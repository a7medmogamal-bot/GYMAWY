var _cg = null;
var _ci = null;
var _cm = null;

async function _cc(code) {
    code = code.trim().toUpperCase();
    if (code === 'ADMIN2026GYM') { _op(); return; }
    var sn = await _d.collection('gyms').where('redeemCode', '==', code).get();
    if (sn.empty) { _t('Invalid code', 'error'); return; }
    var d = sn.docs[0];
    _cg = { id: d.id, name: d.data().name || 'Gym', monthlyPrice: d.data().monthlyPrice || 0, yearlyPrice: d.data().yearlyPrice || 0, sessionPrice: d.data().sessionPrice || 0, offerPrice: d.data().offerPrice || null, location: d.data().location || '', notes: d.data().notes || '', openTime: d.data().openTime || '', closeTime: d.data().closeTime || '', images: d.data().images || [], phones: d.data().phones || [], verified: d.data().verified || false, active: d.data().active || false, subEnd: d.data().subEnd || null, warnings: d.data().warnings || 0 };
    _ci = d.id;
    if (!_cg.active || _x(_cg.subEnd)) { _t('Gym not active or expired', 'error'); return; }
    var rd = _dr(_cg.subEnd);
    if (rd <= 3 && rd > 0) { _t('Subscription expires in ' + rd + ' days', 'warning'); }
    localStorage.setItem('_ci', _ci);
    _go('coach');
    _lcf();
    _lp();
    _li();
    _lrc();
    _r.listen('_nr/' + _ci, function(s) { if (s.val()) { _t('New request!', 'warning'); _lrc(); _r.ref('_nr/' + _ci).remove(); } });
}

function _lcf() {
    document.getElementById('_gn').value = _cg.name || '';
    document.getElementById('_gmp').value = _cg.monthlyPrice || '';
    document.getElementById('_gyp').value = _cg.yearlyPrice || '';
    document.getElementById('_gsp').value = _cg.sessionPrice || '';
    document.getElementById('_gop').value = _cg.offerPrice || '';
    document.getElementById('_glc').value = _cg.location || '';
    document.getElementById('_gnt').value = _cg.notes || '';
    document.getElementById('_got').value = _cg.openTime || '';
    document.getElementById('_gct').value = _cg.closeTime || '';
    _li();
    _lp();
}

function _li() {
    var g = document.getElementById('_ig');
    if (!g) return;
    var h = '';
    if (_cg.images) {
        _cg.images.forEach(function(img, i) {
            h += '<div class="img-box"><img src="' + img + '"><button class="del-img" onclick="event.stopPropagation();_di(' + i + ')"><i class="fas fa-times"></i></button></div>';
        });
    }
    h += '<div class="img-box add-box" onclick="document.getElementById(\'_ii\').click()"><i class="fas fa-plus"></i></div>';
    g.innerHTML = h;
}

async function _uii(input) {
    if (!_cg.images) _cg.images = [];
    if (_cg.images.length >= 5) { _t('Max 5 images', 'warning'); return; }
    for (var i = 0; i < Math.min(input.files.length, 5 - _cg.images.length); i++) {
        var url = await _ui(input.files[i]);
        if (url) { _cg.images.push(url); _li(); }
    }
    input.value = '';
}

function _di(i) {
    _cg.images.splice(i, 1);
    _li();
}

function _lp() {
    var l = document.getElementById('_pl');
    if (!l) return;
    var h = '';
    if (_cg.phones) {
        _cg.phones.forEach(function(p, i) {
            h += '<div class="phone-row"><input type="tel" value="' + p + '" class="form-control" onchange="_up(' + i + ',this.value)"><button class="del-phone" onclick="_dp(' + i + ')"><i class="fas fa-times"></i></button></div>';
        });
    }
    l.innerHTML = h;
}

function _ap() {
    if (!_cg.phones) _cg.phones = [];
    _cg.phones.push('');
    _lp();
}

function _up(i, v) { _cg.phones[i] = v; }

function _dp(i) {
    _cg.phones.splice(i, 1);
    _lp();
}

