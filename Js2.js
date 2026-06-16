function _t(m,t){t=t||'success';var c=document.getElementById('_tc');if(!c){c=document.createElement('div');c.id='_tc';c.style.cssText='position:fixed;bottom:24px;left:20px;right:20px;max-width:400px;margin:0 auto;z-index:9999;';document.body.appendChild(c);}var x=document.createElement('div');x.className='toast toast-'+t;x.textContent=m;c.appendChild(x);setTimeout(function(){x.remove();},3000);}
function _f(d){if(!d)return '';return new Date(d).toLocaleDateString('ar-EG',{year:'numeric',month:'long',day:'numeric'});}
function _x(d){return new Date(d)<new Date();}
function _dr(d){return Math.max(0,Math.ceil((new Date(d)-new Date())/86400000));}
function _id(){return Date.now().toString(36)+Math.random().toString(36).substring(2,8);}
function _gc(){return Math.floor(100000+Math.random()*900000).toString();}
function _ta(t){if(!t)return'';var n=new Date();var d=t.toDate?t.toDate():new Date(t);var s=Math.floor((n-d)/1000);if(s<60)return 'now';if(s<3600)return Math.floor(s/60)+'m';if(s<86400)return Math.floor(s/3600)+'h';return Math.floor(s/86400)+'d';}
function _sr(r){var h='';for(var i=1;i<=5;i++){h+=i<=Math.round(r)?'<i class="fas fa-star" style="color:#FFD700;font-size:14px;"></i>':'<i class="far fa-star" style="color:#DDD;font-size:14px;"></i>';}return h;}
function _mr(ra){var c={};ra.forEach(function(r){c[r]=(c[r]||0)+1;});var m=0,mi=0;for(var i=1;i<=5;i++){if(c[i]>mi){mi=c[i];m=i;}}return m;}
async function _ui(f){var d=new FormData();d.append('file',f);d.append('upload_preset',_c.p);var r=await fetch('https://api.cloudinary.com/v1_1/'+_c.n+'/image/upload',{method:'POST',body:d});var j=await r.json();return j.secure_url||null;}
async function _se(e,c){try{await emailjs.send(_e.s,_e.t,{code:c,to_email:e});return true;}catch(x){return false;}}
function _mo(i){var m=document.getElementById(i);if(m){m.remove();}}
function _go(p){_cp=p;_r();window.scrollTo(0,0);}
function _os(){document.getElementById('_sb').classList.add('active');document.getElementById('_so').classList.add('active');}
function _cs(){document.getElementById('_sb').classList.remove('active');document.getElementById('_so').classList.remove('active');}
function _td(){document.body.classList.toggle('dark');localStorage.setItem('_dm',document.body.classList.contains('dark')?'1':'0');_r();}