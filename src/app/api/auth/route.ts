import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { checkOrigin, readBody, errorResponse } from '@/lib/http';
import { query } from '@/lib/db';
import { hashPassword, verifyPassword, token, tokenHash } from '@/lib/crypto';
import { rateLimit, sessionCookie } from '@/lib/auth';
const dummyHash = hashPassword('unused-constant-timing-comparison');
export async function POST(request: NextRequest) { try { checkOrigin(request); const input = z.object({email:z.email().max(254).transform(v=>v.toLowerCase()),password:z.string().min(1).max(256)}).parse(await readBody(request)); if (!await rateLimit('login:' + input.email, 8, 15)) return NextResponse.json({error:'Limite de tentativas atingido. Aguarde 15 minutos.'},{status:429}); const admin = (await query<{id:string;password_hash:string}>('SELECT id,password_hash FROM administrators WHERE email=$1',[input.email]))[0]; const valid = await verifyPassword(input.password,admin?.password_hash ?? await dummyHash); if (!admin || !valid) return NextResponse.json({error:'E-mail ou senha incorretos.'},{status:401}); const session = token(); await query("INSERT INTO sessions(token_hash,administrator_id,expires_at) VALUES($1,$2,now()+interval '8 hours')",[tokenHash(session),admin.id]); (await cookies()).set(sessionCookie,session,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:8*3600}); return NextResponse.json({ok:true}); } catch(error) { return errorResponse(error); } }
export async function DELETE(request: NextRequest) { try { checkOrigin(request); const jar=await cookies(); const session=jar.get(sessionCookie)?.value; if(session) await query('DELETE FROM sessions WHERE token_hash=$1',[tokenHash(session)]); jar.delete(sessionCookie); return NextResponse.json({ok:true}); } catch(error) { return errorResponse(error); } }
