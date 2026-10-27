import test from 'node:test';
import assert from 'node:assert/strict';
import {callMeta} from '../src/meta.mjs';
import {lessonAuthorRequest,readLessonAuthor} from '../src/lesson-author.mjs';
import {processLesson} from '../test-support/generated-lessons.mjs';
const ready={status:'ready',message:{en:'Ready',zh:'已就绪'},lesson:processLesson()};
const response=text=>({status:'completed',model:'muse-spark-1.3',output:[{type:'message',role:'assistant',content:[{type:'output_text',text}]}]});
test('Meta lesson creation uses constrained JSON and preserves the validated lesson contract',async()=>{
 const options=lessonAuthorRequest({topic:'How a browser loads a page',creation:'generated'},'compose');
 assert.equal(options.structuredOutput,true);
 const traces=[];
 const result=await callMeta({...options,apiKey:'private-fixture',onTrace:e=>traces.push(e),fetchImpl:async(_url,{body})=>{
  const request=JSON.parse(body);assert.equal(request.tools,undefined);assert.equal(request.tool_choice,undefined);
  assert.equal(request.text.format.type,'json_schema');assert.equal(request.text.format.name,'compose_lesson');
  assert.equal(request.text.format.strict,true);assert.deepEqual(request.text.format.schema,options.tools[0].parameters);
  return Response.json(response(JSON.stringify(ready)));
 }});
 assert.equal(result.toolCall,undefined);assert.deepEqual(readLessonAuthor(result,'compose','generated'),ready);
 assert.doesNotMatch(JSON.stringify(traces),/private-fixture/);
});
test('structured transport never repairs malformed or string-encoded lessons',async()=>{
 const options=lessonAuthorRequest({topic:'Web requests',creation:'generated'},'compose');
 for(const data of [{...ready,lesson:JSON.stringify(ready.lesson)},{...ready,lesson:{...ready.lesson,code:'execute()'}}]){
  const result=await callMeta({...options,apiKey:'fixture',fetchImpl:async()=>Response.json(response(JSON.stringify(data)))});
  assert.throws(()=>readLessonAuthor(result,'compose','generated'));
 }
 await assert.rejects(callMeta({...options,apiKey:'fixture',fetchImpl:async()=>Response.json(response('broken fixture JSON'))}),/structured JSON/);
});
test('structured unsupported replies and existing tool-based providers keep their contracts',()=>{
 const unsupported={status:'unsupported',message:{en:'Unsupported',zh:'不支持'},lesson:null};
 assert.deepEqual(readLessonAuthor({structured:{name:'compose_lesson',value:unsupported}},'compose'),unsupported);
 assert.deepEqual(readLessonAuthor({toolCall:{name:'compose_lesson',arguments:JSON.stringify(ready)}},'compose','generated'),ready);
 assert.equal(lessonAuthorRequest({topic:'Car acceleration'},'compose').structuredOutput,true);
});
