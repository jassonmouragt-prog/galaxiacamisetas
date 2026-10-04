import { existsSync } from 'node:fs';
import { createConnection } from 'node:net';
import { spawnSync } from 'node:child_process';

let failures = 0;
function report(ok, label) {
  console.log(`${ok ? 'OK' : 'PENDENTE'}: ${label}`);
  if (!ok) failures++;
}

report(Number(process.versions.node.split('.')[0]) >= 22, `Node ${process.versions.node}`);
const packages = ['next', 'react', 'pg', 'zod', 'typescript', 'eslint', 'tsx', '@playwright/test'];
const missing = packages.filter(name => !existsSync(`node_modules/${name}/package.json`));
report(missing.length === 0, missing.length ? `Dependências ausentes: ${missing.join(', ')}. Execute npm install.` : 'Dependências principais instaladas.');

if (existsSync('.env.local')) process.loadEnvFile('.env.local');
report(Boolean(process.env.APP_URL), 'APP_URL configurada (valor não exibido).');
report(Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_INITIAL_PASSWORD), 'Credenciais para o seed configuradas (valores não exibidos).');

if (!process.env.DATABASE_URL) {
  report(false, 'Configure DATABASE_URL em .env.local.');
} else {
  try {
    const url = new URL(process.env.DATABASE_URL);
    if (!['postgres:', 'postgresql:'].includes(url.protocol)) throw new Error('protocolo inválido');
    const result = await new Promise(resolve => {
      const socket = createConnection({ host: url.hostname, port: Number(url.port || 5432), timeout: 2000 });
      const finish = result => { socket.destroy(); resolve(result); };
      socket.once('connect', () => finish({ ok: true }));
      socket.once('error', error => finish({ ok: false, code: error.code }));
      socket.once('timeout', () => finish({ ok: false, code: 'TIMEOUT' }));
    });
    report(result.ok, result.ok
      ? 'Porta do banco acessível. Migração ainda deve validar autenticação e esquema.'
      : `Porta do banco inacessível (${result.code}). Inicie PostgreSQL ou configure uma conexão disponível.`);
  } catch {
    report(false, 'DATABASE_URL inválida. Credenciais não foram exibidas.');
  }
}

const docker = spawnSync('docker', ['version', '--format', '{{.Server.Version}}'], {
  encoding: 'utf8', timeout: 5000, windowsHide: true,
});
console.log(docker.status === 0 ? 'INFO: Docker disponível.' : 'INFO: Docker não está disponível; uma instância PostgreSQL externa também serve.');
console.log('Este diagnóstico não instala ferramentas, não altera o banco e não exibe credenciais.');
process.exitCode = failures ? 1 : 0;
