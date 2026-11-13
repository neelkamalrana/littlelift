export function optionalEmail(value){
 if(value===undefined||value===null||value==='')return '';
 if(typeof value!=='string')throw new Error('Enter a valid email address.');
 const email=value.trim();
 if(!email)return '';
 if(email.length>254||! /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/.test(email))throw new Error('Enter a valid email address.');
 return email;
}
export async function sendBillEmail({apiKey,email,id,token},send=fetch){
 if(!apiKey)return 'unavailable';
 const link='https://littlelift.neelkamalrana.com/#bill='+encodeURIComponent(id)+'&key='+encodeURIComponent(token);
 try{
 const response=await send('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+apiKey,'Content-Type':'application/json','Idempotency-Key':'bill-link/'+id},signal:AbortSignal.timeout(10000),body:JSON.stringify({from:'Little Lift <littlelift@neelkamalrana.com>',to:[email],subject:'Your private Little Lift management link',text:`You requested a private link for your Little Lift bill.\n\nManage your request:\n${link}\n\nYou posted without an account. Keep this link safe: anyone with it can resolve or remove your request. Do not share it with donors.\n\nAfter confirming money arrived in your PayPal account, use this link to mark your request resolved. Little Lift does not verify payments.\n\nIf you did not request this email, ignore it.\n\nLittle Lift\nhttps://littlelift.neelkamalrana.com/`})});
 return response.ok?'accepted':'failed';
 }catch{return 'failed'}
}
