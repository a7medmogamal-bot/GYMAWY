var _cp = 'home';

function _r() {
    var app = document.getElementById('app');
    if (!app) return;
    
    var h = '';
    
    h += '<header class="header">';
    h += '<div class="header-logo" onclick="_go(\'home\')"><i class="fas fa-dumbbell"></i> Gymawy</div>';
    h += '<div class="header-actions">';
    h += '<button class="icon-btn" onclick="_td()"><i class="fas ' + (document.body.classList.contains('dark') ? 'fa-sun' : 'fa-moon') + '"></i></button>';
    h += '<button class="icon-btn" onclick="_go(\'notifications\')"><i class="fas fa-bell"></i></button>';
    h += '<button class="icon-btn" onclick="_go(' + (_cu ? "'profile'" : "'login'") + ')"><i class="fas fa-user"></i></button>';
    h += '<button class="icon-btn" onclick="_os()"><i class="fas fa-bars"></i></button>';
    h += '</div></header>';
    
    h += '<div class="sidebar-overlay" id="_so" onclick="_cs()"></div>';
    h += '<aside class="sidebar" id="_sb">';
    h += '<div class="sidebar-header"><h3>Gymawy</h3><button class="sidebar-close" onclick="_cs()"><i class="fas fa-times"></i></button></div>';
    h += '<div class="sidebar-menu">';
    h += '<div class="sidebar-item" onclick="_go(\'home\');_cs();"><i class="fas fa-home"></i> Home</div>';
    h += '<div class="sidebar-item" onclick="_go(\'about\');_cs();"><i class="fas fa-info-circle"></i> About</div>';
    h += '<div class="sidebar-item" onclick="_go(\'how\');_cs();"><i class="fas fa-play-circle"></i> How It Works</div>';
    h += '<div class="sidebar-item" onclick="_go(\'faq\');_cs();"><i class="fas fa-question-circle"></i> FAQ</div>';
    h += '<div class="sidebar-item" onclick="_go(\'privacy\');_cs();"><i class="fas fa-shield-alt"></i> Privacy</div>';
    h += '<div class="sidebar-item" onclick="_go(\'download\');_cs();"><i class="fas fa-download"></i> Download</div>';
    if (_cu) {
        h += '<div class="sidebar-divider"></div>';
        h += '<div class="sidebar-item" onclick="_go(\'achievements\');_cs();"><i class="fas fa-trophy"></i> Achievements</div>';
        h += '<div class="sidebar-item" onclick="_lo();_cs();"><i class="fas fa-sign-out-alt"></i> Logout</div>';
    }
    h += '</div><div class="sidebar-footer">2026 Gymawy</div></aside>';
    
    if (_cp !== 'coach' && _cp !== 'admin') {
        h += '<nav class="nav-bar">';
        h += '<div class="nav-item ' + (_cp === 'home' ? 'active' : '') + '" onclick="_go(\'home\')"><i class="fas fa-home"></i> Home</div>';
        h += '<div class="nav-item ' + (_cp === 'gyms' ? 'active' : '') + '" onclick="_go(\'gyms\')"><i class="fas fa-dumbbell"></i> Gyms</div>';
        h += '<div class="nav-item ' + (_cp === 'requests' ? 'active' : '') + '" onclick="_go(\'requests\')"><i class="fas fa-clipboard-list"></i> Requests</div>';
        h += '<div class="nav-item ' + (_cp === 'profile' ? 'active' : '') + '" onclick="_go(\'profile\')"><i class="fas fa-user"></i> Profile</div>';
        h += '</nav>';
    }
    
    h += '<div class="container" id="_mc">';
    h += _rp();
    h += '</div>';
    
    h += '<footer class="footer">';
    h += '<div class="footer-links">';
    h += '<a href="#" onclick="_go(\'home\')">Home</a>';
    h += '<a href="#" onclick="_go(\'gyms\')">Gyms</a>';
    h += '<a href="#" onclick="_go(\'about\')">About</a>';
    h += '<a href="#" onclick="_go(\'privacy\')">Privacy</a>';
    h += '</div>';
    h += '<div class="footer-contact"><i class="fas fa-envelope"></i> ' + _w.e + '</div>';
    h += '<div class="footer-social"><a href="https://instagram.com/gymawy" target="_blank"><i class="fab fa-instagram"></i></a></div>';
    h += '<div class="footer-copy">2026 Gymawy - All Rights Reserved</div>';
    h += '</footer>';
    
    h += '<div id="_tc"></div>';
    
    app.innerHTML = h;
    _ld();
}