async function _sg() {
    var n = document.getElementById('_gn').value.trim();
    if (!n) { _t('Gym name required', 'error'); return; }
    await _d.collection('gyms').doc(_ci).update({
        name: n,
        monthlyPrice: +(document.getElementById('_gmp').value || 0),
        yearlyPrice: document.getElementById('_gyp').value ? +(document.getElementById('_gyp').value) : null,
        sessionPrice: +(document.getElementById('_gsp').value || 0),
        offerPrice: document.getElementById('_gop').value ? +(document.getElementById('_gop').value) : null,
        location: document.getElementById('_glc').value,
        notes: document.getElementById('_gnt').value,
        openTime: document.getElementById('_got').value,
        closeTime: document.getElementById('_gct').value,
        images: _cg.images || [],
        phones: _cg.phones || []
    });
    _cg.name = n;
    _t('Saved');
}

async function _lrc() {
    var sn = await _d.collection('requests').where('gymId', '==', _ci).where('status', '==', 'pending').get();
    var b = document.getElementById('_rb');
    if (b) { b.textContent = sn.size; b.style.display = sn.size > 0 ? 'inline-block' : 'none'; }
}

async function _lr() {
    var c = document.getElementById('_rl');
    if (!c) return;
    var sn = await _d.collection('requests').where('gymId', '==', _ci).where('status', '==', 'pending').get();
    var rs = [];
    sn.forEach(function(d) { rs.push({ id: d.id, name: d.data().name || '', phone: d.data().phone || '', subType: d.data().subType || 'monthly' }); });
    if (!rs.length) { c.innerHTML = '<div class="empty"><i class="fas fa-inbox"></i><h4>No pending requests</h4></div>'; return; }
    c.innerHTML = rs.map(function(r) {
        return '<div style="background:var(--card);border-radius:10px;padding:10px;margin-bottom:6px;"><div><strong>' + r.name + '</strong></div><div style="font-size:11px;">' + r.phone + ' | ' + (r.subType === 'monthly' ? 'Monthly' : 'Yearly') + '</div><div style="display:flex;gap:4px;margin-top:6px;"><button class="btn btn-success btn-sm" onclick="_ar(\'' + r.id + '\')">Accept</button><button class="btn btn-danger btn-sm" onclick="_rr(\'' + r.id + '\')">Reject</button></div></div>';
    }).join('');
}

async function _ar(rid) {
    var rs = await _d.collection('requests').doc(rid).get();
    var r = rs.data();
    var ms = await _d.collection('members').where('gymId', '==', _ci).where('phone', '==', r.phone).where('active', '==', true).where('leftByUser', '==', false).get();
    if (!ms.empty) { _t('Already member', 'error'); return; }
    var sd = new Date();
    var dd = new Date(sd);
    r.subType === 'monthly' ? dd.setDate(dd.getDate() + 30) : dd.setDate(dd.getDate() + 365);
    await _d.collection('members').add({ gymId: _ci, gymName: _cg.name, name: r.name, phone: r.phone, type: r.subType, start: sd.toISOString(), due: dd.toISOString(), monthlyPrice: _cg.monthlyPrice, yearlyPrice: _cg.yearlyPrice, paid: true, active: true, leftByUser: false, created: new Date().toISOString() });
    await _d.collection('requests').doc(rid).update({ status: 'accepted' });
    _lr();
    _lrc();
    _t('Accepted');
}

async function _rr(rid) {
    await _d.collection('requests').doc(rid).update({ status: 'rejected' });
    _lr();
    _lrc();
    _t('Rejected');
}

async function _lm() {
    var c = document.getElementById('_ml');
    if (!c) return;
    var sn = await _d.collection('members').where('gymId', '==', _ci).where('active', '==', true).where('leftByUser', '==', false).get();
    var ms = [];
    sn.forEach(function(d) { ms.push({ id: d.id, name: d.data().name || '', phone: d.data().phone || '', type: d.data().type || 'monthly', due: d.data().due || null, paid: d.data().paid || false }); });
    var s = (document.getElementById('_msi')?.value || '').toLowerCase();
    if (s) ms = ms.filter(function(m) { return (m.name || '').toLowerCase().includes(s) || (m.phone || '').includes(s); });
    if (!ms.length) { c.innerHTML = '<div class="empty"><i class="fas fa-users"></i><h4>No members</h4></div>'; return; }
    c.innerHTML = '<div class="data-table"><div class="data-table-header data-table-cols-4"><span>Name</span><span>Type</span><span>Due</span><span>Status</span></div>' + ms.map(function(m) {
        var ok = m.paid && !_x(m.due);
        return '<div class="data-table-row data-table-cols-4" onclick="_ma(\'' + m.id + '\')"><span style="font-weight:600;">' + (m.name || 'No name') + '</span><span style="font-size:10px;">' + (m.type === 'monthly' ? 'Monthly' : 'Yearly') + '</span><span style="font-size:10px;">' + _f(m.due) + '</span><span><span class="status-badge ' + (ok ? 'status-paid' : 'status-unpaid') + '">' + (ok ? 'Paid' : 'Overdue') + '</span></span></div>';
    }).join('') + '</div>';
}

