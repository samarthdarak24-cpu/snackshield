const API_URL = "http://127.0.0.1:5001";
let html5QrCode = null;
let scannerRunning = false;

const state = {
    token: localStorage.getItem("token"),
    user: JSON.parse(localStorage.getItem("user") || "null"),
    currentView: "home",
    viewHistory: [],
    viewLoadTime: Date.now(),
    charts: {},
    fullHistory: []
};

// ─── INIT ─────────────────────────────────────────────────
window.onload = async () => {
    // DEV MODE: Auto-login to bypass auth wall for demo
    if (!state.token) {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method:'POST', headers:{'Content-Type':'application/json'},
                body: JSON.stringify({ username:'admin', password:'admin123' })
            });
            if (res.ok) {
                const data = await res.json();
                state.token = "Bearer " + data.token;
                state.user = { username: data.username, role: data.role };
                localStorage.setItem("token", state.token);
                localStorage.setItem("user", JSON.stringify(state.user));
            }
        } catch(e) { console.error("Auto-login failed", e); }
    }

    updateUI();
    const hash = window.location.hash.replace("#", "") || "home";
    route(hash, false);

    if (hash === 'home' && state.token) loadDashboard();
};

function updateUI() {
    const isAuth = !!state.token;
    const isAdmin = state.user && state.user.role === 'admin';
    document.querySelectorAll('.auth-only').forEach(el => el.style.display = isAuth ? 'flex' : 'none');
    document.querySelectorAll('.guest-only').forEach(el => el.style.display = isAuth ? 'none' : 'flex');
    document.querySelectorAll('.admin-only').forEach(el => el.style.display = isAdmin ? 'flex' : 'none');
}

// ─── ROUTING ──────────────────────────────────────────────
function route(view, push = true) {
    if (view !== state.currentView && push) state.viewHistory.push(state.currentView);
    if (view !== 'verify') stopScanner();

    // Reset active classes
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));

    const target  = document.getElementById(`view-${view}`);
    const navLink = document.getElementById(`nav-${view}`);

    if (target)  target.classList.add('active');
    if (navLink) navLink.classList.add('active');

    const titles = { 
        home: 'Executive Dashboard', 
        verify: 'Product Authentication', 
        dashboard: 'Security Intelligence', 
        history: 'Audit Log Retrieval',
        ai: 'Neural Analytics Engine', 
        products: 'Asset Provisioning', 
        companies: 'Network Partners', 
        distributors: 'Distributor Intelligence', 
        clusters: 'Geospatial Threat Map', 
        login: 'Operator Gateway'
    };
    
    document.getElementById('page-title').textContent = titles[view] || view;

    state.currentView = view;
    state.viewLoadTime = Date.now();
    if (push) window.location.hash = view;

    // Load Data
    if (state.token) {
        if (view === 'home') loadDashboard();
        if (view === 'dashboard') loadAnalytics();
        if (view === 'companies') loadCompanies();
        if (view === 'products') { loadCompaniesForSelect(); loadProducts(); }
        if (view === 'history') loadHistory();
        if (view === 'ai') loadForecast();
        if (view === 'distributors') loadDistributors();
        if (view === 'clusters') loadClusters();
    }
    
    if (view === 'verify') startScanner();

    // Scroll to top
    document.getElementById('main-content').scrollTop = 0;
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
}

function handleGlobalSearch(e) {
    const q = e.target.value.toLowerCase();
    if (q.length < 3) return;
    if (q.includes('scan') || q.includes('verify')) route('verify');
    if (q.includes('batch') || q.includes('product')) route('products');
    if (q.includes('fraud') || q.includes('map')) route('clusters');
}

// ─── AUTH ─────────────────────────────────────────────────
async function handleLogin(e) {
    e.preventDefault();
    const u = document.getElementById('login-username').value.trim();
    const p = document.getElementById('login-password').value;
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ username:u, password:p })
        });
        const data = await res.json();
        if (res.ok) {
            state.token = "Bearer " + data.token;
            state.user = { username: data.username, role: data.role };
            localStorage.setItem("token", state.token);
            localStorage.setItem("user", JSON.stringify(state.user));
            updateUI();
            route('home');
            showToast('✅ Access Granted. Welcome, Operator.', 'success');
        } else {
            showToast('❌ ' + data.message, 'danger');
        }
    } catch(err) { showToast('❌ Gateway connection failure.', 'danger'); }
}

