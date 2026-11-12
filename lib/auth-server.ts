import {env} from 'cloudflare:workers';
export function authConfig(){
 const url=env.SUPABASE_URL,key=env.SUPABASE_PUBLISHABLE_KEY;
 if(!url||!key||!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url)||!key.startsWith('sb_publishable_'))return null;
 return {url,key,emailEnabled:env.AUTH_EMAIL_ENABLED==='true',phoneEnabled:env.AUTH_PHONE_ENABLED==='true'};
}
export async function getVerifiedUser(req:Request):Promise<{userId:string}|null>{
 const config=authConfig();const bearer=req.headers.get('authorization');
 if(!config||!bearer?.startsWith('Bearer ')||bearer.length>8192)return null;
 const response=await fetch(config.url+'/auth/v1/user',{headers:{apikey:config.key,Authorization:bearer},signal:AbortSignal.timeout(10000)});
 if(!response.ok)return null;
 const user=await response.json() as {id?:string;is_anonymous?:boolean;email_confirmed_at?:string;phone_confirmed_at?:string};
 if(!user.id||user.is_anonymous||(!user.email_confirmed_at&&!user.phone_confirmed_at))return null;
 return {userId:'supabase:'+user.id};
}
