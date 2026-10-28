import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadStudioSuite,decodeStudioSuite,selectStudioCases,scoreStudioCase,runStudioEvaluation} from '../src/eval/studio.mjs';
import {coolingLesson,processLesson} from '../test-support/generated-lessons.mjs';
const response=lesson=>({structured:{name:'compose_lesson',value:{status:'ready',message:{en:'Ready',zh:'已就绪'},lesson}}});
const refused={structured:{name:'compose_lesson',value:{status:'unsupported',message:{en:'Please clarify the object and quantity.','zh':'请说明对象和衡量的量。'},lesson:null}}};

test('frozen Studio suite has six bilingual pairs and rejects checksum or filter changes',()=>{
 const {suite,sha256}=loadStudioSuite();assert.equal(suite.cases.length,12);assert.equal(new Set(suite.cases.map(c=>c.pair)).size,6);
 for(const pair of new Set(suite.cases.map(c=>c.pair)))assert.deepEqual(suite.cases.filter(c=>c.pair===pair).map(c=>c.language),['en','zh']);
 const raw=readFileSync(new URL('../eval/studio-v1.json',import.meta.url),'utf8');
 assert.throws(()=>decodeStudioSuite(raw+' ',sha256),/checksum/i);
 assert.throws(()=>selectStudioCases(suite,'cooling-en,cooling-en'));assert.throws(()=>selectStudioCases(suite,'invented'));
 assert.deepEqual(selectStudioCases(suite,'water-cycle-zh,cooling-en').map(c=>c.id),['water-cycle-zh','cooling-en']);
});
test('numeric checks use independent probes and reject a plausible but false cooling equation',()=>{
 const c=loadStudioSuite().suite.cases.find(c=>c.id==='cooling-en');
 const good=scoreStudioCase(c,response(coolingLesson()));assert.equal(good.automatedPass,true);assert.equal(good.manualReview,'required');assert.ok(good.probes.length>=4);
 const wrong=coolingLesson();wrong.chapters[0].demo.outputs[0].expression='initial - rate * x';
 const bad=scoreStudioCase(c,response(wrong));assert.equal(bad.contractValid,true);assert.equal(bad.automatedPass,false);assert.ok(bad.probes.some(p=>!p.pass));
 const missing=coolingLesson();missing.chapters[0].demo.inputs[0].id='hot';missing.chapters[0].demo.outputs[0].expression='ambient+(hot-ambient)*exp(-rate*x)';missing.chapters[0].demo.transfer.values[0].id='hot';
 assert.equal(scoreStudioCase(c,response(missing)).automatedPass,false);
});
test('contract, renderer and refusal outcomes stay distinct from content review',()=>{
 const cases=loadStudioSuite().suite.cases;
 assert.equal(scoreStudioCase(cases.find(c=>c.id==='ambiguous-en'),refused).automatedPass,true);
 assert.equal(scoreStudioCase(cases.find(c=>c.id==='web-cache-en'),refused).automatedPass,false);
 const process=scoreStudioCase(cases.find(c=>c.id==='web-cache-en'),response(processLesson()));assert.equal(process.automatedPass,true);assert.equal(process.manualReview,'required');
 assert.equal(scoreStudioCase(cases[0],response(processLesson())).automatedPass,false);
 assert.equal(scoreStudioCase(cases[0],response('not a lesson')).contractValid,false);
});
test('supplemental numeric probes reject ignored ambient and initial controls',()=>{
 const item=loadStudioSuite().suite.cases.find(c=>c.id==='cooling-en');
 for(const expression of ['20+(initial-20)*exp(-rate*x)','ambient+(80-ambient)*exp(-rate*x)']){
  const wrong=coolingLesson();wrong.chapters[0].demo.outputs[0].expression=expression;
  wrong.chapters[0].demo.transfer.values.find(v=>v.id==='initial').value=80;
  wrong.chapters[0].demo.transfer.values.find(v=>v.id==='rate').value=.2;
  const result=scoreStudioCase(item,response(wrong));
  assert.equal(result.contractValid,true);assert.equal(result.automatedPass,false,expression);
  assert.equal(result.checks.parameterSensitivity,false);
 }
 const good=scoreStudioCase(item,response(coolingLesson()));
 assert.equal(good.checks.parameterSensitivity,true);assert.equal(good.supplementalProbes.length,2);
});
test('runner is sequential, counts rejected attempts, and never retries or prints raw errors',async()=>{
 const cases=loadStudioSuite().suite.cases.filter(c=>['cooling-en','cooling-zh','ambiguous-en'].includes(c.id));
 let active=0,max=0,calls=0;
 const report=await runStudioEvaluation({cases,call:async()=>{
  calls++;active++;max=Math.max(max,active);await new Promise(r=>setTimeout(r,2));active--;
  if(calls===2)throw new Error('private provider payload');return calls===1?response(coolingLesson()):refused;
 }});
 assert.equal(calls,3);assert.equal(max,1);assert.equal(report.complete,true);assert.equal(report.attempted,3);assert.equal(report.automatedPassed,2);
 assert.equal(report.cases[1].failure,'provider-or-transport');assert.equal(report.cases[1].automatedPass,false);
 assert.doesNotMatch(JSON.stringify(report),/private provider payload/);assert.equal(report.cases[0].promptHash.length,64);
});