function handleLogout() {
    localStorage.clear();
    state.token = null; state.user = null;
    updateUI();
    route('login', false);
    showToast('👋 Session terminated successfully.', 'info');
}

function handleUserBadgeClick() {
    if (!state.token) route('login');
    else if (confirm("Terminate current session?")) handleLogout();
}

// ─── DATA LOADING ─────────────────────────────────────────

async function loadDashboard() {
    try {
        const res = await fetch(`${API_URL}/api/stats`, { headers:{'Authorization':state.token} });
        const data = await res.json();
        
        animateValue("stat-total-scans", data.metrics.total_scans);
        animateValue("stat-fake-detected", data.metrics.fake_detected);
        animateValue("stat-suspicious", data.metrics.suspicious_alerts);
        // Products and Batches are in separate metrics or static for now
        animateValue("stat-total-products", 124); 
        animateValue("stat-total-batches", 45);

        initCharts(data.charts);
        loadRecentScans();
    } catch(e) { console.error(e); }
}

async function loadAnalytics() {
    try {
        const res = await fetch(`${API_URL}/api/stats`, { headers:{'Authorization':state.token} });
        const data = await res.json();
        initAnalyticsCharts(data);
    } catch(e) {}
}

function animateValue(id, end) {
    const el = document.getElementById(id);
    if (!el) return;
    const start = 0;
    const duration = 1500;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        el.innerText = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function initCharts(data) {
    const ctx1 = document.getElementById('chart-daily-scans');
    if (ctx1) {
        if (state.charts.daily) state.charts.daily.destroy();
        state.charts.daily = new Chart(ctx1, {
            type: 'line',
            data: {
                labels: data.daily_labels,
                datasets: [{
                    label: 'Verification Scans',
                    data: data.daily_data,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.05)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 3,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#2563eb',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#f1f5f9' }, border: { display: false }, ticks: { color: '#64748b', font: { size: 11 } } },
                    x: { grid: { display: false }, border: { display: false }, ticks: { color: '#64748b', font: { size: 11 } } }
                }
            }
        });
    }

    const ctx2 = document.getElementById('chart-risk-dist');
    if (ctx2) {
        if (state.charts.risk) state.charts.risk.destroy();
        state.charts.risk = new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: ['Genuine', 'Suspicious', 'High Risk'],
                datasets: [{
                    data: data.risk_distribution,
                    backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20, color: '#475569', font: { size: 12, weight: '500' } } }
                }
            }
        });
    }
}

function initAnalyticsCharts(data) {
    const ctxReg = document.getElementById('chart-analytics-regions');
    if (ctxReg) {
        new Chart(ctxReg, {
            type: 'bar',
            data: {
                labels: ['North America', 'EMEA', 'APAC', 'LATAM'],
                datasets: [{
                    label: 'Fraud Clusters',
                    data: [12, 19, 34, 15],
                    backgroundColor: '#2563eb',
                    borderRadius: 4
                }]
            },
            options: { 
                responsive: true, maintainAspectRatio: false,
                scales: {
                    y: { grid: { color: '#f1f5f9' }, ticks: { color: '#64748b' } },
                    x: { grid: { display: false }, ticks: { color: '#64748b' } }
                },
                plugins: { legend: { display: false } }
            }
        });
    }
}

async function loadRecentScans() {
    try {
        const res = await fetch(`${API_URL}/api/recent_scans`, { headers:{'Authorization':state.token} });
        const records = await res.json();
        const grid = document.getElementById('recent-scans-grid');
        if (!grid) return;
        grid.innerHTML = (records || []).slice(0, 5).map(r => `
            <div style="padding:16px 32px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
                <div style="display:flex;align-items:center;gap:16px">
                    <div style="width:10px;height:10px;border-radius:50%;background:${r.risk <= 30 ? 'var(--success)' : 'var(--danger)'}"></div>
                    <div>
                        <div style="font-weight:600">${r.name}</div>
                        <div style="font-size:12px;color:var(--text-secondary)">${r.city} &bull; ${r.time}</div>
                    </div>
                </div>
                <div class="badge ${r.risk <= 30 ? 'badge-success' : 'badge-danger'}">${r.risk}% RISK</div>
            </div>
        `).join('') || '<div style="padding:3rem;text-align:center;color:var(--text-muted)">No fraud anomalies detected in this quadrant.</div>';
    } catch(e) {}
}

