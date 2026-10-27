// Opt-in, memory-only diagnostics. No request headers or provider reasoning.
export function createTrace(secret='') {
 let rows=[],sequence=0;
 function clean(value,budget={left:60000}) {
  if(typeof value==='string'){
   const redacted=secret?value.split(secret).join('[REDACTED]'):value;
   const n=Math.max(0,budget.left);budget.left-=Math.min(n,redacted.length);
   return redacted.length>n?redacted.slice(0,n)+'…[truncated]':redacted;
  }
  if(Array.isArray(value))return value.slice(0,100).map(v=>clean(v,budget));
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).slice(0,100).filter(([k])=>!['authorization','headers','apiKey','api_key','cookie','reasoning','encrypted_content'].includes(k)).map(([k,v])=>[k,clean(v,budget)]));
  return value;
 }
 return {
  start(request){
   const start=Date.now(),row={sequence:++sequence,startedAt:new Date(start).toISOString(),durationMs:0,outcome:'pending',request:clean(request),response:null,httpStatus:null};
   rows.push(row);if(rows.length>12)rows.shift();
   return {
    event(event){
     if(event.type==='request')row.request=clean(event.body);
     if(event.type==='response'){row.httpStatus=event.status;row.response=clean(event.body);}
     if(event.type==='error'){row.httpStatus=event.status??null;row.error=clean(event.message);}
    },
    finish(outcome){row.outcome=outcome;row.durationMs=Date.now()-start;},
   };
  },
  read:()=>structuredClone(rows),clear:()=>{rows=[];},
 };
}
