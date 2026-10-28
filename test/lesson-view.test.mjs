import test from 'node:test';import assert from 'node:assert/strict';
import {mountLessonStudio} from '../public/lesson-studio.mjs';
import {coolingLesson,processLesson} from '../test-support/generated-lessons.mjs';
const lesson=()=>({version:1,title:{en:'Test motion',zh:'测试运动'},intro:{en:'Introduction',zh:'简介'},chapters:[{experiment:'acceleration',framing:{en:'Two cars',zh:'两辆车'},explanation:{en:'Area under the curve',zh:'曲线下面积'}}]});
class El{
 constructor(){this.dataset={};this.children=[];this.events={};this.options=[];this.nodes=new Map();this.value='';this.classList={toggle(){}};}
 setAttribute(k,v){this[k]=v;}addEventListener(k,f){this.events[k]=f;}append(...e){this.children.push(...e);}replaceChildren(...e){this.children=e;this.options=e;}focus(){}
 querySelector(selector){if(!this.nodes.has(selector))this.nodes.set(selector,new El());return this.nodes.get(selector);}querySelectorAll(){return [];}
}
function fixture(post=async()=>({records:[]})){
 const saved={document:globalThis.document,Option:globalThis.Option};globalThis.document={createElement:()=>new El(),createElementNS:()=>new El()};globalThis.Option=class{constructor(label,value){this.textContent=label;this.value=value;}};
 const root=new El(),lab=mountLessonStudio(root,{post});const props={visible:true,authenticated:true,language:'en',traceEnabled:false,targets:[{id:'meta:test',label:'Test',configured:true,timeoutMs:100}],defaultModel:'meta:test'};lab.set(props);
 return {root,lab,props,q:id=>root.querySelector('#ls-'+id),restore:()=>Object.assign(globalThis,saved)};
}
test('language changes preserve the created lesson and learner experiment progress',()=>{
 const f=fixture();try{
  f.lab.loadLesson(lesson());f.q('present').events.click();f.q('predictions').children[1].events.click();f.q('next').events.click();f.q('end').events.click();
  f.lab.set({...f.props,language:'zh'});assert.equal(f.root.dataset.stage,'experiment');assert.equal(f.root.dataset.progress,'1');assert.equal(f.q('lesson-title').textContent,'测试运动');assert.equal(f.q('next').disabled,false);
 }finally{f.restore();}
});
test('editing a checked transfer answer requires a new check before advancing',()=>{
 const f=fixture();try{
  f.lab.loadLesson(lesson());f.q('present').events.click();f.q('predictions').children[1].events.click();f.q('next').events.click();f.q('end').events.click();f.q('next').events.click();f.q('next').events.click();
  f.q('answer').value='18';f.q('check').events.click();assert.equal(f.q('next').disabled,false);
  f.q('answer').value='0';f.q('answer').events.input();f.q('next').events.click();assert.equal(f.root.dataset.stage,'transfer');assert.equal(f.q('next').disabled,true);
 }finally{f.restore();}
});
test('signing out while authoring discards the late response and clears the draft',async()=>{
 let finish,started;const began=new Promise(r=>started=r);const f=fixture(async path=>{
  if(path==='/api/studio/session')return {sessionId:'session'};
  if(path==='/api/studio/compose'){started();return new Promise(r=>finish=r);}return {records:[]};
 });try{
  f.lab.loadLesson(lesson());f.q('topic').value='Cars';const pending=f.q('create').events.click();await began;
  f.lab.set({...f.props,authenticated:false});finish({status:'ready',lesson:lesson(),attemptsRemaining:7});await pending;
  assert.equal(f.q('draft').hidden,true);assert.equal(f.q('topic').value,'');assert.equal(f.q('create').disabled,true);
  assert.equal(f.q('title-edit').value,'');assert.equal(f.q('draft-title').textContent,'');
 }finally{f.restore();}
});
test('quantum lessons expose measurements only at the final prepared state',()=>{
 const f=fixture();try{
  const qLesson=lesson();qLesson.chapters[0].experiment='qubit';f.lab.loadLesson(qLesson);f.q('present').events.click();f.q('predictions').children[1].events.click();f.q('next').events.click();
  assert.equal(f.q('measure').disabled,true);f.q('measure').events.click();assert.equal(f.q('observations').textContent,'');
  f.q('end').events.click();assert.equal(f.q('measure').disabled,false);f.q('measure').events.click();assert.match(f.q('observations').textContent,/\|[01]⟩/);
 }finally{f.restore();}
});
test('starting a reordered lesson clears the previous quantum measurement before a physics chapter',()=>{
 const f=fixture();try{
  const mixed=lesson();mixed.chapters.unshift({...mixed.chapters[0],experiment:'qubit'});f.lab.loadLesson(mixed);f.q('present').events.click();f.q('predictions').children[1].events.click();f.q('next').events.click();f.q('end').events.click();f.q('measure').events.click();f.q('back').events.click();
  f.q('chapters').children[1].children.at(-1).children[0].events.click();
  assert.doesNotThrow(()=>f.q('present').events.click());assert.equal(f.q('observations').textContent,'');
 }finally{f.restore();}
});
test('generated lessons need review, edits revoke it, and parameters reset prediction while preserving language',()=>{
 const f=fixture();try{
  f.lab.loadLesson(coolingLesson());assert.equal(f.q('present').disabled,true);f.q('present').events.click();assert.equal(f.q('player').hidden,true);
  f.q('reviewed').checked=true;f.q('reviewed').events.change();f.q('present').events.click();f.q('predictions').children[1].events.click();f.q('next').events.click();f.q('end').events.click();
  const input=f.q('generated-controls').children[0].children[1];input.value='90';input.events.change();assert.equal(f.root.dataset.stage,'predict');
  f.lab.set({...f.props,language:'zh'});assert.match(f.q('generated-controls').children[0].children[0].textContent,/初始温度/);assert.equal(f.q('generated-controls').children[0].children[1].value,'90');
  f.q('back').events.click();f.q('title-edit').value='Revised';f.q('title-edit').events.input();assert.equal(f.q('present').disabled,true);
 }finally{f.restore();}
});
test('process steps and transfer choices operate locally and remain marked as authored',()=>{
 const f=fixture();try{
  f.lab.loadLesson(processLesson());f.q('reviewed').checked=true;f.q('reviewed').events.change();f.q('present').events.click();f.q('predictions').children[1].events.click();f.q('next').events.click();f.q('end').events.click();
  assert.equal(f.q('metrics').hidden,true);assert.equal(f.q('visual').children[0].children.length,3);
  f.q('next').events.click();f.q('next').events.click();assert.equal(f.q('answer').hidden,true);assert.equal(f.q('transfer-choices').children.length,3);
  f.q('transfer-choices').children[0].events.click();assert.match(f.q('check-result').textContent,/authored/);assert.equal(f.q('next').disabled,false);
 }finally{f.restore();}
});
test('tiny generated outputs use data-relative charts and visible significant digits',()=>{
 const f=fixture();try{
  const tiny=coolingLesson();tiny.chapters[0].demo.outputs[0].expression='initial * 1e-12 * x';f.lab.loadLesson(tiny);f.q('reviewed').checked=true;f.q('reviewed').events.change();f.q('present').events.click();f.q('predictions').children[1].events.click();f.q('next').events.click();f.q('end').events.click();
  assert.match(f.q('metrics').children[0].children[1].textContent,/e-9/);
  const marker=f.q('visual').children[0].children.find(n=>n.cx!==undefined&&n.cy!==undefined);assert.ok(Number(marker.cy)<100);
 }finally{f.restore();}
});

