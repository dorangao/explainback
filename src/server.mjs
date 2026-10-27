import {flightScenario,flightTitle} from '../public/flight.mjs';
import {createTrace} from './trace.mjs';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { callMeta, DEFAULT_META_MODEL } from './meta.mjs';
import { createSession, assess, advance, view } from './learning.mjs';
import { problems } from './problems.mjs';
import { confirmClaim, replayClaimEvidence } from './claim-testing.mjs';
import { answerShapeValid } from './claim-domains.mjs';
import { motionScenario, motionTitle } from '../public/motion.mjs';

const files = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/assets/app.mjs', ['app.mjs', 'text/javascript; charset=utf-8']],
  ['/assets/math.mjs', ['math.mjs', 'text/javascript; charset=utf-8']],
  ['/assets/graph.mjs', ['graph.mjs', 'text/javascript; charset=utf-8']],
  ['/assets/motion.mjs', ['motion.mjs', 'text/javascript; charset=utf-8']],
  ['/assets/physics-panel.mjs', ['physics-panel.mjs', 'text/javascript; charset=utf-8']],
  ['/assets/motion-graph.mjs', ['motion-graph.mjs', 'text/javascript; charset=utf-8']],
  ['/assets/flight.mjs', ['flight.mjs', 'text/javascript; charset=utf-8']],
  ['/assets/flight-view.mjs', ['flight-view.mjs', 'text/javascript; charset=utf-8']],
  ...['journey','journey-view','demo-presets','demo-runner','demo-guide','provider-console'].map(name=>[`/assets/${name}.mjs`,[`${name}.mjs`,'text/javascript; charset=utf-8']]),
  ['/assets/style.css', ['style.css', 'text/css; charset=utf-8']],
]);
const safeHeaders = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
};
class RequestError extends Error { constructor(status, message) { super(message); this.status = status; } }
async function readJSON(req) {
  if (!req.headers['content-type']?.startsWith('application/json')) throw new RequestError(415, 'Use JSON for this request.');
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 16_384) throw new RequestError(413, 'Request is too large.');
    chunks.push(chunk);
  }
  try {
    const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') throw new Error();
    return parsed;
  } catch { throw new RequestError(400, 'Invalid JSON request.'); }
}

