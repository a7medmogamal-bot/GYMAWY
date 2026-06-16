var _cu = null;
var _ru = null;

async function _reg(fn,ph,un,pw,pwc,em){
    if(!fn||fn.length<6){_t('Name too short','error');return false;}
    if(!un||un.length<6||un.length>16){_t('Username must be 6-16 chars','error');return false;}
    if(!ph||ph.length<10){_t('Phone required','error');return false;}
    if(!pw||pw.length<6){_t('Password must be 6+ chars','error');return false;}
    if(pw!==pwc){_t('Passwords dont match','error');return false;}
    if(!em||!em.includes('@')){_t('Valid email required','error');return false;}
    try{
        var us=await _d.collection('users').doc(un).get();
        if(us.exists){_t('Username taken','error');return false;}
        var es=await _d.collection('users').where('email','==',em).where('emailVerified','==',true).get();
        if(!es.empty){_t('Email used','error');return false;}
        var ph=CryptoJS.SHA256(pw).toString();
        var cd=_gc();
        var tu={fullName:fn,phone:ph,username:un,passHash:ph,email:em,emailCode:cd,createdAt:new Date().toISOString()};
        localStorage.setItem('_pu_'+un,JSON.stringify(tu));
        _se(em,cd);
        _cu={fullName:fn,phone:ph,username:un,email:em,emailVerified:false,pendingActivation:true};
        localStorage.setItem('_ua',JSON.stringify(_cu));
        _t('Code sent to email');
        _go('verify');
        return true;
    }catch(e){_t('Error','error');return false;}
}

async function _log(un,pw){
    if(!un||!pw){_t('Enter credentials','error');return false;}
    try{
        var pu=localStorage.getItem('_pu_'+un);
        if(pu){
            var p=JSON.parse(pu);
            if(CryptoJS.SHA256(pw).toString()===p.passHash){
                _t('Not verified - check email','warning');
                _cu={fullName:p.fullName,phone:p.phone,username:un,email:p.email,emailVerified:false,pendingActivation:true};
                localStorage.setItem('_ua',JSON.stringify(_cu));
                _go('verify');
                return false;
            }
        }
        var sn=await _d.collection('users').doc(un).get();
        if(!sn.exists){_t('Username not found','error');return false;}
        var d=sn.data();
        if(!d.emailVerified){_t('Not verified','warning');_cu={fullName:d.fullName,phone:d.phone||'',username:un,email:d.email||'',emailVerified:false};localStorage.setItem('_ua',JSON.stringify(_cu));_go('verify');return false;}
        if(CryptoJS.SHA256(pw).toString()!==d.passHash){_t('Wrong password','error');return false;}
        _cu={fullName:d.fullName,phone:d.phone||'',username:un,email:d.email||'',emailVerified:true,role:d.role||'user',gymId:d.gymId||null};
        localStorage.setItem('_ua',JSON.stringify(_cu));
        _t('Welcome '+d.fullName);
        _go('home');
        return true;
    }catch(e){_t('Login error','error');return false;}
}

async function _ver(cd){
    if(!cd||cd.length!==6){_t('Enter 6-digit code','error');return;}
    var un=_cu.username;
    var pu=localStorage.getItem('_pu_'+un);
    if(pu){
        var p=JSON.parse(pu);
        if(p.emailCode!==cd){_t('Invalid code','error');return;}
        await _d.collection('users').doc(un).set({fullName:p.fullName,phone:p.phone,username:un,passHash:p.passHash,email:p.email,emailVerified:true,emailCode:null,createdAt:p.createdAt,role:'user'});
        localStorage.removeItem('_pu_'+un);
        _cu.emailVerified=true;_cu.pendingActivation=false;
        localStorage.setItem('_ua',JSON.stringify(_cu));
        _t('Account verified!');
        _go('home');
        return;
    }
    var sn=await _d.collection('users').doc(un).get();
    if(!sn.exists){_t('Error','error');return;}
    var d=sn.data();
    if(d.emailCode!==cd){_t('Invalid code','error');return;}
    await _d.collection('users').doc(un).update({emailVerified:true,emailCode:null});
    _cu.emailVerified=true;
    localStorage.setItem('_ua',JSON.stringify(_cu));
    _t('Verified!');
    _go('home');
}

async function _fp(em){
    if(!em||!em.includes('@')){_t('Enter email','error');return;}
    var sn=await _d.collection('users').where('email','==',em).where('emailVerified','==',true).get();
    if(sn.empty){_t('Email not registered','error');return;}
    _ru=sn.docs[0].data().username;
    var cd=_gc();
    await _d.collection('users').doc(_ru).update({resetCode:cd});
    _se(em,cd);
    _t('Code sent');
    document.getElementById('_ra').innerHTML='<p style="text-align:center;color:var(--success);">Code sent to: '+em+'</p><div class="form-group"><input type="text" id="_rci" class="form-control" placeholder="Code" maxlength="6" style="text-align:center;font-size:20px;letter-spacing:8px;"></div><div class="form-group"><input type="password" id="_rnp" class="form-control" placeholder="New password"></div><div class="form-group"><input type="password" id="_rnc" class="form-control" placeholder="Confirm"></div><button class="btn btn-primary" onclick="_cpr()">Save</button>';
}

async function _cpr(){
    var cd=document.getElementById('_rci').value.trim();
    var pw=document.getElementById('_rnp').value;
    var pc=document.getElementById('_rnc').value;
    if(!cd){_t('Enter code','error');return;}
    if(!pw||pw.length<6){_t('Password 6+ chars','error');return;}
    if(pw!==pc){_t('Dont match','error');return;}
    var sn=await _d.collection('users').doc(_ru).get();
    if(sn.data().resetCode!==cd){_t('Invalid code','error');return;}
    var h=CryptoJS.SHA256(pw).toString();
    await _d.collection('users').doc(_ru).update({passHash:h,resetCode:null});
    _t('Password changed');
    _go('profile');
}

function _lo(){
    _cu=null;
    localStorage.removeItem('_ua');
    localStorage.removeItem('_ci');
    localStorage.removeItem('_ad');
    _go('home');
    _t('Logged out');
}

function _hlog(){
    var u=document.getElementById('_liu').value.trim().toUpperCase();
    var p=document.getElementById('_lip').value;
    _log(u,p);
}

async function _hreg(){
    var fn=document.getElementById('_rfn').value.trim();
    var ph=document.getElementById('_rph').value.trim();
    var em=document.getElementById('_rem').value.trim();
    var un=document.getElementById('_run').value.trim().toUpperCase();
    var pw=document.getElementById('_rpw').value;
    var pc=document.getElementById('_rpc').value;
    await _reg(fn,ph,un,pw,pc,em);
}

async function _hver(){
    var cd=document.getElementById('_vci').value.trim();
    await _ver(cd);
}

async function _hfp(){
    var em=document.getElementById('_fei').value.trim();
    await _fp(em);
}