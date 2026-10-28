import {quantumCoachRequest,readQuantumCoach} from './quantum-coach.mjs';
import {lessonAuthorRequest,readLessonAuthor} from './lesson-author.mjs';
import {suctionScenario,suctionTitle} from '../public/suction.mjs';
import {flightScenario,flightTitle} from '../public/flight.mjs';
import {createTesterAuth,expiredTesterCookie} from './tester-auth.mjs';
import {parseAccessCodes,budgetFor,publicAudience} from './access-codes.mjs';
import {createTrace} from './trace.mjs';
import {createMemoryState} from './state.mjs';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import {createProviderRouter} from './llm/index.mjs';
import { createSession, assess, advance, view } from './learning.mjs';
import { problems } from './problems.mjs';
import { confirmClaim, replayClaimEvidence } from './claim-testing.mjs';
import { answerShapeValid } from './claim-domains.mjs';
import { motionScenario, motionTitle } from '../public/motion.mjs';

const files = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ...['demo-model','generated-demo','demo-review'].map(name=>[`/assets/${name}.mjs`,[`${name}.mjs`,'text/javascript; charset=utf-8']]),
  ...['lesson-schema','lesson-experiments','lesson-player','lesson-studio','studio-showcase','gallery-lessons'].map(name=>[`/assets/${name}.mjs`,[`${name}.mjs`,'text/javascript; charset=utf-8']]),
  ...['quantum','quantum-content','quantum-view'].map(name=>[`/assets/${name}.mjs`,[`${name}.mjs`,'text/javascript; charset=utf-8']]),
  ['/assets/app.mjs', ['app.mjs', 'text/javascript; charset=utf-8']],
  ['/assets/math.mjs', ['math.mjs', 'text/javascript; charset=utf-8']],
  ['/assets/graph.mjs', ['graph.mjs', 'text/javascript; charset=utf-8']],
  ['/assets/motion.mjs', ['motion.mjs', 'text/javascript; charset=utf-8']],
  ['/assets/physics-panel.mjs', ['physics-panel.mjs', 'text/javascript; charset=utf-8']],
  ['/assets/motion-graph.mjs', ['motion-graph.mjs', 'text/javascript; charset=utf-8']],
  ['/assets/roll-view.mjs', ['roll-view.mjs', 'text/javascript; charset=utf-8']],
  ['/assets/presentation.mjs', ['presentation.mjs', 'text/javascript; charset=utf-8']],
  ['/assets/suction.mjs', ['suction.mjs', 'text/javascript; charset=utf-8']],
  ['/assets/suction-view.mjs', ['suction-view.mjs', 'text/javascript; charset=utf-8']],
  ['/assets/suction-presets.mjs', ['suction-presets.mjs', 'text/javascript; charset=utf-8']],
  ['/assets/suction-demo.mjs', ['suction-demo.mjs', 'text/javascript; charset=utf-8']],
  ['/assets/flight.mjs', ['flight.mjs', 'text/javascript; charset=utf-8']],
  ['/assets/flight-view.mjs', ['flight-view.mjs', 'text/javascript; charset=utf-8']],
  ...['journey','powered-journey','journey-view','demo-presets','demo-runner','demo-guide','provider-console'].map(name=>[`/assets/${name}.mjs`,[`${name}.mjs`,'text/javascript; charset=utf-8']]),
  ['/assets/style.css', ['style.css', 'text/css; charset=utf-8']],
]);
export const safeHeaders = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
};
class RequestError extends Error { constructor(status, message) { super(message); this.status = status; } }
async function readJSON(req,maxBytes=16_384) {
  if (!req.headers['content-type']?.startsWith('application/json')) throw new RequestError(415, 'Use JSON for this request.');
  const chunks = [];
  let size = 0;
  // Vercel may supply an already parsed body; bare Node supplies the stream.
  const input=req.body===undefined?req:[Buffer.from(typeof req.body==='string'?req.body:JSON.stringify(req.body))];
  for await (const chunk of input) {
    size += chunk.length;
    if (size > maxBytes) throw new RequestError(413, 'Request is too large.');
    chunks.push(chunk);
  }
  try {
    const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') throw new Error();
    return parsed;
  } catch { throw new RequestError(400, 'Invalid JSON request.'); }
}

