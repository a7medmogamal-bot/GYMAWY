(function() {
    var saved = localStorage.getItem('_ua');
    if (saved) {
        try { _cu = JSON.parse(saved); } catch (e) { _cu = null; }
    }
    
    var ci = localStorage.getItem('_ci');
    if (ci) {
        _d.collection('gyms').doc(ci).get().then(function(sn) {
            if (sn.exists && sn.data().active) {
                _cg = { id: sn.id, name: sn.data().name || 'Gym', monthlyPrice: sn.data().monthlyPrice || 0, yearlyPrice: sn.data().yearlyPrice || 0, sessionPrice: sn.data().sessionPrice || 0, offerPrice: sn.data().offerPrice || null, location: sn.data().location || '', notes: sn.data().notes || '', openTime: sn.data().openTime || '', closeTime: sn.data().closeTime || '', images: sn.data().images || [], phones: sn.data().phones || [], verified: sn.data().verified || false, active: sn.data().active || false, subEnd: sn.data().subEnd || null, warnings: sn.data().warnings || 0 };
                _ci = sn.id;
                _cp = 'coach';
                _r();
            } else {
                localStorage.removeItem('_ci');
            }
        });
        return;
    }
    
    var ad = localStorage.getItem('_ad');
    if (ad === '1') {
        _cp = 'admin';
        _r();
        return;
    }
    
    if (localStorage.getItem('_dm') === '1') {
        document.body.classList.add('dark');
    }
    
    _r();
    
    window.addEventListener('online', function() { _t('Back online'); });
    window.addEventListener('offline', function() { _t('No internet', 'error'); });
})();

async function _lrq() {
    var c = document.getElementById('_rc');
    if (!c) return;
    if (!_cu || !_cu.emailVerified) { c.innerHTML = '<div class="card text-center"><p>Login to view requests</p></div>'; return; }
    var ph = _cu.phone || '';
    var sn = await _d.collection('requests').where('phone', '==', ph).get();
    var rs = [];
    sn.forEach(function(d) { rs.push({ id: d.id, name: d.data().gymName || 'Unknown', status: d.data().status || 'pending', subType: d.data().subType || 'monthly', created: d.data().created || null }); });
    if (!rs.length) { c.innerHTML = '<div class="card text-center"><p>No requests</p></div>'; return; }
    c.innerHTML = rs.reverse().map(function(r) {
        var st = r.status === 'pending' ? '<span style="color:var(--warning);">Pending</span>' : r.status === 'accepted' ? '<span style="color:var(--success);">Accepted</span>' : '<span style="color:var(--danger);">Rejected</span>';
        return '<div style="background:var(--card);border-radius:10px;padding:10px;margin-bottom:6px;display:flex;justify-content:space-between;"><div><strong>' + r.name + '</strong><div style="font-size:11px;">' + _f(r.created) + ' | ' + (r.subType === 'monthly' ? 'Monthly' : 'Yearly') + '</div></div>' + st + '</div>';
    }).join('');
}

async function _lpf() {
    var c = document.getElementById('_pc');
    if (!c) return;
    if (!_cu) { c.innerHTML = _rl(); return; }
    if (!_cu.emailVerified) {
        c.innerHTML = '<div class="card" style="text-align:center;"><i class="fas fa-user-circle" style="font-size:50px;color:var(--primary);margin-bottom:12px;"></i><h3>' + (_cu.fullName || 'User') + '</h3><p>' + (_cu.username || '') + '</p><p>' + (_cu.email || '') + '</p><p style="color:var(--danger);">Not verified</p><button class="btn btn-primary btn-sm" onclick="_go(\'verify\')">Verify Now</button><br><button class="btn btn-outline btn-sm" onclick="_lo()" style="margin-top:8px;">Logout</button></div>';
        return;
    }
    var ms = await _d.collection('members').where('phone', '==', _cu.phone || '').get();
    var members = [];
    ms.forEach(function(d) { members.push({ id: d.id, gymName: d.data().gymName || 'Unknown', type: d.data().type || 'monthly', start: d.data().start || null, due: d.data().due || null, paid: d.data().paid || false, active: d.data().active || false, leftByUser: d.data().leftByUser || false }); });
    var active = members.filter(function(m) { return m.active && !m.leftByUser; });
    var hist = members.filter(function(m) { return !m.active || m.leftByUser; });
    var h = '<div style="background:var(--card);border-radius:16px;padding:16px;text-align:center;margin-bottom:12px;box-shadow:var(--shadow);"><i class="fas fa-user-circle" style="font-size:46px;color:var(--primary);"></i><h2>' + (_cu.fullName || 'User') + '</h2><p>' + (_cu.username || '') + '</p><p>' + (_cu.phone || '') + '</p><p>' + (_cu.email || '') + ' <span style="color:var(--success);">Verified</span></p><button class="btn btn-outline btn-sm" onclick="_lo()">Logout</button></div>';
    if (active.length) {
        h += '<h3>Active Subscriptions</h3>';
        active.forEach(function(m) {
            var ok = m.paid && !_x(m.due);
            var rd = _dr(m.due);
            var sn = rd <= 3 && rd > 0 && ok;
            h += '<div style="background:linear-gradient(135deg,var(--primary),var(--primary-dark));border-radius:16px;padding:14px;color:white;margin-bottom:8px;"><div style="font-size:16px;font-weight:800;">' + m.gymName + '</div><div style="background:rgba(255,255,255,0.15);border-radius:8px;padding:8px;margin:6px 0;"><div style="display:flex;justify-content:space-between;font-size:12px;"><span>Start</span><span>' + _f(m.start) + '</span></div><div style="display:flex;justify-content:space-between;font-size:12px;"><span>Due</span><span>' + _f(m.due) + '</span></div></div>' + (sn ? '<div style="background:rgba(255,193,7,0.3);padding:6px;border-radius:8px;font-size:11px;margin-bottom:4px;">' + rd + ' ' + (rd === 1 ? 'day' : 'days') + ' left</div>' : '') + '<span style="display:inline-block;padding:3px 8px;border-radius:12px;font-size:11px;background:' + (ok ? 'rgba(0,184,148,0.3)' : 'rgba(255,107,107,0.3)') + ';">' + (ok ? 'Paid' : 'Overdue') + '</span></div>';
        });
    }
    if (hist.length) {
        h += '<h3>History</h3>';
        hist.forEach(function(m) {
            h += '<div style="background:var(--card);border-radius:8px;padding:8px;margin-bottom:4px;font-size:12px;color:var(--text-secondary);"><strong>' + m.gymName + '</strong> - ' + (m.leftByUser ? 'Left' : 'Expired') + ' ' + _f(m.due) + '</div>';
        });
    }
    c.innerHTML = h;
}