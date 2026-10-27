import {flightAssumptions} from './flight.mjs';
import {journeyScenario} from './journey.mjs';
import {mountJourney} from './journey-view.mjs';
import {demoPresets} from './demo-presets.mjs';
import {demoGuide,guideStages} from './demo-guide.mjs';
import {runPresetDemo,demoSettings} from './demo-runner.mjs';
import {mountProviderConsole} from './provider-console.mjs';
import {drawFlightView,flightReadout,flightMetrics} from './flight-view.mjs';
import { drawGraph } from './graph.mjs';
import { evaluate } from './math.mjs';
import { physicsAt, motionAssumptions } from './motion.mjs';
import { drawMotionGraph } from './motion-graph.mjs';
import { renderPhysicsPanel } from './physics-panel.mjs';
const $ = id => document.getElementById(id);
let playbackFrame=null,playbackLast=0;
let session = null, generation = 0, busy = false, ready = false, catalog = [];
let traceEnabled=false,demoPresetUsed=false,journeyModel=null;
let guidedDemo=false,autoEvidence=false,autoWaiting=false,autoGate=null;
let autoRun=null,autoState='idle',autoStage='',autoCalls=0,autoStopReason='';
const journey=mountJourney($('journey')),providerConsole=mountProviderConsole($('provider-console'),post);
const copy = {
  en: {
    'roadster-acceleration':'1 · Acceleration & force','roadster-flight':'2 · Flip & landing','roadster-stage-note':'Changing stage resets the current session.','flight-settings-heading':'Choose a hypothetical flip and landing','flight-mass-label':'Total mass (kg)','flight-time-label':'Airborne time T (s)','flight-radius-label':'Radius of gyration k (m), I=mk²','flight-separation-label':'Pure-couple force separation d (m)','flight-stop-label':'Vertical stopping time D (s)','flight-profile-label':'Net upward acceleration during contact','flight-setting-note':'k describes mass distribution, not wheel radius. All values are hypothetical; fixed per session. A starts spinning; B assumes an external torque couple. Contact is modeled separately.','flight-metric-label':'Graph view','example-torque':'Torque & spin','example-landing':'Landing force',
    'motion-mass-label':'Total mass, including occupants (kg)', 'motion-grip-label':'Effective tire grip μ (unitless)', 'motion-power-label':'Available wheel power (kW)', 'example-force':'Mass & force', 'example-smooth':'Smoothness',
    'motion-settings-heading':'Choose a hypothetical experiment', 'motion-speed-label':'Final speed (both cars)', 'motion-duration-label':'Time from rest (both cars)', 'motion-profile-label':"Car B’s acceleration", 'motion-setting-note':'A has constant acceleration. Every setting is hypothetical, not a Tesla specification. Settings stay fixed for a session; reset to change them.', 'motion-assumptions-heading':'What this model assumes', 'motion-metric-label':'Graph view',
    provenance:'Baseline: bilingual adaptive coach and fixed math. Extension: claim confirmation, checked evidence, replay, and transfer report. Implementation starts October 26 Pacific; competition eligibility unresolved.',
    'claim-heading':'Is this your claim?', 'confirm-claim':'Yes, test this claim', 'revise-claim':'Revise my meaning',
    'confirm-note':'Confirmation runs locally. No Meta request.', 'evidence-heading':'Checked evidence',
    'evidence-note':'Code checks the fixed mathematical identity. Claim interpretation and reasoning assessments come from Meta and may be wrong.',
    'values-legend':'Your transfer values', 'asymptote-label':'Horizontal asymptote y =', 'crossing-label':'Crossing input x =',
    'values-note':'Enter both values with your reasoning, or leave both blank to ask for help.', 'report-heading':'Transfer evidence',
    headline: 'Make your reasoning visible.', subtitle: 'Explain in your own words. Find one gap. Try the idea somewhere new.',
    eyebrow: 'LOCAL LEARNING LAB · ADULT PROTOTYPE', 'topic-label': 'Explore an idea',
    'consent-text': 'I am 18+ and will use only synthetic adult-user examples. No real student data.',
    start: 'Start a session ↗', reset: 'Reset session', 'explanation-label': 'Explain why, not just the answer.',
    'example-label': 'Synthetic starting points:', 'example-ambiguous': 'A vague claim', 'example-misconception': 'A possible misconception',
    submit: 'Get one next step →', 'request-note': 'One live Meta request per submission. No automatic retries.',
    'graph-heading': 'Look at the behavior.', 'graph-tag': 'VERIFIED MATH', 'scrubber-label': 'Explore a finite input',
    'margin-note': 'A limit describes what happens toward an end. A value tells you what happens at one input.',
    'comparison-label': 'YOUR REASONING, SIDE BY SIDE', 'before-label': 'Where you started', 'after-label': 'On a fresh problem',
    'learning-note': 'Your explanation supports this transfer problem. One response is evidence to build on, not a claim of lasting mastery.',
    again: 'Explore another idea →', 'trail-label': 'Reasoning trail', 'empty-text': 'Choose one idea and bring a synthetic explanation.',
    'empty-note': 'English or Chinese. A small question, a visible change in thinking.',
    'footer-left': 'Local prototype · Synthetic adults only · Sessions stay in memory', 'footer-right': 'Meta feedback + deterministic graphs',
    steps: ['01 · Explain', '02 · Reflect', '03 · Transfer', '04 · Compare'],
    stages: { explain: 'YOUR REASONING', revisit: 'REVISIT ONE IDEA', transfer: 'A FRESH PROBLEM', complete: 'A CHANGE IN REASONING' },
    actions: { ask_clarification:'Clarify the meaning',ask_prediction:'Predict before checking',evaluate_point:'Check one value',reveal_graph:'Test the idea with a graph',select_transfer:'Try a targeted transfer',compare_reasoning:'Compare the reasoning' },
    labels: { ambiguous: 'LET’S CLARIFY', misconception: 'ONE POSSIBLE GAP', supported: 'REASONING SUPPORTED' },
    pending: 'Reading your reasoning…', unavailable: 'Meta key missing · configure .env.local',
    ready: 'Meta configured · live requests', graphHidden: 'Make a prediction first. We can reveal the graph when it helps test your idea.',
    placeholder: 'I think… because…', newSession: 'Session reset. Choose an idea and start again.',
  },
  zh: {
    'roadster-acceleration':'1 · 加速度与力','roadster-flight':'2 · 翻转与着陆','roadster-stage-note':'切换阶段将重置当前会话。','flight-settings-heading':'选择一个假想翻转与着陆实验','flight-mass-label':'总质量 (kg)','flight-time-label':'空中时间 T (s)','flight-radius-label':'回转半径 k (m)，I=mk²','flight-separation-label':'力偶两力作用线间距 d (m)','flight-stop-label':'竖直制停时间 D (s)','flight-profile-label':'接触期间净向上加速度','flight-setting-note':'k 描述质量分布，不是轮胎半径。所有数值为假设，每次会话固定。A 起飞时已旋转；B 假设有外力偶。接触阶段单独建模。','flight-metric-label':'图像视图','example-torque':'力矩与旋转','example-landing':'着陆力',
    'motion-mass-label':'总质量，含乘员 (kg)', 'motion-grip-label':'有效轮胎抓地系数 μ（无量纲）', 'motion-power-label':'可用轮端功率 (kW)', 'example-force':'质量与力', 'example-smooth':'平滑度',
    'motion-settings-heading':'选择一个假想实验', 'motion-speed-label':'末速度（两车相同）', 'motion-duration-label':'从静止开始的时间（两车相同）', 'motion-profile-label':'B 车的加速度', 'motion-setting-note':'A 车的加速度恒定。所有数值均为假设，并非 Tesla 规格。每次会话设置固定；重置后可修改。', 'motion-assumptions-heading':'模型假设', 'motion-metric-label':'图像视图',
    provenance:'已有基础：双语自适应辅导与固定数学题库。新增：确认说法、核验证据、重放与迁移报告。实际开发始于太平洋时间10月26日；参赛资格尚待确认。',
    'claim-heading':'这是你想表达的说法吗？', 'confirm-claim':'是，检验这个说法', 'revise-claim':'修改我的意思',
    'confirm-note':'确认在本地完成，不发送 Meta 请求。', 'evidence-heading':'已核验的证据',
    'evidence-note':'代码核验固定数学恒等式。说法解读和推理评价来自 Meta，可能有误。',
    'values-legend':'你的迁移题数值', 'asymptote-label':'水平渐近线 y =', 'crossing-label':'穿越点的输入 x =',
    'values-note':'结合推理填写两个数值；如需帮助，可以将两个输入框都留空。', 'report-heading':'迁移证据',
    headline: '让你的思考看得见。', subtitle: '用自己的话讲出来，找到一个缺口，再用一道新题检验。',
    eyebrow: '本地学习实验室 · 成人原型', 'topic-label': '探索一个想法',
    'consent-text': '我已满18岁，只使用虚构的成人学习示例，不输入真实学生资料。',
    start: '开始学习 ↗', reset: '重置本次学习', 'explanation-label': '请解释为什么，而不只是给出答案。',
    'example-label': '虚构示例：', 'example-ambiguous': '一个模糊的说法', 'example-misconception': '一个可能的误解',
    submit: '获取一个下一步 →', 'request-note': '每次提交发送一次真实 Meta 请求，不会自动重试。',
    'graph-heading': '看看函数的行为。', 'graph-tag': '已核验的数学', 'scrubber-label': '探索一个有限的输入值',
    'margin-note': '极限描述趋向某一端时的行为；函数值描述某个输入处的结果。',
    'comparison-label': '对照你的两次推理', 'before-label': '最初的想法', 'after-label': '面对一道新题',
    'learning-note': '这次解释支持你在这道迁移题上的理解。一次回答只是进一步学习的依据，不代表已经长期掌握。',
    again: '探索另一个想法 →', 'trail-label': '推理记录', 'empty-text': '选择一个概念，从一段虚构的解释开始。',
    'empty-note': '中文或英文。一个小问题，一次看得见的思考变化。',
    'footer-left': '本地原型 · 仅限虚构成人示例 · 会话只保存在内存', 'footer-right': 'Meta 反馈 + 确定性图像',
    steps: ['01 · 解释', '02 · 反思', '03 · 迁移', '04 · 对照'],
    stages: { explain: '讲出你的推理', revisit: '重新思考一个概念', transfer: '一道全新的题', complete: '推理的变化' },
    actions: { ask_clarification:'先澄清含义',ask_prediction:'先预测，再验证',evaluate_point:'核验一个函数值',reveal_graph:'用图像检验想法',select_transfer:'尝试针对性的迁移题',compare_reasoning:'对照两次推理' },
    labels: { ambiguous: '先澄清一下', misconception: '一个可能的理解缺口', supported: '推理得到支持' },
    pending: '正在阅读你的推理…', unavailable: '未配置 Meta 密钥 · 请检查 .env.local',
    ready: 'Meta 已配置 · 真实 API 请求', graphHidden: '先讲出预测。需要时再展开图像，检验你的想法。',
    placeholder: '我认为……因为……', newSession: '学习记录已重置。选择一个概念重新开始。',
  },
};
const language = () => $('language').value;
const t = () => copy[language()];
function localize() {
  document.documentElement.lang = language() === 'zh' ? 'zh-CN' : 'en';
  for (const [id, value] of Object.entries(t())) if (typeof value === 'string' && $(id)) $(id).textContent = value;
  t().steps.forEach((text, i) => $(`step-${i+1}`).textContent = text);
  $('explanation').placeholder = t().placeholder;
  for (const item of catalog) { const option = [...$('topic').options].find(o => o.value === item.id); if (option) option.textContent = item.title[language()]; }
  $('connection').textContent = ready ? t().ready : t().unavailable;
  for(const [value,en,zh]of [['rising','Increasing','递增'],['falling','Decreasing','递减'],['smooth','Cosine pulse · smooth joins','余弦脉冲 · 平滑衔接']])$('motion-profile').querySelector(`option[value="${value}"]`).textContent=language()==='zh'?zh:en;
  for(const [value,en,zh]of [['velocity','Velocity (m/s)','速度 (m/s)'],['acceleration','Acceleration (m/s²)','加速度 (m/s²)'],['distance','Distance (m)','路程 (m)'],['force','Required force (kN)','所需力 (kN)'],['powerKw','Wheel power (kW)','轮端功率 (kW)'],['jerk','Jerk (m/s³)','加加速度 (m/s³)']])$('motion-metric').querySelector(`option[value="${value}"]`).textContent=language()==='zh'?zh:en;
  for(const [value,en,zh]of flightMetrics)$('flight-metric').querySelector(`option[value="${value}"]`).textContent=language()==='zh'?zh:en;
  for(const [value,en,zh]of [['constant','Constant','恒定'],['pulse','Cosine pulse','余弦脉冲']])$('flight-profile').querySelector(`option[value="${value}"]`).textContent=language()==='zh'?zh:en;
  renderMotionSetup();drawCurrentGraph();stopPlayback();renderDemo();
}
function flightMode(){return (session?.problem.id||$('topic').value)==='flight';}
function motionMode(){return (session?.problem.id||$('topic').value)==='acceleration';}
function renderMotionSetup(){
  $('motion-settings').hidden=!(motionMode()||flightMode())||['transfer','complete'].includes(session?.phase);$('motion-assumptions').hidden=!(motionMode()||flightMode());
  $('flight-settings').hidden=!(motionMode()||flightMode())||['transfer','complete'].includes(session?.phase);
  $('roadster-stages').hidden=!(motionMode()||flightMode());
  for(const [id,active]of [['roadster-acceleration',motionMode()],['roadster-flight',flightMode()]])$(id).setAttribute('aria-pressed',String(active));
  $('motion-assumptions-text').textContent=session?.assumptions||(flightMode()?flightAssumptions:motionAssumptions)[language()];
  for(const id of ['example-force','example-smooth'])$(id).hidden=!motionMode();
  $('provenance').textContent=motionMode()?(language()==='zh'?'已有基础：双语辅导、渐近线与加速度说法实验。此次新增：质量、力、抓地/功率上限、加加速度与余弦平滑曲线。实际开发日期已记录；参赛资格尚待确认。':'Baseline: bilingual coach, crossing and acceleration claim labs. New extension: mass, force, grip/power limits, jerk and cosine profiles. Actual development dates are recorded; competition eligibility unresolved.'):t().provenance;
  for(const id of ['example-torque','example-landing'])$(id).hidden=!flightMode();
  if(flightMode())$('provenance').textContent=language()==='zh'?'已有基础：渐近线、加速度与力/体感实验。此次新增：理想翻转力矩、竖直接触力、交互播放与迁移题。实际开发日期已记录；参赛资格尚待确认。':'Baseline: crossing, acceleration and force/feel labs. New stage: ideal flip torque, vertical contact forces, interactive playback and transfer. Actual development dates recorded; competition eligibility unresolved.';
  document.querySelector('#empty > span').textContent=flightMode()?'θ(t) → ?':motionMode()?'v(t) → ?':'f(x) → ?';
  if(motionMode()||flightMode())$('provenance').textContent=language()==='zh'?'已有基础：加速、力与体感、翻转与着陆的独立实验。此次新增：连续演示、同步图像、预设提示和可选请求控制台。比赛资格尚待确认。':'Baseline: separate acceleration, force/feel, flip and landing labs. New: continuous demo, synchronized graphs, presets and optional provider console. Event eligibility remains unresolved.';
}
function readJourney(){return journeyScenario({speedMph:Number($('motion-speed').value),duration:Number($('motion-duration').value),profileB:$('motion-profile').value,massKg:Number($('motion-mass').value),grip:Number($('motion-grip').value),powerKw:Number($('motion-power').value)},{massKg:Number($('flight-mass').value),airtime:Number($('flight-time').value),radius:Number($('flight-radius').value),separation:Number($('flight-separation').value),stopTime:Number($('flight-stop').value),landingProfile:$('flight-profile').value});}
function renderDemo(){
 const zh=language()==='zh',options=demoPresets(session,language());
 $('demo-presets').hidden=options.length===0;
 const old=$('demo-preset').value;$('demo-preset').replaceChildren(...options.map((p,i)=>new Option(p.label,String(i))));if(options[old])$('demo-preset').value=old;
 $('demo-preset-label').textContent=zh?'演示预设 · 当前步骤':'Demo preset · current step';$('demo-load').textContent=zh?'载入预设':'Load preset';
 $('demo-preset-note').textContent=zh?'可编辑，再点击提交。使用预设后，本会话标记为脚本演示，不作为独立迁移证据。':'Load, optionally edit, then submit. Presets mark this session as a scripted demo, not independent transfer evidence.';
 const scripted=traceEnabled||demoPresetUsed||session?.demoUsed;
 $('demo-mode-note').hidden=!scripted;$('demo-mode-note').textContent=traceEnabled?(zh?'开发演示 · 请求追踪已启用，可能显示核验答案；结果不计为独立迁移。':'Developer demo · provider tracing can expose checked answers; results do not count as independent transfer.'):(zh?'脚本演示 · 使用了预设提示；结果不计为独立迁移。':'Scripted demo · preset prompts used; results do not count as independent transfer.');
 providerConsole.set({enabled:traceEnabled,sessionId:session?.sessionId??null,language:language(),followLatest:autoActive()});
 journey.set({scenario:journeyModel,visible:guidedDemo||Boolean(session?.graph&&journeyModel&&session.phase!=='transfer'&&(motionMode()||flightMode())),language:language(),busy,locked:autoActive(),preview:guidedDemo&&!autoEvidence});
 renderAutoDemo();
}
const autoActive=()=>Boolean(autoRun&&!autoRun.controller.signal.aborted);
function renderAutoDemo(){
 const zh=language()==='zh',guide=demoGuide(autoStage,language());
 $('auto-demo').classList.toggle('guided-demo',guidedDemo);$('auto-demo').classList.toggle('guide-active',autoActive());
 $('auto-demo-title').textContent=zh?'Roadster 分步演示':'Roadster guided demo';
 $('auto-demo-run').textContent=zh?'开始演示':'Start demo';$('auto-demo-stop').textContent=zh?'停止演示':'Stop demo';
 $('auto-demo-language').value=language();
 $('auto-demo-preview-title').textContent=zh?'本步预设与真实反馈':'This step’s preset and live feedback';
 $('auto-demo-note').textContent=!traceEnabled?(zh?'演示需启用 EXPLAINBACK_TRACE=1 并重启，以显示真实调用。':'Enable EXPLAINBACK_TRACE=1 and restart to show live calls in the guided demo.'):
  !$('adult').checked?(zh?'先勾选上方成人 / 虚构示例确认，再开始。':'Confirm adult / synthetic use above, then start.'):
  (zh?'按“下一步”推进，每个阶段都暂停。完整流程最多 4 次真实模型调用；脚本确认，不自动重试。切换语言会停止并重置。':'Advance with Next; every stage pauses. Up to 4 live calls, scripted confirmation, no retries. Switching language stops and resets the run.');
 const states=zh?{idle:'选择语言，再开始演示。',running:autoWaiting?'已暂停 · 阅读后点击下一步':'进行中 · 请等待本步完成',complete:'演示完成 · 数值与推理已核验；计为辅助完成。',stopped:'演示已停止；已发送的请求可能仍会完成。',attention:'演示已停在当前步骤，请查看反馈；可手动继续。'}:{idle:'Choose a language, then start.',running:autoWaiting?'Paused · read, then select Next':'In progress · wait for this step to finish',complete:'Demo complete · values and reasoning checked; assisted result.',stopped:'Demo stopped; an already sent request may still finish.',attention:'Demo stopped at this step. Inspect feedback; you can continue manually.'};
 $('auto-demo-status').textContent=states[autoState]+(autoState!=='idle'?` · ${autoCalls}/4 ${zh?'次模型调用':'provider calls'}`:'')+(autoStopReason==='language'?(zh?' 点击开始，以新语言重新演示。':' Select Start to run in the new language.'):'');
 const names=zh?['说法','确认','预测','证据','加速','翻转','着陆','修正','迁移','结果']:['Claim','Confirm','Predict','Evidence','Accelerate','Flip','Land','Revise','Transfer','Result'];
 const current=guideStages.indexOf(autoStage);
 $('auto-demo-steps').hidden=autoState==='idle';$('auto-demo-steps').replaceChildren(...guideStages.map((id,i)=>{const li=document.createElement('li');li.textContent=`${i+1}. ${names[i]}`;li.classList.toggle('done',autoState==='complete'||i<current);if(id===autoStage)li.setAttribute('aria-current','step');return li;}));
 $('auto-demo-run').disabled=!ready||!traceEnabled||!$('adult').checked||busy||autoActive();$('auto-demo-stop').hidden=!autoActive();
 $('auto-demo-guide').hidden=!guidedDemo||!guide;
 if(guide){$('auto-demo-guide-title').textContent=guide[0];['claim','graph','result'].forEach((id,i)=>{$('guide-'+id).textContent=guide[i+1];$('guide-'+id+'-label').textContent=(zh?['说法 / 想法','怎么看图','结果 / 下一步']:['Claim / idea','Read the graph','Result / next action'])[i];});}
 $('auto-demo-next').disabled=!autoWaiting||!autoActive()||busy;
 $('auto-demo-next').textContent=autoState==='complete'?(zh?'已完成':'Finished'):`${zh?'下一步':'Next'} → ${guide?.[4]??''}`;
 $('auto-demo-reference').hidden=!guidedDemo;
 $('auto-demo-reference').textContent=!autoEvidence?(zh?'起点预览 · 先预测，再显示图像。':'Starting scene · graphs appear after the prediction.'):
  ['transfer','complete'].includes(session?.phase)?(zh?'初始示例参考 · 下方动画仍是 2000 kg、1.5 秒翻转，不是当前迁移题的参数。':'Primary reference · the animation still uses 2000 kg and a 1.5 s flip, not the fresh transfer values.'):
  (zh?'初始演示 · 同一光标贯穿三个独立模型；每段结束后暂停。':'Primary demonstration · one cursor across three separate models; each segment ends with a pause.');
}

