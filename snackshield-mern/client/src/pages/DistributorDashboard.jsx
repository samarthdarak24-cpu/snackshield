import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck, Package, AlertTriangle, TrendingUp, ArrowUpRight, ArrowDownRight,
  MapPin, Clock, CheckCircle, XCircle, Activity, Shield, Zap, RefreshCw,
  ChevronRight, BarChart2, Globe, Layers, Eye, Bot, Brain, Wifi, WifiOff,
  Navigation, Box, ShieldAlert, ShieldCheck, Sparkles, Bell
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import DashboardLayout from '../components/layout/DashboardLayout';
import { getDistributorDashboard, getAlerts, getScanStats } from '../services/api';

// ── AI Agent Panel ────────────────────────────────────────────────────────────
const AgentPanel = ({ report, loading }) => {
  const [expanded, setExpanded] = useState(true);
  const severityColor = { Low: 'emerald', Medium: 'yellow', High: 'orange', Critical: 'red' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 border border-purple-500/30 rounded-2xl p-6 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-base">AI Supply Chain Agent</h3>
            <p className="text-purple-300 text-xs">Real-time anomaly detection & insights</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 rounded-full border border-purple-500/30">
              <RefreshCw size={12} className="text-purple-300 animate-spin" />
              <span className="text-purple-300 text-xs font-medium">Analyzing...</span>
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

      {/* Health Score */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
          <div className="text-3xl font-bold text-white mb-1">{report?.healthScore ?? '--'}</div>
          <div className="text-xs text-slate-400">Chain Health</div>
          <div className="mt-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all duration-1000"
              style={{ width: `${report?.healthScore ?? 0}%` }} />
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
          <div className="text-3xl font-bold text-orange-400 mb-1">{report?.anomalies?.length ?? 0}</div>
          <div className="text-xs text-slate-400">Anomalies</div>
        </div>
        <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
          <div className="text-3xl font-bold text-cyan-400 mb-1">{report?.totalAnalyzed ?? 0}</div>
          <div className="text-xs text-slate-400">Analyzed</div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            {/* Anomalies */}
            {report?.anomalies?.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Detected Anomalies</p>
                <div className="space-y-2">
                  {report.anomalies.map((a, i) => (
                    <div key={i} className={`p-3 rounded-xl border bg-orange-500/10 border-orange-500/30`}>
                      <div className="flex items-start gap-2">
                        <ShieldAlert size={14} className="text-orange-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-white text-xs font-semibold">{a.productName}</p>
                          <p className="text-slate-300 text-xs mt-0.5">{a.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Insights */}
            {report?.insights?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">AI Insights</p>
                <div className="space-y-2">
                  {report.insights.map((ins, i) => (
                    <div key={i} className={`p-3 rounded-xl border ${
                      ins.severity === 'Critical' ? 'bg-red-500/10 border-red-500/30' :
                      ins.severity === 'High' ? 'bg-orange-500/10 border-orange-500/30' :
                      'bg-cyan-500/10 border-cyan-500/30'
                    }`}>
                      <div className="flex items-start gap-2">
                        <Sparkles size={14} className={`mt-0.5 flex-shrink-0 ${
                          ins.severity === 'Critical' ? 'text-red-400' :
                          ins.severity === 'High' ? 'text-orange-400' : 'text-cyan-400'
                        }`} />
                        <p className="text-slate-200 text-xs">{ins.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!report?.anomalies?.length && !report?.insights?.length) && (
              <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <ShieldCheck size={16} className="text-emerald-400" />
                <p className="text-emerald-300 text-xs font-medium">Supply chain operating normally. No anomalies detected.</p>
              </div>
            )}

            {report?.lastAnalyzed && (
              <p className="text-slate-500 text-xs mt-3 text-right">
                Last analyzed: {new Date(report.lastAnalyzed).toLocaleTimeString()}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── Shipment Status Card ──────────────────────────────────────────────────────
const ShipmentCard = ({ shipment, index }) => {
  const statusColors = {
    Verified: 'emerald', 'In Transit': 'cyan', Delivered: 'purple', Suspicious: 'red'
  };
  const color = statusColors[shipment.status] || 'slate';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all group"
    >
      <div className={`w-10 h-10 rounded-xl bg-${color}-100 flex items-center justify-center flex-shrink-0`}>
        <Truck size={18} className={`text-${color}-600`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 truncate">{shipment.productName}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <MapPin size={11} className="text-slate-400" />
          <span className="text-xs text-slate-500">{shipment.currentLocation}</span>
          <span className="text-slate-300">•</span>
          <span className="text-xs text-slate-500">{shipment.batchId}</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold bg-${color}-100 text-${color}-700`}>
          {shipment.status}
        </span>
        {shipment.riskScore > 0 && (
          <span className={`text-xs font-bold ${shipment.riskScore > 60 ? 'text-red-500' : shipment.riskScore > 30 ? 'text-orange-500' : 'text-emerald-500'}`}>
            Risk: {shipment.riskScore}
          </span>
        )}
      </div>
    </motion.div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const DistributorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [agentLoading, setAgentLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const mockScanTrend = [
    { _id: 'Mon', total: 24, genuine: 22, fake: 2 },
    { _id: 'Tue', total: 38, genuine: 35, fake: 3 },
    { _id: 'Wed', total: 31, genuine: 29, fake: 2 },
    { _id: 'Thu', total: 52, genuine: 48, fake: 4 },
    { _id: 'Fri', total: 44, genuine: 41, fake: 3 },
    { _id: 'Sat', total: 61, genuine: 58, fake: 3 },
    { _id: 'Sun', total: 47, genuine: 45, fake: 2 },
  ];

  const mockJourneyStages = [
    { _id: 'Manufacturer', count: 12 },
    { _id: 'Distributor', count: 28 },
    { _id: 'Retailer', count: 18 },
    { _id: 'Customer', count: 7 },
  ];

  const mockShipments = [
    { productName: 'Organic Snacks Premium', batchId: 'BCH-001', currentLocation: 'Mumbai, IN', status: 'In Transit', riskScore: 5 },
    { productName: 'Energy Bars Pro Pack', batchId: 'BCH-002', currentLocation: 'Delhi, IN', status: 'Verified', riskScore: 0 },
    { productName: 'Nuts Mix Deluxe', batchId: 'BCH-003', currentLocation: 'Chennai, IN', status: 'Delivered', riskScore: 0 },
    { productName: 'Protein Chips Box', batchId: 'BCH-004', currentLocation: 'Pune, IN', status: 'Suspicious', riskScore: 72 },
    { productName: 'Healthy Bites Bundle', batchId: 'BCH-005', currentLocation: 'Kolkata, IN', status: 'In Transit', riskScore: 12 },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getDistributorDashboard();
      setData(res.data);
    } catch {
      // Use mock data if API not ready
      setData({
        stats: { totalProducts: 65, totalBatches: 18, totalScans: 312, fakeScans: 7, unresolvedAlerts: 3 },
        scanTrend: mockScanTrend,
        journeyStages: mockJourneyStages,
        recentBatches: [],
        recentScans: [],
        agentReport: {
          healthScore: 84,
          anomalies: [{ productName: 'Protein Chips Box', recommendation: 'Product has not moved in 4 days. Verify with logistics partner.', severity: 'Medium' }],
          insights: [{ type: 'high_risk_products', count: 1, message: '1 product has elevated risk score. Immediate inspection recommended.', severity: 'High' }],
          lastAnalyzed: new Date().toISOString(),
          totalAnalyzed: 65
        }
      });
    }
    setLoading(false);
    setLastRefresh(new Date());
  };

  useEffect(() => { fetchData(); }, []);

  const stats = data?.stats || {};
  const scanTrend = data?.scanTrend?.length ? data.scanTrend : mockScanTrend;
  const journeyStages = data?.journeyStages?.length ? data.journeyStages : mockJourneyStages;
  const agentReport = data?.agentReport;

  const kpiCards = [
    { label: 'Active Shipments', value: stats.totalProducts ?? 65, icon: Truck, color: 'purple', change: '+8%', trend: 'up' },
    { label: 'Total Batches', value: stats.totalBatches ?? 18, icon: Layers, color: 'cyan', change: '+3%', trend: 'up' },
    { label: 'Scans Processed', value: stats.totalScans ?? 312, icon: Activity, color: 'emerald', change: '+22%', trend: 'up' },
    { label: 'Fraud Detected', value: stats.fakeScans ?? 7, icon: ShieldAlert, color: 'orange', change: '-5%', trend: 'down' },
  ];

  const colorMap = { purple: '#7c3aed', cyan: '#06b6d4', emerald: '#10b981', orange: '#f97316' };
  const bgMap = { purple: 'bg-purple-100', cyan: 'bg-cyan-100', emerald: 'bg-emerald-100', orange: 'bg-orange-100' };
  const textMap = { purple: 'text-purple-600', cyan: 'text-cyan-600', emerald: 'text-emerald-600', orange: 'text-orange-600' };

  const STAGE_COLORS = ['#7c3aed', '#06b6d4', '#10b981', '#f97316'];

  return (
    <DashboardLayout title="Distributor Dashboard">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-300/15 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative mb-6 bg-gradient-to-r from-purple-50 via-white to-cyan-50 rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-xl shadow-purple-500/30">
              <Truck size={26} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-slate-900">Distributor Dashboard</h1>
                <span className="px-2.5 py-0.5 bg-purple-100 border border-purple-200 rounded-full text-xs font-bold text-purple-700">DISTRIBUTOR</span>
              </div>
              <p className="text-sm text-slate-600">Supply chain integrity & shipment tracking — <span className="font-semibold text-purple-600">{user.company || 'Your Company'}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-white px-3 py-2 rounded-xl border border-slate-200">
              <Clock size={14} />
              <span>Updated {lastRefresh.toLocaleTimeString()}</span>
            </div>
            <button onClick={fetchData} disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mt-5 bg-white p-1 rounded-xl border border-slate-200 w-fit shadow-sm">
          {['overview', 'shipments', 'analytics'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                activeTab === tab ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}>
              {tab}
            </button>
          ))}
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
        {/* Scan Trend Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart2 size={18} className="text-purple-600" /> Weekly Scan Activity
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Genuine vs flagged scans across distribution network</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-purple-500 inline-block" />Genuine</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-500 inline-block" />Flagged</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scanTrend}>
                <defs>
                  <linearGradient id="distGenuine" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="distFake" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="genuine" stroke="#7c3aed" strokeWidth={2.5} fill="url(#distGenuine)" />
                <Area type="monotone" dataKey="fake" stroke="#f97316" strokeWidth={2.5} fill="url(#distFake)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Journey Stage Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-5">
            <Navigation size={18} className="text-cyan-600" /> Journey Stages
          </h3>
          <div className="h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={journeyStages} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="count" nameKey="_id">
                  {journeyStages.map((_, i) => <Cell key={i} fill={STAGE_COLORS[i % STAGE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {journeyStages.map((stage, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: STAGE_COLORS[i % STAGE_COLORS.length] }} />
                  <span className="text-slate-600 text-xs">{stage._id}</span>
                </div>
                <span className="font-bold text-slate-900 text-xs">{stage.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Grid: AI Agent + Shipments */}
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Agent */}
        <AgentPanel report={agentReport} loading={loading} />

        {/* Live Shipments */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Truck size={18} className="text-purple-600" /> Live Shipments
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Real-time product location tracking</p>
            </div>
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-semibold text-emerald-700">
              <Wifi size={11} /> Live
            </span>
          </div>
          <div className="space-y-3">
            {mockShipments.map((s, i) => <ShipmentCard key={i} shipment={s} index={i} />)}
          </div>
          <button className="w-full mt-4 py-2.5 text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200 transition-colors">
            View All Shipments
          </button>
        </motion.div>
      </div>

      {/* Unresolved Alerts Banner */}
      {(stats.unresolvedAlerts > 0) && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="mt-6 flex items-center gap-4 p-4 bg-orange-50 border border-orange-200 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
            <Bell size={18} className="text-orange-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-orange-900">{stats.unresolvedAlerts} Unresolved Alert{stats.unresolvedAlerts > 1 ? 's' : ''}</p>
            <p className="text-xs text-orange-700">Review and resolve pending supply chain alerts to maintain compliance.</p>
          </div>
          <a href="/alerts" className="px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl hover:bg-orange-700 transition-colors">
            View Alerts
          </a>
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default DistributorDashboard;
