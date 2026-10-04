import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { BusinessError } from './domain';
import { readJsonBody, RequestBodyError } from './request-body';
export function checkOrigin(request: NextRequest) { const expected = process.env.APP_URL; if (!expected) throw new Error('APP_URL não configurada.'); if (request.headers.get('origin') !== new URL(expected).origin) throw new BusinessError('Origem da solicitação não autorizada. Recarregue a página.'); }
export async function readBody(request: NextRequest) { return readJsonBody(request); }
export function errorResponse(error: unknown) { if (error instanceof ZodError) return NextResponse.json({error: error.issues.map(i => i.message).join(' ')}, {status: 400}); if (error instanceof RequestBodyError) return NextResponse.json({error: error.message}, {status:error.status}); if (error instanceof BusinessError) return NextResponse.json({error: error.message}, {status: 400}); console.error('Falha interna:', error instanceof Error ? error.message : 'erro desconhecido'); return NextResponse.json({error:'Não foi possível concluir agora. Tente novamente em instantes.'},{status:503}); }
