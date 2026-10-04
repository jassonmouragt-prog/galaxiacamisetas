import test from 'node:test';
import assert from 'node:assert/strict';
import {hashPassword,verifyPassword,token,tokenHash} from '../src/lib/crypto.ts';
test('senha nunca é persistida em texto claro e verifica corretamente',async()=>{const password='senha-apenas-de-teste';const hash=await hashPassword(password);assert.equal(hash.includes(password),false);assert.equal(await verifyPassword(password,hash),true);assert.equal(await verifyPassword('incorreta',hash),false);assert.equal(await verifyPassword(password,'invalido'),false);assert.notEqual(await hashPassword(password),hash);});
test('tokens de sessão e resultado têm 256 bits e são armazenados como hash',()=>{const a=token(),b=token();assert.match(a,/^[a-f0-9]{64}$/);assert.notEqual(a,b);assert.notEqual(a,tokenHash(a));assert.equal(tokenHash(a),tokenHash(a));});
