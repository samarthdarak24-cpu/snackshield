import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, 
  ShieldCheck, 
  Globe, 
  MapPin, 
  Users, 
  Package, 
  Activity, 
  ArrowLeft,
  Calendar,
  Lock,
  Cpu,
  Server,
  Network,
  ChevronRight,
  Key,
  RefreshCw,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { getCompanyById } from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import { AnimatePresence } from 'framer-motion';

const NetworkNodeProfile = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Feature states
  const [showAudit, setShowAudit] = useState(false);
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [auditing, setAuditing] = useState(false);
  const [auditStep, setAuditStep] = useState(0);

  useEffect(() => {
    getCompanyById(companyId)
      .then(res => {
        setCompany(res.data);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, [companyId]);

  const handleAudit = () => {
    setAuditing(true);
    setAuditStep(1);
    
    // Simulate multi-step audit
    setTimeout(() => setAuditStep(2), 1500);
    setTimeout(() => setAuditStep(3), 3000);
    setTimeout(() => setAuditStep(4), 4500);
    setTimeout(() => {
      setAuditing(false);
    }, 5500);
  };

  if (loading) return (
    <DashboardLayout title="Loading Profile...">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
      </div>
    </DashboardLayout>
  );

  if (!company) return (
    <DashboardLayout title="Company Not Found">
      <div className="text-center py-20">
        <h2 className="text-2xl font-black text-slate-900">Partner Node Not Found</h2>
        <button onClick={() => navigate('/companies')} className="mt-4 text-purple-600 font-bold">Return to Partners</button>
      </div>
    </DashboardLayout>
  );

  const nodeStats = [
    { label: 'Blockchain Uptime', value: company.uptime || '99.99%', icon: Activity },
    { label: 'Security Compliance', value: '100%', icon: ShieldCheck },
    { label: 'Active Edge Nodes', value: `${company.nodeCount}/${company.nodeCount}`, icon: Network },
    { label: 'Data Encryption', value: 'AES-256', icon: Lock },
  ];

  return (
    <DashboardLayout title="Partner Node Profile">
      <div className="mb-8">
        <button 
          onClick={() => navigate('/companies')}
          className="flex items-center gap-2 text-slate-500 hover:text-purple-600 font-bold transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Partners
        </button>
      </div>

      {/* Audit Modal */}
      <AnimatePresence>
        {showAudit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !auditing && setShowAudit(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900 border-2 border-slate-700 rounded-[3rem] p-8 w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden"
            >
               {/* Terminal Accent */}
               <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
               
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <Terminal size={22} className="text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-black">Connection Diagnostic</h3>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Node ID: SNK-{company._id?.substr(-6).toUpperCase()}</p>
                    </div>
                  </div>
                  {!auditing && (
                    <button onClick={() => setShowAudit(false)} className="text-slate-500 hover:text-white transition-colors">
                      <Lock size={20} />
                    </button>
                  )}
               </div>

               <div className="bg-black/50 rounded-2xl p-6 font-mono text-sm mb-8 min-h-[240px] border border-white/5">
                 <div className="space-y-2">
                    <div className="text-emerald-500 flex items-center gap-2">
                      <span className="opacity-50">$</span> initializing_handshake...
                    </div>
                    {auditStep >= 1 && (
                      <div className="text-slate-300 transition-opacity">
                        <span className="opacity-50 mr-2">$</span> Pinging node at {company.location}... <span className="text-emerald-500 font-bold ml-2">DONE (1.2ms)</span>
                      </div>
                    )}
                    {auditStep >= 2 && (
                      <div className="text-slate-300">
                        <span className="opacity-50 mr-2">$</span> Validating SSL/TLS Certificates... <span className="text-emerald-500 font-bold ml-2">SECURE</span>
                      </div>
                    )}
                    {auditStep >= 3 && (
                      <div className="text-slate-300">
                        <span className="opacity-50 mr-2">$</span> Handshaking with Main Ledger... <span className="text-purple-500 font-bold ml-2">SYNCED</span>
                      </div>
                    )}
                    {auditStep >= 4 && (
                      <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                        <div className="flex items-center gap-3 text-emerald-500">
                          <CheckCircle2 size={24} />
                          <div>
                            <div className="font-black">NODE HEALTH: EXCELLENT</div>
                            <div className="text-[10px] font-bold">All 142 checks passed. Connection is immutable and secure.</div>
                          </div>
                        </div>
                      </div>
                    )}
                    {auditing && (
                      <div className="text-purple-500 animate-pulse mt-2 flex items-center gap-2">
                        <Loader2 size={14} className="animate-spin" />
                        Analyzing_packet_flow...
                      </div>
                    )}
                 </div>
               </div>

               <button 
                 onClick={handleAudit}
                 disabled={auditing}
                 className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-3 ${
                   auditing 
                     ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                     : 'bg-white text-slate-900 hover:bg-purple-500 hover:text-white'
                 }`}
               >
                 {auditing ? 'Running Diagnostic...' : auditStep === 4 ? 'Rerun Audit' : 'Initialize Deep Audit'}
                 {!auditing && <RefreshCw size={18} strokeWidth={3} />}
               </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* API Config Modal */}
      <AnimatePresence>
        {showApiConfig && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowApiConfig(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[3rem] p-10 w-full max-w-xl shadow-2xl relative z-10"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl">
                  <Key size={28} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">API Configuration</h3>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Credentials for Node Integration</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-slate-50 rounded-3xl border-2 border-slate-100 relative group overflow-hidden">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Public Client ID</div>
                  <div className="font-mono text-slate-900 font-bold break-all">snk_live_prod_{company._id?.substr(0, 16)}</div>
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-xl shadow-sm text-slate-400 hover:text-purple-600 transition-all opacity-0 group-hover:opacity-100">
                    <Package size={18} />
                  </button>
                </div>

                <div className="p-6 bg-slate-900 rounded-3xl border-2 border-slate-800 relative group overflow-hidden">
                   <div className="flex items-center justify-between mb-2">
                     <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Secret Access Key</div>
                     <Lock size={12} className="text-slate-500" />
                   </div>
                   <div className="font-mono text-white font-bold blur-[4px] hover:blur-0 transition-all cursor-pointer select-none">
                     sk_snk_9283-4821-x9a2-9210-9b2s
                   </div>
                   <div className="text-[8px] text-slate-600 font-bold uppercase mt-2">Hover to reveal • Confidential</div>
                </div>

                <div className="p-4 bg-amber-50 border-2 border-amber-100 rounded-2xl flex items-start gap-3">
                  <AlertTriangle size={20} className="text-amber-600 shrink-0" strokeWidth={2.5} />
                  <p className="text-[10px] font-bold text-amber-700 leading-relaxed">
                    NEVER share these keys. They grant direct read/write access to the {company.name} ledger partition. If compromised, rotate keys immediately.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button className="py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 font-black rounded-2xl transition-all flex items-center justify-center gap-2">
                    <RefreshCw size={18} />
                    Rotate Secret
                  </button>
                  <button className="py-4 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-2xl shadow-lg transition-all">
                    Download SDK
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Profile Banner */}
      <div className="relative mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-2 border-slate-200 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
        >
          <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${company.logoColor} opacity-[0.05] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`} />
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            <div className={`w-32 h-32 rounded-[2.5rem] bg-gradient-to-br ${company.logoColor} flex items-center justify-center text-white shadow-2xl border-4 border-white`}>
              <Building2 size={56} strokeWidth={1.5} />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">{company.name}</h1>
                <div className="flex items-center gap-2 mx-auto md:mx-0">
                  <span className="px-4 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full border-2 border-emerald-200">
                    Verified Node
                  </span>
                  <span className="px-4 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full border-2 border-blue-200">
                    Trusted Partner
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-slate-500 font-bold text-sm">
                <div className="flex items-center gap-2">
                  <Globe size={18} className="text-purple-500" />
                  {company.industry}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-purple-500" />
                  {company.location}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-purple-500" />
                  Onboarded: {new Date(company.onboardedDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto">
              <button 
                onClick={() => setShowAudit(true)}
                className="px-8 py-3 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-purple-600 transition-all active:scale-95"
              >
                Audit Connection
              </button>
              <button 
                onClick={() => setShowApiConfig(true)}
                className="px-8 py-3 bg-white border-2 border-slate-200 text-slate-900 font-black rounded-2xl hover:bg-slate-50 transition-all"
              >
                API Configuration
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Connectivity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {nodeStats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-lg hover:border-purple-300 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <stat.icon size={22} strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Network Topology */}
        <div className="lg:col-span-8">
          <div className="bg-white border-2 border-slate-200 rounded-[2.5rem] p-8 shadow-xl mb-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Deployment Topology</h3>
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Network Sync</span>
              </div>
            </div>
            
            <div className="aspect-video bg-slate-900 rounded-[2rem] relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:24px_24px]" />
              
              <div className="relative z-10 flex flex-col items-center text-center p-12">
                <div className="w-24 h-24 mb-6 rounded-full bg-purple-500/20 flex items-center justify-center border-4 border-purple-500/30 animate-pulse">
                  <Network size={48} className="text-purple-400" />
                </div>
                <h4 className="text-2xl font-black text-white mb-2">Decentralized Trust Node</h4>
                <p className="text-slate-400 text-sm max-w-sm mb-8">This node is verified and actively contributing to the immutability of the SnackShield ledger.</p>
                
                <div className="grid grid-cols-3 gap-8">
                  <div>
                    <div className="text-white font-black text-xl font-mono">1.2ms</div>
                    <div className="text-[10px] text-slate-500 font-black uppercase">Latency</div>
                  </div>
                  <div>
                    <div className="text-white font-black text-xl font-mono">OK</div>
                    <div className="text-[10px] text-slate-500 font-black uppercase">Consensus</div>
                  </div>
                  <div>
                    <div className="text-white font-black text-xl font-mono">0x7F...3B</div>
                    <div className="text-[10px] text-slate-500 font-black uppercase">Identity</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Node Configuration */}
        <div className="lg:col-span-4">
          <div className="bg-white border-2 border-slate-200 rounded-[2.5rem] p-8 shadow-xl h-full">
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Node Infrastructure</h3>
            
            <div className="space-y-6">
              {[
                { icon: Cpu, label: 'Compute Engine', value: 'vSphere High-Perf' },
                { icon: Server, label: 'Database Node', value: 'Distributed MongoDB' },
                { icon: Lock, label: 'Authentication', value: 'JWT + OAuth 2.0' },
                { icon: ShieldCheck, label: 'Verification', value: 'Edge AI Scanner' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-purple-200 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-purple-600 shadow-sm transition-all">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{item.label}</div>
                    <div className="text-sm font-black text-slate-900">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl text-white">
              <h4 className="font-black mb-2">Compliance Score</h4>
              <div className="text-4xl font-black mb-4">A+</div>
              <div className="w-full bg-white/10 h-2 rounded-full mb-6">
                <div className="bg-purple-500 h-full rounded-full w-[95%]" />
              </div>
              <p className="text-xs font-bold text-slate-400">Validated against SnackShield Network Security Standards v4.2</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NetworkNodeProfile;
