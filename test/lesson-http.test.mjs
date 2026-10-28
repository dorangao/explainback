import test from 'node:test';import assert from 'node:assert/strict';
import {createApp} from '../src/server.mjs';import {testerCredentials,testerCookie} from '../test-support/tester.mjs';
import {coolingLesson,processLesson,tinyPng} from '../test-support/generated-lessons.mjs';
const bi=text=>({en:text,zh:'示例'+text});
const lesson=()=>({version:1,title:bi('Motion'),intro:bi('Test a claim'),chapters:[{experiment:'acceleration',framing:bi('Two cars'),explanation:bi('Compare areas')}]});
async function setup(t,modelCall,traceEnabled=true){
 const server=createApp({testerCredentials,configured:true,traceEnabled,modelCall});await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>{server.close(r);server.closeAllConnections();}));
 const origin=`http://127.0.0.1:${server.address().port}`,cookie=await testerCookie(origin);
 return {origin,post:(path,body,c=cookie)=>fetch(origin+path,{method:'POST',headers:{Origin:origin,Cookie:c,'Content-Type':'application/json'},body:JSON.stringify(body)})};
}
test('studio composes bounded bilingual lessons, recomputes guide evidence and isolates sessions',async t=>{
 let calls=0,lastInput;const {post,origin}=await setup(t,async args=>{
  calls++;lastInput=JSON.parse(args.input);args.onTrace?.({type:'request',body:{input:args.input}});
  const name=args.tools[0].name;return {toolCall:{name,arguments:JSON.stringify(name==='compose_lesson'?{status:'ready',message:bi('Ready'),lesson:lesson()}:{explanation:'Different areas imply different distances.',nextAction:'replay'})}};
 });
 assert.equal((await post('/api/studio/session',{synthetic:true,language:'en'},'')).status,401);
 const s=await(await post('/api/studio/session',{synthetic:true,language:'en'})).json();assert.equal(s.llm.provider,'meta');
 assert.equal((await post('/api/studio/compose',{sessionId:s.sessionId,topic:''})).status,400);assert.equal(calls,0);
 const result=await(await post('/api/studio/compose',{sessionId:s.sessionId,topic:'Car acceleration'})).json();assert.equal(result.lesson.chapters[0].experiment,'acceleration');
 const guide={sessionId:s.sessionId,lesson:result.lesson,chapter:0,variant:0,prediction:'agree',language:'en'};
 assert.equal((await post('/api/studio/guide',{...guide,variant:500})).status,400);
 const answer=await(await post('/api/studio/guide',guide)).json();assert.equal(answer.nextAction,'replay');assert.equal(lastInput.checked.metrics[0].value,13.4112);
 assert.equal((await post('/api/turn',{sessionId:s.sessionId,explanation:'hello'})).status,400);
 const another=await testerCookie(origin);assert.equal((await post('/api/studio/compose',{sessionId:s.sessionId,topic:'hi'},another)).status,404);
 const trace=await(await post('/api/trace',{sessionId:s.sessionId})).json();assert.equal(trace.records.length,2);assert.equal(trace.records[0].outcome,'accepted');
 await post('/api/reset',{sessionId:s.sessionId});assert.equal((await post('/api/studio/guide',guide)).status,404);
});
test('studio rejects generated code and caps failed attempts; unsupported topics are explicit',async t=>{
 let calls=0;const {post}=await setup(t,async()=>({toolCall:{name:'compose_lesson',arguments:JSON.stringify(++calls===1?{status:'unsupported',message:bi('No supported experiment'),lesson:null}:{status:'ready',message:bi('Ready'),lesson:{...lesson(),code:'eval()'}})}}),false);
 const s=await(await post('/api/studio/session',{synthetic:true,language:'en'})).json(),body={sessionId:s.sessionId,topic:'Unsupported subject'};
 const first=await(await post('/api/studio/compose',body)).json();assert.equal(first.status,'unsupported');assert.equal(first.lesson,null);
 for(let i=0;i<7;i++)assert.equal((await post('/api/studio/compose',body)).status,502);
 assert.equal((await post('/api/studio/compose',body)).status,429);assert.equal(calls,8);
 assert.equal((await post('/api/trace',{sessionId:s.sessionId})).status,404);
});
test('Ollama busy attempts report remaining budget so the studio can recover from exhaustion',async t=>{
 const {post}=await setup(t,async()=>{throw Object.assign(new Error('The Ollama host is busy.'),{code:'OLLAMA_BUSY'});});
 const s=await(await post('/api/studio/session',{synthetic:true,language:'en'})).json(),body={sessionId:s.sessionId,topic:'Acceleration'};
 for(let i=0;i<8;i++){const response=await post('/api/studio/compose',body);assert.equal(response.status,409);assert.equal((await response.json()).attemptsRemaining,7-i);}
 const final=await post('/api/studio/compose',body);assert.equal(final.status,429);assert.equal((await final.json()).attemptsRemaining,0);
});
test('new-topic composition and revision use version 2 and guide recomputes changed parameters',async t=>{
 let input,lastTools;const {post,origin}=await setup(t,async args=>{input=JSON.parse(args.input);lastTools=args.tools;const name=args.tools[0].name;return {toolCall:{name,arguments:JSON.stringify(name==='compose_lesson'?{status:'ready',message:bi('Ready'),lesson:coolingLesson()}:{explanation:'These values follow the generated cooling equation; its assumptions need review.',nextAction:'replay'})}};});
 const session=await(await post('/api/studio/session',{synthetic:true,language:'en'})).json();
 const response=await post('/api/studio/compose',{sessionId:session.sessionId,topic:'Cooling coffee',creation:'generated'});assert.equal(response.status,200);const generated=await response.json();assert.equal(generated.lesson.version,2);assert.equal(input.catalog,undefined);assert.ok(JSON.stringify(lastTools).includes('expression'));
 const revision=await post('/api/studio/compose',{sessionId:session.sessionId,topic:'Cooling coffee',creation:'generated',draft:generated.lesson,revision:'Make the explanation simpler.'});assert.equal(revision.status,200);assert.equal(input.previousDraft.version,2);assert.match(input.revision,/simpler/);
 const guide={sessionId:session.sessionId,lesson:generated.lesson,chapter:0,variant:0,language:'zh',prediction:'agree',controls:{initial:90,ambient:20,rate:.1},metric:0};
 assert.equal((await post('/api/studio/guide',guide)).status,200);assert.ok(Math.abs(input.checked.metrics[0].value-(20+70*Math.exp(-3)))<1e-10);assert.match(input.checked.validation,/NOT independently/);
 assert.equal((await post('/api/studio/guide',{...guide,controls:{initial:10000}})).status,400);
});
test('new-topic request rejects catalog substitution and formulas with hidden singularities',async t=>{
 let output=lesson();const {post}=await setup(t,async()=>({toolCall:{name:'compose_lesson',arguments:JSON.stringify({status:'ready',message:bi('Ready'),lesson:output})}}));
 const session=await(await post('/api/studio/session',{synthetic:true,language:'en'})).json();const body={sessionId:session.sessionId,topic:'A new topic',creation:'generated'};
 assert.equal((await post('/api/studio/compose',body)).status,502);
 output=coolingLesson();output.chapters[0].demo.outputs[0].expression='1/(x-12.345)';assert.equal((await post('/api/studio/compose',body)).status,502);
 output=processLesson();assert.equal((await post('/api/studio/compose',body)).status,200);
});
test('studio compose accepts a bounded image for Meta targets only and never traces its bytes',async t=>{
 let seen;const {post}=await setup(t,async args=>{seen=args;args.onTrace?.({type:'request',body:{input:'[image omitted]'}});return {toolCall:{name:'compose_lesson',arguments:JSON.stringify({status:'ready',message:bi('Ready'),lesson:lesson()})}};});
 const s=await(await post('/api/studio/session',{synthetic:true,language:'en'})).json();
 const ok=await post('/api/studio/compose',{sessionId:s.sessionId,topic:'',creation:'catalog',image:tinyPng});assert.equal(ok.status,200);assert.deepEqual(seen.images,[tinyPng]);
 assert.equal((await post('/api/studio/compose',{sessionId:s.sessionId,topic:'x',creation:'catalog',image:'data:text/html;base64,QQ=='})).status,400);
 const trace=await(await post('/api/trace',{sessionId:s.sessionId})).json();assert.doesNotMatch(JSON.stringify(trace),/iVBORw0KGgo/);
 const big=await post('/api/studio/compose',{sessionId:s.sessionId,topic:'x',creation:'catalog',image:'data:image/png;base64,'+'A'.repeat(1_500_000)});assert.equal(big.status,413);await big.arrayBuffer();
});

test('an oversized streaming image request returns 413 before the upload finishes',async t=>{
 const {request}=await import('node:http');
 const {origin}=await setup(t,async()=>{throw new Error('No provider request is expected.');});
 const cookie=await testerCookie(origin);
 const status=await new Promise((resolve,reject)=>{
  let endBody;
  const req=request(origin+'/api/studio/compose',{method:'POST',headers:{Origin:origin,Cookie:cookie,'Content-Type':'application/json'}},res=>{
   res.resume();res.on('end',()=>{clearTimeout(endBody);req.end('"}');resolve(res.statusCode);});
  });
  req.on('error',reject);req.setTimeout(2000,()=>req.destroy(new Error('No 413 response received.')));
  req.write('{"image":"'+'A'.repeat(1_410_000));
  endBody=setTimeout(()=>req.end('"}'),100);
 });
 assert.equal(status,413);
});