async function _ma(mid) {
    var sn = await _d.collection('members').doc(mid).get();
    var m = sn.data();
    _cm = { id: sn.id, name: m.name || '', phone: m.phone || '', type: m.type || 'monthly', due: m.due || null, paid: m.paid || false };
    var ok = m.paid && !_x(m.due);
    var canRenew = !m.paid || _x(m.due);
    var mh = '<div class="modal-overlay" id="_mm" onclick="_mo(\'_mm\')"><div class="modal-content" onclick="event.stopPropagation()"><div class="modal-header"><h3>' + (_cm.name || 'Member') + '</h3><button class="modal-close" onclick="_mo(\'_mm\')"><i class="fas fa-times"></i></button></div><div class="modal-body"><p>' + (_cm.phone || '') + '</p><p>Type: ' + (_cm.type === 'monthly' ? 'Monthly' : 'Yearly') + '</p><p>Due: ' + _f(_cm.due) + '</p><span class="status-badge ' + (ok ? 'status-paid' : 'status-unpaid') + '">' + (ok ? 'Paid' : 'Needs Renewal') + '</span></div><div class="modal-footer">' + (canRenew ? '<button class="btn btn-success" onclick="_rn()">Renew</button>' : '<p style="color:var(--success);">Subscription active</p>') + '<button class="btn btn-outline btn-sm" onclick="_em()">Edit</button><button class="btn btn-danger btn-sm" onclick="_xp()">Remove</button></div></div></div>';
    document.body.insertAdjacentHTML('beforeend', mh);
}

async function _em() {
    var mh = '<div class="modal-overlay" id="_em" onclick="_mo(\'_em\')"><div class="modal-content" onclick="event.stopPropagation()"><div class="modal-header"><h3>Edit Member</h3><button class="modal-close" onclick="_mo(\'_em\')"><i class="fas fa-times"></i></button></div><div class="modal-body"><div class="form-group"><label>Name</label><input type="text" id="_emn" class="form-control" value="' + (_cm.name || '') + '"></div><div class="form-group"><label>Phone</label><input type="tel" id="_emp" class="form-control" value="' + (_cm.phone || '') + '"></div></div><div class="modal-footer"><button class="btn btn-primary" onclick="_sem()">Save</button></div></div></div>';
    document.body.insertAdjacentHTML('beforeend', mh);
}

async function _sem() {
    var n = document.getElementById('_emn').value.trim();
    var p = document.getElementById('_emp').value.trim();
    if (!n) { _t('Name required', 'error'); return; }
    await _d.collection('members').doc(_cm.id).update({ name: n, phone: p });
    _mo('_em');
    _mo('_mm');
    _lm();
    _t('Updated');
}

async function _rn() {
    _st = _cm.type || 'monthly';
    var mh = '<div class="modal-overlay" id="_rm" onclick="_mo(\'_rm\')"><div class="modal-content" onclick="event.stopPropagation()"><div class="modal-header"><h3>Renew</h3><button class="modal-close" onclick="_mo(\'_rm\')"><i class="fas fa-times"></i></button></div><div class="modal-body"><div class="radio-group"><div class="radio-option ' + (_st === 'monthly' ? 'selected' : '') + '" id="_rnm" onclick="_srn(\'monthly\')">Monthly<span style="display:block;font-size:10px;">' + (_cg.monthlyPrice || 0) + ' EGP</span></div>' + (_cg.yearlyPrice ? '<div class="radio-option ' + (_st === 'yearly' ? 'selected' : '') + '" id="_rny" onclick="_srn(\'yearly\')">Yearly<span style="display:block;font-size:10px;">' + _cg.yearlyPrice + ' EGP</span></div>' : '') + '</div></div><div class="modal-footer"><button class="btn btn-success" onclick="_crn()">Confirm</button></div></div></div>';
    document.body.insertAdjacentHTML('beforeend', mh);
}