// ─── SCANNER ──────────────────────────────────────────────
async function startScanner() {
    if (scannerRunning) return;
    html5QrCode = new Html5Qrcode("reader");
    try {
        await html5QrCode.start(
            { facingMode: "environment" },
            { fps: 15, qrbox: { width: 280, height: 280 } },
            (text) => { verifySnack(text); stopScanner(); }
        );
        scannerRunning = true;
    } catch(e) { console.warn("Hardware Access Denied:", e); }
}

async function stopScanner() {
    if (html5QrCode && scannerRunning) {
        try { await html5QrCode.stop(); } catch(e) {}
        scannerRunning = false;
    }
}

function manualVerify() {
    const pid = document.getElementById('verify-pid-input').value.trim();
    if (pid) verifySnack(pid);
    else showToast('⚠️ Identification string required.', 'warning');
}

async function verifySnack(pid) {
    const resDiv = document.getElementById('verify-result');
    resDiv.innerHTML = `
        <div style="text-align:center">
            <div style="width:50px;height:50px;border:4px solid var(--primary);border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 20px"></div>
            <h3 style="color:var(--primary)">Neural Audit in Progress...</h3>
            <p style="color:var(--text-secondary);font-size:14px;margin-top:10px">Analyzing temporal and spatial vectors</p>
        </div>
        <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
    `;

    let loc = "Unknown";
    try {
        const p = await new Promise((rs, rj) => navigator.geolocation.getCurrentPosition(rs, rj, { timeout: 3000 }));
        loc = `${p.coords.latitude.toFixed(2)},${p.coords.longitude.toFixed(2)}`;
    } catch(e) {}

    try {
        const res  = await fetch(`${API_URL}/api/verify`, {
            method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ product_id: pid, location: loc, interaction_time: 1250 })
        });
        const data = await res.json();
        const badgeClass = data.riskScore <= 30 ? 'badge-success' : (data.riskScore <= 60 ? 'badge-warning' : 'badge-danger');
        
        resDiv.innerHTML = `
            <div class="fade-in" style="width:100%;padding:2rem">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem">
                    <span class="badge ${badgeClass}">${data.status} AUDIT</span>
                    <span style="font-size:12px;color:var(--text-muted);font-family:monospace">${data.executionTime}s latency</span>
                </div>
                <h2 style="color:var(--text-primary);margin-bottom:1.5rem;text-align:center">${data.message}</h2>
                <div class="card" style="background:var(--bg-primary);margin-bottom:2rem">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
                        <div>
                            <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;font-weight:700">Serial ID</div>
                            <div style="font-family:monospace;font-size:14px;font-weight:600">${pid}</div>
                        </div>
                        <div>
                            <div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;font-weight:700">Risk Confidence</div>
                            <div style="font-size:14px;font-weight:600">${data.confidence}% Accuracy</div>
                        </div>
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                    <button class="btn btn-primary" onclick="route('verify')">Initialize New Scan Cycle</button>
                    <button class="btn btn-secondary" onclick="copyToClipboard('${pid}')">Copy Serial ID</button>
                </div>
            </div>
        `;
        showToast('✅ Verification complete.', 'success');
    } catch(err) {
        showToast('❌ Neural engine timeout.', 'danger');
    }
}

// ─── TABLES & MODULES ─────────────────────────────────────

async function loadHistory() {
    try {
        const res = await fetch(`${API_URL}/api/history`, { headers:{'Authorization':state.token} });
        state.fullHistory = await res.json();
        renderHistory(state.fullHistory);
    } catch(e) {}
}

function renderHistory(items) {
    const body = document.getElementById('history-list-body');
    if (!body) return;
    body.innerHTML = items.map(h => `
        <tr>
            <td style="color:var(--text-secondary);font-size:13px font-family:monospace">${h.time}</td>
            <td style="font-family:monospace;font-weight:600">${h.pid}</td>
            <td>${h.loc}</td>
            <td><span class="badge ${h.risk <= 30 ? 'badge-success' : h.risk <= 60 ? 'badge-warning' : 'badge-danger'}">${h.risk}%</span></td>
            <td style="font-weight:600">${h.res}</td>
        </tr>
    `).join('') || '<tr><td colspan="5" style="text-align:center;padding:3rem">Zero telemetry records found.</td></tr>';
}

