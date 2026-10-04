import {readFile,readdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
const dirs=['src','scripts','tests'];
let failures=0,checked=0;
async function walk(path){for(const entry of await readdir(path,{withFileTypes:true})){const file=`${path}/${entry.name}`;if(entry.isDirectory())await walk(file);else if(/\.(ts|tsx|mjs|css)$/.test(file)){const text=await readFile(file,'utf8');if(/Ã[£á©³µ§]|\uFFFD/.test(text)){console.error(`Codificação suspeita: ${file}`);failures++;}if(file.endsWith('.ts')){const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});checked++;if(result.status!==0){console.error(result.stderr);failures++;}}}}}
for(const dir of dirs)await walk(dir);
console.log(`Sintaxe Node: ${checked} arquivos .ts; problemas: ${failures}. Não substitui TypeScript, ESLint, build nem validação de JSX.`);
process.exitCode=failures?1:0;
