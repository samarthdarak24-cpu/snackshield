import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Scan, CheckCircle, XCircle, AlertTriangle, TrendingUp,
  ArrowUpRight, ArrowDownRight, Clock, MapPin, RefreshCw, Shield,
  Brain, Sparkles, ShieldCheck, ShieldAlert, ChevronRight, Zap,
  BarChart2, Eye, Package, Bell, Search, Star, Activity, Wifi
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import DashboardLayout from '../components/layout/DashboardLayout';
import { getRetailerDashboard } from '../services/api';

// ── AI Counterfeit Agent Panel ────────────────────────────────────────────────
const CounterfeitAgentPanel = ({ report, loading }) => {
  const [expanded, setExpanded] = useState(true);

  const scoreColor = report?.safetyScore >= 80 ? 'emerald' : report?.safetyScore >= 50 ? 'yellow' : 'red';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-base">AI Counterfeit Agent</h3>
            <p className="text-emerald-300 text-xs">Real-time threat detection & store safety</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 rounded-full border border-emerald-500/30">
              <RefreshCw size={12} className="text-emerald-300 animate-spin" />
              <span className="text-emerald-300 text-xs font-medium">Scanning...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 rounded-full border border-emerald-500/30">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 text-xs font-medium">Agent Active</span>
            </div>
          )}
          <button onClick={() => setExpanded(!expanded)} className="text-slate-400 hover:text-white transition-colors">
            <ChevronRight size={18} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </div>

      {/* Safety Score */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
          <div className={`text-3xl font-bold mb-1 ${
            scoreColor === 'emerald' ? 'text-emerald-400' : scoreColor === 'yellow' ? 'text-yellow-400' : 'text-red-400'
          }`}>{report?.safetyScore ?? '--'}</div>
          <div className="text-xs text-slate-400">Store Safety</div>
          <div className="mt-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-1000 ${
              scoreColor === 'emerald' ? 'bg-emerald-500' : scoreColor === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
            }`} style={{ width: `${report?.safetyScore ?? 0}%` }} />
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
          <div className="text-3xl font-bold text-red-400 mb-1">{report?.threats?.length ?? 0}</div>
          <div className="text-xs text-slate-400">Threats</div>
        </div>
        <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
          <div className="text-3xl font-bold text-cyan-400 mb-1">{report?.totalScansAnalyzed ?? 0}</div>
          <div className="text-xs text-slate-400">Scans Analyzed</div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            {report?.threats?.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Active Threats</p>
                <div className="space-y-2">
                  {report.threats.map((t, i) => (
                    <div key={i} className="p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                      <div className="flex items-start gap-2">
                        <ShieldAlert size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-white text-xs font-semibold">{t.type?.replace(/_/g, ' ').toUpperCase()}</p>
                          <p className="text-slate-300 text-xs mt-0.5">{t.message}</p>
                        </div>
                        <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                          t.severity === 'Critical' ? 'bg-red-500/30 text-red-300' : 'bg-orange-500/30 text-orange-300'
                        }`}>{t.severity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {report?.recommendations?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Recommendations</p>
                <div className="space-y-2">
                  {report.recommendations.map((r, i) => (
                    <div key={i} className={`p-3 rounded-xl border ${
                      r.severity === 'High' ? 'bg-orange-500/10 border-orange-500/30' : 'bg-cyan-500/10 border-cyan-500/30'
                    }`}>
                      <div className="flex items-start gap-2">
                        <Sparkles size={14} className={`mt-0.5 flex-shrink-0 ${r.severity === 'High' ? 'text-orange-400' : 'text-cyan-400'}`} />
                        <p className="text-slate-200 text-xs">{r.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!report?.threats?.length && !report?.recommendations?.length) && (
              <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <ShieldCheck size={16} className="text-emerald-400" />
                <p className="text-emerald-300 text-xs font-medium">All products verified. No counterfeit threats detected.</p>
              </div>
            )}

            {report?.lastAnalyzed && (
              <p className="text-slate-500 text-xs mt-3 text-right">
                Last scan: {new Date(report.lastAnalyzed).toLocaleTimeString()}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── Quick Verify Widget ───────────────────────────────────────────────────────
const QuickVerifyWidget = () => {
  const [qrInput, setQrInput] = useState('');
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);

  const handleVerify = async () => {
    if (!qrInput.trim()) return;
    setChecking(true);
    setResult(null);
    try {
      const { quickVerifyProduct } = await import('../services/api');
      const res = await quickVerifyProduct(qrInput.trim());
      setResult(res.data);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) {
        setResult({ result: 'Unknown', productName: 'Not Found', message: 'Product not registered in system.' });
      } else {
        setResult({ result: 'Error', message: 'Verification service unavailable.' });
      }
    }
    setChecking(false);
  };

  const resultColors = {
    Genuine: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700', icon: CheckCircle, iconColor: 'text-emerald-600' },
    Suspicious: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-700', icon: AlertTriangle, iconColor: 'text-orange-600' },
    Expired: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', icon: XCircle, iconColor: 'text-red-600' },
    Unknown: { bg: 'bg-slate-50', border: 'border-slate-300', text: 'text-slate-700', icon: Eye, iconColor: 'text-slate-500' },
    Error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', icon: XCircle, iconColor: 'text-red-500' },
  };

  const rc = result ? (resultColors[result.result] || resultColors.Unknown) : null;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl">
      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
        <Scan size={18} className="text-emerald-600" /> Quick Product Verify
      </h3>
      <p className="text-xs text-slate-500 mb-4">Enter a QR code or product ID to instantly verify authenticity</p>
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={qrInput}
            onChange={e => setQrInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleVerify()}
            placeholder="e.g. BCH-001-001"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        </div>
        <button onClick={handleVerify} disabled={checking || !qrInput.trim()}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20">
          {checking ? <RefreshCw size={15} className="animate-spin" /> : 'Verify'}
        </button>
      </div>

      <AnimatePresence>
        {result && rc && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`p-4 rounded-xl border ${rc.bg} ${rc.border}`}>
            <div className="flex items-start gap-3">
              <rc.icon size={20} className={`${rc.iconColor} flex-shrink-0 mt-0.5`} />
              <div className="flex-1">
                <p className={`font-bold text-sm ${rc.text}`}>{result.result}</p>
                {result.productName && <p className="text-slate-700 text-xs mt-0.5 font-medium">{result.productName}</p>}
                {result.batchId && <p className="text-slate-500 text-xs">Batch: {result.batchId}</p>}
                {result.expiryDate && (
                  <p className="text-slate-500 text-xs">Expires: {new Date(result.expiryDate).toLocaleDateString()}</p>
                )}
                {result.riskScore !== undefined && (
                  <p className={`text-xs font-semibold mt-1 ${result.riskScore > 60 ? 'text-red-600' : 'text-emerald-600'}`}>
                    Risk Score: {result.riskScore}/100
                  </p>
                )}
                {result.message && <p className="text-slate-500 text-xs mt-1">{result.message}</p>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const RetailerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const mockHourlyTrend = Array.from({ length: 12 }, (_, i) => ({
    _id: i * 2,
    scans: Math.floor(Math.random() * 30) + 5,
    genuine: Math.floor(Math.random() * 25) + 4,
    fake: Math.floor(Math.random() * 3),
  }));

  const mockTopScanned = [
    { _id: 'BCH-001-001', count: 47, lastScan: new Date() },
    { _id: 'BCH-002-003', count: 38, lastScan: new Date() },
    { _id: 'BCH-001-005', count: 29, lastScan: new Date() },
    { _id: 'BCH-003-002', count: 21, lastScan: new Date() },
    { _id: 'BCH-004-001', count: 15, lastScan: new Date() },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getRetailerDashboard();
      setData(res.data);
    } catch {
      setData({
        stats: { totalProducts: 38, totalScans: 284, genuineScans: 271, fakeScans: 13, unresolvedAlerts: 2, verificationRate: '95.4' },
        hourlyTrend: mockHourlyTrend,
        topScanned: mockTopScanned,
        recentScans: [],
        agentReport: {
          safetyScore: 91,
          threats: [],
          recommendations: [{ type: 'expiry_risk', count: 3, message: '3 products expire within 7 days. Prioritize sales or removal.', severity: 'Medium' }],
          lastAnalyzed: new Date().toISOString(),
          totalScansAnalyzed: 284
        }
      });
    }
    setLoading(false);
    setLastRefresh(new Date());
  };

  useEffect(() => { fetchData(); }, []);

  const stats = data?.stats || {};
  const hourlyTrend = data?.hourlyTrend?.length ? data.hourlyTrend : mockHourlyTrend;
  const topScanned = data?.topScanned?.length ? data.topScanned : mockTopScanned;
  const agentReport = data?.agentReport;

  const verRate = parseFloat(stats.verificationRate || 95.4);

  const kpiCards = [
    { label: 'Products in Store', value: stats.totalProducts ?? 38, icon: ShoppingBag, color: 'emerald', change: '+4%', trend: 'up' },
    { label: 'Total Scans Today', value: stats.totalScans ?? 284, icon: Scan, color: 'cyan', change: '+18%', trend: 'up' },
    { label: 'Verified Genuine', value: stats.genuineScans ?? 271, icon: CheckCircle, color: 'purple', change: '+16%', trend: 'up' },
    { label: 'Fake Detected', value: stats.fakeScans ?? 13, icon: ShieldAlert, color: 'orange', change: '-8%', trend: 'down' },
  ];

  const bgMap = { emerald: 'bg-emerald-100', cyan: 'bg-cyan-100', purple: 'bg-purple-100', orange: 'bg-orange-100' };
  const textMap = { emerald: 'text-emerald-600', cyan: 'text-cyan-600', purple: 'text-purple-600', orange: 'text-orange-600' };

  return (
    <DashboardLayout title="Retailer Dashboard">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-300/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-300/15 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative mb-6 bg-gradient-to-r from-emerald-50 via-white to-cyan-50 rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-cyan-500 flex items-center justify-center shadow-xl shadow-emerald-500/30">
              <ShoppingBag size={26} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-slate-900">Retailer Dashboard</h1>
                <span className="px-2.5 py-0.5 bg-emerald-100 border border-emerald-200 rounded-full text-xs font-bold text-emerald-700">RETAILER</span>
              </div>
              <p className="text-sm text-slate-600">Product verification & customer scan analytics — <span className="font-semibold text-emerald-600">{user.company || 'Your Store'}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-white px-3 py-2 rounded-xl border border-slate-200">
              <Clock size={14} />
              <span>Updated {lastRefresh.toLocaleTimeString()}</span>
            </div>
            {/* Verification Rate Badge */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold ${
              verRate >= 90 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-orange-50 border-orange-200 text-orange-700'
            }`}>
              <Shield size={14} />
              {verRate}% Verified
            </div>
            <button onClick={fetchData} disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpiCards.map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-12 h-12 rounded-xl ${bgMap[card.color]} flex items-center justify-center shadow-md`}>
                <card.icon size={22} className={textMap[card.color]} />
              </div>
              <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-lg ${
                card.trend === 'up' ? 'text-emerald-700 bg-emerald-100' : 'text-red-700 bg-red-100'
              }`}>
                {card.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {card.change}
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{card.value}</div>
            <div className="text-xs text-slate-500 font-medium">{card.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Hourly Scan Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity size={18} className="text-emerald-600" /> Hourly Scan Activity
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Customer verification scans over last 24 hours</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-semibold text-emerald-700">
              <Wifi size={11} /> Live
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyTrend} barGap={2}>
                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }}
                  tickFormatter={v => `${v}:00`} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 12 }}
                  labelFormatter={v => `${v}:00`} />
                <Bar dataKey="genuine" fill="#10b981" radius={[4, 4, 0, 0]} name="Genuine" />
                <Bar dataKey="fake" fill="#f97316" radius={[4, 4, 0, 0]} name="Fake" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Scanned Products */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-5">
            <Star size={18} className="text-yellow-500" /> Top Scanned
          </h3>
          <div className="space-y-3">
            {topScanned.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  i === 0 ? 'bg-yellow-100 text-yellow-700' : i === 1 ? 'bg-slate-200 text-slate-700' : 'bg-orange-100 text-orange-700'
                }`}>#{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-900 truncate">{item._id}</p>
                  <p className="text-xs text-slate-500">{item.count} scans</p>
                </div>
                <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${Math.min(100, (item.count / (topScanned[0]?.count || 1)) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Grid: AI Agent + Quick Verify */}
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CounterfeitAgentPanel report={agentReport} loading={loading} />
        <QuickVerifyWidget />
      </div>

      {/* Alert Banner */}
      {(stats.unresolvedAlerts > 0) && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="mt-6 flex items-center gap-4 p-4 bg-orange-50 border border-orange-200 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
            <Bell size={18} className="text-orange-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-orange-900">{stats.unresolvedAlerts} Unresolved Alert{stats.unresolvedAlerts > 1 ? 's' : ''}</p>
            <p className="text-xs text-orange-700">Review pending counterfeit alerts to protect your customers.</p>
          </div>
          <a href="/alerts" className="px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl hover:bg-orange-700 transition-colors">
            View Alerts
          </a>
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default RetailerDashboard;
