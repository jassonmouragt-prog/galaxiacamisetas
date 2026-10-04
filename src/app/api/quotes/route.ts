import { NextRequest, NextResponse } from 'next/server';
import { checkOrigin, errorResponse, readBody } from '@/lib/http';
import { quoteSchema } from '@/lib/validation';
import { createQuote } from '@/lib/repository';
import { rateLimit } from '@/lib/auth';
import { code } from '@/lib/domain';
export async function POST(request: NextRequest) { try { checkOrigin(request); const input = quoteSchema.parse(await readBody(request)); if (!await rateLimit('quote:' + input.phone, 10, 60)) return NextResponse.json({error:'Muitas solicitações para este telefone. Tente novamente em uma hora.'},{status:429}); const quote = await createQuote(input); return NextResponse.json({url:`/orcamento/resultado/${code(quote.number)}?token=${quote.public_token}`}, {status:201}); } catch(error) { return errorResponse(error); } }
