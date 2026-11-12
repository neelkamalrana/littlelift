export const categories=['Electricity','Groceries','Internet','Rent','Other'];
export function parseBill(value){
 if(!value||typeof value!=='object')throw new Error('Please complete the bill details.');
 const {name,category,story,paypal,amount}=value;
 if(typeof name!=='string'||!name.trim()||name.trim().length>35)throw new Error('Use a first name up to 35 characters.');
 if(!categories.includes(category))throw new Error('Choose a bill category.');
 if(typeof story!=='string'||!story.trim()||story.trim().length>240)throw new Error('Add a short description, up to 240 characters.');
 if(typeof amount!=='string'||!/^\d{1,6}(\.\d{1,2})?$/.test(amount)||Number(amount)<1||Number(amount)>100000)throw new Error('Enter an amount between $1 and $100,000, with up to two decimal places.');
 if(typeof paypal!=='string')throw new Error('Add your PayPal.me link.');
 const link=paypal.trim().match(/^(?:https:\/\/)?(?:www\.)?paypal\.me\/([a-z0-9]{1,20})\/?$/i);
 if(!link)throw new Error('Use a PayPal.me profile link, such as https://paypal.me/YourName.');
 return {name:name.trim(),category,story:story.trim(),cents:Math.round(Number(amount)*100),paypal:link[1]};
}
export function paymentUrl(handle,cents){if(!/^[a-z0-9]{1,20}$/i.test(handle)||!Number.isInteger(cents)||cents<100)throw new Error('Invalid payment details');return `https://paypal.me/${handle}/${(cents/100).toFixed(2)}USD`}
