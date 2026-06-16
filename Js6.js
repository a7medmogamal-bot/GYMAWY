var _rgid = null;

async function _la() {
    var c = document.getElementById('_ac');
    if (!c) return;
    var sn = await _d.collection('gyms').get();
    var gs = [];
    sn.forEach(function(d) { gs.push({ id: d.id, name: d.data().name || 'Unknown', active: d.data().active || false, subEnd: d.data().subEnd || null, verified: d.data().verified || false, redeemCode: d.data().redeemCode || '', warnings: d.data().warnings || 0, monthlyPrice: d.data().monthlyPrice || 0, yearlyPrice: d.data().yearlyPrice || 0 }); });
    var total = gs.length;
    var act = gs.filter(function(g) { return g.active && !_x(g.subEnd); }).length;
    var exp = gs.filter(function(g) { return g.active && g.subEnd && _dr(g.subEnd) <= 3 && _dr(g.subEnd) > 0; }).length;
    
    var h = '<div class="stat-grid" style="margin-bottom:12px;">';
    h += '<div class="stat-card"><div class="stat-value">' + total + '</div><div class="stat-label">Total Gyms</div></div>';
    h += '<div class="stat-card success"><div class="stat-value">' + act + '</div><div class="stat-label">Active</div></div>';
    h += '<div class="stat-card warning"><div class="stat-value">' + exp + '</div><div class="stat-label">Expiring Soon</div></div>';
    h += '</div>';
    
    h += '<div style="display:flex;gap:8px;margin-bottom:12px;">';
    h += '<button class="btn btn-primary btn-sm" onclick="_ng()">New Gym</button>';
    h += '<button class="btn btn-outline btn-sm" onclick="_nco()">New Coach</button>';
    h += '</div>';
    
    h += gs.map(function(g) {
        var ok = g.active && !_x(g.subEnd);
        var rd = _dr(g.subEnd) || 0;
        return '<div style="background:var(--card);border-radius:10px;padding:10px;margin-bottom:6px;box-shadow:var(--shadow);">' +
            '<div style="display:flex;justify-content:space-between;"><strong>' + g.name + ' ' + (g.verified ? '<span style="color:#F57F17;">Verified</span>' : '') + '</strong>' +
            '<span style="font-size:10px;padding:2px 8px;border-radius:10px;background:' + (ok ? '#D4EDDA' : '#F8D7DA') + ';color:' + (ok ? '#155724' : '#721C24') + ';">' + (ok ? 'Active' : 'Inactive') + '</span></div>' +
            '<div style="color:var(--text-secondary);font-size:11px;margin:3px 0;">Code: ' + g.redeemCode + ' | Days: ' + rd + '</div>' +
            '<div style="display:flex;gap:4px;flex-wrap:wrap;">' +
            '<button class="btn btn-success btn-sm" onclick="_rng(\'' + g.id + '\')">Renew</button>' +
            '<button class="btn ' + (g.active ? 'btn-danger' : 'btn-success') + ' btn-sm" onclick="_tg(\'' + g.id + '\')">' + (g.active ? 'Disable' : 'Enable') + '</button>' +
            '<button class="btn btn-outline btn-sm" onclick="_tv(\'' + g.id + '\',' + (g.verified || false) + ')">' + (g.verified ? 'Unverify' : 'Verify') + '</button>' +
            '<button class="btn btn-outline btn-sm" onclick="_ed(\'' + g.id + '\',' + rd + ')">Edit Days</button>' +
            '<button class="btn btn-outline btn-sm" onclick="_erc(\'' + g.id + '\',\'' + (g.redeemCode || '') + '\')">Edit Code</button>' +
            '<button class="btn btn-danger btn-sm" onclick="_dg(\'' + g.id + '\',\'' + g.name + '\')">Delete</button>' +
            '</div></div>';
    }).join('');
    
    c.innerHTML = h;
}

