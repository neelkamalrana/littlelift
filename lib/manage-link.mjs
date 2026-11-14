export function parseManagementLink(value,currentOrigin){
 if(typeof value!=='string'||value.length>2048)throw new Error('Invalid link');
 const url=new URL(value.trim());
 const allowed=['https://littlelift.neelkamalrana.com','https://little-lift-bills-nkr.nkrneelkamalrana.chatgpt.site',currentOrigin];
 if(!allowed.includes(url.origin)||url.username||url.password||url.pathname!=='/'||url.search)throw new Error('Invalid link');
 const params=new URLSearchParams(url.hash.slice(1)),id=params.get('bill'),token=params.get('key');
 if(params.getAll('bill').length!==1||params.getAll('key').length!==1||!id||!token||! /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id)||! /^[a-f0-9]{64}$/.test(token))throw new Error('Invalid link');
 return {id,token};
}
