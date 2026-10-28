import test from 'node:test';import assert from 'node:assert/strict';
import {galleryLessons,galleryIds,galleryLesson,galleryIdFromHash,gallerySourceNote} from '../public/gallery-lessons.mjs';
import {validateLesson} from '../public/lesson-schema.mjs';
import {createLessonPlayer} from '../public/lesson-player.mjs';
import {mountLessonStudio} from '../public/lesson-studio.mjs';
import {createApp} from '../src/server.mjs';
import {testerCredentials} from '../test-support/tester.mjs';

test('every gallery lesson validates, states its provenance and completes locally in both languages',()=>{
 assert.ok(galleryLessons.length>=4);assert.equal(new Set(galleryIds).size,galleryIds.length);
 for(const item of galleryLessons){
  assert.match(item.id,/^[a-z-]+$/);assert.ok(['muse','catalog'].includes(item.source));assert.ok(['model','process','catalog'].includes(item.kind));
  assert.ok(item.summary.en.length<=200&&item.summary.zh.length<=200);
  const lesson=validateLesson(item.lesson);assert.equal(lesson.chapters.length,item.lesson.chapters.length);
  for(const language of ['en','zh']){
   const player=createLessonPlayer(item.lesson);
   for(let chapter=0;chapter<lesson.chapters.length;chapter++){
    const e=player.experiment(language);assert.ok(e.title&&e.claim&&e.transfer.question);
    player.predict('disagree');assert.ok(player.next());player.scrub(1);assert.ok(player.next());assert.ok(player.next());
    assert.equal(player.check(String(e.transfer.answer)),true);assert.ok(player.next());
   }
   assert.equal(player.state.stage,'complete');
  }
  assert.notEqual(gallerySourceNote(item.source,'en'),gallerySourceNote(item.source,'zh'));
 }
 assert.match(gallerySourceNote('muse','en'),/muse-spark-1\.3/);
});
test('gallery deep links accept only known lesson ids',()=>{
 assert.equal(galleryIdFromHash('#lesson:cooling'),'cooling');assert.equal(galleryIdFromHash('#lesson:nope'),null);
 assert.equal(galleryIdFromHash('#physics'),null);assert.equal(galleryIdFromHash(''),null);assert.equal(galleryIdFromHash(undefined),null);
 assert.equal(galleryLesson('web-cache').kind,'process');assert.equal(galleryLesson('missing'),null);
});

class El{
 constructor(){this.dataset={};this.children=[];this.events={};this.options=[];this.nodes=new Map();this.value='';this.classList={toggle(){}};}
 setAttribute(k,v){this[k]=v;}addEventListener(k,f){this.events[k]=f;}append(...e){this.children.push(...e);}replaceChildren(...e){this.children=e;this.options=e;}focus(){}
 querySelector(selector){if(!this.nodes.has(selector))this.nodes.set(selector,new El());return this.nodes.get(selector);}querySelectorAll(){return [];}
}
function fixture(){
 const saved={document:globalThis.document,Option:globalThis.Option};globalThis.document={createElement:()=>new El(),createElementNS:()=>new El()};globalThis.Option=class{constructor(label,value){this.textContent=label;this.value=value;}};
 const calls=[];const root=new El(),lab=mountLessonStudio(root,{post:async path=>{calls.push(path);return {records:[]};}});
 const guest={visible:true,authenticated:false,language:'en',traceEnabled:false,targets:[],defaultModel:null};lab.set(guest);
 return {root,lab,guest,calls,q:id=>root.querySelector('#ls-'+id),restore:()=>Object.assign(globalThis,saved)};
}
test('signed-out visitors can open, operate and finish a gallery lesson without any request',()=>{
 const f=fixture();try{
  assert.equal(f.q('gallery').hidden,false);assert.equal(f.q('author').hidden,true);assert.equal(f.q('model-panel').hidden,true);
  assert.equal(f.q('gallery-cards').children.length,galleryLessons.length);
  const card=f.q('gallery-cards').children[0],open=card.children.at(-1);assert.equal(open.textContent,'Open lesson →');
  open.events.click();
  assert.equal(f.q('gallery').hidden,true);assert.equal(f.q('player').hidden,false);assert.equal(f.root.dataset.stage,'predict');
  assert.match(f.q('status').textContent,/No model call was made/);assert.equal(f.q('ask').hidden,true);assert.equal(f.q('create').disabled,true);
  f.q('predictions').children[0].events.click();f.q('next').events.click();f.q('end').events.click();f.q('next').events.click();f.q('next').events.click();
  assert.equal(f.root.dataset.stage,'transfer');
  f.q('answer').value=String(createLessonPlayer(galleryLessons[0].lesson).experiment('en').transfer.answer);f.q('check').events.click();assert.equal(f.q('next').disabled,false);
  f.lab.set({...f.guest,language:'zh'});assert.equal(f.q('lesson-title').textContent,galleryLessons[0].lesson.title.zh);assert.equal(f.root.dataset.stage,'transfer');
  f.q('back').events.click();assert.equal(f.q('draft').hidden,false);assert.equal(f.q('gallery').hidden,true);
  f.q('close').events.click();assert.equal(f.q('gallery').hidden,false);assert.equal(f.q('draft').hidden,true);
  assert.equal(f.lab.openGallery('quantum'),true);assert.equal(f.q('lesson-title').textContent,galleryLessons.find(l=>l.id==='quantum').lesson.title.zh);
  assert.equal(f.lab.openGallery('missing'),false);
  assert.deepEqual(f.calls,[]);
 }finally{f.restore();}
});
test('signing in keeps the open gallery lesson and shows the authoring panel again',()=>{
 const f=fixture();try{
  f.lab.openGallery('cooling');f.q('back').events.click();
  f.lab.set({...f.guest,authenticated:true,targets:[{id:'meta:test',label:'Test',configured:true}],defaultModel:'meta:test'});
  assert.equal(f.q('author').hidden,false);assert.equal(f.q('model-panel').hidden,false);assert.equal(f.q('draft-title').textContent,'Newton cooling: how hot objects cool');
  assert.equal(f.q('reviewed').checked,true);assert.equal(f.q('present').disabled,false);
 }finally{f.restore();}
});
test('the gallery module is served without tester sign-in',async t=>{
 const server=createApp({testerCredentials,configured:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(r)));
 const origin=`http://127.0.0.1:${server.address().port}`,response=await fetch(origin+'/assets/gallery-lessons.mjs');
 assert.equal(response.status,200);assert.match(await response.text(),/galleryLessons/);
 assert.equal((await fetch(origin+'/api/status')).status,401);
});
