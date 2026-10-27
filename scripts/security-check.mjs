import {readdir,readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const secrets=[process.env.MODEL_API_KEY?.trim(),process.env.EXPLAINBACK_TESTER_PASSWORD].filter(Boolean);
if(!secrets.length){console.error('No configured secrets; cannot perform a value-based leak check.');process.exitCode=1;}
else{
 let count=0;const leaks=[];
 async function scan(dir){
  for(const entry of await readdir(dir,{withFileTypes:true})){
   if(['.git','node_modules','.env.local'].includes(entry.name))continue;
   const path=join(dir,entry.name);
   if(entry.isDirectory())await scan(path);
   else if(entry.isFile()){count++;const data=await readFile(path);if(secrets.some(s=>data.includes(Buffer.from(s))))leaks.push(path.slice(root.length));}
  }
 }
 await scan(root);
 let privateFile=true,present=true;
 try{privateFile=((await stat(join(root,'.env.local'))).mode&0o777)===0o600;}catch(error){if(error.code!=='ENOENT')throw error;present=false;}
 const ignores=await readFile(join(root,'.gitignore'),'utf8');
 const protectedFile=privateFile&&ignores.split('\n').includes('.env.*');
 if(leaks.length||!protectedFile){console.error('FAIL: configured-secret matches:',leaks.length?leaks.join(', '):'none');console.error('Environment permissions and ignore rule:',protectedFile?'pass':'review needed');process.exitCode=1;}
 else console.log(`PASS: ${secrets.length} configured secret(s) absent from ${count} other project files; ${present?'.env.local is private':'environment-only configuration'}; ignore rule present. Values hidden.`);
}
