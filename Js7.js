var _ft = 'gyms';

function _sft(t) {
    _ft = t;
    var tabs = document.querySelectorAll('.forum-tab');
    tabs.forEach(function(tb) {
        tb.classList.remove('active');
        if ((t === 'gyms' && tb.textContent.includes('Gym')) || (t === 'developer' && tb.textContent.includes('Dev'))) {
            tb.classList.add('active');
        }
    });
    _lf();
}

async function _lf() {
    var c = document.getElementById('_fl');
    if (!c) return;
    c.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
    try {
        var posts = [];
        if (_ft === 'gyms') {
            var sn = await _d.collection('announcements').orderBy('createdAt', 'desc').limit(5).get();
            sn.forEach(function(d) {
                posts.push({
                    id: d.id,
                    type: 'gym',
                    sender: d.data().sender || 'Coach',
                    gymName: d.data().gymName || '',
                    message: d.data().message || '',
                    likes: d.data().likes || 0,
                    comments: d.data().comments || 0,
                    createdAt: d.data().createdAt || null
                });
            });
        } else {
            var sn = await _d.collection('updates').orderBy('createdAt', 'desc').limit(5).get();
            sn.forEach(function(d) {
                posts.push({
                    id: d.id,
                    type: 'dev',
                    author: d.data().author || 'Admin',
                    authorType: d.data().authorType || 'admin',
                    title: d.data().title || '',
                    content: d.data().content || '',
                    likes: d.data().likes || 0,
                    comments: d.data().comments || 0,
                    pinned: d.data().pinned || false,
                    createdAt: d.data().createdAt || null
                });
            });
        }
        if (!posts.length) { c.innerHTML = '<div class="card text-center"><p>No posts yet</p></div>'; return; }
        c.innerHTML = posts.map(function(p) { return _rfp(p); }).join('');
    } catch (e) { c.innerHTML = '<div class="card text-center"><p>Failed to load</p></div>'; }
}

function _rfp(p) {
    var isAdmin = p.authorType === 'admin';
    var isDev = p.authorType === 'developer';
    var pc = isAdmin ? 'admin-post' : isDev ? 'dev-post' : '';
    
    var h = '<div class="forum-post ' + pc + '">';
    h += '<div class="forum-post-header">';
    h += '<div class="forum-post-author"><i class="fas fa-user-circle"></i><span>' + (p.sender || p.author) + '</span>';
    if (isAdmin) h += '<span class="badge-role badge-admin">Admin</span>';
    if (isDev) h += '<span class="badge-role badge-dev">Dev</span>';
    if (!isAdmin && !isDev && p.type === 'gym') h += '<span class="badge-role badge-coach">' + (p.gymName || 'Coach') + '</span>';
    h += '</div><span>' + _ta(p.createdAt) + '</span></div>';
    if (p.title) h += '<h4>' + p.title + '</h4>';
    h += '<div class="forum-post-content">' + (p.message || p.content) + '</div>';
    h += '<div class="forum-post-actions">';
    h += '<span><i class="far fa-heart"></i> ' + (p.likes || 0) + '</span>';
    h += '<span><i class="far fa-comment"></i> ' + (p.comments || 0) + '</span>';
    if (_cu) {
        h += '<span class="report-btn" onclick="_rp(\'' + p.id + '\',\'' + p.type + '\')"><i class="fas fa-flag"></i> Report</span>';
    }
    h += '</div></div>';
    return h;
}

async function _rp(pid, type) {
    if (!_cu) { _t('Login to report', 'error'); return; }
    var reason = prompt('Reason for report:');
    if (!reason) return;
    var col = type === 'dev' ? 'updates' : 'announcements';
    await _d.collection('reports').add({
        targetId: pid,
        targetType: col,
        reporterId: _cu.username,
        reporterName: _cu.fullName,
        reason: reason,
        createdAt: new Date().toISOString()
    });
    
    var countSnap = await _d.collection('reports').where('targetId', '==', pid).get();
    var count = countSnap.size;
    
    if (count >= 5) {
        if (type === 'gym') {
            var postSnap = await _d.collection('announcements').doc(pid).get();
            if (postSnap.exists) {
                var postData = postSnap.data();
                if (postData.gymId) {
                    await _d.collection('gyms').doc(postData.gymId).update({
                        flagged: true,
                        reportCount: count,
                        updatedAt: new Date().toISOString()
                    });
                }
            }
        }
        await _d.collection('adminNotifications').add({
            type: 'report_threshold',
            targetId: pid,
            targetType: col,
            reportCount: count,
            message: 'Post reached ' + count + ' reports',
            read: false,
            createdAt: new Date().toISOString()
        });
    }
    
    _t('Report sent');
}

async function _lwg() {
    var s = document.getElementById('_wgs');
    if (!s) return;
    try {
        var sn = await _d.collection('gyms').where('active', '==', true).get();
        var gs = [];
        sn.forEach(function(d) { gs.push({ id: d.id, name: d.data().name || 'Unknown', warnings: d.data().warnings || 0 }); });
        var now = new Date();
        var wa = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        var bg = null, bs = -1;
        for (var i = 0; i < gs.length; i++) {
            var g = gs[i];
            var rs = await _d.collection('ratings').where('gymId', '==', g.id).where('createdAt', '>=', wa.toISOString()).get();
            var ms = await _d.collection('members').where('gymId', '==', g.id).where('created', '>=', wa.toISOString()).get();
            var rc = rs.size;
            var ar = rc > 0 ? rs.docs.reduce(function(sum, d) { return sum + d.data().rating; }, 0) / rc : 0;
            var nm = ms.size;
            var wn = g.warnings || 0;
            var sc = (ar * 0.5) + (nm * 0.3) + ((10 - Math.min(wn, 10)) * 0.2);
            if (sc > bs && rc >= 3) { bs = sc; bg = { id: g.id, name: g.name, ar: ar, nm: nm, wn: wn }; }
        }
        if (bg) {
            s.innerHTML = '<div class="week-gym-card"><div class="week-badge">Gym of the Week</div><h3>' + bg.name + '</h3><div class="week-stats"><span>' + bg.ar.toFixed(1) + ' Stars</span><span>' + bg.nm + ' New</span><span>' + bg.wn + ' Warnings</span></div><button class="btn btn-gold btn-sm" onclick="_sgd(\'' + bg.id + '\')">View Gym</button></div>';
        }
    } catch (e) { s.innerHTML = ''; }
}