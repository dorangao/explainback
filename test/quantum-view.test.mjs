import test from 'node:test';import assert from 'node:assert/strict';
import {mountQuantumLab} from '../public/quantum-view.mjs';
class El{
 constructor(){this.dataset={};this.children=[];this.events={};this.options=[];this.nodes=new Map();this.classList={toggle(){}};}
 setAttribute(k,v){this[k]=v;}addEventListener(k,f){this.events[k]=f;}append(...e){this.children.push(...e);}replaceChildren(...e){this.children=e;this.options=e;}focus(){}
 querySelector(selector){if(!this.nodes.has(selector))this.nodes.set(selector,new El());return this.nodes.get(selector);}querySelectorAll(){return [];}
}
function fixture(post=async()=>({records:[]})){
 const saved={document:globalThis.document,Option:globalThis.Option};globalThis.document={createElement:()=>new El(),createElementNS:()=>new El()};globalThis.Option=class{constructor(label,value){this.textContent=label;this.value=value;}};
 const root=new El(),lab=mountQuantumLab(root,{post});lab.set({visible:true,authenticated:true,language:'en',traceEnabled:false,targets:[{id:'meta:test',label:'Test',configured:true,timeoutMs:100}],defaultModel:'meta:test'});
 return {root,lab,q:id=>root.querySelector('#q-'+id),restore:()=>Object.assign(globalThis,saved)};
}
test('measurement waits until the coherent circuit is complete instead of silently discarding a collapse',()=>{
 const f=fixture();try{
  f.q('showcase').events.click();f.q('next').events.click();f.q('next').events.click();f.q('next').events.click();
  assert.equal(f.root.dataset.lesson,'interference');assert.equal(f.root.dataset.step,'1');
  assert.equal(f.q('measure').disabled,true);assert.equal(f.q('shots').disabled,true);
  f.q('measure').events.click();assert.equal(f.q('observed').textContent,'');
  f.q('next').events.click();f.q('next').events.click();assert.equal(f.q('measure').disabled,false);
 }finally{f.restore();}
});
test('exhaustion recovery keeps the circuit and creates a fresh provider session only on the next explicit request',async()=>{
 let sessions=0,calls=0;const f=fixture(async(path)=>{
  if(path==='/api/quantum/session')return {sessionId:'session-'+(++sessions)};
  if(path==='/api/quantum/explain'){calls++;return {explanation:'Checked.',nextQuestion:'Change phase?',focus:'amplitudes',attemptsRemaining:0};}
  return {records:[]};
 });try{
  f.q('showcase').events.click();f.q('next').events.click();await f.q('ask').events.click();assert.equal(calls,1);assert.equal(f.q('ask').disabled,true);
  assert.equal(f.q('new-coach').hidden,false);f.q('new-coach').events.click();assert.equal(f.root.dataset.step,'1');assert.equal(sessions,1);
  await f.q('ask').events.click();assert.equal(sessions,2);assert.equal(calls,2);
 }finally{f.restore();}
});
test('an expired coach session can recover on an explicit retry without changing language or provider',async()=>{
 let sessions=0,calls=0;const f=fixture(async(path)=>{
  if(path==='/api/quantum/session')return {sessionId:'session-'+(++sessions)};
  if(path==='/api/quantum/explain'){if(++calls===1)throw Object.assign(new Error('Expired'),{status:404});return {explanation:'Checked.',nextQuestion:'Try another?',focus:'circuit',attemptsRemaining:7};}
  return {records:[]};
 });try{f.q('showcase').events.click();f.q('next').events.click();await f.q('ask').events.click();assert.equal(sessions,1);await f.q('ask').events.click();assert.equal(sessions,2);assert.equal(calls,2);}finally{f.restore();}
});
