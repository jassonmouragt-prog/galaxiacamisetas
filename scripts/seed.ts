import nextEnv from '@next/env';
import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { hashPassword } from '../src/lib/crypto';
nextEnv.loadEnvConfig(process.cwd());
const email=process.env.ADMIN_EMAIL?.toLowerCase();const password=process.env.ADMIN_INITIAL_PASSWORD;
if(!email||!password||password.length<12) throw new Error('Defina ADMIN_EMAIL e ADMIN_INITIAL_PASSWORD (mínimo 12 caracteres) em .env.local.');
const pool=new Pool({connectionString:process.env.DATABASE_URL});
try{const result=await pool.query('INSERT INTO administrators(id,email,password_hash) VALUES($1,$2,$3) ON CONFLICT(email) DO NOTHING RETURNING id',[randomUUID(),email,await hashPassword(password)]);console.log(result.rowCount?'Administrador criado.':'Administrador já existe; senha preservada.');}finally{await pool.end();}