function _rp() {
    switch (_cp) {
        case 'home': return _rh();
        case 'gyms': return _rg();
        case 'gym-details': return '<div id="_gdc"><div class="loading"><div class="spinner"></div></div></div>';
        case 'requests': return '<div id="_rc"><div class="loading"><div class="spinner"></div></div></div>';
        case 'profile': return '<div id="_pc"><div class="loading"><div class="spinner"></div></div></div>';
        case 'login': return _rl();
        case 'register': return _rr();
        case 'verify': return _rv();
        case 'forgot': return _rf();
        case 'about': return '<div class="card"><h3>About Gymawy</h3><p>Smart gym platform connecting seekers with owners across Egypt.</p></div>';
        case 'how': return '<div class="card"><h3>How It Works</h3><p>1. Register<br>2. Browse Gyms<br>3. Subscribe</p></div>';
        case 'faq': return '<div class="card"><h3>FAQ</h3><p>Common questions and answers.</p></div>';
        case 'privacy': return '<div class="card"><h3>Privacy Policy</h3><p>Your privacy matters to us.</p></div>';
        case 'download': return '<div class="card text-center"><h3>Download App</h3><button class="btn btn-primary" onclick="_ip()">Install PWA</button></div>';
        case 'coach': return _rcp();
        case 'admin': return '<div id="_ac"><div class="loading"><div class="spinner"></div></div></div>';
        case 'achievements': return '<div class="card"><h3>Achievements</h3><p>Rating 4.9+ this month = 10% discount coupon</p></div>';
        case 'notifications': return '<div class="card"><h3>Notifications</h3><p>No new notifications.</p></div>';
        default: return _rh();
    }
}

function _rh() {
    return '<div class="hero-card" onclick="_go(\'gyms\')"><div class="hero-icon"><i class="fas fa-dumbbell"></i></div><h2>Gyms</h2><p>Browse and subscribe to the best gyms near you</p></div>' +
        '<div class="sub-cards"><div class="sub-card locked"><i class="fas fa-capsules"></i><h4>Supplements</h4><span class="locked-badge"><i class="fas fa-lock"></i> Soon</span></div><div class="sub-card locked"><i class="fas fa-user-tie"></i><h4>Private Trainer</h4><span class="locked-badge"><i class="fas fa-lock"></i> Soon</span></div></div>' +
        '<div id="_wgs"></div>' +
        '<div class="forums-section"><div class="forums-tabs"><button class="forum-tab active" onclick="_sft(\'gyms\')">Gym Forums</button><button class="forum-tab" onclick="_sft(\'developer\')">Dev Forum</button></div><div id="_fl"><div class="loading"><div class="spinner"></div></div></div></div>';
}