function _ng() {
    var mh = '<div class="modal-overlay" id="_nm" onclick="_mo(\'_nm\')"><div class="modal-content" onclick="event.stopPropagation()"><div class="modal-header"><h3>New Gym</h3><button class="modal-close" onclick="_mo(\'_nm\')"><i class="fas fa-times"></i></button></div><div class="modal-body"><div class="form-group"><input type="text" id="_ngn" class="form-control" placeholder="Gym Name"></div><div class="form-group"><input type="text" id="_ngc" class="form-control" placeholder="Code" style="text-transform:uppercase;"></div><div class="form-group"><select id="_ngt" class="form-control"><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select></div><div class="form-group"><input type="date" id="_ngd" class="form-control"></div></div><div class="modal-footer"><button class="btn btn-primary" onclick="_cng()">Create</button></div></div></div>';
    document.body.insertAdjacentHTML('beforeend', mh);
    document.getElementById('_ngd').value = new Date().toISOString().split('T')[0];
}

async function _cng() {
    var n = document.getElementById('_ngn').value.trim();
    var co = document.getElementById('_ngc').value.trim().toUpperCase();
    var t = document.getElementById('_ngt').value;
    var d = document.getElementById('_ngd').value;
    if (!n || !co) { _t('Fill all fields', 'error'); return; }
    var dd = new Date(d);
    t === 'monthly' ? dd.setDate(dd.getDate() + 30) : dd.setDate(dd.getDate() + 365);
    await _d.collection('gyms').add({ name: n, redeemCode: co, active: true, images: [], monthlyPrice: 0, yearlyPrice: null, sessionPrice: 0, offerPrice: null, phones: [], location: '', notes: '', subType: t, subStart: new Date(d).toISOString(), subEnd: dd.toISOString(), verified: false, warnings: 0, created: new Date().toISOString() });
    _mo('_nm');
    _la();
    _t('Gym created');
}

function _nco() {
    var mh = '<div class="modal-overlay" id="_ncm" onclick="_mo(\'_ncm\')"><div class="modal-content" onclick="event.stopPropagation()"><div class="modal-header"><h3>New Coach</h3><button class="modal-close" onclick="_mo(\'_ncm\')"><i class="fas fa-times"></i></button></div><div class="modal-body"><div class="form-group"><input type="text" id="_ncn" class="form-control" placeholder="Gym Name"></div><div class="form-group"><input type="tel" id="_ncp" class="form-control" placeholder="Phone"></div><div class="form-group"><input type="email" id="_nce" class="form-control" placeholder="Email"></div></div><div class="modal-footer"><button class="btn btn-primary" onclick="_cnc()">Create</button></div></div></div>';
    document.body.insertAdjacentHTML('beforeend', mh);
}

async function _cnc() {
    var n = document.getElementById('_ncn').value.trim();
    var p = document.getElementById('_ncp').value.trim();
    var e = document.getElementById('_nce').value.trim();
    if (!n || !p || !e) { _t('Fill all fields', 'error'); return; }
    var cd = _gc();
    var ph = CryptoJS.SHA256(cd).toString();
    await _d.collection('coaches').add({ gymName: n, phone: p, email: e, passHash: ph, active: true, emailVerified: false, createdAt: new Date().toISOString() });
    _se(e, cd);
    _mo('_ncm');
    _t('Coach created - code sent to email');
}

function _rng(id) {
    _rgid = id;
    var mh = '<div class="modal-overlay" id="_rnm" onclick="_mo(\'_rnm\')"><div class="modal-content" onclick="event.stopPropagation()"><div class="modal-header"><h3>Renew</h3><button class="modal-close" onclick="_mo(\'_rnm\')"><i class="fas fa-times"></i></button></div><div class="modal-body"><div class="form-group"><select id="_rnt" class="form-control"><option value="monthly">Monthly (30 days)</option><option value="yearly">Yearly (365 days)</option></select></div><div class="form-group"><input type="date" id="_rnd" class="form-control"></div></div><div class="modal-footer"><button class="btn btn-success" onclick="_crng()">Confirm</button></div></div></div>';
    document.body.insertAdjacentHTML('beforeend', mh);
    document.getElementById('_rnd').value = new Date().toISOString().split('T')[0];
}

async function _crng() {
    var t = document.getElementById('_rnt').value;
    var d = document.getElementById('_rnd').value;
    var dd = new Date(d);
    t === 'monthly' ? dd.setDate(dd.getDate() + 30) : dd.setDate(dd.getDate() + 365);
    await _d.collection('gyms').doc(_rgid).update({ subType: t, subStart: new Date(d).toISOString(), subEnd: dd.toISOString(), active: true });
    _mo('_rnm');
    _la();
    _t('Renewed');
}