function stopAutoDemo(reason='stop'){
 if(!autoActive())return;autoStopReason=reason;autoState='stopped';autoRun.controller.abort();journey.stop();renderAutoDemo();controls();
}
function demoCheckpoint(_stage,signal){
 return new Promise((resolve,reject)=>{
  if(signal.aborted){reject(new DOMException('Stopped','AbortError'));return;}
  const gate={next:()=>finish(true)};
  const cancel=()=>finish(false);
  const finish=ok=>{if(autoGate!==gate)return;autoGate=null;autoWaiting=false;signal.removeEventListener('abort',cancel);renderAutoDemo();ok?resolve():reject(new DOMException('Stopped','AbortError'));};
  autoGate=gate;autoWaiting=true;signal.addEventListener('abort',cancel,{once:true});renderAutoDemo();
 });
}
$('auto-demo-next').addEventListener('click',event=>{if(event.detail>1||busy||!autoActive())return;autoGate?.next();});
$('auto-demo-next').addEventListener('keydown',event=>{if(event.repeat&&(event.key==='Enter'||event.key===' '))event.preventDefault();});
$('auto-demo-language').addEventListener('change',()=>{$('language').value=$('auto-demo-language').value;$('language').dispatchEvent(new Event('change'));});

function drawCurrentGraph(){
  if(flightMode())drawFlightView($('flight-scene'),$('graph'),$('flight-panel'),session?.graph,language(),Number($('scrubber').value),$('flight-metric').value);
  else if(motionMode())drawMotionGraph($('graph'),session?.graph,language(),Number($('scrubber').value),$('motion-metric').value);
  else drawGraph($('graph'),session?.graph,language(),Number($('scrubber').value));
  if(!flightMode()){$('flight-scene').hidden=true;$('flight-panel').hidden=true;$('graph').classList.remove('flight-plot');}
  renderPhysicsPanel($('physics-panel'),motionMode()?session?.graph:null,language(),Number($('scrubber').value));
}
function controls() {
  if(busy){stopPlayback();journey.stop();}
  $('demo-load').disabled=busy||!session;$('demo-preset').disabled=busy;
  for(const id of ['roadster-acceleration','roadster-flight','example-torque','example-landing'])$(id).disabled=busy;
  $('flight-play').disabled=busy||!session?.graph;
  $('start').disabled = !ready || !$('adult').checked || busy || Boolean(session);
  $('topic').disabled = Boolean(session) || busy;
  $('adult').disabled = Boolean(session) || busy;
  $('submit').disabled = busy || !session || ['complete','confirm'].includes(session.phase) || session.attemptsRemaining <= 0;
  $('submit').textContent = busy ? t().pending : t().submit;
  $('submit').classList.toggle('busy', busy);
  $('explanation').disabled = busy;
  $('example-ambiguous').disabled = busy;
  $('example-misconception').disabled = busy;
  $('example-force').disabled=busy;$('example-smooth').disabled=busy;
  for(const id of ['confirm-claim','revise-claim','transfer-asymptote','transfer-crossing'])$(id).disabled=busy;
  for(const button of document.querySelectorAll('#evidence-records button'))button.disabled=busy;
  for(const id of ['motion-speed','motion-duration','motion-profile','motion-mass','motion-grip','motion-power','flight-mass','flight-time','flight-radius','flight-separation','flight-stop','flight-profile'])$(id).disabled=busy||Boolean(session);
  if(autoActive())for(const id of ['start','topic','adult','roadster-acceleration','roadster-flight','submit','explanation','confirm-claim','revise-claim','demo-load','demo-preset','transfer-asymptote','transfer-crossing','example-ambiguous','example-misconception','example-force','example-smooth','example-torque','example-landing','flight-play'])$(id).disabled=true;
  renderAutoDemo();
}
async function post(path, body) {
  const response = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(40_000) });
  const data = await response.json();
  if (!response.ok) { const error = new Error(data.error || 'Local request failed.'); error.attemptsRemaining = data.attemptsRemaining; throw error; }
  return data;
}
function showError(message) { $('error').textContent = message; $('error').hidden = false; }
function render() {
  stopPlayback();journey.stop();renderDemo();
  $('workspace').hidden = !session; $('empty').hidden = Boolean(session);
  renderMotionSetup();
  if (!session) { controls(); return; }
  const { phase, problem, history, graph } = session;
  const claimMode=session.workflow==='claim-testing';
  const claimStages=language()==='zh'?{claim:'讲出一个说法',confirm:'确认解读',prediction:'先预测',revision:'根据证据重新解释',complete:'证据与迁移'}:{claim:'STATE A CLAIM',confirm:'CONFIRM THE INTERPRETATION',prediction:'PREDICT BEFORE CHECKING',revision:'RECONCILE THE EVIDENCE',complete:claimMode?'EVIDENCE AND TRANSFER':t().stages.complete};
  $('stage-label').textContent = (claimMode?claimStages[phase]:null)||t().stages[phase];
  if(claimMode){const steps=language()==='zh'?['01 · 说法','02 · 证据','03 · 迁移','04 · 报告']:['01 · Claim','02 · Evidence','03 · Transfer','04 · Report'];steps.forEach((v,i)=>$(`step-${i+1}`).textContent=v);}
  $('problem-title').textContent = problem.title;
  $('expression').textContent = problem.expression;
  $('prompt').textContent = phase === 'complete' ? problem.prompt : (session.probe || problem.prompt);
  const examplesRow = document.querySelector('.example-row');
  examplesRow.hidden = phase === 'transfer' || phase === 'complete'||phase==='confirm'||(claimMode&&phase!=='claim');
  $('explain-form').hidden = phase === 'complete'||phase==='confirm';
  $('transfer-values').hidden=!(claimMode&&phase==='transfer');
  if(claimMode){session.answerFields.forEach((field,i)=>$(i===0?'asymptote-label':'crossing-label').textContent=field.label[language()]);
    $('values-note').textContent=(motionMode()||flightMode())?(language()==='zh'?'按上方单位填写两个数值并解释，可四舍五入到0.01。如需帮助可将两项留空。':'Enter both values in the labeled units with reasoning, rounded to 0.01. Leave both blank to ask for help.'):t()['values-note'];}
  $('attempts').textContent = language() === 'zh' ? `本次剩余 ${session.attemptsRemaining} 次请求` : `${session.attemptsRemaining} requests left in this session`;
  const stage = phase === 'complete' ? 4 : phase === 'transfer' ? 3 : ['revisit','prediction','revision'].includes(phase) ? 2 : 1;
  for (let i=1;i<=4;i++) { $(`step-${i}`).classList.toggle('active', i === stage); if(i===stage)$(`step-${i}`).setAttribute('aria-current','step');else $(`step-${i}`).removeAttribute('aria-current'); }
  const last = history.at(-1);
  $('feedback').hidden = !last;
  if (last) {
    $('feedback-label').textContent = t().labels[last.assessment];
    $('evidence').textContent = last.evidence;
    $('feedback-text').textContent = last.feedback;
    const actions=language()==='zh'?{propose_claim:'提出待确认的解读',run_experiment:'执行已核验的实验'}:{propose_claim:'Propose an interpretation',run_experiment:'Execute the checked experiment'};
    $('coach-action').textContent = actions[last.action]||t().actions[last.action] || '';
    $('coach-reason').textContent = `${language()==='zh'?'这一步的目的：':'Why this step: '}${last.reason}`;
    $('checked-result').hidden = !session.observation;
    if(session.observation){
      const point=session.observation;
      const name=point.expression.split('=')[0].trim().replace('(x)',`(${point.x})`);
      $('checked-result').textContent=`${language()==='zh'?'已核验的数值':'Checked value'} · ${name} = ${Number(point.y.toPrecision(8))}`;
    }
    $('next-question').textContent = phase === 'complete' ? '' : (session.probe || last.question);
    $('source').textContent = `${language()==='zh'?'真实 Meta 反馈':'Live Meta feedback'} · ${last.model || 'Meta Model API'}`;
  }
  if(flightMode()&&graph){const slider=$('scrubber'),end=graph.scenario.airtime+graph.scenario.stopTime;if(slider.dataset.scenario!==graph.scenario.id){slider.value=0;slider.dataset.scenario=graph.scenario.id;}slider.min=0;slider.max=end;slider.step=.0001;}
  else if(motionMode()&&graph){const slider=$('scrubber');if(slider.dataset.scenario!==graph.scenario.id){slider.value=0;slider.dataset.scenario=graph.scenario.id;}slider.min=0;slider.max=graph.scenario.T;slider.step=graph.scenario.T/100;}
  else {$('scrubber').min=-8;$('scrubber').max=8;$('scrubber').step=.1;}
  drawCurrentGraph();
  $('motion-metric-wrap').hidden=!(motionMode()&&graph);$('motion-legend').hidden=!((motionMode()||flightMode())&&graph);
  $('flight-metric-wrap').hidden=!(flightMode()&&graph);$('flight-play').hidden=!(flightMode()&&graph);
  if(motionMode()){
    $('graph-heading').textContent=language()==='zh'?'同样的端点，不同的运动。':'Same endpoints, different motion.';
    $('graph-tag').textContent=language()==='zh'?'假想解析模型':'HYPOTHETICAL MODEL';
    $('scrubber-label').textContent=language()==='zh'?'探索时间 t（秒）':'Explore time t (seconds)';
    $('margin-note').textContent=language()==='zh'?'加速度是速度曲线的斜率；路程是速度曲线下的面积。':'Acceleration is the slope of velocity; distance is the area under velocity.';
    if(graph)$('motion-legend').textContent=language()==='zh'?`A：绿色实线，加速度恒定。B：棕色虚线，加速度${graph.scenario.profileB==='rising'?'递增':graph.scenario.profileB==='falling'?'递减':'为余弦脉冲'}。`:`A: green solid, constant acceleration. B: brown dashed, ${graph.scenario.profileB==='rising'?'increasing':graph.scenario.profileB==='falling'?'decreasing':'cosine-pulse'} acceleration.`;
  }
  $('scrubber-wrap').hidden = !graph;
  $('graph-caption').textContent = motionMode()?(graph?(language()==='zh'?`仅在 0 ≤ t ≤ ${graph.scenario.T} s 区间内。两车从静止出发，末速度 ${graph.scenario.speedLabel}。`:`Only on 0 ≤ t ≤ ${graph.scenario.T} s. Both start from rest and finish at ${graph.scenario.speedLabel}.`):(language()==='zh'?'先给出预测，核验后再探索曲线。迁移题的图像需要额外帮助才会显示。':'Make a prediction before exploring the curves. A transfer graph is available through additional help.')):
    graph ? `${graph.expression} · x → −∞: y → ${graph.leftLimit}; x → ∞: y → ${graph.rightLimit}${graph.isReference?(language()==='zh'?'（上一题的参考图像）':' (reference graph from the first problem)'):''}` : t().graphHidden;
  if(flightMode()){
    $('graph-heading').textContent=language()==='zh'?'回正以后，运动停止了吗？':'Upright again. Has the motion stopped?';
    $('graph-tag').textContent=language()==='zh'?'理想模型':'IDEAL MODEL';
    $('scrubber-label').textContent=language()==='zh'?'探索飞行与制停时间 t（秒）':'Explore flight and stopping time t (seconds)';
    $('margin-note').textContent=language()==='zh'?'角度不等于角速度；接触力不等于合力；平均力不等于峰值力。':'Angle is not angular speed. Contact force is not net force. Average is not peak.';
    $('motion-legend').textContent=language()==='zh'?'旋转：A 绿色实线（已有旋转）；B 棕色虚线（外力偶控制）。竖直/接触：共享的一维计算。':'Rotation: A green solid (initial spin); B brown dashed (external couple). Vertical/contact: one shared 1D calculation.';
    $('graph-caption').textContent=graph?(language()==='zh'?`T=${graph.scenario.airtime} s 接地，之后 D=${graph.scenario.stopTime} s 仅计算竖直制停。旋转视图停在接地快照；不模拟 A 后续旋转或实车接触。`:`Touchdown at T=${graph.scenario.airtime} s, then D=${graph.scenario.stopTime} s of vertical-only stopping. Rotation view ends at a touchdown snapshot; A’s later spin and real contact are not simulated.`):(language()==='zh'?'先预测，再显示模型。迁移题的图像需额外帮助或完成后才显示。':'Predict before exploring. Transfer visuals require explicit help or completion.');
  }
  if(graph) updatePoint();
  $('comparison').hidden = phase !== 'complete';
  $('before').textContent = session.before; $('after').textContent = session.after;
  if(session.comparison){
    $('learning-note').textContent=`${session.comparison.scaffolded?(language()==='zh'?'这道迁移题使用了额外提示。':'This transfer used additional scaffolding.'):''} ${t()['learning-note']}`;
  }
  if(phase==='transfer'&&problem.purpose){$('notice').textContent=`${language()==='zh'?'这道题检验什么：':'What this variant tests: '}${problem.purpose}`;}
  $('history').replaceChildren(...history.map((entry,i) => { const li=document.createElement('li'); li.textContent=`${i+1}. ${entry.explanation}\n${t().actions[entry.action]||''} · ${entry.reason}\n${entry.feedback}\n${entry.question}${entry.observation?`\nx=${entry.observation.x} → y=${Number(entry.observation.y.toPrecision(8))}`:''}`; return li; }));
  renderClaimWorkbench();
  controls();
}
function renderClaimWorkbench(){
  const mode=session?.workflow==='claim-testing',zh=language()==='zh';
  $('claim-confirmation').hidden=!(mode&&session.claim);
  if(mode&&session.claim){
    $('claim-heading').textContent=session.claim.confirmed?(zh?'已确认的说法':'Confirmed claim'):t()['claim-heading'];
    $('claim-buttons').hidden=session.phase!=='confirm';
    $('confirm-note').textContent=session.claim.confirmed?(session.claim.confirmationSource==='scripted-demo'?(zh?'演示脚本自动确认了预设解读；这不是学习者的确认。说法是否成立由证据另行检验。':'The demo script confirmed the preset interpretation automatically; this is not a learner confirmation. Evidence checks whether the claim holds.'):(zh?'学习者已确认这段解读。数学结果与说法是否成立将在证据中另行核验。':'The learner confirmed this interpretation. Whether the claim holds is checked separately in the evidence.')):t()['confirm-note'];
    $('claim-decisions-label').textContent=zh?'说法的决定记录':'Claim decisions';
    const names=zh?{proposed:'Meta 提出解读',confirm:'学习者确认 · 本地操作',revise:'学习者要求修改 · 本地操作'}:{proposed:'Meta proposed an interpretation',confirm:'Learner confirmed · local action',revise:'Learner requested revision · local action'};
    $('claim-decisions').replaceChildren(...session.claimEvents.map(e=>{const li=document.createElement('li');li.textContent=`${e.source==='scripted-demo'?(zh?'演示脚本确认 · 本地操作':'Demo script confirmed · local action'):names[e.action]}: ${e.interpretation}`;return li;}));
    $('claim-quote').textContent=session.claim.quote;
    $('claim-interpretation').textContent=session.claim.interpretation;
    const scope=session.claim.scope==='ideal-flight-and-contact'?(zh?'理想飞行与竖直接触':'ideal flight and vertical contact'):session.claim.scope==='prescribed-motion-interval'?(zh?'设定的一维运动区间':'prescribed 1D motion interval'):session.claim.scope==='finite-inputs'?(zh?'有限输入':'finite inputs'):(zh?'无穷远处的行为':'end behavior');
    $('claim-scope').textContent=`${zh?'范围':'Scope'}: ${scope} · ${zh?'待检验的实验':'Proposed experiment'}: ${experimentName(session.claim.experimentId)}`;
  }
  const records=mode?session.evidenceRecords:[];
  $('evidence-workbench').hidden=!records.length;
  $('evidence-records').replaceChildren(...records.map((e,i)=>{
    const item=document.createElement('article');item.className='evidence-record';
    const heading=document.createElement('h3');heading.textContent=`${i+1}. ${experimentName(e.experimentId)}`;
    const formula=document.createElement('p');formula.className='fine';formula.textContent=e.formulaId;
    const conclusion=document.createElement('p');conclusion.textContent=e.conclusion[language()];
    const proof=document.createElement('p');proof.textContent=e.proof[language()];
    const limits=document.createElement('p');limits.className='fine';limits.textContent=e.limitations[language()];
    const detail=document.createElement('details'),summary=document.createElement('summary'),data=document.createElement('pre');
    summary.textContent=zh?'查看执行记录':'Inspect execution record';data.textContent=JSON.stringify(e,null,2);detail.append(summary,data);
    const replay=document.createElement('button');replay.type='button';replay.className='example';replay.disabled=busy;
    replay.textContent=zh?'重放核验 · 0 次模型请求':'Replay check · 0 model requests';
    replay.addEventListener('click',async()=>{
      if(busy)return;const version=generation;replay.disabled=true;
      try{const result=await post('/api/replay',{sessionId:session.sessionId,evidenceId:e.id});
        if(version===generation)$('replay-status').textContent=result.verified?`${zh?'重放核验通过；未调用模型。':'Replay verified; no model call.'} ${e.id}`:(zh?'重放未通过。':'Replay failed.');
      }catch(error){if(version===generation)showError(error.message);}finally{replay.disabled=busy;}
    });
    item.append(heading,formula,conclusion,proof,limits,detail,replay);return item;
  }));
  $('transfer-report').hidden=!(mode&&['transfer','complete'].includes(session.phase));
  if(!mode)return;
  const report=session.report,outcomes=zh?{insufficient:'尚无充分证据：迁移尝试未完成。',independent:'独立迁移：本题未使用额外辅导。',assisted:'辅助迁移：本题使用了额外辅导。'}:{insufficient:'Insufficient evidence: transfer is not complete.',independent:'Independent transfer: no additional coaching on this problem.',assisted:'Assisted transfer: additional coaching was used on this problem.'};
  $('report-outcome').textContent=session.demoUsed&&report.outcome!=='insufficient'?(zh?'脚本 / 开发演示完成：数值和推理已检查，不计独立迁移。':'Scripted / developer demo complete: values and reasoning checked; not independent transfer.'):outcomes[report.outcome];
  $('report-checked').textContent=report.checkedAnswer?`${zh?'代码核验的数值':'Values checked by code'}: ${session.answerFields.map(f=>`${f.label[language()]} ${report.checkedAnswer[f.key]}`).join('; ')}`:'';
  $('report-judgment').textContent=report.reasoningAssessment?(zh?'Meta 判断推理得到支持；这不是代码对理解程度的证明。':'Meta assessed the reasoning as supported; code does not verify understanding.') : '';
  $('report-revision').textContent=report.revision?`${zh?'依据证据作出的解释':'Evidence-based revision'}: ${report.revision}`:'';
  $('report-refs').textContent=report.evidenceIds?`${zh?'引用证据':'Evidence references'}: ${report.evidenceIds.join(', ')}`:'';
  $('report-limit').textContent=report.limitation?.[language()]||'';
}
function experimentName(id){
 const flightNames=language()==='zh'?{'flight-torque':'力矩与角动量','flight-contact':'接触冲量与峰值力','flight-state':'接地姿态与剩余运动'}:{'flight-torque':'Torque and angular momentum','flight-contact':'Contact impulse and peak force','flight-state':'Touchdown orientation and residual motion'};
 if(flightNames[id])return flightNames[id];
 if(id==='motion-force')return language()==='zh'?'质量、力与理想上限':'Mass, force and ideal limits';
 if(id==='motion-smoothness')return language()==='zh'?'加加速度与平滑衔接':'Jerk and smooth joins';
 if(id==='motion-acceleration')return language()==='zh'?'平均加速度与瞬时加速度':'Average versus instantaneous acceleration';
 if(id==='motion-distance')return language()==='zh'?'端点速度与速度曲线下的面积':'Endpoint speeds versus area under velocity';
 const names=language()==='zh'?{'finite-equality':'有限交点','finite-crossing':'有限穿越与两端极限','end-behavior':'两端的极限'}:{'finite-equality':'Finite intersection','finite-crossing':'Finite crossing and end limits','end-behavior':'End limits'};
 return names[id]||id;
}
function updatePoint() {
  if (!session?.graph) return;
  if(flightMode()){$('point-value').textContent=flightReadout(session.graph.scenario,Number($('scrubber').value),$('flight-metric').value,language());drawCurrentGraph();return;}
  if(motionMode()){
    const s=session.graph.scenario,time=Number($('scrubber').value),metric=$('motion-metric').value;
    const unit={velocity:'m/s',acceleration:'m/s²',distance:'m',force:'kN',powerKw:'kW',jerk:'m/s³'}[metric];
    const value=profile=>physicsAt(s,profile,time)[metric]/(metric==='force'?1000:1);
    $('point-value').textContent=`t = ${Number(time.toFixed(3))} s · A = ${value('uniform').toFixed(3)} ${unit} · B = ${value(s.profileB).toFixed(3)} ${unit}`;
    drawCurrentGraph();return;
  }
  const x=Number($('scrubber').value), y=evaluate(session.graph.formula,x);
  $('point-value').textContent=`x = ${x.toFixed(1)} → y = ${y.toFixed(4)}`;
  drawGraph($('graph'), session.graph, language(), x);
}
function clear() {
  stopAutoDemo('reset');
  guidedDemo=false;autoEvidence=false;autoWaiting=false;$('workspace').prepend($('journey'));
  if(autoState!=='stopped'){autoState='idle';autoStage='';autoCalls=0;autoStopReason='';}
  $('auto-demo-preview').hidden=true;$('auto-demo-prompt').textContent='';$('auto-demo-feedback').textContent='';
  stopPlayback();journey.stop();generation++;demoPresetUsed=false;journeyModel=null;
  if(session) post('/api/reset',{sessionId:session.sessionId}).catch(()=>{});
  session=null;busy=false;$('explanation').value='';$('character-count').textContent='0 / 1200';
  $('transfer-asymptote').value='';$('transfer-crossing').value='';$('replay-status').textContent='';
  $('scrubber').value=0;delete $('scrubber').dataset.scenario;$('motion-metric').value='velocity';$('flight-metric').value='torque';
  $('error').hidden=true;$('notice').textContent=t().newSession;render();
}
$('auto-demo-stop').addEventListener('click',()=>stopAutoDemo());
$('auto-demo-run').addEventListener('click',async()=>{
 if(!ready||!traceEnabled||!$('adult').checked||busy||autoActive())return;
 clear();$('topic').value='flight';
 for(const[id,value]of Object.entries({'motion-speed':60,'motion-duration':5,'motion-profile':'smooth','motion-mass':2000,'motion-grip':1,'motion-power':600,'flight-mass':2000,'flight-time':1.5,'flight-radius':.9,'flight-separation':1,'flight-stop':.3,'flight-profile':'pulse'}))$(id).value=String(value);
 journeyModel=journeyScenario(demoSettings.motion,demoSettings.flight);demoPresetUsed=true;guidedDemo=true;autoEvidence=false;$('auto-demo-animation').append($('journey'));
 const run={controller:new AbortController(),version:++generation,language:language()};autoRun=run;autoState='running';autoStage='start';autoCalls=0;autoStopReason='';
 $('auto-demo-console').append($('provider-console'));$('provider-console').open=true;
 $('auto-demo-preview').hidden=false;$('auto-demo-prompt').textContent='';$('auto-demo-feedback').textContent='';
 localize();render();$('auto-demo').scrollIntoView({block:'start'});
 const current=()=>run.version===generation&&autoRun===run;
 const request=async(path,body)=>{
  if(run.controller.signal.aborted)throw new DOMException('Stopped','AbortError');
  busy=true;if(path==='/api/turn')autoCalls++;controls();
  const poll=path==='/api/turn'?setInterval(()=>{if(current())providerConsole.refresh();},750):null;
  try{
   const result=await post(path,body);
   if(path==='/api/session'&&(!current()||run.controller.signal.aborted))post('/api/reset',{sessionId:result.sessionId}).catch(()=>{});
   return result;
  }catch(error){if(current()&&session&&Number.isInteger(error.attemptsRemaining))session.attemptsRemaining=error.attemptsRemaining;throw error;}
  finally{if(poll)clearInterval(poll);if(current()){busy=false;controls();renderDemo();await providerConsole.refresh();}}
 };
 try{
  await runPresetDemo({language:run.language,adultConfirmed:$('adult').checked,traceEnabled,signal:run.controller.signal,request,
   checkpoint:demoCheckpoint,
   step:stage=>{if(!current())return;autoStage=stage;if(stage==='complete')autoState='complete';renderAutoDemo();},
   show:(data,preset)=>{
    if(!current())return;session=data;if(data.graph)autoEvidence=true;render();
    if(preset){$('explanation').value=preset.text;$('explanation').dispatchEvent(new Event('input'));$('auto-demo-prompt').textContent=preset.text;if(data.phase==='transfer')data.answerFields.forEach((f,i)=>$(i===0?'transfer-asymptote':'transfer-crossing').value=preset.answer?.[f.key]??'');}
    const feedback=data.phase==='confirm'?data.claim.interpretation:data.history.at(-1)?.feedback;$('auto-demo-feedback').textContent=feedback?`Meta · ${feedback}`:'';providerConsole.refresh();
   },
   play:async(signal,stage)=>{const [from,to,rate]={acceleration:[0,journeyModel.launch,.5],flip:[journeyModel.launch,journeyModel.touchdown,.25],landing:[journeyModel.touchdown,journeyModel.end,.1]}[stage];return journey.playRange({signal,from,to,rate});},
  });
 }catch(error){if(current()){autoState=error.name==='AbortError'?'stopped':'attention';if(error.name!=='AbortError')showError(language()==='zh'?'演示在此停止，请检查模型反馈或连接状态；不会自动重试。':error.message);}}
 finally{if(current()){autoRun=null;busy=false;journey.stop();controls();renderDemo();await providerConsole.refresh();}}
});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAutoDemo('hidden');});
$('adult').addEventListener('change',controls);
$('topic').addEventListener('change',()=>{localize();renderMotionSetup();});
$('language').addEventListener('change',()=>{stopAutoDemo('language');clear();localize();controls();});
$('start').addEventListener('click',async()=>{
  if(busy||session||!$('adult').checked)return;
  busy=true;controls();const version=++generation;
  try {
    if(motionMode()||flightMode())journeyModel=readJourney();
    const data=await post('/api/session',{problemId:$('topic').value,language:language(),adult:true,synthetic:true,workflow:['crossing','acceleration','flight'].includes($('topic').value)?'claim-testing':'baseline',...($('topic').value==='flight'?{flight:{massKg:Number($('flight-mass').value),airtime:Number($('flight-time').value),radius:Number($('flight-radius').value),separation:Number($('flight-separation').value),stopTime:Number($('flight-stop').value),landingProfile:$('flight-profile').value}}:{}),...($('topic').value==='acceleration'?{motion:{speedMph:Number($('motion-speed').value),duration:Number($('motion-duration').value),profileB:$('motion-profile').value,massKg:Number($('motion-mass').value),grip:Number($('motion-grip').value),powerKw:Number($('motion-power').value)}}:{})});
    if(version!==generation)return;
    session=data;$('notice').textContent=language()==='zh'?'虚构成人示例；不输入真实个人或学生信息。':'Synthetic adult example; keep real personal and student information out.';
    $('error').hidden=true;render();$('explanation').focus();
  }catch(error){if(version===generation){$('notice').textContent=error.message;}}
  finally{if(version===generation){busy=false;controls();$('explanation').focus();}}
});
function continueManually(){
 if(!guidedDemo||autoActive())return;
 guidedDemo=false;autoEvidence=false;autoWaiting=false;autoStage='';autoState='idle';autoStopReason='';
 $('workspace').prepend($('journey'));$('auto-demo-preview').hidden=true;renderDemo();
}
$('explain-form').addEventListener('submit',async event=>{
  event.preventDefault();if(busy||!session||autoActive())return;continueManually();
  const explanation=$('explanation').value.trim();if(!explanation)return;
  let answer;
  if(session.workflow==='claim-testing'&&session.phase==='transfer'){
    const a=$('transfer-asymptote').value,b=$('transfer-crossing').value;
    if(Boolean(a)!==Boolean(b)){showError(t()['values-note']);return;}
    if(a&&b)answer=Object.fromEntries(session.answerFields.map((f,i)=>[f.key,Number(i===0?a:b)]));
  }
  busy=true;controls();$('error').hidden=true;const version=generation;
  try {
    const data=await post('/api/turn',{sessionId:session.sessionId,explanation,demoPreset:demoPresetUsed,...(answer?{answer}:{})});
    if(version!==generation)return;
    session=data;$('explanation').value='';$('character-count').textContent='0 / 1200';render();$('feedback').focus();
  }catch(error){if(version===generation){
    if(Number.isInteger(error.attemptsRemaining)){session.attemptsRemaining=error.attemptsRemaining;render();}
    showError(error.name==='TimeoutError'?(language()==='zh'?'请求超时。文本已保留，请稍后手动重试。':'Request timed out. Your text is preserved; retry explicitly after the current request finishes.'):error.message);
  }}
  finally{if(version===generation){busy=false;controls();renderDemo();providerConsole.refresh();}}
});
for(const [id,decision] of [['confirm-claim','confirm'],['revise-claim','revise']])$(id).addEventListener('click',async()=>{
  if(busy||session?.phase!=='confirm'||autoActive())return;continueManually();
  const version=generation,previous=session.claim.quote;busy=true;controls();$('error').hidden=true;
  try{
    const data=await post('/api/claim',{sessionId:session.sessionId,claimId:session.claim.id,decision});
    if(version!==generation)return;session=data;
    $('explanation').value=decision==='revise'?previous:'';$('explanation').dispatchEvent(new Event('input'));
    render();$('explanation').focus();
  }catch(error){if(version===generation)showError(error.message);}
  finally{if(version===generation){busy=false;controls();}}
});
$('explanation').addEventListener('input',()=>{$('character-count').textContent=`${$('explanation').value.length} / 1200`;});
$('demo-load').addEventListener('click',()=>{
 if(busy||!session)return;const preset=demoPresets(session,language())[Number($('demo-preset').value)];if(!preset)return;
 demoPresetUsed=true;$('explanation').value=preset.text;$('explanation').dispatchEvent(new Event('input'));
 if(session.phase==='transfer')session.answerFields.forEach((f,i)=>$(i===0?'transfer-asymptote':'transfer-crossing').value=preset.answer?.[f.key]??'');
 renderDemo();$('explanation').focus();
});
for(const [from,to]of [['motion-mass','flight-mass'],['flight-mass','motion-mass']])$(from).addEventListener('change',()=>{$(to).value=$(from).value;});
$('reset').addEventListener('click',clear);$('again').addEventListener('click',()=>{clear();$('topic').focus();});
$('scrubber').addEventListener('input',()=>{stopPlayback();updatePoint();});
$('flight-metric').addEventListener('change',updatePoint);
$('motion-metric').addEventListener('change',updatePoint);
const examples={
  flight:{en:['The car flips and comes back upright, so I am unsure what is still moving.','In this ideal model, returning to an upright angle after a full turn means both objects have zero angular speed at touchdown.'],zh:['车翻转后回正了，我不清楚此时还有什么在运动。','在此理想模型中，转过一整圈回正就意味着两个物体接地时角速度都为零。']},
  acceleration:{en:['The car accelerates really fast, so I am not sure what the number means.','If two cars reach the same final speed in the same time, they must have identical acceleration at every instant and travel the same distance.'],zh:['车加速很快，但我不清楚这个数值说明了什么。','如果两辆车在同样时间达到同样末速度，那么每一瞬间的加速度都相同，行驶的路程也一定相同。']},
  crossing:{en:['It can never touch the asymptote.','At every finite x, it is impossible for the curve to equal the asymptote because it is a barrier.'],zh:['曲线永远碰不到渐近线。','任何有限的 x 都不能让曲线等于渐近线，因为渐近线就是一道边界。']},
  nonzero:{en:['The denominator becomes very large, so maybe it goes down.','The limit is zero because the denominator goes to infinity, regardless of the numerator.'],zh:['分母越来越大，所以它可能会变小。','极限是零，因为分母趋向无穷大，不需要考虑分子的变化。']},
  ends:{en:['Both ends should settle down.','Both limits are 1 because the square root of x squared is always x.'],zh:['两端应该都会稳定下来。','两个极限都是 1，因为 x 平方的平方根总是 x。']},
};
for(const [id,index] of [['example-ambiguous',0],['example-misconception',1]])$(id).addEventListener('click',()=>{
  if(!session||busy)return;
  demoPresetUsed=true;renderDemo();
  $('explanation').value=examples[session.problem.id][language()][index];$('explanation').dispatchEvent(new Event('input'));$('explanation').focus();
});
for(const [id,en,zh]of [
 ['example-torque','In this model B starts and ends with zero spin, so the torque must be zero at every instant during its full turn.','在本模型中，B 初末角速度都为零，所以完整翻转过程中每一瞬间的力矩都应为零。'],
 ['example-landing','In this vertical-only contact model, equal stopping impulse means the average force and peak force must be identical for every force shape.','在此竖直接触模型中，相同制停冲量意味着任何力曲线的平均力和峰值力都相同。'],
 ['example-force','If a heavier car follows exactly the same speed curve, it needs no extra force or power.','如果更重的车遵循完全相同的速度曲线，它不需要额外的力或功率。'],
 ['example-smooth','A sine/cosine speed curve guarantees a comfortable ride and makes the acceleration physically achievable.','正弦/余弦速度曲线能保证乘坐舒适，也能保证加速在物理上可行。']
])$(id).addEventListener('click',()=>{if(!session||busy)return;demoPresetUsed=true;renderDemo();$('explanation').value=language()==='zh'?zh:en;$('explanation').dispatchEvent(new Event('input'));$('explanation').focus();});
function stopPlayback(){if(playbackFrame!==null)cancelAnimationFrame(playbackFrame);playbackFrame=null;playbackLast=0;$('flight-play').setAttribute('aria-pressed','false');$('flight-play').textContent=language()==='zh'?'播放时间线':'Play timeline';}
$('flight-play').addEventListener('click',()=>{
 if(playbackFrame!==null){stopPlayback();return;}if(!flightMode()||!session?.graph||busy)return;
 if(Number($('scrubber').value)>=Number($('scrubber').max))$('scrubber').value=0;
 $('flight-play').textContent=language()==='zh'?'暂停':'Pause';$('flight-play').setAttribute('aria-pressed','true');
 let simulated=Number($('scrubber').value);
 const tick=now=>{if(!flightMode()||!session?.graph||busy){stopPlayback();return;}
  if(!playbackLast)playbackLast=now;simulated=Math.min(Number($('scrubber').max),simulated+(now-playbackLast)/3000);playbackLast=now;
  $('scrubber').value=String(simulated);updatePoint();
  if(simulated>=Number($('scrubber').max)){stopPlayback();return;}playbackFrame=requestAnimationFrame(tick);
 };playbackFrame=requestAnimationFrame(tick);
});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopPlayback();});
for(const [id,topic]of [['roadster-acceleration','acceleration'],['roadster-flight','flight']])$(id).addEventListener('click',()=>{if(busy)return;if((session?.problem.id||$('topic').value)===topic)return;clear();$('topic').value=topic;localize();controls();});
try {
  const response=await fetch('/api/status');if(!response.ok)throw new Error();
  const status=await response.json();ready=status.configured;catalog=status.problems;traceEnabled=status.traceEnabled===true;
  $('connection').classList.toggle('ready',ready);localize();controls();
}catch{ready=false;localize();$('connection').textContent=language()==='zh'?'本地服务器不可用':'Local server unavailable';}
