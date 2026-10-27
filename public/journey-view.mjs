import {journeyAt} from './journey.mjs';
const NS='http://www.w3.org/2000/svg';
const svg=(tag,attrs={},text)=>{const n=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))n.setAttribute(k,v);if(text!==undefined)n.textContent=text;return n;};
const fmt=n=>Number(n.toFixed(3));
const groups=[
 [['vx','Horizontal speed (m/s)','水平速度 (m/s)',1],['driveForce','Drive force (kN)','驱动力 (kN)',1000]],
 [['torque','Pitch torque (kN·m)','俯仰力矩 (kN·m)',1000],['angle','Pitch angle (rad)','俯仰角度 (rad)',1],['omega','Angular speed (rad/s)','角速度 (rad/s)',1]],
 [['contactForce','Vertical contact force (kN)','竖直接触力 (kN)',1000],['y','Vertical displacement (m)','竖直位移 (m)',1],['vy','Vertical speed (m/s)','竖直速度 (m/s)',1]],
];
export function mountJourney(root){
 root.innerHTML='<div class="section-heading"><h2 id="journey-title"></h2><span class="small-label" id="journey-tag"></span></div><p id="journey-context" class="fine"></p><div class="journey-phases"></div><div class="journey-layout"><div class="journey-player"><div id="journey-scene"></div><p id="journey-scene-note" class="fine"></p><p id="journey-boundary" class="journey-boundary"></p><div class="journey-buttons"><button type="button" id="journey-play" class="example" aria-pressed="false"></button><button type="button" id="journey-restart" class="example"></button><label><span id="journey-speed-label"></span><select id="journey-speed"><option value="1">1×</option><option value="0.5">0.5×</option><option value="0.25" selected>0.25×</option><option value="0.1">0.1×</option></select></label></div><label class="scrubber"><span id="journey-time-label"></span><input id="journey-time" type="range" min="0" step="0.0001" value="0"><output id="journey-readout"></output></label></div><div class="journey-plots"></div></div><p id="journey-limits" class="fine"></p>';
 const q=id=>root.querySelector('#'+id),play=q('journey-play'),time=q('journey-time');
 let scenario=null,key='',zh=false,t=0,frame=null,last=0,blocked=false,locked=false,preview=false,rangeEnd=null,leftBoundary=false,car,cursors=[],phaseButtons=[],sceneWidth=900,plotWidth=900,observedWidth=0,playResolve=null,guided=false;
 const selectors=groups.map((options,i)=>{
  const wrap=document.createElement('div'),label=document.createElement('label'),select=document.createElement('select'),plot=document.createElement('div');
  const output=document.createElement('output');output.className='journey-metric-value';select.id=`journey-metric-${i}`;label.append(select,output);wrap.append(label,plot);root.querySelector('.journey-plots').append(wrap);
  options.forEach(o=>select.add(new Option(o[1],o[0])));select.addEventListener('change',()=>{buildPlots();update();});return {select,plot,output};
 });
 const stop=(completed=false)=>{const resolve=playResolve;playResolve=null;guided=false;if(frame!==null)cancelAnimationFrame(frame);frame=null;last=0;play.setAttribute('aria-pressed','false');play.textContent=zh?'播放全程':'Play journey';for(const c of [play,time,q('journey-restart'),q('journey-speed'),...phaseButtons])c.disabled=blocked||locked||preview;resolve?.(completed);};
 function buildScene(){
  sceneWidth=Math.max(280,q('journey-scene').clientWidth||root.clientWidth||300);
  const drawing=svg('svg',{viewBox:`0 0 ${sceneWidth} 205`,role:'img','aria-label':zh?'加速、翻转、竖直制停的连续示意图':'Continuous schematic of acceleration, flip and vertical stopping'});
  drawing.append(svg('rect',{x:20,y:150,width:sceneWidth-40,height:55,fill:'#e9e1d1'}),svg('line',{x1:20,y1:150,x2:sceneWidth-20,y2:150,stroke:'#9baaa1','stroke-dasharray':'6 5'}));
  car=svg('g');car.append(svg('rect',{x:-29,y:-12,width:58,height:16,rx:5,fill:'#176f64'}),svg('path',{d:'M -15 -12 L -5 -24 L 13 -24 L 24 -12 Z',fill:'#176f64'}),svg('circle',{cx:-18,cy:6,r:6,fill:'#263d35'}),svg('circle',{cx:19,cy:6,r:6,fill:'#263d35'}),svg('path',{d:'M 16 -7 L 25 -7 L 21 -11 M 25 -7 L 21 -3',fill:'none',stroke:'#fff','stroke-width':2}));drawing.append(car);q('journey-scene').replaceChildren(drawing);
 }
 function buildPlots(){
  cursors=[];if(!scenario)return;
  plotWidth=Math.max(280,selectors[0].plot.clientWidth||root.clientWidth||300);
  const s=scenario,px=t=>62+t/s.end*(plotWidth-82);
  selectors.forEach(({select,plot},i)=>{
   const metric=groups[i].find(o=>o[0]===select.value),[name,,,scale]=metric;
   const intervals=[[0,s.launch,'#176f64'],[s.launch,s.touchdown,'#a45c31'],[s.touchdown,s.end,'#8d4545']];
   const series=intervals.map(([a,b,color],phase)=>({color,points:Array.from({length:101},(_,j)=>{
    const x=a+(b-a)*j/100;
    // Use one-sided values at model joins; never connect a velocity impulse.
    const sample=j===100&&phase<2?Math.max(a,x-1e-10):x;
    const p=journeyAt(s,sample);return [x,p[name]===null?null:p[name]/scale];
   })}));
   // Rotation after touchdown is not modeled, even though the snapshot is upright.
   if(['angle','omega','torque'].includes(name))series[2].points=[];
   const values=series.flatMap(l=>l.points.filter(p=>p[1]!==null).map(p=>p[1])),lo=Math.min(0,...values),hi=Math.max(1e-5,...values),span=hi-lo;
   const py=v=>127-(v-lo)/span*92;
   const g=svg('svg',{viewBox:`0 0 ${plotWidth} 163`,role:'img','aria-label':metric[zh?2:1]});
   intervals.forEach(([a,b,color])=>g.append(svg('rect',{x:px(a),y:25,width:px(b)-px(a),height:105,fill:color,opacity:.07})));
   for(let j=0;j<=2;j++){const v=lo+span*j/2;g.append(svg('line',{x1:62,x2:plotWidth-20,y1:py(v),y2:py(v),stroke:'#d5ddd5'}),svg('text',{x:55,y:py(v)+4,'text-anchor':'end',fill:'#5d6c67','font-size':12},fmt(v)));}
   for(const line of series){let path='',drawing=false;for(const[x,v]of line.points){if(v===null){drawing=false;continue;}path+=`${drawing?'L':'M'}${px(x)},${py(v)} `;drawing=true;}g.append(svg('path',{d:path,fill:'none',stroke:line.color,'stroke-width':2}));}
   for(const x of [0,s.launch,s.touchdown,s.end])g.append(svg('line',{x1:px(x),x2:px(x),y1:25,y2:130,stroke:'#8e9e94','stroke-dasharray':'3 4'}));
   // End label on its own row prevents short contact intervals overlapping.
   for(const x of [0,s.launch,s.touchdown])g.append(svg('text',{x:px(x),y:147,'text-anchor':'middle',fill:'#5d6c67','font-size':12},`${fmt(x)} s`));
   g.append(svg('text',{x:plotWidth-20,y:161,'text-anchor':'end',fill:'#5d6c67','font-size':12},`${zh?'结束':'End'} ${fmt(s.end)} s`));
   const cursor=svg('line',{y1:22,y2:132,stroke:'#233f34','stroke-width':2});g.append(cursor);cursors.push(cursor);plot.replaceChildren(g);
  });
 }
 function update(){
  if(!scenario)return;const s=scenario,p=journeyAt(s,leftBoundary?Math.max(0,t-1e-10):t),end=journeyAt(s,s.end);
  time.value=t;const apex=9.80665*s.flight.airtime**2/8,travel=Math.abs(end.y);
  const x=45+p.x/end.x*(sceneWidth-90),y=143-(p.y>=0?p.y/apex*88:p.y/Math.max(travel,.001)*35);
  car.setAttribute('transform',`translate(${x} ${y}) rotate(${-p.angle*180/Math.PI})`);car.setAttribute('opacity',p.phase==='contact'?'.55':'1');
  selectors.forEach(({select,output},i)=>{const metric=groups[i].find(m=>m[0]===select.value),value=p[metric[0]];output.textContent=p.phase==='contact'&&['angle','omega','torque'].includes(metric[0])?(zh?'接地后未模拟':'Unmodeled after touchdown'):value===null?'—':String(fmt(value/metric[3]));});
  cursors.forEach(c=>{const x=62+t/s.end*(plotWidth-82);c.setAttribute('x1',x);c.setAttribute('x2',x);});
  phaseButtons.forEach((b,i)=>b.setAttribute('aria-current',['acceleration','flight','contact'][i]===p.phase?'step':'false'));
  const labels=zh?['水平加速 · F=ma','抛体 + 理想外力偶 · τ=Iα','独立竖直制停 · N=mg+ma']:['Horizontal acceleration · F=ma','Ballistic flight + ideal external couple · τ=Iα','Separate vertical stopping · N=mg+ma'];
  const index=['acceleration','flight','contact'].indexOf(p.phase);
  q('journey-boundary').textContent=labels[index]+(p.phase==='flight'?(zh?'。起飞加入假设的竖直冲量；没有模拟起跳机构。':'. Launch adds an assumed vertical impulse; no takeoff mechanism is simulated.') :p.phase==='contact'?(zh?'。姿态是接地快照，后续旋转未模拟；水平速度仍保持。':'. Orientation is a touchdown snapshot; later rotation is unmodeled. Horizontal speed continues.'):'');
  q('journey-readout').textContent=`t=${fmt(t)} s · x=${fmt(p.x)} m · y=${fmt(p.y)} m · vx=${fmt(p.vx)} m/s · vy=${fmt(p.vy)} m/s · ${zh?'当前模型':'Model'} ${index+1}`;
 }
 function startPlayback(end=scenario?.end){
  rangeEnd=end;
  if(!scenario||blocked||root.hidden)return false;if(t>=scenario.end)t=0;
  play.textContent=zh?'暂停':'Pause';play.setAttribute('aria-pressed','true');
  const tick=now=>{if(root.hidden||blocked){stop();return;}if(!last)last=now;t=Math.min(rangeEnd,t+(now-last)/1000*Number(q('journey-speed').value));last=now;leftBoundary=guided&&t===rangeEnd&&rangeEnd<scenario.end;update();if(t>=rangeEnd){stop(true);return;}frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);return true;
 }
 play.addEventListener('click',()=>{if(guided||locked||preview)return;leftBoundary=false;if(frame!==null){stop();return;}startPlayback();});
 function playRange({signal,from=0,to=scenario?.end,rate=.5}){
  stop();if(signal.aborted||!scenario||blocked||preview||root.hidden)return Promise.resolve(false);
  if(!Number.isFinite(from)||!Number.isFinite(to)||from<0||to>scenario.end||from>=to||![1,.5,.25,.1].includes(rate))return Promise.resolve(false);
  t=from;leftBoundary=false;time.value=t;q('journey-speed').value=String(rate);update();guided=true;
  for(const c of [play,time,q('journey-restart'),q('journey-speed'),...phaseButtons])c.disabled=true;
  return new Promise(resolve=>{const cancel=()=>stop();signal.addEventListener('abort',cancel,{once:true});playResolve=completed=>{signal.removeEventListener('abort',cancel);resolve(completed);};if(!startPlayback(to))stop();});
 }
 const playThrough=({signal})=>playRange({signal});
 q('journey-restart').addEventListener('click',()=>{stop();leftBoundary=false;t=0;update();});
 time.addEventListener('input',()=>{stop();leftBoundary=false;t=Number(time.value);update();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 const observer=new ResizeObserver(()=>{const width=root.clientWidth;if(width&&width!==observedWidth&&scenario&&!root.hidden){observedWidth=width;buildScene();buildPlots();update();}});observer.observe(root);
 return {stop,playThrough,playRange,set({scenario:next,visible,language,busy=false,locked:lock=false,preview:initial=false}){
  zh=language==='zh';blocked=busy;locked=lock;preview=initial;root.dataset.preview=String(preview);root.hidden=!visible;if(!visible||busy)stop();
  // A parent workspace can be revealed after set() returns. ResizeObserver may
  // not emit if its final size equals the previous session's size.
  if(visible)requestAnimationFrame(()=>{if(scenario&&!root.hidden&&root.clientWidth&&selectors[0].plot.clientWidth!==plotWidth){observedWidth=root.clientWidth;buildScene();buildPlots();update();}});
  for(const c of [play,time,q('journey-restart'),q('journey-speed'),...phaseButtons])c.disabled=busy||locked||preview;
  if(!next){stop();scenario=null;key='';t=0;leftBoundary=false;time.value=0;observedWidth=0;return;}const nextKey=JSON.stringify(next)+language;
  if(key!==nextKey){stop();key=nextKey;scenario=next;t=0;leftBoundary=false;time.max=next.end;observedWidth=0;
   q('journey-title').textContent=zh?'从加速到着陆，一条时间线。':'One timeline, from acceleration to landing.';
   q('journey-scene-note').textContent=zh?'虚线是接地参考高度；下方仅示意制停行程，不是地面几何。':'Dashed line: touchdown reference. Lower band: stopping travel, not ground geometry.';
   q('journey-tag').textContent=zh?'三个独立模型':'THREE SEPARATE MODELS';
   q('journey-context').textContent=zh?`初始演示参数：m=${next.motion.massKg} kg，V=${next.motion.speedLabel}，加速 ${next.launch} s，飞行 ${next.flight.airtime} s，制停 ${next.flight.stopTime} s。示意图不按比例；各图同一时间轴。`:`Primary demo: m=${next.motion.massKg} kg, V=${next.motion.speedLabel}, ${next.launch} s acceleration, ${next.flight.airtime} s flight, ${next.flight.stopTime} s contact. Schematic scales differ; graphs share time.`;
   q('journey-restart').textContent=zh?'回到起点':'Restart';q('journey-speed-label').textContent=zh?'播放速度':'Playback speed';q('journey-time-label').textContent=zh?'全程时间（点击阶段可跳转）':'Journey time (select a phase to jump)';
   q('journey-limits').textContent=zh?'采用 B 的规定加速度曲线和受控翻转；位置连续不代表物理模型已耦合。起飞假设 vy 从 0 跳到 gT/2；空中与接触期间 vx=V，无水平制动。接触阶段只制停竖直速度，姿态冻结仅是快照。无实车执行器、轮胎、悬架或安全判断。':'Uses B’s prescribed acceleration and controlled turn. Continuous position does not imply coupled physics. Launch assumes vy jumps from 0 to gT/2; vx=V during flight/contact, with no horizontal braking. Contact only stops vertical velocity; frozen orientation is a snapshot. No real actuator, tire, suspension or safety evaluation.';
   const phaseNames=zh?['1 · 加速','2 · 翻转','3 · 着陆']:['1 · Accelerate','2 · Flip','3 · Land'];phaseButtons=phaseNames.map((label,i)=>{const b=document.createElement('button');b.type='button';b.className='example';b.textContent=label;b.disabled=busy||locked||preview;b.addEventListener('click',()=>{stop();leftBoundary=false;t=[0,next.launch,next.touchdown][i];update();});return b;});root.querySelector('.journey-phases').replaceChildren(...phaseButtons);
   selectors.forEach(({select},i)=>{select.setAttribute('aria-label',zh?`同步图 ${i+1}`:`Synchronized graph ${i+1}`);for(const o of select.options)o.textContent=groups[i].find(m=>m[0]===o.value)[zh?2:1];});
   buildScene();buildPlots();update();
  }
 }};
}
