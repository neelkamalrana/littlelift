import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newToken,tokenHash} from './manage-token.mjs';
test('management secrets are random, hashed, and distinct',async()=>{const a=newToken(),b=newToken();assert.match(a,/^[a-f0-9]{64}$/);assert.notEqual(a,b);assert.notEqual(await tokenHash(a),a);assert.equal(await tokenHash(a),await tokenHash(a));assert.notEqual(await tokenHash(a),await tokenHash(b))});
test('invalid management tokens are rejected',async()=>{for(const value of [null,'','short','a'.repeat(63),'x'.repeat(64)])await assert.rejects(()=>tokenHash(value))});
