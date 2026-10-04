import { randomUUID } from 'node:crypto';
import { query, transaction } from './db';
import { BusinessError, calculate, sameQuoteInput } from './domain';
import { token } from './crypto';
import type { Quote, QuoteInput, Settings } from './types';
export async function getSettings() { const rows = await query<{data: Settings}>('SELECT data FROM settings WHERE id=1'); if (!rows[0]) throw new Error('Migração pendente.'); return rows[0].data; }
export async function createQuote(input: QuoteInput) {
  return transaction(async client => {
    // Serializes retries with the same request key, including simultaneous requests.
    await client.query('SELECT pg_advisory_xact_lock(hashtextextended($1,0))', [input.requestKey]);
    const existing = await client.query<Quote>('SELECT * FROM quotes WHERE request_key=$1', [input.requestKey]);
    if (existing.rows[0]) {
      if (!sameQuoteInput(existing.rows[0].details, input)) throw new BusinessError('Esta tentativa já foi salva com outros dados. Inicie um novo orçamento para enviar alterações.');
      return existing.rows[0];
    }
    const settings = (await client.query<{data: Settings}>('SELECT data FROM settings WHERE id=1 FOR SHARE')).rows[0].data;
    const pricing = calculate(input, settings);
    const customer = await client.query<{id: string}>(`INSERT INTO customers(id,name,phone,city) VALUES($1,$2,$3,$4) ON CONFLICT(phone) DO UPDATE SET name=EXCLUDED.name,city=EXCLUDED.city RETURNING id`, [randomUUID(),input.name,input.phone,input.city]);
    const result = await client.query<Quote>(`INSERT INTO quotes(id,public_token,request_key,customer_id,details,pricing,total_cents,delivery_date,event_date,valid_until) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,now()+make_interval(days=>$10)) RETURNING *`, [randomUUID(),token(),input.requestKey,customer.rows[0].id,JSON.stringify(input),JSON.stringify(pricing),pricing.totalCents,input.deliveryDate,input.eventDate,settings.validityDays]);
    return result.rows[0];
  });
}
export async function convertQuote(id: string, adminId: string) {
  return transaction(async client => {
    const quote = (await client.query<Quote>('SELECT * FROM quotes WHERE id=$1 FOR UPDATE', [id])).rows[0];
    if (!quote) throw new BusinessError('Orçamento não encontrado.');
    const existing = (await client.query<{id: string}>('SELECT id FROM orders WHERE quote_id=$1',[id])).rows[0];
    if (existing) return existing.id;
    if (quote.status === 'PERDIDO') throw new BusinessError('Reabra o orçamento antes de convertê-lo.');
    if (new Date(quote.valid_until) < new Date()) throw new BusinessError('Orçamento vencido. Renove sua validade antes de converter.');
    const orderId = randomUUID();
    await client.query('INSERT INTO orders(id,quote_id,delivery_date) VALUES($1,$2,$3)',[orderId,id,quote.delivery_date]);
    await client.query("UPDATE quotes SET status='APROVADO' WHERE id=$1",[id]);
    await client.query("UPDATE followups SET done=true WHERE quote_id=$1",[id]);
    await client.query('INSERT INTO audit_events(administrator_id,entity_id,action) VALUES($1,$2,$3)',[adminId,id,'CONVERTER_PEDIDO']);
    return orderId;
  });
}
