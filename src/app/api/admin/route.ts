import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { checkOrigin, readBody, errorResponse } from '@/lib/http';
import { currentAdmin, sessionCookie } from '@/lib/auth';
import { query, transaction } from '@/lib/db';
import { settingsSchema, dateSchema } from '@/lib/validation';
import { convertQuote } from '@/lib/repository';
import { BusinessError, assertOrderUpdate, today } from '@/lib/domain';
import { hashPassword, verifyPassword } from '@/lib/crypto';
import { cookies } from 'next/headers';
const mutation = z.discriminatedUnion('action',[
 z.object({action:z.literal('settings'),data:settingsSchema}),
 z.object({action:z.literal('convert'),id:z.uuid()}),
 z.object({action:z.literal('quote-status'),id:z.uuid(),status:z.enum(['NOVO','EM_CONTATO','PERDIDO'])}),
 z.object({action:z.literal('renew'),id:z.uuid(),date:dateSchema}),
 z.object({action:z.literal('order'),id:z.uuid(),status:z.enum(['AGUARDANDO_ARTE','ARTE_APROVADA','EM_PRODUCAO','PRONTO','ENTREGUE','CANCELADO']),deliveryDate:dateSchema,notes:z.string().trim().max(4000)}),
 z.object({action:z.literal('followup'),id:z.uuid(),dueAt:z.iso.datetime({offset:true}),note:z.string().trim().min(1).max(1000)}),
 z.object({action:z.literal('followup-done'),id:z.uuid()}),
 z.object({action:z.literal('password'),current:z.string().max(256),password:z.string().min(12,'Use pelo menos 12 caracteres.').max(256)}),
]);
export async function POST(request: NextRequest) { try {
 checkOrigin(request); const admin=await currentAdmin(); if(!admin) return NextResponse.json({error:'Sua sessão expirou. Entre novamente.'},{status:401});
 const input=mutation.parse(await readBody(request));
 if(input.action==='convert') return NextResponse.json({ok:true,id:await convertQuote(input.id,admin.id)});
 if(input.action==='password') { const row=(await query<{password_hash:string}>('SELECT password_hash FROM administrators WHERE id=$1',[admin.id]))[0]; if(!await verifyPassword(input.current,row.password_hash)) throw new BusinessError('A senha atual está incorreta.'); const hash=await hashPassword(input.password); await transaction(async client=>{await client.query('UPDATE administrators SET password_hash=$1 WHERE id=$2',[hash,admin.id]); await client.query('DELETE FROM sessions WHERE administrator_id=$1',[admin.id]);}); (await cookies()).delete(sessionCookie); return NextResponse.json({ok:true,logout:true}); }
 await transaction(async client=>{
  if(input.action==='settings') await client.query('UPDATE settings SET data=$1,updated_at=now() WHERE id=1',[JSON.stringify(input.data)]);
  if(input.action==='quote-status') { const result=await client.query("UPDATE quotes SET status=$1 WHERE id=$2 AND status<>'APROVADO' RETURNING id",[input.status,input.id]); if(!result.rowCount) throw new BusinessError('Orçamento inexistente ou já convertido em pedido.'); }
  if(input.action==='renew') { if(input.date<today()) throw new BusinessError('A validade deve ser hoje ou uma data futura.'); const result=await client.query("UPDATE quotes SET valid_until=($1::date+interval '1 day')::timestamp AT TIME ZONE 'America/Sao_Paulo' WHERE id=$2 AND status<>'APROVADO' RETURNING id",[input.date,input.id]); if(!result.rowCount) throw new BusinessError('Não foi possível renovar este orçamento.'); }
  if(input.action==='order') { const order=(await client.query<{status:string;delivery_date:string}>('SELECT status,delivery_date FROM orders WHERE id=$1 FOR UPDATE',[input.id])).rows[0]; if(!order) throw new BusinessError('Pedido não encontrado.'); assertOrderUpdate(order,input); await client.query('UPDATE orders SET status=$1,delivery_date=$2,notes=$3,updated_at=now() WHERE id=$4',[input.status,input.deliveryDate,input.notes,input.id]); }
  if(input.action==='followup') { if(new Date(input.dueAt)<new Date()) throw new BusinessError('Agende o retorno para uma data futura.'); await client.query('INSERT INTO followups(id,quote_id,due_at,note) VALUES($1,$2,$3,$4)',[randomUUID(),input.id,input.dueAt,input.note]); }
  if(input.action==='followup-done') { const result=await client.query('UPDATE followups SET done=true WHERE id=$1 RETURNING id',[input.id]); if(!result.rowCount) throw new BusinessError('Retorno não encontrado.'); }
  await client.query('INSERT INTO audit_events(administrator_id,entity_id,action) VALUES($1,$2,$3)',[admin.id,'id' in input?input.id:null,input.action]);
 });
 return NextResponse.json({ok:true});
 }catch(error){return errorResponse(error);} }
