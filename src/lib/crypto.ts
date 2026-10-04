import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
const scrypt = promisify(scryptCallback);
export async function hashPassword(password: string) { const salt = randomBytes(16).toString('hex'); const key = await scrypt(password, salt, 64) as Buffer; return `scrypt:${salt}:${key.toString('hex')}`; }
export async function verifyPassword(password: string, encoded: string) { const [algorithm, salt, hash] = encoded.split(':'); if (algorithm !== 'scrypt' || !salt || !hash) return false; const key = await scrypt(password, salt, 64) as Buffer; const expected = Buffer.from(hash, 'hex'); return key.length === expected.length && timingSafeEqual(key, expected); }
export function token() { return randomBytes(32).toString('hex'); }
export function tokenHash(value: string) { return createHash('sha256').update(value).digest('hex'); }
