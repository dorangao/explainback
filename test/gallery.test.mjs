import test from 'node:test';import assert from 'node:assert/strict';
import {galleryLessons,galleryIds,galleryLesson,galleryIdFromHash,gallerySourceNote} from '../public/gallery-lessons.mjs';
import {validateLesson} from '../public/lesson-schema.mjs';
import {createLessonPlayer} from '../public/lesson-player.mjs';
import {createApp} from '../src/server.mjs';
import {testerCredentials} from '../test-support/tester.mjs';

test('every gallery lesson validates, states its provenance and completes locally in both languages',()=>{
 assert.ok(galleryLessons.length>=4);assert.equal(new Set(galleryIds).size,galleryIds.length);
 for(const item of galleryLessons){
  assert.match(item.id,/^[a-z-]+$/);assert.ok(['muse','muse-image','catalog'].includes(item.source));assert.ok(['model','process','catalog'].includes(item.kind));
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

test('gallery playback needs no sign-in: status stays private while the page is public',async t=>{
 const server=createApp({testerCredentials,configured:true});await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(r)));
 const origin=`http://127.0.0.1:${server.address().port}`;
 assert.equal((await fetch(origin+'/api/status')).status,401);
 assert.deepEqual(await(await fetch(origin+'/api/auth')).json(),{configured:true,codes:false,open:false,authenticated:false});
});
test('the sketch-sourced lesson records its image, ships the image with the brand files, and names the sketch in its provenance',async()=>{
 const {galleryLessons,gallerySourceNote}=await import('../public/gallery-lessons.mjs');
 const item=galleryLessons.find(l=>l.id==='sketch-pendulum');assert.ok(item);assert.equal(item.source,'muse-image');assert.equal(item.image,'/gallery/pendulum-sketch.png');
 assert.ok(galleryLessons.filter(l=>l.image).every(l=>l.image.startsWith('/gallery/')));
 const {brandFiles}=await import('../src/static.mjs');assert.equal(brandFiles.get('/gallery/pendulum-sketch.png'),'image/png');
 const {readFileSync}=await import('node:fs');const bytes=readFileSync(new URL('../public/gallery/pendulum-sketch.png',import.meta.url));assert.equal(bytes.subarray(1,4).toString(),'PNG');
 assert.match(gallerySourceNote('muse-image','en'),/sketch/);assert.match(gallerySourceNote('muse-image','zh'),/草图/);
});