test('Studio demo starters are editable local actions that preserve an existing reviewed draft',async()=>{
 let calls=0;const f=fixture(async()=>{calls++;return {records:[]};});try{
  f.lab.loadLesson(coolingLesson());f.q('reviewed').checked=true;f.q('reviewed').events.change();
  f.q('demo-topic').events.click();assert.match(f.q('topic').value,/coffee/);assert.equal(f.q('creation').value,'generated');
  f.q('revision-example').events.click();assert.match(f.q('revision').value,/second output/);
  assert.equal(calls,0);assert.equal(f.q('draft-title').textContent,'Cooling coffee');assert.equal(f.q('present').disabled,false);
  const topic=f.q('topic').value;f.lab.set({...f.props,language:'zh'});assert.equal(f.q('topic').value,topic);
  f.q('revision-example').events.click();assert.match(f.q('revision').value,/输出/);assert.equal(calls,0);
 }finally{f.restore();}
});
test('revision starter uses process guidance and a real revision revokes review',async()=>{
 const f=fixture(async path=>path==='/api/studio/session'?{sessionId:'session'}:path==='/api/studio/compose'?{status:'ready',lesson:processLesson(),attemptsRemaining:7}:{records:[]});try{
  f.lab.loadLesson(processLesson());f.q('reviewed').checked=true;f.q('reviewed').events.change();
  f.q('revision-example').events.click();assert.match(f.q('revision').value,/conditional/);
  await f.q('revise').events.click();assert.equal(f.q('present').disabled,true);assert.equal(f.q('reviewed').checked,false);
 }finally{f.restore();}
});

test('demo starters cannot change prompts or send extra calls during authoring',async()=>{
 let finish,started,calls=0;const began=new Promise(r=>started=r);
 const f=fixture(async path=>{
  if(path==='/api/studio/session')return {sessionId:'session'};
  if(path==='/api/studio/compose'){calls++;started();return new Promise(r=>finish=r);}return {records:[]};
 });try{
  f.lab.loadLesson(coolingLesson());f.q('topic').value='Keep this question';f.q('revision').value='Keep this revision';
  const pending=f.q('create').events.click();await began;
  assert.equal(f.q('demo-topic').disabled,true);assert.equal(f.q('revision-example').disabled,true);
  f.q('demo-topic').events.click();f.q('revision-example').events.click();
  assert.equal(f.q('topic').value,'Keep this question');assert.equal(f.q('revision').value,'Keep this revision');assert.equal(calls,1);
  finish({status:'ready',lesson:coolingLesson(),attemptsRemaining:7});await pending;
 }finally{f.restore();}
});
