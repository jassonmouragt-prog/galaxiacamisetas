import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { query } from './db';
import { tokenHash } from './crypto';
export const sessionCookie = 'galaxia_session';
export async function currentAdmin() { const value = (await cookies()).get(sessionCookie)?.value; if (!value || !/^[a-f0-9]{64}$/.test(value)) return null; const rows = await query<{id: string; email: string}>('SELECT a.id,a.email FROM sessions s JOIN administrators a ON a.id=s.administrator_id WHERE s.token_hash=$1 AND s.expires_at>now()', [tokenHash(value)]); return rows[0] ?? null; }
export async function requireAdmin() { const admin = await currentAdmin(); if (!admin) redirect('/admin/login'); return admin; }
export async function rateLimit(key: string, max: number, minutes: number) { const rows = await query<{attempts: number}>(`INSERT INTO rate_limits(key,attempts,reset_at) VALUES($1,1,now()+make_interval(mins=>$2)) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN rate_limits.reset_at<now() THEN 1 ELSE rate_limits.attempts+1 END, reset_at=CASE WHEN rate_limits.reset_at<now() THEN now()+make_interval(mins=>$2) ELSE rate_limits.reset_at END RETURNING attempts`, [tokenHash(key), minutes]); return rows[0].attempts <= max; }