function _rg() {
    return '<div class="search-box" style="margin-bottom:12px;"><i class="fas fa-search" style="color:var(--gray-light);"></i><input type="text" id="_si" placeholder="Search gyms..." oninput="_lg()"></div>' +
        '<div class="filters-panel"><div class="filter-row"><span style="font-size:12px;font-weight:600;">Price:</span><input type="number" id="_pmi" placeholder="Min" class="form-control" style="width:80px;padding:6px 8px;font-size:11px;" onchange="_lg()"><span>-</span><input type="number" id="_pma" placeholder="Max" class="form-control" style="width:80px;padding:6px 8px;font-size:11px;" onchange="_lg()"></div><div class="filter-row"><span style="font-size:12px;font-weight:600;">Rating:</span><div class="rating-stars-filter" id="_rf">' + [1,2,3,4,5].map(function(i) { return '<i class="fas fa-star" onclick="_srf(' + i + ')"></i>'; }).join('') + '</div></div><div class="filter-row"><span style="font-size:12px;font-weight:600;">Open Now:</span><label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:12px;"><input type="checkbox" id="_of" onchange="_lg()">Yes</label></div></div>' +
        '<div id="_gl"><div class="loading"><div class="spinner"></div></div></div>';
}

function _rl() {
    return '<div class="card" style="max-width:400px;margin:20px auto;"><h3 style="text-align:center;">Login</h3><div class="form-group"><label>Username</label><input type="text" id="_liu" class="form-control" placeholder="Enter username" style="text-transform:uppercase;"></div><div class="form-group"><label>Password</label><input type="password" id="_lip" class="form-control" placeholder="Enter password"></div><button class="btn btn-primary btn-block" onclick="_hlog()">Login</button><div class="auth-links" style="text-align:center;margin-top:12px;"><span onclick="_go(\'register\')" style="cursor:pointer;color:var(--primary);font-weight:700;">Create Account</span> | <span onclick="_go(\'forgot\')" style="cursor:pointer;color:var(--primary);font-weight:700;">Forgot Password?</span></div></div>';
}

function _rr() {
    return '<div class="card" style="max-width:400px;margin:20px auto;"><h3 style="text-align:center;">Register</h3><div class="form-group"><label>Full Name</label><input type="text" id="_rfn" class="form-control" placeholder="Enter full name"></div><div class="form-group"><label>Phone</label><input type="tel" id="_rph" class="form-control" placeholder="+20"></div><div class="form-group"><label>Email</label><input type="email" id="_rem" class="form-control" placeholder="example@mail.com"></div><div class="form-group"><label>Username</label><input type="text" id="_run" class="form-control" placeholder="6-16 characters" style="text-transform:uppercase;"></div><div class="form-group"><label>Password</label><input type="password" id="_rpw" class="form-control" placeholder="6+ characters"></div><div class="form-group"><label>Confirm Password</label><input type="password" id="_rpc" class="form-control" placeholder="Re-enter password"></div><button class="btn btn-primary btn-block" onclick="_hreg()">Register</button><p style="text-align:center;margin-top:12px;"><span onclick="_go(\'login\')" style="cursor:pointer;color:var(--primary);font-weight:700;">Already have account? Login</span></p></div>';
}

function _rv() {
    return '<div class="card" style="max-width:400px;margin:20px auto;text-align:center;"><h3>Verify Email</h3><p>Enter code sent to your email</p><div class="form-group"><input type="text" id="_vci" class="form-control" placeholder="6-digit code" maxlength="6" style="text-align:center;font-size:22px;letter-spacing:8px;"></div><button class="btn btn-primary btn-block" onclick="_hver()">Verify</button></div>';
}

function _rf() {
    return '<div class="card" style="max-width:400px;margin:20px auto;"><h3 style="text-align:center;">Forgot Password</h3><div class="form-group"><label>Email</label><input type="email" id="_fei" class="form-control" placeholder="Enter your email"></div><button class="btn btn-warning btn-block" onclick="_hfp()">Send Code</button><div id="_ra" style="margin-top:16px;border-top:1px solid var(--border);padding-top:16px;"></div></div>';
}

