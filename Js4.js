var _ag = [];
var _sg = null;
var _st = 'monthly';
var _sr = 0;

async function _lg() {
    var c = document.getElementById('_gl');
    if (!c) return;
    c.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
    try {
        var sn = await _d.collection('gyms').where('active', '==', true).get();
        _ag = [];
        sn.forEach(function(d) {
            _ag.push({
                id: d.id,
                name: d.data().name || 'Unknown',
                monthlyPrice: d.data().monthlyPrice || 0,
                yearlyPrice: d.data().yearlyPrice || 0,
                location: d.data().location || '',
                images: d.data().images || [],
                rating: d.data().rating || 0,
                ratingCount: d.data().ratingCount || 0,
                verificationType: d.data().verificationType || 'none',
                openTime: d.data().openTime || '',
                closeTime: d.data().closeTime || '',
                weekGym: d.data().weekGym || false,
                createdAt: d.data().createdAt || null,
                phones: d.data().phones || [],
                sessionPrice: d.data().sessionPrice || 0,
                notes: d.data().notes || ''
            });
        });
        var s = (document.getElementById('_si')?.value || '').toLowerCase();
        var pmin = +(document.getElementById('_pmi')?.value || 0);
        var pmax = +(document.getElementById('_pma')?.value || 999999);
        var on = document.getElementById('_of')?.checked || false;
        var as = document.querySelectorAll('#_rf i.active').length;
        var f = _ag.filter(function(g) {
            if (s && !(g.name.toLowerCase().includes(s) || g.location.toLowerCase().includes(s))) return false;
            if (g.monthlyPrice < pmin || g.monthlyPrice > pmax) return false;
            if (as > 0 && g.rating < as) return false;
            if (on) {
                if (!g.openTime || !g.closeTime) return true;
                var n = new Date();
                var ct = n.getHours() + ':' + String(n.getMinutes()).padStart(2, '0');
                return ct >= g.openTime && ct <= g.closeTime;
            }
            return true;
        });
        f.sort(function(a, b) {
            if (a.verificationType === 'gold' && b.verificationType !== 'gold') return -1;
            if (a.verificationType !== 'gold' && b.verificationType === 'gold') return 1;
            return (b.rating || 0) - (a.rating || 0);
        });
        if (!f.length) { c.innerHTML = '<div class="card text-center"><p>No gyms found</p></div>'; return; }
        var h = '<div class="gym-grid">';
        f.forEach(function(g) { h += _rgc(g); });
        h += '</div>';
        c.innerHTML = h;
    } catch (e) { c.innerHTML = '<div class="card text-center"><p>Connection error</p></div>'; }
}

function _rgc(g) {
    var sh = '';
    var n = new Date();
    var ct = n.getHours() + ':' + String(n.getMinutes()).padStart(2, '0');
    if (!g.openTime || !g.closeTime) {
        sh = '<span class="gym-card-status status-open"><i class="fas fa-circle"></i> 24H</span>';
    } else if (ct >= g.openTime && ct <= g.closeTime) {
        sh = '<span class="gym-card-status status-open"><i class="fas fa-circle"></i> Open</span>';
    } else {
        sh = '<span class="gym-card-status status-closed"><i class="fas fa-circle"></i> Closed</span>';
    }
    var isNew = g.createdAt && (new Date() - new Date(g.createdAt)) < 7 * 24 * 60 * 60 * 1000;
    var h = '<div class="gym-card" onclick="_sgd(\'' + g.id + '\')">';
    h += '<div class="gym-card-image">';
    h += g.images.length ? '<img src="' + g.images[0] + '" alt="' + g.name + '">' : '<i class="fas fa-dumbbell ph"></i>';
    if (g.verificationType === 'gold') h += '<span class="verified-badge"><i class="fas fa-check-circle"></i> VIP</span>';
    if (g.verificationType === 'blue') h += '<span class="verified-badge" style="background:#3498DB;color:white;"><i class="fas fa-check-circle"></i> Premium</span>';
    if (isNew) h += '<span class="gym-card-badge badge-new">NEW</span>';
    if (g.weekGym) h += '<span class="gym-card-badge badge-vip">WEEK</span>';
    h += '</div><div class="gym-card-body">';
    h += '<div class="gym-card-title">' + g.name + sh + '</div>';
    h += '<div class="gym-prices"><div class="gym-price-item"><span class="gym-price-value">' + (g.monthlyPrice || 0) + '</span><span class="gym-price-label">EGP/mo</span></div>';
    if (g.yearlyPrice) h += '<div class="gym-price-item"><span class="gym-price-value">' + g.yearlyPrice + '</span><span class="gym-price-label">EGP/yr</span></div>';
    h += '</div>';
    if (g.rating) h += '<div class="gym-rating"><div class="stars">' + _sr(g.rating) + '</div><span>' + g.rating + '</span></div>';
    if (g.location) h += '<div class="gym-distance"><i class="fas fa-map-marker-alt"></i> ' + g.location + '</div>';
    h += '</div></div>';
    return h;
}

function _srf(r) {
    _sr = r;
    var ss = document.querySelectorAll('#_rf i');
    ss.forEach(function(s, i) { s.classList.toggle('active', i < r); });
    _lg();
}

async function _sgd(id) {
    _sg = _ag.find(function(g) { return g.id === id; });
    if (!_sg) {
        try {
            var d = await _d.collection('gyms').doc(id).get();
            if (d.exists) {
                _sg = {
                    id: d.id,
                    name: d.data().name || 'Unknown',
                    monthlyPrice: d.data().monthlyPrice || 0,
                    yearlyPrice: d.data().yearlyPrice || 0,
                    location: d.data().location || '',
                    images: d.data().images || [],
                    phones: d.data().phones || [],
                    sessionPrice: d.data().sessionPrice || 0,
                    openTime: d.data().openTime || '',
                    closeTime: d.data().closeTime || '',
                    notes: d.data().notes || '',
                    verificationType: d.data().verificationType || 'none'
                };
            }
        } catch (e) { return; }
    }
    _go('gym-details');
}