function _srn(t) {
    _st = t;
    document.querySelectorAll('#_rm .radio-option').forEach(function(o) { o.classList.remove('selected'); });
    document.getElementById(t === 'monthly' ? '_rnm' : '_rny').classList.add('selected');
}

async function _crn() {
    var dd = new Date();
    _st === 'monthly' ? dd.setDate(dd.getDate() + 30) : dd.setDate(dd.getDate() + 365);
    await _d.collection('members').doc(_cm.id).update({ due: dd.toISOString(), paid: true, type: _st });
    _mo('_rm');
    _mo('_mm');
    _lm();
    _t('Renewed');
}

async function _xp() {
    await _d.collection('members').doc(_cm.id).update({ active: false, leftByUser: false, expelledByCoach: true, expelledAt: new Date().toISOString(), paid: false });
    _mo('_mm');
    _lm();
    _t('Removed', 'warning');
}

async function _sam() {
    var mh = '<div class="modal-overlay" id="_am" onclick="_mo(\'_am\')"><div class="modal-content" onclick="event.stopPropagation()"><div class="modal-header"><h3>Add Member</h3><button class="modal-close" onclick="_mo(\'_am\')"><i class="fas fa-times"></i></button></div><div class="modal-body"><div class="form-group"><label>Name</label><input type="text" id="_amn" class="form-control"></div><div class="form-group"><label>Phone</label><input type="tel" id="_amp" class="form-control"></div><div class="form-group"><label>Type</label><select id="_amt" class="form-control"><option value="monthly">Monthly (30 days)</option><option value="yearly">Yearly (365 days)</option></select></div><div class="form-group"><label>Start Date</label><input type="date" id="_amd" class="form-control"></div></div><div class="modal-footer"><button class="btn btn-success" onclick="_cam()">Add</button></div></div></div>';
    document.body.insertAdjacentHTML('beforeend', mh);
    document.getElementById('_amd').value = new Date().toISOString().split('T')[0];
}

async function _cam() {
    var n = document.getElementById('_amn').value.trim();
    var p = document.getElementById('_amp').value.trim();
    var t = document.getElementById('_amt').value;
    var d = document.getElementById('_amd').value;
    if (!n || !p) { _t('Fill all fields', 'error'); return; }
    var sd = new Date(d);
    var dd = new Date(sd);
    t === 'monthly' ? dd.setDate(dd.getDate() + 30) : dd.setDate(dd.getDate() + 365);
    await _d.collection('members').add({ gymId: _ci, gymName: _cg.name, name: n, phone: p, type: t, start: sd.toISOString(), due: dd.toISOString(), monthlyPrice: _cg.monthlyPrice, yearlyPrice: _cg.yearlyPrice, paid: true, active: true, leftByUser: false, isManual: true, created: new Date().toISOString() });
    _mo('_am');
    _lm();
    _t('Member added');
}

function _lss() {
    var d = document.getElementById('_sd').value || new Date().toISOString().split('T')[0];
    var ss = JSON.parse(localStorage.getItem('_gss') || '[]');
    ss = ss.filter(function(s) { return s.gymId === _ci && s.date === d; });
    var total = ss.reduce(function(a, s) { return a + s.price; }, 0);
    document.getElementById('_sc').textContent = ss.length;
    document.getElementById('_st').textContent = total + ' EGP';
    var c = document.getElementById('_sl');
    if (!c) return;
    if (!ss.length) { c.innerHTML = '<div class="empty"><i class="fas fa-calendar"></i><h4>No sessions</h4></div>'; return; }
    c.innerHTML = ss.map(function(s) { return '<div style="background:var(--card);border-radius:8px;padding:8px;margin-bottom:4px;display:flex;justify-content:space-between;"><span>' + s.name + '</span><span>' + s.price + ' EGP</span></div>'; }).join('');
}

