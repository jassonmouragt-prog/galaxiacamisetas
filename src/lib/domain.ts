import type { Settings, QuoteInput, Pricing } from './types.ts';
export class BusinessError extends Error {}
export const quoteStatuses = ['NOVO', 'EM_CONTATO', 'APROVADO', 'PERDIDO'] as const;
export const orderStatuses = ['AGUARDANDO_ARTE', 'ARTE_APROVADA', 'EM_PRODUCAO', 'PRONTO', 'ENTREGUE', 'CANCELADO'] as const;
export const labels: Record<string, string> = { NOVO: 'Novo', EM_CONTATO: 'Em contato', APROVADO: 'Aprovado', PERDIDO: 'Perdido', AGUARDANDO_ARTE: 'Aguardando arte', ARTE_APROVADA: 'Arte aprovada', EM_PRODUCAO: 'Em produção', PRONTO: 'Pronto', ENTREGUE: 'Entregue', CANCELADO: 'Cancelado', PRONTA: 'Já possui arte', CRIAR: 'Criação de arte', SEM_ARTE: 'Sem estampa' };
export function money(cents: number) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100); }
export function code(number: string | number, kind = 'Q') { return `GAL-${kind}-${String(number).padStart(5, '0')}`; }
export function today(now = new Date()) { return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now); }
export function addDays(date: string, days: number) { const d = new Date(date + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + days); return d.toISOString().slice(0, 10); }
export function dateLabel(date: string | Date) { const value = typeof date === 'string' && date.length === 10 ? new Date(date + 'T12:00:00Z') : new Date(date); return new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo' }).format(value); }
export function normalizePhone(phone: string) { const digits = phone.replace(/\D/g, ''); return digits.length <= 11 ? '55' + digits : digits; }
export function sameQuoteInput(a: QuoteInput, b: QuoteInput) { const keys = Object.keys(a).sort() as (keyof QuoteInput)[]; return keys.length === Object.keys(b).length && keys.every(key => JSON.stringify(a[key]) === JSON.stringify(b[key])); }
export function isDate(value: string) { return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value + 'T12:00:00Z').toISOString().slice(0, 10) === value; }
export function settingsReady(settings: Settings) { return settings.enabled && /^55\d{10,11}$/.test(settings.whatsapp) && settings.models.length > 0; }
export function calculate(input: QuoteInput, settings: Settings, now = new Date()): Pricing {
  if (!settingsReady(settings)) throw new BusinessError('Os orçamentos estão temporariamente indisponíveis. Nossa equipe está atualizando a tabela.');
  if (!Number.isInteger(input.quantity) || input.quantity < settings.minimumQuantity || input.quantity > 10000) throw new BusinessError(`Informe uma quantidade entre ${settings.minimumQuantity} e 10.000 peças.`);
  if (!isDate(input.deliveryDate) || !isDate(input.eventDate)) throw new BusinessError('Informe datas válidas.');
  if (input.deliveryDate < addDays(today(now), settings.productionDays)) throw new BusinessError(`A produção precisa de pelo menos ${settings.productionDays} dias corridos.`);
  if (input.eventDate < input.deliveryDate) throw new BusinessError('A entrega deve acontecer até a data do evento.');
  const model = settings.models.find(x => x.id === input.modelId);
  if (!model) throw new BusinessError('O modelo selecionado não está mais disponível.');
  if (new Set(input.printIds).size !== input.printIds.length) throw new BusinessError('Personalizações repetidas.');
  const prints = input.printIds.map(id => { const item = settings.prints.find(p => p.id === id); if (!item) throw new BusinessError('Uma personalização não está mais disponível.'); return item; });
  if (input.art === 'SEM_ARTE' && prints.length) throw new BusinessError('Selecione uma opção de arte para incluir estampas.');
  if (input.art === 'CRIAR' && !prints.length) throw new BusinessError('Selecione a personalização que receberá a arte.');
  const unitCents = model.priceCents + prints.reduce((sum, p) => sum + p.priceCents, 0);
  const subtotalCents = unitCents * input.quantity;
  const discountPercent = settings.discounts.filter(d => input.quantity >= d.from).reduce((max, d) => Math.max(max, d.percent), 0);
  const discountCents = Math.round(subtotalCents * discountPercent / 100);
  const artCents = input.art === 'CRIAR' ? settings.artFeeCents : 0;
  const totalCents = subtotalCents - discountCents + artCents;
  if (!Number.isSafeInteger(totalCents) || totalCents > 2_000_000_000) throw new BusinessError('Este volume precisa de atendimento personalizado.');
  return { model, prints, quantity: input.quantity, unitCents, subtotalCents, discountPercent, discountCents, artCents, totalCents, whatsapp: settings.whatsapp, provisional: settings.provisional };
}
export function canTransition(from: string, to: string) { const next: Record<string, string[]> = { AGUARDANDO_ARTE: ['ARTE_APROVADA', 'CANCELADO'], ARTE_APROVADA: ['EM_PRODUCAO', 'CANCELADO'], EM_PRODUCAO: ['PRONTO', 'CANCELADO'], PRONTO: ['ENTREGUE', 'CANCELADO'], ENTREGUE: [], CANCELADO: [] }; return next[from]?.includes(to) ?? false; }
export function assertOrderUpdate(current: { status: string; delivery_date: string }, next: { status: string; deliveryDate: string }) {
  if (!isDate(next.deliveryDate)) throw new BusinessError('Informe uma data de entrega válida.');
  if (current.status !== next.status && !canTransition(current.status, next.status)) {
    throw new BusinessError('Avance uma etapa de produção por vez. Pedidos encerrados não podem ser reabertos.');
  }
  if (['ENTREGUE', 'CANCELADO'].includes(current.status) && current.delivery_date !== next.deliveryDate) {
    throw new BusinessError('A data de entrega de um pedido encerrado não pode ser alterada.');
  }
}
export function whatsappMessage(number: string, input: QuoteInput, pricing: Pricing) {
  return [`Olá, Galáxia! Quero finalizar o orçamento ${code(number)}.`, `Nome: ${input.name}`, `WhatsApp: ${input.phone}`, `Cidade: ${input.city}`, `Evento: ${input.event}`, `Modelo: ${pricing.model.name}`, `Quantidade: ${input.quantity}`, `Personalizações: ${pricing.prints.map(p => p.name).join(', ') || 'Nenhuma'}`, `Arte: ${labels[input.art]}`, `Evento: ${dateLabel(input.eventDate)}`, `Entrega: ${dateLabel(input.deliveryDate)}`, `Valor por peça antes do desconto: ${money(pricing.unitCents)}`, `Desconto: ${money(pricing.discountCents)}`, `Criação de arte: ${money(pricing.artCents)}`, `Total: ${money(pricing.totalCents)}`, `Observações: ${input.notes || 'Nenhuma'}`].join('\n');
}
