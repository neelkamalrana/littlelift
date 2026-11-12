import {createClient, type SupabaseClient} from '@supabase/supabase-js';
export type Config={url:string;key:string;emailEnabled:boolean;phoneEnabled:boolean};
let pending:Promise<{client:SupabaseClient;config:Config}|null>|null=null;
export function getAuth(){
 if(!pending)pending=fetch('/api/auth/config',{cache:'no-store'}).then(async response=>{
  if(!response.ok)throw new Error('Sign-in is temporarily unavailable.');
  const {config}=await response.json() as {config:Config|null};
  if(!config){pending=null;return null}
  return {client:createClient(config.url,config.key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}),config};
 }).catch(error=>{pending=null;throw error});
 return pending;
}
export async function authHeaders():Promise<Record<string,string>>{const auth=await getAuth();if(!auth)return {};const {data}=await auth.client.auth.getSession();return data.session?{Authorization:'Bearer '+data.session.access_token}:{};}
