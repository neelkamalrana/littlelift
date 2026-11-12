import {getVerifiedUser} from '../../../lib/auth-server';
export const dynamic='force-dynamic';
export async function GET(req:Request){try{const user=await getVerifiedUser(req);return Response.json({signedIn:!!user},{headers:{'Cache-Control':'no-store'}})}catch{return Response.json({error:'Unable to check sign-in. Please try again.'},{status:503,headers:{'Cache-Control':'no-store'}})}}
