import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Building2, 
  Search, 
  MoreVertical, 
  Users, 
  Package, 
  ShieldCheck,
  Globe,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { getCompanies, createCompany } from '../services/api';
import { AnimatePresence } from 'framer-motion';

const Companies = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    industry: 'Food & Beverage',
    logoColor: 'from-blue-500 to-indigo-600',
    nodeCount: 1
  });
  
  useEffect(() => {
    getCompanies()
      .then(res => {
        setCompanies(res.data);
        setLoading(false);
      })
      .catch(e => {
        console.log(e);
        setLoading(false);
      });
  }, []);

  const handleAddCompany = async () => {
    try {
      await createCompany(newCompany);
      const res = await getCompanies();
      setCompanies(res.data);
      setShowAddModal(false);
      setNewCompany({ name: '', industry: 'Food & Beverage', logoColor: 'from-blue-500 to-indigo-600', nodeCount: 1 });
    } catch (e) {
      console.error(e);
    }
  };

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: 'Network Partners', value: companies.length, icon: Building2, color: 'from-indigo-500 to-blue-600' },
    { label: 'Verified Nodes', value: companies.filter(c => c.verified).length, icon: ShieldCheck, color: 'from-emerald-500 to-teal-600' },
    { label: 'Monitored Assets', value: companies.reduce((acc, c) => acc + (c.products || 0), 0), icon: Package, color: 'from-purple-500 to-purple-600' },
    { label: 'Authorized Users', value: companies.reduce((acc, c) => acc + (c.users || c.nodeCount || 5), 0), icon: Users, color: 'from-amber-500 to-orange-600' },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <DashboardLayout title="Supply Chain Partners">
      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Partner Ecosystem</h1>
            <p className="text-slate-500 font-medium max-w-2xl">Manage and verify manufacturer nodes within the global supply chain ledger.</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-purple-600 hover:to-indigo-600 text-white font-black rounded-2xl shadow-xl transition-all group"
          >
            <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
            Onboard New Partner
          </button>
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl relative z-10 border-2 border-slate-100"
            >
              <h2 className="text-2xl font-black text-slate-900 mb-6">Onboard Partner</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Company Name</label>
                  <input 
                    type="text"
                    value={newCompany.name}
                    onChange={e => setNewCompany({...newCompany, name: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:border-purple-500 transition-all"
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Industry</label>
                  <select 
                    value={newCompany.industry}
                    onChange={e => setNewCompany({...newCompany, industry: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 focus:outline-none focus:border-purple-500 transition-all"
                  >
                    <option>Food & Beverage</option>
                    <option>Logistics</option>
                    <option>Retail</option>
                    <option>Technology</option>
                  </select>
                </div>
                <div className="flex gap-4 mt-8">
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddCompany}
                    className="flex-1 px-6 py-4 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-500 shadow-lg shadow-purple-200 transition-all"
                  >
                    Confirm Onboarding
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:border-purple-300 transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon size={22} strokeWidth={2.5} />
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Search Bar - Modern Style */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="relative mb-8"
      >
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400">
          <Search size={22} strokeWidth={2.5} />
        </div>
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border-2 border-slate-200 rounded-2xl py-4 pl-14 pr-6 text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 transition-all shadow-lg"
          placeholder="Search by company name, industry, or node ID..."
        />
      </motion.div>

      {/* Companies Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {filteredCompanies.map((company, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border-2 border-slate-200 rounded-[2.5rem] p-8 shadow-xl hover:shadow-2xl hover:border-purple-300 transition-all group overflow-hidden relative"
          >
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${company.logoColor} opacity-[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-[0.08] transition-opacity`} />
            
            <div className="flex items-start justify-between mb-8 relative z-10">
              <div className="flex items-center gap-5">
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${company.logoColor} flex items-center justify-center text-white shadow-xl group-hover:rotate-3 transition-transform duration-500`}>
                  <Building2 size={36} strokeWidth={2} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{company.name}</h3>
                    {company.verified && (
                      <div className="bg-emerald-100 p-1 rounded-full border border-emerald-200" title="Verified Node">
                        <ShieldCheck size={16} className="text-emerald-600" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-lg w-fit">
                    <Globe size={12} strokeWidth={2.5} />
                    {company.industry}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100">
                  <MoreVertical size={20} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 py-6 border-y-2 border-slate-100 mb-6 bg-slate-50/50 rounded-2xl px-6">
              <div>
                <div className="text-3xl font-black text-slate-900 tracking-tighter">{company.products}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Catalog</div>
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900 tracking-tighter">{company.nodeCount || 0}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Node Count</div>
              </div>
              <div className="flex items-end">
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 shadow-sm ${
                  company.status === 'Active' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${company.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  {company.status}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((_, j) => (
                  <div key={j} className="w-10 h-10 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center overflow-hidden shadow-md">
                    <img src={`https://i.pravatar.cc/100?u=${company.name}-${j}`} alt="Member" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-4 border-white bg-slate-900 flex items-center justify-center text-[10px] text-white font-black shadow-md">
                  +{Math.max(0, (company.nodeCount || 5) - 4)}
                </div>
              </div>
              <button 
                onClick={() => navigate(`/companies/${company.name.toLowerCase().replace(/\s+/g, '-')}`)}
                className="group/btn flex items-center gap-2 text-sm font-black text-purple-600 px-5 py-2.5 rounded-2xl hover:bg-purple-50 transition-all border-2 border-transparent hover:border-purple-200"
              >
                <span>Network Node Profile</span>
                <ChevronRight size={18} className="translate-x-0 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </DashboardLayout>
  );
};

export default Companies;