export function createApp({
  configured = Boolean(process.env.MODEL_API_KEY?.trim()),
  model = process.env.META_MODEL || DEFAULT_META_MODEL,
  modelCall = args => callMeta({ ...args, apiKey: process.env.MODEL_API_KEY, model }),
  traceEnabled = process.env.EXPLAINBACK_TRACE === '1',
} = {}) {
  const sessions = new Map();
  let turnWindow = Date.now();
  let turns = 0;
  const server = createServer(async (req, res) => {
    const json = (status, data) => { res.writeHead(status, { ...safeHeaders, 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(data)); };
    try {
      const port = server.address().port;
      const validHosts = [`127.0.0.1:${port}`, `localhost:${port}`];
      if (!validHosts.includes(req.headers.host)) throw new RequestError(403, 'Only local requests are accepted.');
      const url = new URL(req.url, `http://${req.headers.host}`);
      const path = url.pathname;
      if (req.method === 'GET' && files.has(path)) {
        const [name, type] = files.get(path);
        const data = await readFile(new URL(`../public/${name}`, import.meta.url));
        res.writeHead(200, { ...safeHeaders, 'Content-Type': type }); res.end(data); return;
      }
      if (req.method === 'GET' && path === '/api/status') {
        json(200, { configured, mode: 'live', model, traceEnabled, audience: 'synthetic-adult', problems: [...Object.values(problems).map(p => ({ id: p.id, title: p.title })),{id:'acceleration',title:motionTitle},{id:'flight',title:flightTitle}] }); return;
      }
      if (req.method !== 'POST' || !['/api/session', '/api/turn', '/api/reset', '/api/claim', '/api/replay',...(traceEnabled?['/api/trace']:[])].includes(path)) { json(404, { error: 'Not found.' }); return; }
      if (req.headers.origin !== `http://${req.headers.host}`) throw new RequestError(403, 'This action must come from the local app.');
      const body = await readJSON(req);
      for (const [id, s] of sessions) if (!s.busy && Date.now() - s.createdAt > 30 * 60_000) sessions.delete(id);
      if (path === '/api/session') {
        if (body.adult !== true || body.synthetic !== true) throw new RequestError(400, 'Confirm adult-only, synthetic use before starting.');
        if ((!Object.hasOwn(problems, body.problemId)&&!['acceleration','flight'].includes(body.problemId)) || !['en', 'zh'].includes(body.language)) throw new RequestError(400, 'Choose a problem and language.');
        if (sessions.size >= 100) throw new RequestError(429, 'Local session limit reached. Reset an existing session.');
        const workflow=body.workflow??(['acceleration','flight'].includes(body.problemId)?'claim-testing':'baseline');
        if(!['baseline','claim-testing'].includes(workflow)||(workflow==='claim-testing'&&!['crossing','acceleration','flight'].includes(body.problemId))||(['acceleration','flight'].includes(body.problemId)&&workflow!=='claim-testing')) throw new RequestError(400,'Choose an available workflow.');
        if(body.problemId==='acceleration')try{motionScenario(body.motion===undefined?{}:body.motion);}catch{throw new RequestError(400,'Choose allowed hypothetical motion, mass, grip and power settings.');}
        if(body.problemId==='flight')try{flightScenario(body.flight===undefined?{}:body.flight);}catch{throw new RequestError(400,'Choose allowed hypothetical flight, inertia and stopping settings.');}
        const s = createSession(body.problemId, body.language, workflow,body.problemId==='flight'?(body.flight??{}):body.problemId==='acceleration'?(body.motion??{}):{});
        const sessionId = randomBytes(24).toString('hex');
        s.demoUsed=traceEnabled;s.trace=traceEnabled?createTrace(process.env.MODEL_API_KEY?.trim()):null;
        sessions.set(sessionId, s);
        json(200, { sessionId, ...view(s) }); return;
      }
      const s = sessions.get(body.sessionId);
      if (!s) throw new RequestError(404, 'Session expired. Start a new session.');
      if (path === '/api/reset') { sessions.delete(body.sessionId); json(200, { reset: true }); return; }
      if(path==='/api/trace'){
        if(body.clear!==undefined&&typeof body.clear!=='boolean')throw new RequestError(400,'Use a boolean clear flag.');
        if(body.clear)s.trace.clear();json(200,{records:s.trace.read()});return;
      }
      if (s.busy) throw new RequestError(409, 'A response is already in progress.');
      if(path==='/api/claim') {
        if(s.workflow!=='claim-testing')throw new RequestError(400,'This session has no claim to confirm.');
        try{json(200,{sessionId:body.sessionId,...confirmClaim(s,{claimId:body.claimId,decision:body.decision,source:body.source})});}
        catch{throw new RequestError(400,'The claim changed or cannot be confirmed.');}
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
      if (!configured) throw new RequestError(503, 'Meta API key is missing. Configure .env.local and restart the server.');
      if (s.phase === 'complete') throw new RequestError(400, 'This session is complete. Start another example.');
      if (typeof body.explanation !== 'string' || !body.explanation.trim() || body.explanation.length > 1200) throw new RequestError(400, 'Enter 1–1200 characters of synthetic reasoning.');
      if (Date.now() - turnWindow > 60 * 60_000) { turns = 0; turnWindow = Date.now(); }
      if (s.attempts >= 12 || turns >= 60) throw new RequestError(429, 'Local API request limit reached. No request was sent.');
      s.busy = true; s.attempts++; turns++;
      if(body.demoPreset)s.demoUsed=true;
      let traceCall;
      try {
        const result = await assess(s, body.explanation.trim(), args=>{
          traceCall=s.trace?.start({model,input:args.input,instructions:args.instructions});
          return modelCall({...args,...(traceCall?{onTrace:traceCall.event}:{})});
        }, body.answer);
        if (!sessions.has(body.sessionId)) throw new RequestError(409, 'Session was reset; the response was discarded.');
        const next=advance(s, body.explanation.trim(), result, body.answer);
        traceCall?.finish('accepted');json(200, { sessionId: body.sessionId, ...next });
      } catch (error) {
        traceCall?.finish(error instanceof RequestError?'discarded':'failed or rejected');
        if (error instanceof RequestError) throw error;
        // Deliberately do not log or return raw upstream errors, prompts or secrets.
        const failure = new RequestError(502, 'Meta feedback could not be completed or validated. Your text is preserved. Check API access, model and credits, then retry explicitly.');
        failure.attemptsRemaining = Math.max(0, 12 - s.attempts);
        throw failure;
      } finally { s.busy = false; }
    } catch (error) {
      json(error instanceof RequestError ? error.status : 500,
        { error: error instanceof RequestError ? error.message : 'Local request failed. Please try again.',
          ...(Number.isInteger(error.attemptsRemaining) ? { attemptsRemaining: error.attemptsRemaining } : {}) });
    }
  });
  server.requestTimeout = 45_000;
  server.headersTimeout = 10_000;
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT || 4173);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('PORT must be an integer from 1024 to 65535.');
  const server = createApp();
  server.on('error', () => { console.error('Could not start the local server. Check whether the port is already in use.'); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`ExplainBack local adult prototype: http://127.0.0.1:${port}`));
}
