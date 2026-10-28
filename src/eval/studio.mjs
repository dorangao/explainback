import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {lessonAuthorRequest,readLessonAuthor} from '../lesson-author.mjs';
import {chapterExperiment} from '../../public/generated-demo.mjs';
const hash=value=>createHash('sha256').update(value).digest('hex');
const near=(a,b)=>Number.isFinite(a)&&Math.abs(a-b)<=Math.max(1e-8,Math.abs(b)*1e-6);
export const studioScorerVersion='studio-score-v2';
// Post-baseline supplement: vary each previously untested cooling control.
// Keep studio-v1 fixtures and original reports unchanged.
const coolingSensitivity=[
 {controls:{initial:80,ambient:25,rate:.1},at:10,value:25+55*Math.exp(-1)},
 {controls:{initial:90,ambient:20,rate:.1},at:10,value:20+70*Math.exp(-1)}
];

export function decodeStudioSuite(contents,expectedHash){
 if(hash(contents)!==expectedHash)throw new Error('Frozen Studio suite checksum mismatch.');
 const suite=JSON.parse(contents);
 if(suite.version!=='studio-v1'||suite.cases?.length!==12||new Set(suite.cases.map(c=>c.id)).size!==12)throw new Error('Invalid frozen suite.');
 return {suite,sha256:expectedHash};
}
export function loadStudioSuite(){
 const raw=readFileSync(new URL('../../eval/studio-v1.json',import.meta.url),'utf8');
 const digest=readFileSync(new URL('../../eval/studio-v1.sha256',import.meta.url),'utf8').trim().split(/\s+/)[0];
 return decodeStudioSuite(raw,digest);
}
export function selectStudioCases(suite,filter){
 if(filter===undefined)return suite.cases;
 const ids=filter.split(',');
 if(!ids.length||new Set(ids).size!==ids.length||ids.some(id=>!suite.cases.some(c=>c.id===id)))throw new Error('Choose distinct frozen case IDs.');
 return ids.map(id=>suite.cases.find(c=>c.id===id));
}
export function scoreStudioCase(item,result){
 const score={scorerVersion:studioScorerVersion,contractValid:false,automatedPass:false,checks:{},probes:[],supplementalProbes:[],manualReview:'required',reviewCriteria:item.expected.review};
 let response;
 try{response=readLessonAuthor(result,'compose','generated');}catch{return {...score,failure:'contract-rejected'};}
 score.contractValid=true;score.actualStatus=response.status;score.response=response;
 const expected=item.expected;
 score.checks.status=response.status===expected.status;
 if(response.status==='ready'&&expected.status==='ready'){
  score.checks.oneChapter=response.lesson.chapters.length===1;
  const chapter=response.lesson.chapters[0],demo=chapter.demo;
  score.checks.renderer=demo?.kind===expected.kind;
  if(expected.kind==='model'&&demo?.kind==='model'){
   score.checks.inputs=[...demo.inputs.map(p=>p.id)].sort().join('|')===[...expected.inputIds].sort().join('|');
   score.checks.axis=near(demo.axis.min,expected.axis[0])&&near(demo.axis.max,expected.axis[1]);
   const metric=demo.outputs.findIndex(o=>o.id===expected.output);score.checks.output=metric>=0;
   for(const probe of expected.probes){
    let actual=null;try{const e=chapterExperiment(chapter,0,item.language,probe.controls,metric);actual=e.sample((probe.at-demo.axis.min)/(demo.axis.max-demo.axis.min))[0];}catch{/* Missing or out-of-range controls fail this probe. */}
    score.probes.push({...probe,actual,pass:near(actual,probe.value)});
   }
   score.checks.probes=score.probes.every(p=>p.pass);
   if(item.pair==='cooling'){
    for(const probe of coolingSensitivity){
     let actual=null;try{const e=chapterExperiment(chapter,0,item.language,probe.controls,metric);actual=e.sample((probe.at-demo.axis.min)/(demo.axis.max-demo.axis.min))[0];}catch{/* Unsupported controls fail the supplement. */}
     score.supplementalProbes.push({...probe,actual,pass:near(actual,probe.value)});
    }
    score.checks.parameterSensitivity=score.supplementalProbes.every(p=>p.pass);
   }
   // Transfer reference is independent of the authored expression.
   try{
    const e=chapterExperiment(chapter,0,item.language),values=Object.fromEntries(demo.transfer.values.map(v=>[v.id,v.value]));
    const answer=item.pair==='cooling'?values.ambient+(values.initial-values.ambient)*Math.exp(-values.rate*demo.transfer.at):2*Math.PI*Math.sqrt(demo.transfer.at/values.gravity);
    score.checks.transfer=demo.transfer.output===expected.output&&near(e.transfer.answer,answer);
   }catch{score.checks.transfer=false;}
  }
 }
 score.automatedPass=Object.values(score.checks).every(Boolean);
 if(!score.automatedPass)score.failure='expectation-failed';
 return score;
}

export async function runStudioEvaluation({cases,call,onUpdate=async()=>{},metadata={}}){
 const report={suite:'studio-v1',scorerVersion:studioScorerVersion,startedAt:new Date().toISOString(),complete:false,planned:cases.length,attempted:0,contractValid:0,automatedPassed:0,metadata,cases:[],limitations:'One sample per frozen synthetic case. No retries, repairs or model judge. Automated checks do not establish scientific validity, bilingual fluency or learning effectiveness. Manual content review is separate.'};
 await onUpdate(report);
 for(const item of cases){
  const request=lessonAuthorRequest({topic:item.topic,creation:'generated'},'compose');
  const row={id:item.id,pair:item.pair,language:item.language,category:item.category,promptHash:hash(JSON.stringify(request)),requestSent:false,httpStatus:null,contractValid:false,automatedPass:false,manualReview:'required',reviewCriteria:item.expected.review};
  const started=performance.now();report.attempted++;
  try{
   const result=await call({...request,onTrace:event=>{
    if(event.type==='request')row.requestSent=true;
    if(Number.isInteger(event.status))row.httpStatus=event.status;
   }});
   Object.assign(row,scoreStudioCase(item,result));
   row.model=result.model??null;
   row.usage={input:result.usage?.input_tokens??null,output:result.usage?.output_tokens??null};
  }catch{row.failure='provider-or-transport';}
  row.latencyMs=Math.round(performance.now()-started);report.cases.push(row);
  report.contractValid+=Number(row.contractValid);report.automatedPassed+=Number(row.automatedPass);
  await onUpdate(report,row);
 }
 report.complete=true;report.finishedAt=new Date().toISOString();await onUpdate(report);
 return report;
}
export function studioReportMarkdown(report){
 const lines=[`# ${report.suite} · generated lesson smoke evaluation`,'',report.limitations,'',`Complete: ${report.complete}. Attempted: ${report.attempted}/${report.planned}. Valid contracts: ${report.contractValid}/${report.attempted}. Automated checks passed: ${report.automatedPassed}/${report.planned}.`,'','Manual science/language review: required; not included in the automated score.','','| Case | Contract valid | Automated checks | Failure | Latency |','|---|---|---|---|---|'];
 for(const c of report.cases)lines.push(`| ${c.id} | ${c.contractValid} | ${c.automatedPass} | ${c.failure??'—'} | ${c.latencyMs} ms |`);
 return lines.join('\n')+'\n';
}
