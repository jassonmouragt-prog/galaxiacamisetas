import { BusinessError } from './domain.ts';

export const maxRequestBytes = 32 * 1024;

export class RequestBodyError extends BusinessError {
  readonly status: 400 | 413 | 415;

  constructor(message: string, status: 400 | 413 | 415) {
    super(message);
    this.status = status;
  }
}

/** Limits bytes while reading, including requests without Content-Length. */
export async function readJsonBody(request: Pick<Request, 'headers' | 'body'>): Promise<unknown> {
  const mediaType = request.headers.get('content-type')?.split(';')[0].trim().toLowerCase();
  if (mediaType !== 'application/json') {
    throw new RequestBodyError('Envie os dados no formato JSON.', 415);
  }

  const declaredLength = request.headers.get('content-length');
  if (declaredLength && (!/^\d+$/.test(declaredLength) || Number(declaredLength) > maxRequestBytes)) {
    throw new RequestBodyError('Solicitação muito grande ou tamanho inválido.', 413);
  }
  if (!request.body) throw new RequestBodyError('Dados inválidos.', 400);

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytesRead = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytesRead += value.byteLength;
      if (bytesRead > maxRequestBytes) {
        await reader.cancel().catch(() => undefined);
        throw new RequestBodyError('Solicitação muito grande.', 413);
      }
      chunks.push(value);
    }
  } catch (error) {
    if (error instanceof RequestBodyError) throw error;
    throw new RequestBodyError('A transmissão foi interrompida. Tente novamente.', 400);
  } finally {
    reader.releaseLock();
  }

  const buffer = new Uint8Array(bytesRead);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(buffer)) as unknown;
  } catch {
    throw new RequestBodyError('Dados inválidos.', 400);
  }
}
