// Server/CLI module only. Never bundle this module with a browser application.
export const META_ENDPOINT = 'https://api.meta.ai/v1/responses';
export const DEFAULT_META_MODEL = 'muse-spark-1.3';

export async function callMeta({
  apiKey,
  input,
  model = DEFAULT_META_MODEL,
  instructions,
  reasoningEffort,
  maxOutputTokens = 2048,
  tools,
  structuredOutput = false,
  timeoutMs = 30_000,
  fetchImpl = globalThis.fetch,
  onTrace,
} = {}) {
  if (typeof apiKey !== 'string' || !apiKey.trim()) {
    throw new Error('MODEL_API_KEY is missing. Set it privately in your shell or .env.local.');
  }
  if (typeof input !== 'string' || !input.trim()) {
    throw new Error('input must be non-empty text.');
  }
  if(structuredOutput&&(!Array.isArray(tools)||tools.length!==1||!tools[0].parameters))throw new Error('Structured output needs one named schema.');

  const signal = AbortSignal.timeout(timeoutMs);
  const trace=event=>{try{onTrace?.(event);}catch{/* Diagnostics must not affect calls. */}};
  const body={model,input,store:false,max_output_tokens:maxOutputTokens,
    ...(instructions?{instructions}:{}),...(reasoningEffort?{reasoning:{effort:reasoningEffort}}:{}),
    ...(structuredOutput?{text:{format:{type:'json_schema',name:tools[0].name,schema:tools[0].parameters,strict:true}}}:tools?{tools,tool_choice:'auto',parallel_tool_calls:false}:{})};
  if(structuredOutput)body.instructions=(instructions??'')+'\nTransport for this request: return the '+tools[0].name+' argument object directly as JSON matching the response schema. This is a structured response, not a tool invocation.';
  trace({type:'request',body});
  let response;
  try {
    response = await fetchImpl(META_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal,
      redirect: 'error',
    });
  } catch {
    // Do not propagate transport errors that may contain headers or request data.
    trace({type:'error',message:signal.aborted?'timeout':'transport failure'});
    throw new Error(signal.aborted ? 'Meta request timed out.' : 'Could not reach Meta Model API. Check your network connection.');
  }
  if (!response.ok) {
    trace({type:'error',status:response.status,message:'Provider returned an HTTP error; raw body omitted.'});
    const guidance = {
      401: 'Check your Meta API key.',
      403: 'Check account and model access.',
      404: 'Check META_MODEL against your available models.',
      429: 'Check credits and rate limits before retrying.',
    }[response.status] ?? 'Check the Meta dashboard before retrying.';
    throw new Error(`Meta API returned HTTP ${response.status}. ${guidance}`);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    trace({type:'error',status:response.status,message:signal.aborted?'timeout':'invalid JSON'});
    throw new Error(signal.aborted ? 'Meta request timed out.' : 'Meta API returned invalid JSON.');
  }
  trace({type:'response',status:response.status,body:{id:data?.id,status:data?.status,model:data?.model,usage:data?.usage,
    output:(Array.isArray(data?.output)?data.output:[]).flatMap(item=>item?.type==='function_call'?[{type:'function_call',name:item.name,arguments:item.arguments}]:item?.type==='message'&&item.role==='assistant'?[{type:'message',role:'assistant',content:(Array.isArray(item.content)?item.content:[]).filter(c=>c?.type==='output_text').map(c=>({type:'output_text',text:c.text}))}]:[])}});
  if (data?.status !== 'completed') throw new Error('Meta response was not completed; no success was recorded.');
  if (tools&&!structuredOutput) {
    const calls = (Array.isArray(data.output) ? data.output : []).filter(item => item?.type === 'function_call');
    if (calls.length !== 1 || !tools.some(tool => tool.name === calls[0].name) || typeof calls[0].arguments !== 'string') {
      throw new Error('Meta must return exactly one allowed learning action.');
    }
    return { id: data.id, model: data.model, text: '', usage: data.usage,
      toolCall: { name: calls[0].name, arguments: calls[0].arguments } };
  }
  const text = (Array.isArray(data.output) ? data.output : [])
    .filter(item => item?.type === 'message' && item.role === 'assistant')
    .flatMap(item => Array.isArray(item.content) ? item.content : [])
    .filter(item => item?.type === 'output_text' && typeof item.text === 'string')
    .map(item => item.text).join('\n').trim();
  if (!text) throw new Error('Meta response contained no assistant text.');
  if(structuredOutput){
    let value;try{value=JSON.parse(text);}catch{throw new Error('Meta returned invalid structured JSON.');}
    return {id:data.id,model:data.model,usage:data.usage,text:'',structured:{name:tools[0].name,value}};
  }
  return { id: data.id, model: data.model, text, usage: data.usage };
}
