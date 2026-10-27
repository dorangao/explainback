import {createHash,randomBytes,timingSafeEqual} from 'node:crypto';
const COOKIE='explainback_tester',TTL=8*60*60_000;
const digest=value=>createHash('sha256').update(value).digest();
const fail=(status,code,message)=>{throw Object.assign(new Error(message),{status,code});};
export const expiredTesterCookie=`${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;
// Local shared tester access. Tokens and learning state live only in this process.
export function createTesterAuth({username=process.env.EXPLAINBACK_TESTER_USERNAME,password=process.env.EXPLAINBACK_TESTER_PASSWORD,now=Date.now,onRevoke=()=>{}}={}){
 const configured=typeof username==='string'&&username.trim().length>0&&username.length<=80&&typeof password==='string'&&password.length>=12&&password.length<=512;
 const expectedUser=digest(configured?username:''),expectedPassword=digest(configured?password:'');
 const sessions=new Map();let failures=0,windowStart=now();
 const tokenId=cookie=>{
  if(typeof cookie!=='string')return null;
  const token=cookie.split(';').map(s=>s.trim()).find(s=>s.startsWith(COOKIE+'='))?.slice(COOKIE.length+1);
  return /^[a-f0-9]{64}$/.test(token??'')?digest(token).toString('hex'):null;
 };
 const remove=id=>{if(sessions.delete(id))onRevoke(id);};
 const prune=()=>{for(const [id,s]of sessions)if(s.expiresAt<=now())remove(id);};
 return {
  configured,
  authenticate(cookie){prune();return sessions.get(tokenId(cookie))??null;},
  active(id){prune();return sessions.has(id);},
  revoke(cookie){remove(tokenId(cookie));},
  login(body,cookie){
   if(!configured)fail(503,'TESTER_SETUP','Configure tester access in the server environment.');
   if(now()-windowStart>=60000){failures=0;windowStart=now();}
   if(failures>=5)fail(429,'TESTER_RATE','Too many login attempts. Try again in one minute.');
   const validShape=typeof body?.username==='string'&&body.username.length<=80&&typeof body?.password==='string'&&body.password.length<=512;
   const userMatch=timingSafeEqual(digest(validShape?body.username:''),expectedUser);
   const passwordMatch=timingSafeEqual(digest(validShape?body.password:''),expectedPassword);
   if(!validShape||!userMatch||!passwordMatch){failures++;fail(401,'TESTER_CREDENTIALS','Username or password is incorrect.');}
   prune();const previousId=tokenId(cookie);
   if(sessions.size>=20&&!sessions.has(previousId))fail(429,'TESTER_CAPACITY','Tester session limit reached. Sign out another session or restart the local server.');
   remove(previousId);failures=0;
   const token=randomBytes(32).toString('hex'),id=digest(token).toString('hex');
   sessions.set(id,{id,expiresAt:now()+TTL});
   return {id,cookie:`${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${TTL/1000}`};
  },
 };
}
