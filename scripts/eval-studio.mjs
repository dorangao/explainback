import {mkdir,writeFile} from 'node:fs/promises';
import {randomUUID,createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {createProviderRouter} from '../src/llm/index.mjs';
import {loadStudioSuite,selectStudioCases,runStudioEvaluation,studioReportMarkdown} from '../src/eval/studio.mjs';
const args=process.argv.slice(2);
if(args.some(a=>a!=='--live'&&!a.startsWith('--cases='))||new Set(args.map(a=>a.split('=')[0])).size!==args.length)throw new Error('Use --live and optional --cases=ID,ID. Without --live, no calls are made.');
const {suite,sha256}=loadStudioSuite(),cases=selectStudioCases(suite,args.find(a=>a.startsWith('--cases='))?.slice(8));
console.log(`${suite.version} · ${sha256}\n${cases.map(c=>c.id).join('\n')}`);
if(args.includes('--live')){
 const router=createProviderRouter({env:{...process.env,EXPLAINBACK_PROVIDERS:'meta',EXPLAINBACK_DEFAULT_MODEL:'meta:muse-spark-1.3',EXPLAINBACK_META_MODELS:'muse-spark-1.3'}}),id=router.defaultId;
 if(!router.get(id).configured)throw new Error('Meta is not configured. No calls made.');
 const directory=new URL(`../output/eval/studio-${new Date().toISOString().replaceAll(':','-')}-${randomUUID().slice(0,8)}/`,import.meta.url);
 await mkdir(directory,{recursive:true,mode:0o700});
 const metadata={suiteHash:sha256,scorerHash:createHash('sha256').update(readFileSync(new URL('../src/eval/studio.mjs',import.meta.url))).digest('hex'),provider:'meta',model:'muse-spark-1.3',retryCount:0};
 const report=await runStudioEvaluation({cases,call:args=>router.call(id,args),metadata,onUpdate:async(report,row)=>{
  await writeFile(new URL('report.json',directory),JSON.stringify(report,null,2)+'\n',{mode:0o600});
  await writeFile(new URL('report.md',directory),studioReportMarkdown(report),{mode:0o600});
  if(row)console.log(`${row.id}: ${row.automatedPass?'CHECKS PASS':row.failure} · ${row.latencyMs} ms`);
 }});
 console.log(studioReportMarkdown(report));console.log('Local report:',directory.pathname);
 if(!report.complete||report.automatedPassed!==report.planned)process.exitCode=1;
}