function _ass() {
    var mh = '<div class="modal-overlay" id="_asm" onclick="_mo(\'_asm\')"><div class="modal-content" onclick="event.stopPropagation()"><div class="modal-header"><h3>New Session</h3><button class="modal-close" onclick="_mo(\'_asm\')"><i class="fas fa-times"></i></button></div><div class="modal-body"><div class="form-group"><input type="text" id="_asn" class="form-control" placeholder="Client name"></div><div class="form-group"><input type="number" id="_asp" class="form-control" value="' + (_cg.sessionPrice || 0) + '"></div></div><div class="modal-footer"><button class="btn btn-primary" onclick="_cas()">Record</button></div></div></div>';
    document.body.insertAdjacentHTML('beforeend', mh);
}

function _cas() {
    var n = document.getElementById('_asn').value.trim();
    var p = +document.getElementById('_asp').value;
    if (!n) { _t('Enter name', 'error'); return; }
    var ss = JSON.parse(localStorage.getItem('_gss') || '[]');
    ss.push({ id: _id(), gymId: _ci, name: n, price: p, date: new Date().toISOString().split('T')[0], created: new Date().toISOString() });
    localStorage.setItem('_gss', JSON.stringify(ss));
    _mo('_asm');
    _lss();
    _t('Recorded');
}

async function _lst() {
    var c = document.getElementById('_stc');
    if (!c) return;
    var ms = await _d.collection('members').where('gymId', '==', _ci).where('active', '==', true).where('leftByUser', '==', false).get();
    var totalMembers = ms.size;
    var nm = 0, mr = 0;
    var now = new Date();
    var tm = new Date(now.getFullYear(), now.getMonth(), 1);
    ms.forEach(function(d) {
        var dd = d.data();
        if (dd.start && new Date(dd.start) >= tm) nm++;
        if (dd.type === 'monthly') mr += dd.monthlyPrice || 0;
        else mr += (dd.yearlyPrice || 0) / 12;
    });
    var ss = JSON.parse(localStorage.getItem('_gss') || '[]').filter(function(s) { return s.gymId === _ci; });
    c.innerHTML = '<div class="stat-grid"><div class="stat-card"><div class="stat-value">' + totalMembers + '</div><div class="stat-label">Active Members</div></div><div class="stat-card success"><div class="stat-value">' + nm + '</div><div class="stat-label">New This Month</div></div><div class="stat-card"><div class="stat-value">' + Math.round(mr) + '</div><div class="stat-label">Monthly Revenue (EGP)</div></div><div class="stat-card success"><div class="stat-value">' + ss.length + '</div><div class="stat-label">Total Sessions</div></div></div>';
}

function _lco() {
    localStorage.removeItem('_ci');
    _cg = null;
    _ci = null;
    _go('home');
    _t('Logged out');
}

function _stb(t) {
    document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
    document.querySelector('.tab-btn[onclick*="' + t + '"]').classList.add('active');
    document.querySelectorAll('.tab-content').forEach(function(c) { c.classList.remove('active'); });
    document.getElementById('_t-' + t).classList.add('active');
    if (t === 'requests') _lr();
    if (t === 'members') _lm();
    if (t === 'sessions') _lss();
    if (t === 'stats') _lst();
}

function _op() {
    var mh = '<div class="modal-overlay" id="_pm" onclick="_mo(\'_pm\')"><div class="modal-content" onclick="event.stopPropagation()"><div class="modal-header"><h3>Admin Access</h3><button class="modal-close" onclick="_mo(\'_pm\')"><i class="fas fa-times"></i></button></div><div class="modal-body" style="text-align:center;"><p>Enter password</p><div class="passcode-grid" id="_pg"></div></div><div class="modal-footer"><button class="btn btn-primary" onclick="_vp()">Enter</button></div></div></div>';
    document.body.insertAdjacentHTML('beforeend', mh);
    var g = document.getElementById('_pg');
    var h = '';
    for (var i = 1; i <= 6; i++) {
        h += '<input type="password" class="form-control passcode-input" maxlength="1" id="_pc' + i + '" oninput="if(this.value.length===1&&' + i + '<6)document.getElementById(\'_pc' + (i+1) + '\').focus()">';
    }
    g.innerHTML = h;
}

function _vp() {
    var v = '';
    for (var i = 1; i <= 6; i++) v += document.getElementById('_pc' + i).value;
    if (CryptoJS.SHA256(v).toString() === _a.h) {
        _mo('_pm');
        localStorage.setItem('_ad', '1');
        _go('admin');
        _la();
    } else {
        _t('Wrong password', 'error');
    }
}