async function _tg(id) {
    var sn = await _d.collection('gyms').doc(id).get();
    var g = sn.data();
    await _d.collection('gyms').doc(id).update({ active: !g.active });
    _la();
}

async function _tv(id, cur) {
    await _d.collection('gyms').doc(id).update({ verified: !cur });
    _la();
    _t(cur ? 'Unverified' : 'Verified');
}

function _ed(id, cd) {
    _rgid = id;
    var mh = '<div class="modal-overlay" id="_edm" onclick="_mo(\'_edm\')"><div class="modal-content" onclick="event.stopPropagation()"><div class="modal-header"><h3>Edit Days (Current: ' + cd + ')</h3><button class="modal-close" onclick="_mo(\'_edm\')"><i class="fas fa-times"></i></button></div><div class="modal-body"><div class="form-group"><label>New Days</label><input type="number" id="_edn" class="form-control" placeholder="Days" min="1"></div><div class="form-group"><label>Bonus (1-29)</label><input type="number" id="_edb" class="form-control" placeholder="Bonus" min="1" max="29"></div></div><div class="modal-footer"><button class="btn btn-primary" onclick="_ced()">Save</button></div></div></div>';
    document.body.insertAdjacentHTML('beforeend', mh);
}

async function _ced() {
    var nd = +document.getElementById('_edn').value;
    var bd = +document.getElementById('_edb').value;
    if (!nd && !bd) { _t('Enter value', 'error'); return; }
    if (bd >= 30) { bd = 29; _t('Bonus capped at 29', 'warning'); }
    var sn = await _d.collection('gyms').doc(_rgid).get();
    var g = sn.data();
    var ne;
    if (nd > 0) { ne = new Date(); ne.setDate(ne.getDate() + nd); }
    else { ne = new Date(g.subEnd); ne.setDate(ne.getDate() + bd); }
    await _d.collection('gyms').doc(_rgid).update({ subEnd: ne.toISOString() });
    _mo('_edm');
    _la();
    _t('Days updated');
}

function _erc(id, cc) {
    _rgid = id;
    var mh = '<div class="modal-overlay" id="_ercm" onclick="_mo(\'_ercm\')"><div class="modal-content" onclick="event.stopPropagation()"><div class="modal-header"><h3>Edit Code</h3><button class="modal-close" onclick="_mo(\'_ercm\')"><i class="fas fa-times"></i></button></div><div class="modal-body"><div class="form-group"><input type="text" id="_ercc" class="form-control" placeholder="New code" style="text-transform:uppercase;"></div></div><div class="modal-footer"><button class="btn btn-primary" onclick="_cerc()">Save</button></div></div></div>';
    document.body.insertAdjacentHTML('beforeend', mh);
}

async function _cerc() {
    var nc = document.getElementById('_ercc').value.trim().toUpperCase();
    if (!nc) { _t('Enter code', 'error'); return; }
    await _d.collection('gyms').doc(_rgid).update({ redeemCode: nc });
    _mo('_ercm');
    _la();
    _t('Code updated');
}

function _dg(id, name) {
    var mh = '<div class="modal-overlay" id="_dgm" onclick="_mo(\'_dgm\')"><div class="modal-content" onclick="event.stopPropagation()"><div class="modal-header"><h3>Delete ' + name + '?</h3><button class="modal-close" onclick="_mo(\'_dgm\')"><i class="fas fa-times"></i></button></div><div class="modal-body"><p>This cannot be undone.</p></div><div class="modal-footer"><button class="btn btn-danger" onclick="_cdg(\'' + id + '\')">Delete</button></div></div></div>';
    document.body.insertAdjacentHTML('beforeend', mh);
}

async function _cdg(id) {
    var ms = await _d.collection('members').where('gymId', '==', id).get();
    var batch = _d.batch();
    ms.forEach(function(d) { batch.delete(d.ref); });
    await batch.commit();
    await _d.collection('gyms').doc(id).delete();
    _mo('_dgm');
    _la();
    _t('Deleted');
}

function _lad() {
    localStorage.removeItem('_ad');
    _go('home');
    _t('Logged out');
}