function _rcp() {
    return '<div class="tabs">' +
        '<button class="tab-btn active" onclick="_stb(\'gym\')">Gym</button>' +
        '<button class="tab-btn" onclick="_stb(\'requests\')">Requests <span id="_rb" style="display:none;background:var(--danger);color:white;padding:2px 8px;border-radius:10px;font-size:10px;">0</span></button>' +
        '<button class="tab-btn" onclick="_stb(\'members\')">Members</button>' +
        '<button class="tab-btn" onclick="_stb(\'sessions\')">Sessions</button>' +
        '<button class="tab-btn" onclick="_stb(\'stats\')">Stats</button>' +
        '</div>' +
        '<div class="tab-content active" id="_t-gym">' +
        '<div class="form-card"><h3>Gym Data</h3>' +
        '<div class="form-group"><label>Name</label><input type="text" id="_gn" class="form-control"></div>' +
        '<div class="form-group"><label>Images</label><div class="images-grid" id="_ig"></div><input type="file" id="_ii" accept="image/*" multiple style="display:none;" onchange="_uii(this)"></div>' +
        '<div class="form-row"><div class="form-group"><label>Monthly Price</label><input type="number" id="_gmp" class="form-control"></div><div class="form-group"><label>Yearly Price</label><input type="number" id="_gyp" class="form-control"></div></div>' +
        '<div class="form-row"><div class="form-group"><label>Session Price</label><input type="number" id="_gsp" class="form-control"></div><div class="form-group"><label>Offer Price</label><input type="number" id="_gop" class="form-control"></div></div>' +
        '<div class="form-row"><div class="form-group"><label>Opens</label><input type="time" id="_got" class="form-control"></div><div class="form-group"><label>Closes</label><input type="time" id="_gct" class="form-control"></div></div>' +
        '<div class="form-group"><label>Phones</label><div class="phones-list" id="_pl"></div><div class="add-phone-btn" onclick="_ap()">Add Phone</div></div>' +
        '<div class="form-group"><label>Location</label><input type="text" id="_glc" class="form-control"></div>' +
        '<div class="form-group"><label>Notes</label><textarea id="_gnt" class="form-control" rows="2"></textarea></div>' +
        '<button class="btn btn-primary" onclick="_sg()">Save</button></div></div>' +
        '<div class="tab-content" id="_t-requests"><div id="_rl"></div></div>' +
        '<div class="tab-content" id="_t-members"><button class="btn btn-success btn-sm" onclick="_sam()" style="margin-bottom:8px;">Add Member</button><input type="text" id="_msi" class="form-control" placeholder="Search..." oninput="_lm()" style="margin-bottom:8px;"><div id="_ml"></div></div>' +
        '<div class="tab-content" id="_t-sessions"><div class="form-group"><label>Date</label><input type="date" id="_sd" class="form-control" onchange="_lss()"></div><div style="display:flex;gap:8px;margin-bottom:8px;"><div class="form-card" style="flex:1;text-align:center;"><div style="font-size:22px;font-weight:800;color:var(--primary);" id="_sc">0</div><div>Sessions</div></div><div class="form-card" style="flex:1;text-align:center;"><div style="font-size:22px;font-weight:800;color:var(--primary);" id="_st">0 EGP</div><div>Total</div></div></div><button class="btn btn-primary btn-sm" onclick="_ass()" style="margin-bottom:8px;">Add Session</button><div id="_sl"></div></div>' +
        '<div class="tab-content" id="_t-stats"><div id="_stc"><div class="loading"><div class="spinner"></div></div></div></div>';
}

function _ld() {
    if (_cp === 'home') { _lwg(); _lf(); }
    if (_cp === 'gyms') { _lg(); }
    if (_cp === 'gym-details') { _lgd(); }
    if (_cp === 'requests') { _lrq(); }
    if (_cp === 'profile') { _lpf(); }
    if (_cp === 'coach') { _lcf(); _lp(); _li(); _lrc(); _lss(); _lst(); }
    if (_cp === 'admin') { _la(); }
}

function _ip() {
    if (window._dp) {
        window._dp.prompt();
        window._dp.userChoice.then(function(r) {
            if (r.outcome === 'accepted') _t('App installed!');
            window._dp = null;
        });
    } else {
        _t('Tap Share then Add to Home Screen', 'warning');
    }
}

window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    window._dp = e;
});