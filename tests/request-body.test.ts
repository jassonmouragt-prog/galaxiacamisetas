import test from 'node:test';
import assert from 'node:assert/strict';
import { maxRequestBytes, readJsonBody, RequestBodyError } from '../src/lib/request-body.ts';

function request(body: string, headers: Record<string, string> = {}) {
  return new Request('http://localhost/api/quotes', {
    method: 'POST', body, headers: { 'Content-Type': 'application/json', ...headers },
  });
}

function hasStatus(status: number) {
  return (error: unknown) => error instanceof RequestBodyError && error.status === status;
}

test('leitura JSON preserva Unicode e aceita charset explícito', async () => {
  assert.deepEqual(await readJsonBody(request('{"nome":"Galáxia 🚀"}', {
    'Content-Type': 'application/json; charset=utf-8',
  })), { nome: 'Galáxia 🚀' });
});

test('limita bytes reais mesmo quando o corpo declara tamanho menor', async () => {
  const body = JSON.stringify({ text: 'á'.repeat(maxRequestBytes / 2) });
  assert.ok(body.length < maxRequestBytes);
  await assert.rejects(readJsonBody(request(body, { 'Content-Length': '1' })), hasStatus(413));
});

test('interrompe o stream sem consumir todo o corpo quando excede o limite', async () => {
  let reads = 0;
  let cancelled = false;
  const body = new ReadableStream<Uint8Array<ArrayBuffer>>({
    pull(controller) { reads++; controller.enqueue(new Uint8Array(8192)); },
    cancel() { cancelled = true; },
  }, { highWaterMark: 0 });
  await assert.rejects(readJsonBody({ headers: new Headers({ 'content-type': 'application/json' }), body }), hasStatus(413));
  assert.equal(reads, 5);
  assert.equal(cancelled, true);
});

test('aceita tamanho exato e rejeita um byte além do limite', async () => {
  const atLimit = '"' + 'x'.repeat(maxRequestBytes - 2) + '"';
  assert.equal((await readJsonBody(request(atLimit)) as string).length, maxRequestBytes - 2);
  await assert.rejects(readJsonBody(request(atLimit + ' ')), hasStatus(413));
});

test('rejeita tamanho declarado excessivo e conteúdo não JSON', async () => {
  await assert.rejects(readJsonBody(request('{}', { 'Content-Length': String(maxRequestBytes + 1) })), hasStatus(413));
  await assert.rejects(readJsonBody(request('{}', { 'Content-Type': 'text/plain' })), hasStatus(415));
  await assert.rejects(readJsonBody(request('{')), hasStatus(400));
});

test('JSON com UTF-8 inválido é rejeitado sem corrigir silenciosamente dados', async () => {
  const body = new ReadableStream<Uint8Array<ArrayBuffer>>({
    start(controller) { controller.enqueue(new Uint8Array([34, 255, 34])); controller.close(); },
  });
  await assert.rejects(readJsonBody({ headers: new Headers({ 'content-type': 'application/json' }), body }), hasStatus(400));
});

test('falha de transmissão gera erro recuperável', async () => {
  const body = new ReadableStream<Uint8Array<ArrayBuffer>>({
    start(controller) { controller.error(new Error('conexão perdida')); },
  });
  await assert.rejects(readJsonBody({ headers: new Headers({ 'content-type': 'application/json' }), body }), hasStatus(400));
});
