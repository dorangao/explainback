import {mkdir,copyFile,readdir,rm,writeFile} from 'node:fs/promises';
// Public assets only. Never copy environment files, evals, or baseline archives.
await rm(new URL('../dist/',import.meta.url),{recursive:true,force:true});
await mkdir(new URL('../dist/assets/',import.meta.url),{recursive:true});
for(const name of await readdir(new URL('../public/',import.meta.url))){
 if(!/\.(mjs|css|html)$/.test(name))continue;
 await copyFile(new URL('../public/'+name,import.meta.url),new URL('../dist/'+(name==='index.html'?'':'assets/')+name,import.meta.url));
}
await writeFile(new URL('../dist/robots.txt',import.meta.url),'User-agent: *\nDisallow: /\n');
console.log('Built public ExplainBack assets.');
