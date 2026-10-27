import {createCloudHandler,unavailable} from '../src/cloud.mjs';
let handler;
export default async function(req,res){
 try{handler??=createCloudHandler();}catch{return unavailable(res);}
 return handler(req,res);
}
