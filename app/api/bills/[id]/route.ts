import {env} from 'cloudflare:workers';
import {tokenHash} from '../../../../lib/manage-token.mjs';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
async function owner(req:Request){try{return 'link:'+await tokenHash(req.headers.get('Authorization')?.replace(/^Bearer /,''))}catch{return null}}
export async function GET(req:Request,{params}:{params:Promise<{id:string}>}){
 const key=await owner(req);if(!key)return json({error:'A valid private management link is required.'},401);
 try{const {id}=await params;const bill=await env.DB!.prepare("SELECT id,has_image,name,category,cents,story,paypal,status FROM bills WHERE id=? AND owner=? AND status!='deleted'").bind(id,key).first();return bill?json({bill}):json({error:'This link is invalid or the bill was removed.'},404)}catch{return json({error:'Could not load this bill.'},503)}
}
export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){
 if(req.headers.get('origin')!==new URL(req.url).origin)return json({error:'Invalid request origin.'},403);
 const key=await owner(req);if(!key)return json({error:'A valid private management link is required.'},401);
 try{const raw=await req.text();if(raw.length>200)return json({error:'Request too large.'},413);
 let value;try{value=JSON.parse(raw)}catch{return json({error:'Invalid request.'},400)}
 if(!['closed','deleted'].includes(value?.status))return json({error:'Invalid status.'},400);
 const {id}=await params;const result=await env.DB!.prepare("UPDATE bills SET status=?,updated_at=? WHERE id=? AND owner=? AND status!='deleted'").bind(value.status,Date.now(),id,key).run();
 return result.meta.changes?json({ok:true}):json({error:'This link is invalid or the bill was removed.'},404);
 }catch{return json({error:'Could not update the bill.'},503)}
}
