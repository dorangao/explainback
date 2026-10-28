import {quantumCircuit,quantumProbabilities,measureQuantum,sampleQuantum,quantumLessons} from './quantum.mjs';
import {quantumCopy,quantumLesson,quantumFrameText} from './quantum-content.mjs';
import {mountProviderConsole} from './provider-console.mjs';
const NS='http://www.w3.org/2000/svg';
const svg=(tag,attrs={},text)=>{const n=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))n.setAttribute(k,v);if(text!==undefined)n.textContent=text;return n;};
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
const fmt=n=>Math.abs(n)<1e-10?'0':String(Number(n.toFixed(3)));
const pct=n=>`${Number((n*100).toFixed(1))}%`;
const complex=([r,i])=>Math.abs(i)<1e-10?fmt(r):`${fmt(r)} ${i<0?'−':'+'} ${fmt(Math.abs(i))}i`;
export function mountQuantumLab(root,{post,onBusy=()=>{},onTarget=()=>{}}){
 root.innerHTML=`<div class="quantum-hero"><p class="eyebrow" id="q-tag"></p><h2 id="q-title"></h2><p id="q-intro"></p><div class="quantum-actions"><button id="q-showcase" type="button"></button><span id="q-local" class="fine"></span></div></div>
 <nav id="q-lessons" class="quantum-lessons" aria-label="Quantum experiments"></nav>
 <div class="quantum-layout"><section class="quantum-main"><div class="section-heading"><h3 id="q-heading" tabindex="-1"></h3><span id="q-progress" class="small-label"></span></div>
 <div class="q-claim"><p class="eyebrow" id="q-claim-label"></p><p id="q-claim"></p><div id="q-choices" class="quantum-actions"></div><p id="q-prediction" class="fine"></p><button id="q-test" type="button"></button></div>
 <div class="quantum-settings"><label id="q-phase-wrap"><span id="q-phase-label"></span><select id="q-phase"><option value="0">0</option><option value="1.5707963267948966">π/2</option><option value="3.141592653589793" selected>π</option></select></label><label id="q-basis-wrap"><span id="q-basis-label"></span><select id="q-basis"><option value="Z">Z</option><option value="X">X</option></select></label><label id="q-target-wrap"><span id="q-target-label"></span><select id="q-target"><option value="0">00</option><option value="1">01</option><option value="2">10</option><option value="3" selected>11</option></select></label></div>
 <div id="q-experiment" hidden><div id="q-circuit" class="q-circuit"></div><p id="q-story" class="q-story" role="status"></p>
 <div class="quantum-actions q-step-controls"><button id="q-prev" type="button" class="example"></button><button id="q-next" type="button"></button><button id="q-restart" type="button" class="text-button"></button></div>
 <div id="q-amplitudes"><h4 id="q-amplitude-title"></h4><div id="q-cards" class="q-state-cards"></div><p id="q-amplitude-note" class="fine"></p></div>
 <div id="q-measurements"><div class="quantum-actions"><button id="q-measure" type="button" class="example"></button><button id="q-shots" type="button" class="example"></button><button id="q-restore" type="button" class="text-button" hidden></button></div><p id="q-observed" role="status"></p><p id="q-collapse-note" class="fine" hidden></p><div id="q-counts" hidden></div><div id="q-reference" hidden></div></div></div>
 <details class="q-details"><summary id="q-details-title"></summary><p id="q-why"></p><p id="q-hardware"></p><p id="q-limits"></p></details></section>
 <aside class="quantum-aside"><section class="q-coach"><h3 id="q-coach-title"></h3><label class="q-model-label"><span id="q-model-label"></span><select id="q-model"></select></label><p id="q-coach-note" class="fine"></p><div class="quantum-actions"><button type="button" id="q-ask"></button><button type="button" id="q-challenge" class="example"></button></div><p id="q-coach-status" role="status"></p><p id="q-coach-answer"></p><p id="q-coach-next"></p><button type="button" class="example" id="q-new-coach" hidden></button></section><details id="q-console" class="provider-console" hidden></details><details class="q-details"><summary id="q-sources-title"></summary><p id="q-baseline" class="fine"></p><ul id="q-sources"></ul></details></aside></div>`;
 const q=id=>root.querySelector('#q-'+id),trace=mountProviderConsole(q('console'),post,{prefix:'quantum-trace'});
 let language='en',config={lesson:'qubit',phase:Math.PI,basis:'Z',target:3},step=0,prediction=null,tested=false,guided=false,collapsed=null,counts=null;
 let props={visible:false,authenticated:false,traceEnabled:false,targets:[],defaultModel:null},coachSession=null,modelId='',epoch=0,busy=false,feedback=null,error='',exhausted=false;
 const c=()=>quantumCopy[language],circuit=()=>quantumCircuit(config),target=()=>props.targets.find(t=>t.id===modelId);
 const setBusy=value=>{busy=value;onBusy(value);};
 const activePolls=new Set();
 const stopPolling=()=>{for(const timer of activePolls)clearInterval(timer);activePolls.clear();};
 function invalidateCoach(remote=true){stopPolling();epoch++;if(coachSession&&remote)post('/api/reset',{sessionId:coachSession.sessionId}).catch(()=>{});coachSession=null;feedback=null;error='';exhausted=false;setBusy(false);}
 function resetExperiment({lesson=config.lesson,script=false}={}){config.lesson=lesson;step=0;prediction=script?'agree':null;tested=script;guided=script;collapsed=null;counts=null;feedback=null;error='';render();}
 const chapterButtons=quantumLessons.map(id=>{const b=el('button');b.type='button';b.className='example';b.addEventListener('click',()=>{if(!busy)resetExperiment({lesson:id});});q('lessons').append(b);return b;});
 const predictionButtons=['agree','disagree','unsure'].map(value=>{const b=el('button');b.type='button';b.className='example';b.addEventListener('click',()=>{if(busy)return;prediction=value;guided=false;tested=false;step=0;collapsed=null;counts=null;feedback=null;render();});q('choices').append(b);return b;});
 function renderCircuit(model){
  const height=model.n===1?88:134,width=640,y=i=>42+i*48,gateX=i=>160+(i-1)*165;
  const drawing=svg('svg',{viewBox:`0 0 ${width} ${height}`,role:'img','aria-label':`${language==='zh'?'从左到右执行电路；当前':'Circuit runs left to right; current'} ${model.frames[step].gate}`});
  for(let i=0;i<model.n;i++)drawing.append(svg('text',{x:12,y:y(i)+5,fill:'#47526d','font-size':15},`q${i} |0⟩`),svg('line',{x1:80,x2:620,y1:y(i),y2:y(i),stroke:'#c0c8db','stroke-width':2}));
  model.frames.slice(1).forEach((f,index)=>{const i=index+1,x=gateX(i),active=i<=step,stroke=active?'#5151a0':'#aeb7c9',fill=i===step?'#e2e1f4':'#f8f8fa';
   if(f.gate==='CNOT'){drawing.append(svg('line',{x1:x,x2:x,y1:y(0),y2:y(1),stroke,'stroke-width':2}),svg('circle',{cx:x,cy:y(0),r:5,fill:stroke}),svg('circle',{cx:x,cy:y(1),r:13,fill,stroke,'stroke-width':2}),svg('path',{d:`M ${x-9} ${y(1)} H ${x+9} M ${x} ${y(1)-9} V ${y(1)+9}`,stroke,'stroke-width':2}));}
   else if(['oracle','diffuser'].includes(f.gate)){drawing.append(svg('rect',{x:x-43,y:20,width:86,height:94,rx:6,fill,stroke,'stroke-width':i===step?2.5:1}),svg('text',{x,y:72,'text-anchor':'middle',fill:stroke,'font-size':14},f.gate==='oracle'?(language==='zh'?'标记':'Oracle'):(language==='zh'?'放大':'Diffuser')));}
   else for(const wire of f.targets){drawing.append(svg('rect',{x:x-23,y:y(wire)-20,width:46,height:40,rx:6,fill,stroke,'stroke-width':i===step?2.5:1}),svg('text',{x,y:y(wire)+6,'text-anchor':'middle',fill:stroke,'font-size':18},f.gate==='H⊗H'?'H':f.gate==='P'?'Pφ':f.gate));}
   drawing.append(svg('text',{x,y:height-5,'text-anchor':'middle',fill:stroke,'font-size':11},`${i}${i===step?' ◀':''}`));
  });q('circuit').replaceChildren(drawing);
 }
 function bars(probabilities,labels,observations){
  const box=el('div',undefined,'q-bars');labels.forEach((label,i)=>{const row=el('div',undefined,'q-bar-row'),key=el('span',`|${label}⟩`),meter=el('meter');meter.min=0;meter.max=1;meter.value=observations?observations[i]/256:probabilities[i];meter.setAttribute('aria-label',`|${label}⟩ ${observations?observations[i]+'/256':pct(probabilities[i])}`);row.append(key,meter,el('span',observations?`${observations[i]}/256 · ${c().theory} ${pct(probabilities[i])}`:pct(probabilities[i])));box.append(row);});return box;
 }
 function render(){
  const text=c(),model=circuit(),lesson=quantumLesson(config.lesson,language),frame=model.frames[step],last=step===model.frames.length-1;
  if(props.visible)onTarget(target());
  root.hidden=!props.visible;root.dataset.lesson=config.lesson;root.dataset.step=String(step);root.dataset.guided=String(guided);
  for(const[id,key]of [['tag','tag'],['title','title'],['intro','intro'],['showcase','start'],['local','local'],['claim-label','claim'],['test','test'],['prev','prev'],['restart','restart'],['amplitude-title','amplitudes'],['amplitude-note','amplitudeNote'],['shots','shots'],['restore','restore'],['collapse-note','collapse'],['details-title','details'],['hardware','hardware'],['limits','limits'],['coach-title','coach'],['ask','ask'],['challenge','compare'],['coach-note','coachNote'],['phase-label','phase'],['basis-label','basis'],['target-label','target'],['sources-title','sources'],['baseline','baseline']])q(id).textContent=text[key];
  q('heading').textContent=lesson.title;q('claim').textContent=lesson.claim;q('why').textContent=lesson.why;
  q('progress').textContent=`${text.progress} ${quantumLessons.indexOf(config.lesson)+1}/4`;
  q('lessons').setAttribute('aria-label',language==='zh'?'量子实验章节':'Quantum experiments');
  chapterButtons.forEach((b,i)=>{b.textContent=`${i+1} · ${quantumLesson(quantumLessons[i],language).short}`;b.setAttribute('aria-current',config.lesson===quantumLessons[i]?'step':'false');b.disabled=busy;});
  predictionButtons.forEach((b,i)=>{b.textContent=text.choices[i];b.setAttribute('aria-pressed',String(prediction===['agree','disagree','unsure'][i]));b.disabled=busy;});
  q('prediction').textContent=guided?text.guided:prediction?`${text.prediction}: ${text.choices[['agree','disagree','unsure'].indexOf(prediction)]}`:text.choose;
  q('test').hidden=tested;q('test').disabled=!prediction||busy;q('experiment').hidden=!tested;
  q('phase-wrap').hidden=config.lesson!=='interference';q('basis-wrap').hidden=config.lesson!=='entanglement';q('target-wrap').hidden=config.lesson!=='search';
  q('phase').value=String(config.phase);q('basis').value=config.basis;q('target').value=String(config.target);
  for(const id of ['phase','basis','target','showcase','restart'])q(id).disabled=busy;
  q('prev').disabled=busy||step===0;q('next').disabled=busy||(last&&config.lesson==='search');
  q('next').textContent=last?(config.lesson==='search'?(language==='zh'?'展示完成':'Showcase complete'):text.nextLesson):`${text.next} → ${model.frames[step+1]?.gate}`;
  q('story').textContent=quantumFrameText(model,step,language);renderCircuit(model);
  if(collapsed)q('amplitude-title').textContent=language==='zh'?'本次测量后的状态':'State after this measurement';
  const state=collapsed?.state??frame.state,probabilities=quantumProbabilities(state);
  q('cards').replaceChildren(...model.labels.map((label,i)=>{
   const card=el('article',undefined,'q-state-card'),[re,im]=state[i];card.dataset.basis=label;card.dataset.probability=String(probabilities[i]);
   const phase=svg('svg',{viewBox:'0 0 100 92',role:'img','aria-label':`${text.amplitude} ${complex(state[i])}`});
   phase.append(svg('circle',{cx:50,cy:44,r:32,fill:'#f4f3fb',stroke:'#d6d7e5'}),svg('path',{d:'M 12 44 H 88 M 50 6 V 82',stroke:'#d6d7e5','stroke-width':1}));
   if(probabilities[i]>1e-12){const x=50+32*re,y=44-32*im;phase.append(svg('line',{x1:50,y1:44,x2:x,y2:y,stroke:'#5151a0','stroke-width':3,'stroke-linecap':'round'}),svg('circle',{cx:x,cy:y,r:3,fill:'#5151a0'}));}else phase.append(svg('circle',{cx:50,cy:44,r:2,fill:'#9da4b7'}));
   card.append(el('h5',`|${label}⟩`),phase,el('span',`${text.amplitude} ${complex(state[i])}`,'q-amplitude-number'),el('strong',pct(probabilities[i])),el('small',text.probability));return card;
  }));
  q('measure').textContent=collapsed?text.again:text.measure;q('measure').disabled=busy||!last;q('shots').disabled=busy||!last;q('restore').hidden=!collapsed;q('restore').disabled=busy;
  q('observed').textContent=collapsed?`${text.observed}: |${model.labels[collapsed.outcome]}⟩`:'';q('collapse-note').hidden=!collapsed;
  q('counts').hidden=!counts;if(counts)q('counts').replaceChildren(el('h4',text.histogram),bars(frame.probabilities,model.labels,counts),el('p',text.readout,'fine'));
  q('reference').hidden=!frame.reference;if(frame.reference)q('reference').replaceChildren(el('h4',text.reference),bars(frame.reference,model.labels),el('p',text.referenceNote,'fine'));
  q('model-label').textContent=language==='zh'?'提供商 / 模型':'Provider / model';q('model').disabled=busy;
  q('ask').disabled=q('challenge').disabled=busy||!tested||!last||!props.authenticated||!target()?.configured||exhausted;
  q('coach-status').textContent=busy?text.waiting:error?error:!target()?.configured?text.coachUnavailable:!tested||!last?(language==='zh'?'完成本实验的量子门后，可让模型解释结果。':'Finish this circuit to ask about its checked result.'):exhausted?(language==='zh'?'本会话的 8 次请求已用完。':'This session’s 8 requests have been used.'):'';
  q('new-coach').textContent=language==='zh'?'开始新的解释会话':'New explanation session';q('new-coach').hidden=!exhausted;q('new-coach').disabled=busy;
  q('coach-answer').textContent=feedback?`${text.coachPrefix} · ${target()?.label??''}\n${feedback.explanation}`:'';q('coach-next').textContent=feedback?.nextQuestion??'';
  for(const id of ['amplitudes','measurements','circuit'])q(id).classList.toggle('q-model-focus',feedback?.focus===({amplitudes:'amplitudes',measurements:'probabilities',circuit:'circuit'}[id]));
  trace.set({enabled:props.traceEnabled&&props.visible&&!document.hidden,sessionId:coachSession?.sessionId??null,language});
 }
 function go(next){step=next;collapsed=null;counts=null;feedback=null;error='';if(guided&&step===circuit().frames.length-1)counts=sampleQuantum(circuit().frames[step].state);render();}
 q('test').addEventListener('click',()=>{if(prediction&&!busy){tested=true;go(0);}});
 q('next').addEventListener('click',()=>{if(busy||!tested)return;const model=circuit();if(step<model.frames.length-1)go(step+1);else{const index=quantumLessons.indexOf(config.lesson);if(index<3){resetExperiment({lesson:quantumLessons[index+1],script:guided});q('heading').focus();}}});
 q('prev').addEventListener('click',()=>{if(!busy&&step>0)go(step-1);});
 q('showcase').addEventListener('click',()=>{if(busy)return;config={lesson:'qubit',phase:Math.PI,basis:'Z',target:3};resetExperiment({script:true});q('heading').focus();});
 q('restart').addEventListener('click',()=>{if(!busy)resetExperiment();});
 for(const id of ['phase','basis','target'])q(id).addEventListener('change',()=>{if(busy)return;config[id]=id==='basis'?q(id).value:Number(q(id).value);resetExperiment();});
 q('measure').addEventListener('click',()=>{if(!busy&&tested&&step===circuit().frames.length-1){collapsed=measureQuantum(collapsed?.state??circuit().frames[step].state);render();}});
 q('restore').addEventListener('click',()=>{if(!busy){collapsed=null;render();}});
 q('shots').addEventListener('click',()=>{if(!busy&&tested&&step===circuit().frames.length-1){collapsed=null;counts=sampleQuantum(circuit().frames[step].state);render();}});
 q('model').addEventListener('change',()=>{if(busy)return;modelId=q('model').value;invalidateCoach();render();});
 async function ask(question){
  if(busy||!tested||step!==circuit().frames.length-1||!props.authenticated||!target()?.configured||exhausted)return;
  const token=++epoch,snapshot={...config},picked=prediction,pickedTarget=target(),pickedLanguage=language;
  setBusy(true);feedback=null;error='';render();let poll;
  const send=(path,body)=>post(path,body,{timeoutMs:pickedTarget.timeoutMs+65000});
  try{
   if(!coachSession){const s=await send('/api/quantum/session',{language:pickedLanguage,synthetic:true,llm:pickedTarget.id});if(token!==epoch){post('/api/reset',{sessionId:s.sessionId}).catch(()=>{});return;}coachSession=s;render();}
   poll=setInterval(()=>{if(token===epoch&&props.visible&&!document.hidden)trace.refresh();},1000);activePolls.add(poll);
   const result=await send('/api/quantum/explain',{sessionId:coachSession.sessionId,circuit:snapshot,question,prediction:picked});if(token!==epoch)return;
   feedback=result;exhausted=result.attemptsRemaining===0;
  }catch(e){if(token===epoch){if(e.status===404)coachSession=null;error=c().coachError;exhausted=e.attemptsRemaining===0;}}
  finally{if(poll){clearInterval(poll);activePolls.delete(poll);}if(token===epoch){setBusy(false);render();await trace.refresh();}}
 }
 q('new-coach').addEventListener('click',()=>{if(!busy){invalidateCoach();render();}});
 q('ask').addEventListener('click',()=>ask('why'));q('challenge').addEventListener('click',()=>ask('claim'));
 for(const[label,url]of [['IBM · quantum information','https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/single-systems/quantum-information'],['IBM · entanglement','https://quantum.cloud.ibm.com/learning/en/courses/basics-of-quantum-information/entanglement-in-action/introduction'],['Microsoft · Grover search','https://learn.microsoft.com/en-us/azure/quantum/concepts-grovers']]){const item=el('li'),a=el('a',label);a.href=url;a.target='_blank';a.rel='noreferrer';item.append(a);q('sources').append(item);}
 const onVisibility=()=>{if(document.hidden&&busy)invalidateCoach();render();};
 document.addEventListener('visibilitychange',onVisibility);
 render();
 return {set(next){
  if(!next.visible&&busy)invalidateCoach();
  const lost=props.authenticated&&!next.authenticated;if(lost){invalidateCoach(false);config={lesson:'qubit',phase:Math.PI,basis:'Z',target:3};resetExperiment();}
  if(next.language!==language){invalidateCoach();language=next.language;}
  props={...props,...next};
  const selected=modelId;modelId=props.targets.some(t=>t.id===selected)?selected:props.defaultModel??props.targets[0]?.id??'';
  if([...q('model').options].map(o=>o.value).join('|')!==props.targets.map(t=>t.id).join('|'))q('model').replaceChildren(...props.targets.map(t=>{const o=new Option(t.label,t.id);o.disabled=!t.configured;return o;}));q('model').value=modelId;
  render();
 },reset(){invalidateCoach();resetExperiment();},destroy(){document.removeEventListener('visibilitychange',onVisibility);invalidateCoach();trace.destroy();root.replaceChildren();}};
}
