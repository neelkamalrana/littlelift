import {env} from 'cloudflare:workers';
import {tokenHash} from '../../../../../lib/manage-token.mjs';
export const dynamic='force-dynamic';
export async function GET(_req:Request,{params}:{params:Promise<{id:string}>}){
 try{const {id}=await params;const bill=await env.DB!.prepare("SELECT id FROM bills WHERE id=? AND status='open'").bind(id).first();if(!bill)return new Response('This request is no longer on the wall.',{status:404});const file=await env.BUCKET!.get('bills/'+id+'.jpg');if(!file)return new Response('No bill image attached. The uploader has shared their request as text.',{status:404,headers:{'Content-Type':'text/plain; charset=utf-8'}});return new Response(file.body,{headers:{'Content-Type':'image/jpeg','X-Content-Type-Options':'nosniff','Cache-Control':'no-store','Content-Security-Policy':"default-src 'none'; sandbox"}})}catch{return new Response('Image temporarily unavailable.',{status:503})}
}
export async function PUT(req:Request,{params}:{params:Promise<{id:string}>}){
 if(req.headers.get('origin')!==new URL(req.url).origin)return Response.json({error:'Invalid origin.'},{status:403});
 let owner;try{owner='link:'+await tokenHash(req.headers.get('Authorization')?.replace(/^Bearer /,''))}catch{return Response.json({error:'Private management link required.'},{status:401})}
 try{const {id}=await params;const bill=await env.DB!.prepare("SELECT id FROM bills WHERE id=? AND owner=? AND status!='deleted'").bind(id,owner).first();if(!bill)return Response.json({error:'Bill not found.'},{status:404});
 if(req.headers.get('content-type')!=='image/jpeg')return Response.json({error:'Use a JPEG image.'},{status:415});
 const reader=req.body?.getReader();if(!reader)return Response.json({error:'Image required.'},{status:400});const chunks:Uint8Array[]=[];let size=0;for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>2*1024*1024){await reader.cancel();return Response.json({error:'Image exceeds 2 MB.'},{status:413})}chunks.push(value)}
 const data=new Uint8Array(size);let offset=0;for(const chunk of chunks){data.set(chunk,offset);offset+=chunk.length}if(data[0]!==255||data[1]!==216||data[2]!==255)return Response.json({error:'Invalid JPEG image.'},{status:400});
 await env.BUCKET!.put('bills/'+id+'.jpg',data,{httpMetadata:{contentType:'image/jpeg'}});await env.DB!.prepare('UPDATE bills SET has_image=1 WHERE id=?').bind(id).run();return Response.json({ok:true},{headers:{'Cache-Control':'no-store'}})
 }catch{return Response.json({error:'Could not save image. Please try again.'},{status:503})}
}
