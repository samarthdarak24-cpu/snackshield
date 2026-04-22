import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  MapPin, 
  User, 
  ChevronLeft, 
  ChevronRight,
  Hash,
  ArrowUpRight,
  Activity
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { getScanHistory } from '../services/api';

const ScanHistory = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    getScanHistory().then(res => {
      setScans(res.data);
      setLoading(false);
    }).catch(e => setLoading(false));
  }, []);

  const filteredScans = scans.filter(scan => {
    const matchesSearch = scan.productId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scan.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'genuine' && scan.result === 'Genuine') ||
                         (filterStatus === 'flagged' && scan.result === 'Fake');
    return matchesSearch && matchesFilter;
  });

  const stats = [
    { label: 'Total Logs', value: scans.length, icon: History, color: 'from-slate-700 to-slate-900' },
    { label: 'Genuine Scans', value: scans.filter(s => s.result === 'Genuine').length, icon: CheckCircle2, color: 'from-emerald-500 to-teal-600' },
    { label: 'Flagged Threats', value: scans.filter(s => s.result === 'Fake').length, icon: XCircle, color: 'from-red-500 to-rose-600' },
  ];

  return (
    <DashboardLayout title="Scan History">
      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Immutable Audit Trails</h1>
            <p className="text-slate-500 font-medium max-w-2xl">
              Cryptographically verified history of every interaction across the product lifecycle.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-2xl text-sm font-black text-slate-700 shadow-sm transition-all group">
              <Download size={18} strokeWidth={2.5} className="group-hover:-translate-y-0.5 transition-transform" />
              <span>Generate Audit PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border-2 border-slate-200 rounded-3xl p-6 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 hover:border-slate-300 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon size={22} strokeWidth={2.5} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider">
                <ArrowUpRight size={12} strokeWidth={3} />
                <span>Live</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search & Filters */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-900 rounded-[2rem] p-6 mb-10 shadow-2xl overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} strokeWidth={2.5} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border-2 border-white/10 rounded-2xl py-3.5 pl-12 pr-5 text-white font-bold placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all"
              placeholder="Filter by Serial ID, Region, or Operator..." 
            />
          </div>
          <div className="flex gap-2">
            {['all', 'genuine', 'flagged'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-[0.15em] transition-all ${
                  filterStatus === status 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-500/20' 
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border-2 border-white/5'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Table Content */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white border-2 border-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        <div className="overflow-x-auto px-4 pb-4 mt-6">
          <table className="w-full border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Transaction ID</th>
                <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Timestamp</th>
                <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Geodata</th>
                <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Status</th>
                <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Node/Operator</th>
              </tr>
            </thead>
            <tbody>
              {filteredScans.length > 0 ? filteredScans.map((scan, i) => (
                <tr key={i} className="group transition-all duration-300">
                  <td className="px-6 py-5 bg-slate-50/50 first:rounded-l-[1.5rem] group-hover:bg-purple-50 border-y-2 border-l-2 border-transparent group-hover:border-purple-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border-2 border-slate-200 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:border-purple-200 transition-all">
                        <Hash size={16} className="text-slate-400 group-hover:text-purple-600" strokeWidth={2.5} />
                      </div>
                      <span className="font-mono text-sm font-black text-slate-900 group-hover:text-purple-700">{scan.productId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 bg-slate-50/50 group-hover:bg-purple-50 border-y-2 border-transparent group-hover:border-purple-100 transition-colors">
                    <div className="flex flex-col">
                      <span className="text-slate-900 font-black text-sm">{new Date(scan.scanDate).toLocaleDateString()}</span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{new Date(scan.scanDate).toLocaleTimeString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 bg-slate-50/50 group-hover:bg-purple-50 border-y-2 border-transparent group-hover:border-purple-100 transition-colors">
                    <div className="flex items-center gap-2.5 text-slate-600 font-bold text-xs uppercase bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm w-fit">
                      <MapPin size={14} strokeWidth={2.5} className="text-indigo-500" />
                      {scan.location}
                    </div>
                  </td>
                  <td className="px-6 py-5 bg-slate-50/50 group-hover:bg-purple-50 border-y-2 border-transparent group-hover:border-purple-100 transition-colors">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border-2 shadow-sm ${
                      scan.result === 'Genuine' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${scan.result === 'Genuine' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                      {scan.result}
                    </span>
                  </td>
                  <td className="px-6 py-5 bg-slate-50/50 last:rounded-r-[1.5rem] group-hover:bg-purple-50 border-y-2 border-r-2 border-transparent group-hover:border-purple-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-purple-600">
                        <User size={14} strokeWidth={2.5} />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{scan.user}</span>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center bg-slate-50/50 rounded-3xl">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-[2rem] bg-slate-100 flex items-center justify-center text-slate-300 mb-6 border-4 border-slate-200 border-dashed">
                        <Activity size={32} strokeWidth={1.5} />
                      </div>
                      <h3 className="text-xl font-black text-slate-800">No records indexed yet</h3>
                      <p className="text-sm font-semibold text-slate-500 mt-2 max-w-xs mx-auto">Verified transactions will appear in this immutable ledger automatically.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Better Pagination */}
        <div className="px-10 py-6 border-t-2 border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">
            Displaying <span className="text-slate-900">{filteredScans.length}</span> of <span className="text-slate-900">{scans.length}</span> entries
          </p>
          <div className="flex items-center gap-3">
            <button className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border-2 border-slate-200 text-slate-400 hover:text-slate-900 hover:border-purple-300 transition-all disabled:opacity-30">
              <ChevronLeft size={20} strokeWidth={3} />
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border-2 border-slate-200 font-black text-xs text-slate-700">
              Page 1
            </div>
            <button className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border-2 border-slate-200 text-slate-400 hover:text-slate-900 hover:border-purple-300 transition-all disabled:opacity-30">
              <ChevronRight size={20} strokeWidth={3} />
            </button>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default ScanHistory;
