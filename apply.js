const form=document.querySelector('#entry');
const confirmSection=document.querySelector('#confirmation');
const title=document.querySelector('#page-title');
const email=document.querySelector('#email');
const repeat=document.querySelector('#email-confirm');
function checkEmail(){repeat.setCustomValidity(email.value.trim()===repeat.value.trim()?'':'メールアドレスが一致していません。');}
email.addEventListener('input',checkEmail);repeat.addEventListener('input',checkEmail);
const fields=[['role','希望職種'],['name','お名前'],['kana','ふりがな'],['email','メールアドレス'],['phone','電話番号'],['message','経験・資格・ご質問']];
form.addEventListener('submit',event=>{
 event.preventDefault();checkEmail();if(!form.reportValidity())return;
 const data=new FormData(form);const summary=document.querySelector('#summary');summary.replaceChildren();
 for(const [key,label] of fields){const row=document.createElement('div');const dt=document.createElement('dt');const dd=document.createElement('dd');dt.textContent=label;dd.textContent=String(data.get(key)||'未入力');row.append(dt,dd);summary.append(row);}
 form.hidden=true;confirmSection.hidden=false;title.textContent='応募内容の確認';setStep(1);title.focus();
});
function setStep(index){document.querySelectorAll('.progress li').forEach((item,i)=>{if(i===index)item.setAttribute('aria-current','step');else item.removeAttribute('aria-current');});}
document.querySelector('#back').addEventListener('click',()=>{confirmSection.hidden=true;form.hidden=false;title.textContent='応募フォーム';setStep(0);title.focus();});
document.querySelector('#review').disabled=false;
