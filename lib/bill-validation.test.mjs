import {test} from 'node:test';import assert from 'node:assert/strict';import {parseBill,paymentUrl} from './bill-validation.mjs';
const base={name:'Jamie',category:'Rent',amount:'142.25',story:'Help with rent',paypal:'https://paypal.me/Jamie123'};
test('normalizes cents and uses only the PayPal hostname',()=>{const b=parseBill(base);assert.equal(b.cents,14225);assert.equal(paymentUrl(b.paypal,b.cents),'https://paypal.me/Jamie123/142.25USD')});
test('rejects spoofed and credential-bearing links',()=>{for(const paypal of ['https://paypal.me.evil.com/Jamie','https://paypal.me@evil.com/Jamie','javascript:alert(1)','https://paypal.me/Jamie?redirect=evil','http://paypal.me/Jamie'])assert.throws(()=>parseBill({...base,paypal}))});
test('rejects invalid amounts and categories',()=>{for(const amount of ['-1','0','1.001','1e4','NaN','100001'])assert.throws(()=>parseBill({...base,amount}));assert.throws(()=>parseBill({...base,category:'Unknown'}))});
