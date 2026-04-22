import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck, Package, AlertTriangle, TrendingUp,
  BarChart3, Activity, ScanLine, CheckCircle2,
  XCircle, Clock, ArrowUpRight, ArrowDownRight,
  Bell, Eye, Globe, Zap
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

const StatCard = ({ icon: Icon, label, value, change, changeType, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay * 0.1, duration: 0.4 }}
    className="bg-gradient-to-br from-white to-slate-50/50 rounded-2xl border-2 border-slate-200 p-6 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 hover:border-purple-300 transition-all duration-300 group relative overflow-hidden"
  >
    {/* Subtle gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
          <Icon size={24} strokeWidth={2.5} />
        </div>
        {change && (
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${
            changeType === 'up' 
              ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300' 
              : 'bg-red-100 text-red-700 border-2 border-red-300'
          }`}>
            {changeType === 'up' ? <ArrowUpRight size={14} strokeWidth={3} /> : <ArrowDownRight size={14} strokeWidth={3} />}
            {change}
          </div>
        )}
      </div>
      <div className="text-4xl font-black text-slate-900 mb-2 tracking-tight">{value}</div>
      <div className="text-sm text-slate-600 font-semibold">{label}</div>
    </div>
  </motion.div>
);

const ActivityItem = ({ icon: Icon, title, desc, time, status, color }) => (
  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-transparent border border-transparent hover:border-purple-200 transition-all group">
    <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-md`}>
      <Icon size={20} strokeWidth={2.5} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-bold text-slate-900 truncate">{title}</span>
        <span className="text-xs text-slate-500 font-medium flex-shrink-0">{time}</span>
      </div>
      <p className="text-xs text-slate-600 font-medium mt-1">{desc}</p>
    </div>
    {status && (
      <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0 ${
        status === 'verified' ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300' :
        status === 'flagged' ? 'bg-red-100 text-red-700 border-2 border-red-300' :
        'bg-amber-100 text-amber-700 border-2 border-amber-300'
      }`}>
        {status}
      </span>
    )}
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      navigate('/login');
      return;
    }
    try {
      setUser(JSON.parse(stored));
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
      </div>
    );
  }

  const getRoleConfig = () => {
    switch (user.role) {
      case 'Admin':
        return {
          title: 'Administrator Dashboard',
          subtitle: 'Complete system overview and management controls',
          gradient: 'from-purple-600 to-indigo-600',
          stats: [
            { icon: ShieldCheck, label: 'Total Verifications', value: '24,891', change: '+12.5%', changeType: 'up', color: 'from-purple-500 to-purple-600' },
            { icon: AlertTriangle, label: 'Fraud Alerts', value: '47', change: '+3.2%', changeType: 'up', color: 'from-red-500 to-rose-600' },
            { icon: Package, label: 'Active Products', value: '3,214', change: '+8.1%', changeType: 'up', color: 'from-blue-500 to-cyan-600' },
            { icon: TrendingUp, label: 'Detection Rate', value: '99.7%', change: '+0.3%', changeType: 'up', color: 'from-emerald-500 to-teal-600' },
          ]
        };
      case 'Manufacturer':
        return {
          title: 'Manufacturer Dashboard',
          subtitle: 'Product management and QR code generation',
          gradient: 'from-blue-600 to-cyan-600',
          stats: [
            { icon: Package, label: 'My Products', value: '186', change: '+5.2%', changeType: 'up', color: 'from-blue-500 to-cyan-600' },
            { icon: ScanLine, label: 'QR Codes Generated', value: '12,450', change: '+18.3%', changeType: 'up', color: 'from-purple-500 to-purple-600' },
            { icon: CheckCircle2, label: 'Verified Scans', value: '8,921', change: '+9.7%', changeType: 'up', color: 'from-emerald-500 to-teal-600' },
            { icon: AlertTriangle, label: 'Flagged Items', value: '12', change: '-2.1%', changeType: 'down', color: 'from-amber-500 to-orange-600' },
          ]
        };
      case 'Distributor':
        return {
          title: 'Distributor Dashboard',
          subtitle: 'Supply chain tracking and distribution analytics',
          gradient: 'from-teal-600 to-emerald-600',
          stats: [
            { icon: Globe, label: 'Active Routes', value: '34', change: '+2.4%', changeType: 'up', color: 'from-teal-500 to-emerald-600' },
            { icon: Package, label: 'Shipments', value: '1,247', change: '+11.2%', changeType: 'up', color: 'from-blue-500 to-cyan-600' },
            { icon: ShieldCheck, label: 'Verified Deliveries', value: '1,198', change: '+10.8%', changeType: 'up', color: 'from-emerald-500 to-teal-600' },
            { icon: Activity, label: 'Chain Integrity', value: '98.4%', change: '+0.6%', changeType: 'up', color: 'from-purple-500 to-purple-600' },
          ]
        };
      case 'Retailer':
        return {
          title: 'Retailer Dashboard',
          subtitle: 'Product verification and monitor activity',
          gradient: 'from-orange-600 to-amber-600',
          stats: [
            { icon: ScanLine, label: 'Products Scanned', value: '2,847', change: '+14.3%', changeType: 'up', color: 'from-orange-500 to-amber-600' },
            { icon: CheckCircle2, label: 'Authentic Items', value: '2,801', change: '+13.9%', changeType: 'up', color: 'from-emerald-500 to-teal-600' },
            { icon: XCircle, label: 'Counterfeits Found', value: '46', change: '+2.1%', changeType: 'up', color: 'from-red-500 to-rose-600' },
            { icon: Eye, label: 'Scan Accuracy', value: '99.2%', change: '+0.4%', changeType: 'up', color: 'from-purple-500 to-purple-600' },
          ]
        };
      default:
        return {
          title: 'Dashboard',
          subtitle: 'Welcome to SnackShield',
          gradient: 'from-purple-600 to-indigo-600',
          stats: []
        };
    }
  };

  const config = getRoleConfig();

  const recentActivity = [
    { icon: CheckCircle2, title: 'Product Verified', desc: 'SKU-4829 authenticated successfully', time: '2 min ago', status: 'verified', color: 'bg-emerald-100 text-emerald-600' },
    { icon: AlertTriangle, title: 'Suspicious Scan', desc: 'Unusual pattern in Region 7 — Mumbai', time: '8 min ago', status: 'flagged', color: 'bg-red-100 text-red-600' },
    { icon: ScanLine, title: 'Batch Scan Complete', desc: 'Batch #B-2847 — 250 items processed', time: '15 min ago', status: 'verified', color: 'bg-blue-100 text-blue-600' },
    { icon: Package, title: 'New Product Added', desc: 'Organic Trail Mix — Premium Range', time: '32 min ago', status: 'pending', color: 'bg-purple-100 text-purple-600' },
    { icon: Bell, title: 'System Alert', desc: 'Database backup completed successfully', time: '1 hr ago', status: 'verified', color: 'bg-slate-100 text-slate-600' },
  ];

  const fraudAlerts = [
    { region: 'Mumbai, India', type: 'Duplicate QR Scan', severity: 'High', count: 12 },
    { region: 'Lagos, Nigeria', type: 'Suspicious Pattern', severity: 'Medium', count: 7 },
    { region: 'São Paulo, Brazil', type: 'Counterfeit Report', severity: 'High', count: 5 },
  ];

  return (
    <DashboardLayout title={config.title}>
      {/* Header with gradient */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className={`bg-gradient-to-r ${config.gradient} rounded-2xl p-8 text-white relative overflow-hidden shadow-xl`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Zap size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{config.title}</h1>
                <p className="text-white/70 text-sm">{config.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/15 rounded-full text-xs font-medium backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                All systems operational
              </div>
              <span className="text-white/50 text-xs">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {config.stats.map((stat, i) => (
          <StatCard key={i} {...stat} delay={i} />
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl border-2 border-slate-200 shadow-lg"
        >
          <div className="flex items-center justify-between p-6 pb-4 border-b-2 border-slate-100">
            <div>
              <h3 className="text-xl font-black text-slate-900">Recent Activity</h3>
              <p className="text-sm text-slate-600 font-medium mt-0.5">Latest verification events</p>
            </div>
            <button className="text-sm font-bold text-purple-600 hover:text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-50 transition-all">
              View All →
            </button>
          </div>
          <div className="p-3 space-y-1">
            {recentActivity.map((item, i) => (
              <ActivityItem key={i} {...item} />
            ))}
          </div>
        </motion.div>

        {/* Fraud Alerts Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg"
        >
          <div className="p-6 pb-4 border-b-2 border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-red-100 border-2 border-red-300 flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-600" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-black text-slate-900">Fraud Alerts</h3>
            </div>
            <p className="text-sm text-slate-600 font-medium mt-1">Active incidents requiring attention</p>
          </div>
          <div className="px-4 pb-4 space-y-3 mt-3">
            {fraudAlerts.map((alert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 hover:border-red-300 hover:shadow-lg transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-900">{alert.region}</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    alert.severity === 'High' 
                      ? 'bg-red-100 text-red-700 border-2 border-red-300' 
                      : 'bg-amber-100 text-amber-700 border-2 border-amber-300'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-medium">{alert.type}</span>
                  <span className="text-xs font-bold text-slate-700">{alert.count} incidents</span>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Quick Stats */}
          <div className="mx-4 mb-4 p-5 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 border-2 border-purple-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black text-purple-900 uppercase tracking-wider">This Week</span>
              <BarChart3 size={16} className="text-purple-600" strokeWidth={2.5} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-black text-slate-900">847</div>
                <div className="text-xs text-slate-700 font-semibold">Scans</div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-600">99.4%</div>
                <div className="text-xs text-slate-700 font-semibold">Accuracy</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