function filterHistory() {
    const q = document.getElementById('history-search').value.toLowerCase();
    const resF = document.getElementById('history-filter-result').value;
    let filtered = state.fullHistory;
    if (q) filtered = filtered.filter(h => h.pid.toLowerCase().includes(q) || h.loc.toLowerCase().includes(q));
    if (resF) filtered = filtered.filter(h => h.res === resF);
    renderHistory(filtered);
}

async function loadForecast() {
    try {
        const s = await (await fetch(`${API_URL}/api/ai/stability`, { headers:{'Authorization':state.token} })).json();
        document.getElementById('stability-score').textContent = s.health + "%";
        document.getElementById('active-threats').textContent = s.threats;
        
        const f = await (await fetch(`${API_URL}/api/ai/forecast`, { headers:{'Authorization':state.token} })).json();
        const fc = document.getElementById('forecast-container');
        if (fc) fc.innerHTML = f.map(x => `
            <div class="card hover-lift">
                <div class="badge ${x.risk_probability > 50 ? 'badge-danger' : 'badge-warning'}" style="margin-bottom:12px">${x.risk_probability}% RISK</div>
                <div style="font-weight:700;font-size:15px;margin-bottom:4px">${x.product}</div>
                <div style="font-size:12px;color:var(--text-secondary)">${x.reason}</div>
            </div>
        `).join('') || '<p style="grid-column:1/-1;text-align:center;color:var(--text-muted)">Neural engine learning...</p>';
    } catch(e) {}
}

async function loadCompanies() {
    try {
        const res = await fetch(`${API_URL}/api/companies`, { headers:{'Authorization':state.token} });
        const comps = await res.json();
        const el = document.getElementById('companies-list');
        if (!el) return;
        el.innerHTML = comps.map(c => `
            <div class="card" style="padding:16px;display:flex;justify-content:space-between;align-items:center">
                <div>
                    <div style="font-weight:700;font-size:15px">${c.name}</div>
                    <div style="font-size:12px;color:var(--text-muted)">${c.license}</div>
                </div>
                <span class="badge badge-info">${c.code}</span>
            </div>
        `).join('') || '<p style="color:var(--text-muted);text-align:center">No authorized partners found.</p>';
    } catch(e) {}
}

async function loadCompaniesForSelect() {
    try {
        const res = await fetch(`${API_URL}/api/companies`, { headers:{'Authorization':state.token} });
        const comps = await res.json();
        document.getElementById('prod-comp-id').innerHTML = '<option value="">Select Entity...</option>' + 
            comps.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    } catch(e) {}
}

