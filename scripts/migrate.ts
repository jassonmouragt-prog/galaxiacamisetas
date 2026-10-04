import nextEnv from '@next/env';
import { readFile, readdir } from 'node:fs/promises';
import { Pool } from 'pg';
nextEnv.loadEnvConfig(process.cwd());
if(!process.env.DATABASE_URL) throw new Error('Configure DATABASE_URL em .env.local.');
const pool=new Pool({connectionString:process.env.DATABASE_URL});
const client=await pool.connect();
try { await client.query('BEGIN'); await client.query('SELECT pg_advisory_xact_lock(918274)'); await client.query('CREATE TABLE IF NOT EXISTS schema_migrations(name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())'); const files=(await readdir('db/migrations')).filter(f=>f.endsWith('.sql')).sort(); for(const file of files){const exists=await client.query('SELECT name FROM schema_migrations WHERE name=$1',[file]);if(!exists.rowCount){await client.query(await readFile(`db/migrations/${file}`,'utf8'));await client.query('INSERT INTO schema_migrations(name) VALUES($1)',[file]);console.log(`Aplicada: ${file}`);}}await client.query('COMMIT');}catch(error){await client.query('ROLLBACK');throw error;}finally{client.release();await pool.end();}
