import {optionalEmail,sendBillEmail} from '../../../lib/bill-email.mjs';
import {env} from 'cloudflare:workers';
import {parseBill} from '../../../lib/bill-validation.mjs';
import {newToken,tokenHash} from '../../../lib/manage-token.mjs';
export const dynamic='force-dynamic';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(req:Request){try{
 const u=new URL(req.url);const page=Math.max(0,Math.min(10000,Number(u.searchParams.get('page'))||0));
 const category=u.searchParams.get('category')||'All bills';
 const rows=await env.DB!.prepare("SELECT id,has_image,name,category,cents,story,paypal,status,created_at FROM bills WHERE status='open' AND (?='All bills' OR category=?) ORDER BY created_at DESC,id DESC LIMIT 25 OFFSET ?").bind(category,category,Math.floor(page)*24).all();
 return json({bills:rows.results.slice(0,24),hasMore:rows.results.length>24});
}catch{return json({error:'Bills are temporarily unavailable. Please try again.'},503)}}
export async function POST(req:Request){
 if(req.headers.get('origin')!==new URL(req.url).origin)return json({error:'Invalid request origin.'},403);
 if(!req.headers.get('content-type')?.includes('application/json'))return json({error:'Expected JSON.'},415);
 try{const raw=await req.text();if(raw.length>4096)return json({error:'Bill details are too long.'},413);
 let b,email;try{const input=JSON.parse(raw);if(input.website)return json({error:'Unable to post.'},400);b=parseBill(input);email=optionalEmail(input.email)}catch(e){return json({error:e instanceof Error?e.message:'Invalid bill.'},400)}
 const id=crypto.randomUUID(),token=newToken(),owner='link:'+await tokenHash(token),now=Date.now();
 const result=await env.DB!.prepare("INSERT INTO bills(id,owner,name,category,cents,story,paypal,status,created_at,updated_at) SELECT ?,?,?,?,?,?,?,'open',?,? WHERE (SELECT COUNT(*) FROM bills WHERE lower(paypal)=lower(?) AND (status='open' OR created_at>?))<5").bind(id,owner,b.name,b.category,b.cents,b.story,b.paypal,now,now,b.paypal,now-86400000).run();
 if(!result.meta.changes)return json({error:'This PayPal profile has reached its posting limit. Keep at most five open requests and try again tomorrow.'},429);
 let emailStatus='not_requested';
 if(email){
  // Bound automatic sends; email addresses are never stored in public bill records.
  try{const daily=await env.DB!.prepare('SELECT COUNT(*) AS total FROM bills WHERE created_at>=?').bind(new Date().setUTCHours(0,0,0,0)).first<{total:number}>();
   emailStatus=(daily?.total??91)>90?'unavailable':await sendBillEmail({apiKey:env.RESEND_API_KEY,email,id,token});
  }catch{emailStatus='failed'}
 }
 return json({id,token,emailStatus},201);
 }catch{return json({error:'We could not save your bill. Please try again.'},503)}
}