async function loadProducts() {
    try {
        const res = await fetch(`${API_URL}/api/products`, { headers:{'Authorization':state.token} });
        const prods = await res.json();
        document.getElementById('prod-list-body').innerHTML = prods.map(p => `
            <tr>
                <td style="font-family:monospace;font-size:12px">${p.product_id}</td>
                <td style="font-weight:600">${p.name}</td>
                <td>${p.company}</td>
                <td><span class="badge ${p.trust_score >= 70 ? 'badge-success' : 'badge-warning'}">${p.trust_score}%</span></td>
                <td style="font-size:12px;color:var(--text-secondary)">${p.exp}</td>
                <td>
                    <div style="display:flex;gap:8px">
                        <button class="btn btn-secondary" style="padding:6px 12px;font-size:11px" onclick="showQRModal('${p.product_id}')">Scan QR</button>
                        <button class="btn btn-danger" style="padding:6px 12px;font-size:11px" onclick="deleteProd(${p.id})">Remove</button>
                    </div>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="6" style="text-align:center;padding:2rem">Zero assets provisioned.</td></tr>';
    } catch(e) {}
}

async function addProduct(e) {
    e.preventDefault();
    const payload = {
        company_id: document.getElementById('prod-comp-id').value,
        product_name: document.getElementById('prod-name').value,
        batch_number: document.getElementById('prod-batch').value,
        mfg_date: document.getElementById('prod-mfg').value,
        exp_date: document.getElementById('prod-exp').value
    };
    try {
        const res = await fetch(`${API_URL}/api/products`, {
            method:'POST', headers:{'Content-Type':'application/json','Authorization':state.token},
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
            showToast('✅ Asset provisioned successfully.', 'success');
            loadProducts();
            showQRPanel(data.product_id, data.qr);
            e.target.reset();
        } else {
            showToast('❌ Provisioning failed: ' + data.message, 'danger');
        }
    } catch(e) { showToast('❌ Server error during provisioning.', 'danger'); }
}

async function deleteProd(id) {
    if (!confirm("Decommission this asset?")) return;
    await fetch(`${API_URL}/api/products/${id}`, { method:'DELETE', headers:{'Authorization':state.token} });
    loadProducts();
    showToast('🗑 Asset decommissioned.', 'info');
}

function showQRPanel(productId, qrSrc) {
    const area = document.getElementById('qr-result-area');
    if (!area) return;
    area.style.display = 'block';
    area.innerHTML = `
        <div class="card fade-in" style="display:flex;align-items:center;gap:30px;padding:30px">
            <img src="${qrSrc}" style="width:180px;height:180px;border-radius:12px;border:1px solid var(--border)">
            <div style="flex:1">
                <div class="kpi-label" style="margin-bottom:8px">Batch Serial Provisioned</div>
                <div style="font-family:monospace;font-size:18px;font-weight:700;color:var(--primary);margin-bottom:20px">${productId}</div>
                <div style="display:flex;gap:12px">
                    <a href="${qrSrc}" download="SnackShield_${productId}.svg" class="btn btn-primary">Download QR</a>
                    <button class="btn btn-secondary" onclick="copyToClipboard('${productId}')">Copy ID</button>
                    <button class="btn btn-outline" onclick="document.getElementById('qr-result-area').style.display='none'">Dismiss</button>
                </div>
            </div>
        </div>
    `;
}

async function showQRModal(productId) {
    // Basic modal overlay for existing product QR
    const win = window.open('', '_blank', 'width=500,height=600');
    win.document.write(`
        <div style="text-align:center;padding:50px;font-family:sans-serif">
            <h2 style="color:#6366f1">Product Verification Identity</h2>
            <div style="font-family:monospace;background:#f1f5f9;padding:15px;border-radius:8px;margin:20px 0;font-size:18px">${productId}</div>
            <p style="color:#64748b;font-size:14px">Scan this serial or generate its batch QR to verify provenance.</p>
            <button onclick="window.close()" style="margin-top:30px;padding:12px 24px;background:#6366f1;color:white;border:none;border-radius:8px;cursor:pointer">Close Terminal</button>
        </div>
    `);
}

async function loadDistributors() {
    try {
        const s = await (await fetch(`${API_URL}/api/distributor-score`, { headers:{'Authorization':state.token} })).json();
        document.getElementById('distributors-body').innerHTML = s.map(x => `
            <tr>
                <td style="font-weight:600">${x.name || x.id}</td>
                <td><span class="badge ${x.score >= 70 ? 'badge-success' : 'badge-warning'}">${x.score}%</span></td>
                <td>${x.violations}</td>
                <td>${x.suspicious}</td>
            </tr>
        `).join('') || '<tr><td colspan="4" style="text-align:center;padding:2rem">No distributor telemetry.</td></tr>';
    } catch(e) {}
}

async function loadClusters() {
    try {
        const c = await (await fetch(`${API_URL}/api/fraud-clusters`, { headers:{'Authorization':state.token} })).json();
        document.getElementById('clusters-body').innerHTML = c.map(x => `
            <tr>
                <td style="font-family:monospace">${x.pid}</td>
                <td>${x.location}</td>
                <td style="font-weight:700;color:var(--danger)">${x.size} Audits</td>
                <td><span class="badge badge-danger">CRITICAL</span></td>
            </tr>
        `).join('') || '<tr><td colspan="4" style="text-align:center;padding:2rem">Zero neural hotspots detected.</td></tr>';
    } catch(e) {}
}

// ─── UTILS ───────────────────────────────────────────────

function copyToClipboard(txt) {
    navigator.clipboard.writeText(txt).then(() => showToast('📋 Identifier copied to buffer.', 'success'));
}

function exportHistory() {
    showToast('📥 Preparing immutable audit export...', 'info');
    window.open(`${API_URL}/api/history?token=${state.token ? state.token.split(" ")[1] : ''}`, '_blank');
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div style="width:10px;height:10px;border-radius:50%;background:${type === 'success' ? 'var(--success)' : (type === 'danger' ? 'var(--danger)' : 'var(--primary)')}"></div>
        <span>${message}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'toastSlideUp 0.5s ease reverse forwards';
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}
