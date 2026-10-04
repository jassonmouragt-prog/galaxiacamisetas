import test from 'node:test';
import assert from 'node:assert/strict';
import { assertOrderUpdate } from '../src/lib/domain.ts';

test('pedido ativo pode avançar e ter entrega reagendada', () => {
  assert.doesNotThrow(() => assertOrderUpdate(
    { status: 'EM_PRODUCAO', delivery_date: '2026-11-10' },
    { status: 'PRONTO', deliveryDate: '2026-11-12' },
  ));
});

test('pedido entregue ou cancelado preserva data até em requisição direta à API', () => {
  for (const status of ['ENTREGUE', 'CANCELADO']) {
    assert.throws(() => assertOrderUpdate(
      { status, delivery_date: '2026-11-10' },
      { status, deliveryDate: '2026-11-12' },
    ), /não pode ser alterada/);
    assert.doesNotThrow(() => assertOrderUpdate(
      { status, delivery_date: '2026-11-10' },
      { status, deliveryDate: '2026-11-10' },
    ));
  }
});

test('mudança de pedido rejeita salto de etapas, reabertura e datas impossíveis', () => {
  assert.throws(() => assertOrderUpdate(
    { status: 'AGUARDANDO_ARTE', delivery_date: '2026-11-10' },
    { status: 'ENTREGUE', deliveryDate: '2026-11-10' },
  ));
  assert.throws(() => assertOrderUpdate(
    { status: 'ENTREGUE', delivery_date: '2026-11-10' },
    { status: 'PRONTO', deliveryDate: '2026-11-10' },
  ));
  assert.throws(() => assertOrderUpdate(
    { status: 'PRONTO', delivery_date: '2026-11-10' },
    { status: 'PRONTO', deliveryDate: '2026-02-30' },
  ));
});
