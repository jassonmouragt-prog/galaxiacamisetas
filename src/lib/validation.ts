import { z } from 'zod';
import { isDate, normalizePhone } from './domain';

const boundedText = (max: number) => z.string().trim().min(1, 'Preencha este campo.').max(max);
export const dateSchema = z.string().refine(isDate, 'Informe uma data válida.');

export const quoteSchema = z.object({
  requestKey: z.uuid(),
  event: boundedText(100),
  modelId: boundedText(60),
  quantity: z.number().int().min(1).max(10000),
  printIds: z.array(boundedText(60)).max(20),
  art: z.enum(['PRONTA', 'CRIAR', 'SEM_ARTE']),
  eventDate: dateSchema,
  deliveryDate: dateSchema,
  name: boundedText(120),
  phone: z.string().transform(normalizePhone).refine(v => /^55\d{10,11}$/.test(v), 'Informe um WhatsApp com DDD.'),
  city: boundedText(120),
  notes: z.string().trim().max(2000),
  consent: z.literal(true, { error: 'Autorize o contato para solicitar o orçamento.' }),
});

const catalog = z.array(z.object({
  id: z.string().regex(/^[a-zA-Z0-9_-]{1,60}$/),
  name: boundedText(100),
  priceCents: z.number().int().min(0).max(1000000),
})).max(50).refine(items => new Set(items.map(i => i.id)).size === items.length, 'Os identificadores devem ser únicos.');

export const settingsSchema = z.object({
  enabled: z.boolean(),
  provisional: z.boolean(),
  whatsapp: z.string().trim().refine(v => v === '' || /^55\d{10,11}$/.test(v), 'WhatsApp deve conter 55, DDD e número.'),
  minimumQuantity: z.number().int().min(1).max(10000),
  productionDays: z.number().int().min(1).max(365),
  validityDays: z.number().int().min(1).max(90),
  artFeeCents: z.number().int().min(0).max(1000000),
  models: catalog,
  prints: catalog,
  discounts: z.array(z.object({ from: z.number().int().min(1).max(10000), percent: z.number().int().min(0).max(90) })).max(20),
}).refine(s => !s.enabled || (s.whatsapp.length > 0 && s.models.length > 0 && s.models.every(m => m.priceCents > 0)), 'Para ativar, cadastre WhatsApp e ao menos um modelo com preço maior que zero.');