function localOrigin(req){
  const port=req.socket.localPort;
  if(![`127.0.0.1:${port}`,`localhost:${port}`].includes(req.headers.host))throw new RequestError(403,'Only local requests are accepted.');
  return `http://${req.headers.host}`;
}
export function createHandler({
  configured, modelCall, router = createProviderRouter(),
  traceEnabled = process.env.EXPLAINBACK_TRACE === '1',
  testerCredentials = {},accessCodes=parseAccessCodes(process.env.EXPLAINBACK_ACCESS_CODES),openAccess=process.env.EXPLAINBACK_OPEN_ACCESS==='1',
  state=createMemoryState(),auth=createTesterAuth({...testerCredentials,accessCodes:accessCodes.codes??accessCodes,onRevoke:owner=>state.revokeOwner(owner)}),getOrigin=localOrigin,
} = {}) {
  const codes=accessCodes.codes??accessCodes;
  // Local development only: EXPLAINBACK_OPEN_ACCESS=1 treats every request as one shared
  // signed-in tester. The cloud handler passes openAccess:false, so it cannot apply on Vercel.
  const OPEN_ID='local-open-access';
  const access=openAccess?{...auth,async authenticate(cookie){return await auth.authenticate(cookie)??{id:OPEN_ID,audience:null};},async active(id){return id===OPEN_ID||await auth.active(id);}}:auth;
  // Configuration problems are reported by position only; code values never reach logs.
  for(const warning of accessCodes.warnings??[])console.warn('EXPLAINBACK_ACCESS_CODES '+warning);
  const redacted=[process.env.MODEL_API_KEY?.trim(),testerCredentials.password??process.env.EXPLAINBACK_TESTER_PASSWORD,...codes.map(c=>c.code)];
  const targets=router.list().map(t=>({...t,...(configured!==undefined&&t.id===router.defaultId?{configured}:{})}));
  const selected=id=>{const t=targets.find(t=>t.id===(id??router.defaultId));if(!t)throw new RequestError(400,'Choose an allowed provider/model.');return {...t};};
  const defaultTarget=selected();
  const sessionView=s=>({...view(s),llm:s.llm});
  return async (req, res) => {
    let lockedId,lock;
    const json = (status, data, headers={}) => { res.writeHead(status, { ...safeHeaders, ...headers, 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(data)); };
    try {
      const origin=getOrigin(req);
      if(!origin)throw new RequestError(403,'This host is not allowed.');
      const url = new URL(req.url, origin);
      const path = url.pathname;
      if (req.method === 'GET' && files.has(path)) {
        const [name, type] = files.get(path);
        const data = await readFile(new URL(`../public/${name}`, import.meta.url));
        res.writeHead(200, { ...safeHeaders, 'Content-Type': type }); res.end(data); return;
      }
      const tester=await access.authenticate(req.headers.cookie);
      if(req.method==='GET'&&path==='/api/auth'){json(200,{configured:access.configured,codes:access.codesConfigured===true,open:openAccess,authenticated:Boolean(tester)});return;}
      if(req.method==='POST'&&['/api/login','/api/logout'].includes(path)){
        if(req.headers.origin!==origin)throw new RequestError(403,'This action must come from this app.');
        const body=await readJSON(req);
        if(path==='/api/logout'){await access.revoke(req.headers.cookie);json(200,{authenticated:false},{'Set-Cookie':access.expiredCookie??expiredTesterCookie});return;}
        try{const result=await access.login(body,req.headers.cookie);json(200,{authenticated:true},{'Set-Cookie':result.cookie});}
        catch(error){if(!error.status)throw error;json(error.status,{error:error.message,code:error.code});}return;
      }
      if(path.startsWith('/api/')&&!tester){json(401,{error:'Sign in to tester access.',code:'TESTER_REQUIRED'});return;}
      const [bucket,limit]=budgetFor(tester?.audience);
      const quotaExceeded=()=>new RequestError(429,tester?.audience?'This access code’s hourly request budget is used up. Reviewed lessons still open without live requests.':'API request limit reached. No request was sent.');
      if (req.method === 'GET' && path === '/api/status') {
        const access=tester.audience?{...publicAudience(tester.audience),remaining:await state.remainingTurns(bucket,limit)}:null;
        json(200, { configured:defaultTarget.configured, mode: 'live', access, model:defaultTarget.model, models:targets,defaultModel:defaultTarget.id, traceEnabled, audience: 'tester-poc', problems: [...Object.values(problems).map(p => ({ id: p.id, title: p.title })),{id:'acceleration',title:motionTitle},{id:'flight',title:flightTitle},{id:'suction',title:suctionTitle}] }); return;
      }
      if (req.method !== 'POST' || !['/api/studio/session','/api/studio/compose','/api/studio/guide','/api/quantum/session','/api/quantum/explain','/api/session', '/api/turn', '/api/reset', '/api/claim', '/api/replay',...(traceEnabled?['/api/trace']:[])].includes(path)) { json(404, { error: 'Not found.' }); return; }
      if (req.headers.origin !== origin) throw new RequestError(403, 'This action must come from this app.');
      const body = await readJSON(req,path==='/api/studio/compose'||path==='/api/studio/guide'?48_000:16_384);
      if(!await access.active(tester.id)){json(401,{error:'Sign in to tester access.',code:'TESTER_REQUIRED'});return;}
      if(path==='/api/quantum/session'||path==='/api/studio/session'){
        if(body.synthetic!==true||!['en','zh'].includes(body.language))throw new RequestError(400,'Choose a language and synthetic quantum demo.');
        const target=selected(body.llm);if(!target.configured)throw new RequestError(503,'Selected provider is not configured.');
        const sessionId=randomBytes(24).toString('hex');
        const s={workflow:path==='/api/studio/session'?'lesson-studio':'quantum-showcase',language:body.language,llm:target,owner:tester.id,audience:tester.audience?.label??null,createdAt:Date.now(),attempts:0};
        if(!await state.create(sessionId,s))throw new RequestError(429,'Session limit reached.');
        json(200,{sessionId,llm:target,attemptsRemaining:8});return;
      }
      if (path === '/api/session') {
        if (body.synthetic !== true) throw new RequestError(400, 'Use synthetic examples for this prototype.');
        if ((!Object.hasOwn(problems, body.problemId)&&!['acceleration','flight','suction'].includes(body.problemId)) || !['en', 'zh'].includes(body.language)) throw new RequestError(400, 'Choose a problem and language.');
        const workflow=body.workflow??(['acceleration','flight','suction'].includes(body.problemId)?'claim-testing':'baseline');
        if(!['baseline','claim-testing'].includes(workflow)||(workflow==='claim-testing'&&!['crossing','acceleration','flight','suction'].includes(body.problemId))||(['acceleration','flight','suction'].includes(body.problemId)&&workflow!=='claim-testing')) throw new RequestError(400,'Choose an available workflow.');
        if(body.problemId==='acceleration')try{motionScenario(body.motion===undefined?{}:body.motion);}catch{throw new RequestError(400,'Choose allowed hypothetical motion, mass, grip and power settings.');}
        if(body.problemId==='suction')try{suctionScenario(body.suction===undefined?{}:body.suction);}catch{throw new RequestError(400,'Choose allowed hypothetical suction settings.');}
        if(body.problemId==='flight')try{flightScenario(body.flight===undefined?{}:body.flight);}catch{throw new RequestError(400,'Choose allowed hypothetical flight, inertia and stopping settings.');}
        const target=selected(body.llm);
        if(!target.configured)throw new RequestError(503,'Selected provider is not configured. Check the server environment.');
        const s = createSession(body.problemId, body.language, workflow,body.problemId==='suction'?(body.suction??{}):body.problemId==='flight'?(body.flight??{}):body.problemId==='acceleration'?(body.motion??{}):{});
        const sessionId = randomBytes(24).toString('hex');
        s.llm=target;s.owner=tester.id;s.audience=tester.audience?.label??null;
        s.demoUsed=traceEnabled;
        if(!await state.create(sessionId,s))throw new RequestError(429,'Session limit reached. Reset an existing session.');
        json(200, { sessionId, ...sessionView(s) }); return;
      }
      if(typeof body.sessionId!=='string'||!/^[a-f0-9]{48}$/.test(body.sessionId))throw new RequestError(404,'Session expired. Start a new session.');
      let s = await state.get(body.sessionId);
      if (!s || s.owner!==tester.id) throw new RequestError(404, 'Session expired. Start a new session.');
      if (path === '/api/reset') { await state.remove(body.sessionId); json(200, { reset: true }); return; }
      if(path!=='/api/trace'||body.clear===true){
        lockedId=body.sessionId;lock=await state.acquire(lockedId);
        if(!lock)throw new RequestError(409,'A response is already in progress.');
        s=await state.get(lockedId);
        if(!s||s.owner!==tester.id)throw new RequestError(404,'Session expired. Start a new session.');
      }
      const save=async rows=>{if(!await state.save(body.sessionId,s,lock,rows))throw new RequestError(409,'Session was reset or expired; the response was discarded.');};
      if(path==='/api/trace'){
        if(body.clear!==undefined&&typeof body.clear!=='boolean')throw new RequestError(400,'Use a boolean clear flag.');
        if(body.clear)await state.writeTrace(body.sessionId,[],lock);json(200,{records:await state.readTrace(body.sessionId)});return;
      }
      if(s.workflow==='lesson-studio'){
        const mode=path==='/api/studio/compose'?'compose':path==='/api/studio/guide'?'guide':null;
        if(!mode)throw new RequestError(400,'Use this session for Lesson Studio only.');
        let args;try{args=lessonAuthorRequest(body,mode);}catch{throw new RequestError(400,'Use a short topic or a valid lesson and experiment.');}
        if(s.attempts>=8||!await state.consumeTurn(bucket,limit)){const failure=quotaExceeded();failure.attemptsRemaining=8-s.attempts;throw failure;}
        s.attempts++;await save();
        const trace=traceEnabled?createTrace(redacted,{initial:await state.readTrace(body.sessionId),onChange:rows=>state.writeTrace(body.sessionId,rows,lock)}):null;
        const call=trace?.start({provider:s.llm.provider,model:s.llm.model,input:args.input,instructions:args.instructions});
        try{
          await trace?.flush();const options={...args,...(call?{onTrace:call.event}:{})};
          const result=readLessonAuthor(await(modelCall?modelCall(options):router.call(s.llm.id,options)),mode,body.creation);
          if(!await access.active(tester.id)){call?.finish('discarded');await state.remove(body.sessionId);throw new RequestError(401,'Sign in to tester access.');}
          if(!await state.get(body.sessionId))throw new RequestError(409,'Session was reset; response discarded.');
          call?.finish('accepted');try{await trace?.flush();}catch{}
          await save(trace?.read());json(200,{...result,llm:s.llm,attemptsRemaining:8-s.attempts});return;
        }catch(error){
          call?.finish(error instanceof RequestError?'discarded':'failed or rejected');
          if(error instanceof RequestError)throw error;
          if(['OLLAMA_BUSY','OLLAMA_UNCERTAIN','OLLAMA_OTHER_MODEL','OLLAMA_CONTROL'].includes(error.code)){const failure=new RequestError(409,error.message);failure.attemptsRemaining=8-s.attempts;throw failure;}
          const failure=new RequestError(502,'Provider lesson could not be completed or validated. Retry explicitly.');failure.attemptsRemaining=8-s.attempts;throw failure;
        }finally{try{await trace?.flush();}catch{}}
      }
      if(path.startsWith('/api/studio/'))throw new RequestError(400,'Start a Lesson Studio session first.');
      if(s.workflow==='quantum-showcase'){
        if(path!=='/api/quantum/explain')throw new RequestError(400,'Use this session for the quantum showcase only.');
        let args;try{args=quantumCoachRequest(body,s.language);}catch{throw new RequestError(400,'Choose an allowed circuit and preset question.');}
        if(s.attempts>=8||!await state.consumeTurn(bucket,limit))throw quotaExceeded();
        s.attempts++;await save();
        const trace=traceEnabled?createTrace(redacted,{initial:await state.readTrace(body.sessionId),onChange:rows=>state.writeTrace(body.sessionId,rows,lock)}):null;
        const call=trace?.start({provider:s.llm.provider,model:s.llm.model,input:args.input,instructions:args.instructions});
        try{
          await trace?.flush();const options={...args,...(call?{onTrace:call.event}:{})};
          const result=readQuantumCoach(await (modelCall?modelCall(options):router.call(s.llm.id,options)));
          if(!await access.active(tester.id)){call?.finish('discarded');await state.remove(body.sessionId);throw new RequestError(401,'Sign in to tester access.');}
          if(!await state.get(body.sessionId))throw new RequestError(409,'Session was reset; response discarded.');
          call?.finish('accepted');try{await trace?.flush();}catch{}
          await save(trace?.read());json(200,{...result,llm:s.llm,attemptsRemaining:8-s.attempts});return;
        }catch(error){
          call?.finish(error instanceof RequestError?'discarded':'failed or rejected');
          if(error instanceof RequestError)throw error;
          const failure=new RequestError(502,'Provider explanation could not be completed or validated. Retry explicitly.');failure.attemptsRemaining=8-s.attempts;throw failure;
        }finally{try{await trace?.flush();}catch{}}
      }
      if(path==='/api/quantum/explain')throw new RequestError(400,'Start a quantum showcase session first.');
      if(path==='/api/claim') {
        if(s.workflow!=='claim-testing')throw new RequestError(400,'This session has no claim to confirm.');
        let result;
        try{result=confirmClaim(s,{claimId:body.claimId,decision:body.decision,source:body.source});}
        catch{throw new RequestError(400,'The claim changed or cannot be confirmed.');}
        await save();json(200,{sessionId:body.sessionId,...result,llm:s.llm});
        return;
      }
      if(path==='/api/replay') {
        if(s.workflow!=='claim-testing')throw new RequestError(404,'Evidence not found.');
        try{json(200,replayClaimEvidence(s,body.evidenceId));}
        catch{throw new RequestError(404,'Evidence not found or failed integrity checks.');}
        return;
      }
      if(s.phase==='confirm')throw new RequestError(400,'Confirm or revise the claim interpretation first.');
      if(body.demoPreset!==undefined&&typeof body.demoPreset!=='boolean')throw new RequestError(400,'Use a boolean preset flag.');
      if(body.answer!==undefined&&!answerShapeValid(s,body.answer))
        throw new RequestError(400,'Enter the two numeric values for this topic, or leave both blank to ask for help.');
      if (!s.llm.configured) throw new RequestError(503, 'Selected provider is not configured.');
      if (s.phase === 'complete') throw new RequestError(400, 'This session is complete. Start another example.');
      if (typeof body.explanation !== 'string' || !body.explanation.trim() || body.explanation.length > 1200) throw new RequestError(400, 'Enter 1–1200 characters of synthetic reasoning.');
      if (s.attempts >= 12 || !await state.consumeTurn(bucket,limit)) throw quotaExceeded();
      s.attempts++;
      if(body.demoPreset)s.demoUsed=true;
      await save(); // Count attempts before sending, including rejected upstream output.
      s.trace=traceEnabled?createTrace(redacted,{initial:await state.readTrace(body.sessionId),onChange:rows=>state.writeTrace(body.sessionId,rows,lock)}):null;
      let traceCall;
      try {
        const result = await assess(s, body.explanation.trim(), async args=>{
          traceCall=s.trace?.start({provider:s.llm.provider,model:s.llm.model,input:args.input,instructions:args.instructions});
          await s.trace?.flush();
          const options={...args,...(traceCall?{onTrace:traceCall.event}:{})};
          return modelCall?modelCall(options):router.call(s.llm.id,options);
        }, body.answer);
        if(!await access.active(tester.id)){traceCall?.finish('discarded');await state.remove(body.sessionId);json(401,{error:'Sign in to tester access.',code:'TESTER_REQUIRED'});return;}
        if (!await state.get(body.sessionId)) throw new RequestError(409, 'Session was reset; the response was discarded.');
        const next=advance(s, body.explanation.trim(), result, body.answer);
        traceCall?.finish('accepted');
        // Drain intermediate writes; the atomic final save repairs a failed trace write.
        try{await s.trace?.flush();}catch{}
        await save(s.trace?.read());json(200, { sessionId: body.sessionId, ...next,llm:s.llm });
      } catch (error) {
        traceCall?.finish(error instanceof RequestError?'discarded':'failed or rejected');
        if (error instanceof RequestError) throw error;
        if(['OLLAMA_BUSY','OLLAMA_UNCERTAIN','OLLAMA_OTHER_MODEL','OLLAMA_CONTROL'].includes(error.code)){traceCall?.event({type:'error',message:error.message});throw new RequestError(409,error.message);}
        // Deliberately do not log or return raw upstream errors, prompts or secrets.
        const failure = new RequestError(502, 'Provider feedback could not be completed or validated. Your text is preserved. Check the selected model and connection, then retry explicitly.');
        failure.attemptsRemaining = Math.max(0, 12 - s.attempts);
        throw failure;
      } finally { try{await s.trace?.flush();}catch{/* Diagnostics cannot override a committed response. */} }
    } catch (error) {
      json(error instanceof RequestError ? error.status : 500,
        { error: error instanceof RequestError ? error.message : 'Request failed. Please try again.',
          ...(Number.isInteger(error.attemptsRemaining) ? { attemptsRemaining: error.attemptsRemaining } : {}) });
    } finally {
      if(lock)try{await state.release(lockedId,lock);}catch{/* A bounded lease expires after a storage failure. */}
    }
  };
}

export function createApp(options={}) {
  const server=createServer(createHandler(options));
  server.requestTimeout = 45_000;
  server.headersTimeout = 10_000;
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT || 4173);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('PORT must be an integer from 1024 to 65535.');
  const server = createApp();
  server.on('error', () => { console.error('Could not start the local server. Check whether the port is already in use.'); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => {
    console.log(`ExplainBack local tester prototype: http://127.0.0.1:${port}`);
    if (process.env.EXPLAINBACK_OPEN_ACCESS === '1') console.warn('EXPLAINBACK_OPEN_ACCESS=1: no sign-in required on this local server. Never set this in a hosted environment.');
  });
}
