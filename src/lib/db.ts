import { Pool, types, type PoolClient, type QueryResultRow } from 'pg';
types.setTypeParser(1082, (value: string) => value);
const globalDb = globalThis as unknown as { pool?: Pool };
export const pool = globalDb.pool ?? new Pool({ connectionString: process.env.DATABASE_URL, max: 10, connectionTimeoutMillis: 5000, idleTimeoutMillis: 30000, statement_timeout: 15000 });
if (process.env.NODE_ENV !== 'production') globalDb.pool = pool;
export async function query<T extends QueryResultRow = QueryResultRow>(sql: string, values: unknown[] = []) { return (await pool.query<T>(sql, values)).rows; }
export async function transaction<T>(run: (client: PoolClient) => Promise<T>) { const client = await pool.connect(); try { await client.query('BEGIN'); const value = await run(client); await client.query('COMMIT'); return value; } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); } }