function _lgd() {
    var c = document.getElementById('_gdc');
    if (!c || !_sg) return;
    var g = _sg;
    var ot = g.openTime || '--';
    var ct = g.closeTime || '--';
    var is24 = !g.openTime && !g.closeTime;
    var h = '';
    if (g.images && g.images.length) {
        h += '<div style="display:flex;gap:6px;overflow-x:auto;margin-bottom:10px;">' + g.images.map(function(i) { return '<img src="' + i + '" style="width:100%;max-width:250px;height:180px;object-fit:cover;border-radius:10px;flex-shrink:0;">'; }).join('') + '</div>';
    }
    if (g.verificationType === 'gold') h += '<div style="background:#FFF8E1;padding:6px 10px;border-radius:8px;margin-bottom:10px;font-size:12px;color:#F57F17;"><i class="fas fa-check-circle"></i> Verified VIP Gym</div>';
    h += '<h4><i class="fas fa-tag"></i> Prices</h4>';
    h += '<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--border);"><span>Monthly</span><strong>' + (g.monthlyPrice || 0) + ' EGP</strong></div>';
    if (g.yearlyPrice) h += '<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--border);"><span>Yearly</span><strong>' + g.yearlyPrice + ' EGP</strong></div>';
    h += '<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--border);"><span>Session</span><strong>' + (g.sessionPrice || 0) + ' EGP</strong></div>';
    h += '<h4 style="margin-top:10px;"><i class="fas fa-clock"></i> Hours</h4>';
    h += '<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--border);"><span>Opens</span><strong>' + (is24 ? '24 Hours' : ot) + '</strong></div>';
    h += '<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--border);"><span>Closes</span><strong>' + (is24 ? '24 Hours' : ct) + '</strong></div>';
    if (g.phones && g.phones.length) {
        h += '<div style="margin-top:10px;padding:8px;background:var(--light);border-radius:8px;"><strong><i class="fas fa-phone"></i> Contact:</strong> ' + g.phones.map(function(p) { return '<a href="tel:' + p + '" style="display:inline-block;margin:2px;padding:4px 8px;background:var(--card);border-radius:15px;color:var(--primary);text-decoration:none;font-weight:600;font-size:12px;">' + p + '</a>'; }).join('') + '</div>';
    }
    if (g.location) h += '<div style="margin-top:6px;"><strong><i class="fas fa-map-marker-alt"></i> Location:</strong> ' + g.location + '</div>';
    if (g.notes) h += '<div style="margin-top:6px;padding:8px;background:var(--light);border-radius:8px;">' + g.notes + '</div>';
    h += '<div style="margin-top:16px;display:flex;gap:8px;"><button class="btn btn-primary" onclick="_rs()">Subscribe</button><button class="btn btn-outline" onclick="_go(\'gyms\')">Back</button></div>';
    c.innerHTML = h;
}

async function _rs() {
    if (!_cu || !_cu.emailVerified) { _t('Login and verify email first', 'error'); _go('profile'); return; }
    if (!_sg) return;
    var ph = _cu.phone || '';
    if (!ph) { _t('Add phone in profile', 'error'); return; }
    var ps = await _d.collection('requests').where('gymId', '==', _sg.id).where('phone', '==', ph).where('status', '==', 'pending').get();
    if (!ps.empty) { _t('Pending request exists', 'warning'); return; }
    var ms = await _d.collection('members').where('gymId', '==', _sg.id).where('phone', '==', ph).where('active', '==', true).where('leftByUser', '==', false).get();
    if (!ms.empty) { _t('Already subscribed', 'warning'); return; }
    _st = 'monthly';
    var mh = '<div class="modal-overlay" id="_sm" onclick="_mo(\'_sm\')"><div class="modal-content" onclick="event.stopPropagation()"><div class="modal-header"><h3>Choose Type</h3><button class="modal-close" onclick="_mo(\'_sm\')"><i class="fas fa-times"></i></button></div><div class="modal-body"><div class="radio-group"><div class="radio-option selected" id="_om" onclick="_sst(\'monthly\')"><i class="fas fa-calendar"></i> Monthly<span style="display:block;font-size:11px;">' + (_sg.monthlyPrice || 0) + ' EGP</span></div>' + (_sg.yearlyPrice ? '<div class="radio-option" id="_oy" onclick="_sst(\'yearly\')"><i class="fas fa-calendar-alt"></i> Yearly<span style="display:block;font-size:11px;">' + _sg.yearlyPrice + ' EGP</span></div>' : '') + '</div></div><div class="modal-footer"><button class="btn btn-primary" onclick="_csr()">Confirm</button></div></div></div>';
    document.body.insertAdjacentHTML('beforeend', mh);
}

function _sst(t) {
    _st = t;
    document.querySelectorAll('.radio-option').forEach(function(o) { o.classList.remove('selected'); });
    document.getElementById(t === 'monthly' ? '_om' : '_oy').classList.add('selected');
}

async function _csr() {
    var ph = _cu.phone || '';
    var nm = _cu.fullName || '';
    await _d.collection('requests').add({ gymId: _sg.id, gymName: _sg.name, name: nm, phone: ph, subType: _st, status: 'pending', created: new Date().toISOString() });
    _mo('_sm');
    _t('Request sent!');
    _go('requests');
}