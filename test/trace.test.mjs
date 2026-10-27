import {test} from 'node:test';import assert from 'node:assert/strict';
import {createTrace} from '../src/trace.mjs';
test('trace redacts secrets before truncating and bounds retained calls',()=>{
 const t=createTrace('secret-key');
 for(let i=0;i<15;i++){const call=t.start({input:'secret-key '+i});call.event({type:'request',body:{input:'secret-key',instructions:'x'.repeat(100000)}});call.finish('accepted');}
 const rows=t.read();assert.equal(rows.length,12);assert.equal(rows[0].sequence,4);
 assert.doesNotMatch(JSON.stringify(rows),/secret-key/);assert.match(rows[0].request.input,/REDACTED/);
 assert.ok(JSON.stringify(rows).length<900000);
});
test('clear prevents a pending callback from resurrecting cleared records',()=>{
 const t=createTrace('secret');const c=t.start({input:'synthetic'});assert.equal(t.read()[0].outcome,'pending');
 t.clear();c.event({type:'response',status:200,body:{model:'test'}});c.finish('accepted');assert.deepEqual(t.read(),[]);
});
