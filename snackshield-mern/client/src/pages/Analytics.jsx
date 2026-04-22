import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  Activity, 
  Calendar, 
  Download,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Lock,
  Eye
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import api, { getFraudStats, getGlobalStats, downloadAuditPDF } from '../services/api';
import ReportPreviewModal from '../components/modals/ReportPreviewModal';
import { Loader2 } from 'lucide-react';

const Analytics = () => {
  const [data, setData] = useState([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewTitle, setPreviewTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [liveStats, setLiveStats] = useState({
    totalScans: '...',
    incidentsMitigated: '...',
    trustIndex: '...',
    latency: '...'
  });
  const [trendCharts, setTrendCharts] = useState([]);

  useEffect(() => {
    getGlobalStats().then(res => {
      setLiveStats({
        totalScans: res.data.totalScans,
        incidentsMitigated: res.data.incidentsMitigated,
        trustIndex: res.data.trustIndex,
        latency: res.data.latency
      });
      
      if (res.data.trends) {
        setTrendCharts(res.data.trends.map(t => ({
           day: t._id.split('-').slice(1).join('/'),
           scans: t.scans,
           fraud: t.fraud
        })));
      }
    });

    getFraudStats().then(res => {
      setData(res.data.dailyActivity?.map(s => ({
        name: new Date(s.scanDate).toLocaleDateString(),
        value: s.result === 'Genuine' ? 1 : -1
      })) || []);
    }).catch(e => console.log('No data yet'));
  }, []);

  const handlePreviewAudit = async () => {
    try {
        setIsGenerating(true);
        setPreviewTitle(`Security Audit Report`);
        setIsPreviewOpen(true);
        setPreviewUrl(null);

        const response = await api.get('/analytics/download-audit-pdf', { responseType: 'arraybuffer' });
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        setPreviewUrl(url);
    } catch (error) {
        console.error('Preview Error:', error);
        alert('Failed to generate preview.');
        setIsPreviewOpen(false);
    } finally {
        setIsGenerating(false);
    }
  };

  const handleDownloadAudit = async () => {
    try {
        setIsGenerating(true);
        const response = await api.get('/analytics/download-audit-pdf', { responseType: 'arraybuffer' });
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `SnackShield_Audit_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Download Error:', error);
        alert('Failed to download PDF.');
    } finally {
        setIsGenerating(false);
    }
  };

  const stats = [
    { label: 'Total Network Scans', value: liveStats.totalScans, change: '+23%', changeType: 'up', icon: Activity, color: 'from-blue-500 to-indigo-600' },
    { label: 'Incidents Mitigated', value: liveStats.incidentsMitigated, change: '-8%', changeType: 'up', icon: AlertTriangle, color: 'from-red-500 to-rose-600' },
    { label: 'Trust Index', value: liveStats.trustIndex, change: '+2%', changeType: 'up', icon: ShieldCheck, color: 'from-emerald-500 to-teal-600' },
    { label: 'Real-time Latency', value: liveStats.latency, change: '-15%', changeType: 'up', icon: Zap, color: 'from-purple-500 to-indigo-600' },
  ];

  return (
    <DashboardLayout title="System Intelligence">
      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Threat Intelligence</h1>
            <p className="text-slate-500 font-medium max-w-2xl">Visualizing global security telemetry and product authentication velocity.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
                onClick={handlePreviewAudit}
                disabled={isGenerating}
                className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-black text-slate-700 shadow-xl shadow-slate-200/50 transition-all group disabled:opacity-50"
            >
                {isGenerating ? <Loader2 size={18} className="animate-spin text-indigo-500" /> : <Eye size={18} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />}
                <span>Preview Audit</span>
            </button>
            <button 
                onClick={handleDownloadAudit}
                disabled={isGenerating}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-slate-200 transition-all group disabled:opacity-50"
            >
                {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} strokeWidth={2.5} className="group-hover:-translate-y-1 transition-transform" />}
                <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border-2 border-slate-200 rounded-3xl p-6 hover:shadow-2xl hover:border-purple-300 transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon size={22} strokeWidth={2.5} />
              </div>
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-black border-2 ${
                stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                {stat.change.startsWith('+') ? <ArrowUpRight size={12} strokeWidth={3} /> : <ArrowDownRight size={12} strokeWidth={3} />}
                {stat.change}
              </div>
            </div>
            <div className="text-4xl font-black text-slate-900 mb-1 tracking-tighter">{stat.value}</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Monthly Trends */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-8 bg-white border-2 border-slate-200 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Authenticity Velocity</h3>
              <p className="text-sm font-semibold text-slate-500 mt-1 uppercase tracking-widest text-[10px]">Comparative Monthly Analysis</p>
            </div>
            <div className="flex items-center gap-6 p-2 bg-slate-50 rounded-2xl border-2 border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20" />
                <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Genuine</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/20" />
                <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Threats</span>
              </div>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendCharts}>
                <Bar dataKey="scans" fill="#10b981" radius={[12, 12, 0, 0]} barSize={24} />
                <Bar dataKey="fraud" fill="#ef4444" radius={[12, 12, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Status Breakdown */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-4 bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden text-white"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="mb-8 relative z-10">
            <h3 className="text-2xl font-black tracking-tight">Global Node Spread</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Regional Audit Density</p>
          </div>
          <div className="h-[280px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Healthy', value: parseFloat(liveStats.trustIndex) || 100, color: '#10b981' },
                    { name: 'At Risk', value: 100 - (parseFloat(liveStats.trustIndex) || 100), color: '#ef4444' }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {[
                    { color: '#10b981' },
                    { color: '#ef4444' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: '#1e293b', 
                    border: 'none', 
                    borderRadius: '16px',
                    color: '#fff',
                    padding: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <Globe size={40} className="text-white/20 mx-auto mb-2" />
              <div className="text-2xl font-black">{liveStats.trustIndex}</div>
              <div className="text-[8px] font-black uppercase text-slate-500 tracking-[0.2em]">Trust</div>
            </div>
          </div>
          <div className="space-y-4 mt-6 relative z-10">
            {[
              { name: 'Integrity', value: liveStats.trustIndex, color: '#10b981' },
              { name: 'Threat Surface', value: 100 - parseFloat(liveStats.trustIndex) + '%', color: '#ef4444' },
            ].map((region, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full shadow-lg" style={{ background: region.color, boxShadow: `0 0 10px ${region.color}` }} />
                  <span className="text-xs font-bold text-slate-300">{region.name}</span>
                </div>
                <span className="text-sm font-black">{region.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Network Stability Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white border-2 border-slate-200 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Security Vectoring</h3>
            <p className="text-sm font-semibold text-slate-500 mt-1 uppercase tracking-widest text-[10px]">Real-time Network Telemetry</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border-2 border-slate-100 rounded-xl">
              <Lock size={16} className="text-slate-400" />
              <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Encrypted Stream</span>
            </div>
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendCharts}>
              <defs>
                <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#f8fafc" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 800 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 800 }} />
              <Tooltip 
                contentStyle={{ 
                  background: '#ffffff', 
                  border: 'none', 
                  borderRadius: '20px',
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                  padding: '16px'
                }}
              />
              <Area type="monotone" dataKey="scans" stroke="#6366f1" strokeWidth={4} fill="url(#colorScans)" />
              <Area type="monotone" dataKey="fraud" stroke="#ef4444" strokeWidth={4} fill="url(#colorFraud)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <ReportPreviewModal 
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        pdfUrl={previewUrl}
        onDownload={handleDownloadAudit}
        title={previewTitle}
        fileName="SnackShield_Audit_Report.pdf"
      />
    </DashboardLayout>
  );
};

export default Analytics;
