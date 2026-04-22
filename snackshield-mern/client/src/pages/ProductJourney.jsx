import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Factory, 
  Truck, 
  Store, 
  User, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Search,
  TrendingUp,
  Package,
  Activity,
  Globe
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { getProductJourney, getRiskScore } from '../services/api';

const ProductJourney = () => {
  const navigate = useNavigate();
  const [productId, setProductId] = useState('');
  const [journey, setJourney] = useState(null);
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(false);

  const roleIcons = {
    Manufacturer: Factory,
    Distributor: Truck,
    Retailer: Store,
    Customer: User
  };

  const roleColors = {
    Manufacturer: 'from-purple-600 to-purple-500',
    Distributor: 'from-teal-600 to-teal-500',
    Retailer: 'from-amber-600 to-amber-500',
    Customer: 'from-emerald-600 to-emerald-500'
  };

  const statusColors = {
    Verified: 'text-emerald-700 bg-emerald-50 border-emerald-300',
    'In Transit': 'text-amber-700 bg-amber-50 border-amber-300',
    Delivered: 'text-teal-700 bg-teal-50 border-teal-300',
    Suspicious: 'text-red-700 bg-red-50 border-red-300'
  };

  const handleSearch = async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const [journeyRes, riskRes] = await Promise.all([
        getProductJourney(productId),
        getRiskScore(productId)
      ]);
      setJourney(journeyRes.data);
      setRiskData(riskRes.data);
    } catch (error) {
      console.error('Error fetching journey:', error);
      alert('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score) => {
    if (score < 30) return 'text-emerald-700';
    if (score < 60) return 'text-amber-700';
    return 'text-red-700';
  };

  const getRiskBg = (score) => {
    if (score < 30) return 'bg-emerald-50 border-emerald-300';
    if (score < 60) return 'bg-amber-50 border-amber-300';
    return 'bg-red-50 border-red-300';
  };

  return (
    <DashboardLayout title="Product Journey">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-black text-slate-900 mb-2">Product Journey Timeline</h1>
        <p className="text-slate-600 font-semibold">Track products from manufacturer to customer with complete supply chain visibility</p>
      </div>

      {/* Search */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-2 border-slate-200 rounded-2xl p-6 mb-8 shadow-xl"
      >
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={22} strokeWidth={2.5} />
            <input 
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter Product ID or QR Code (e.g., SNK-X00-1122)"
              className="w-full bg-white border-2 border-slate-300 rounded-xl py-4 pl-12 pr-4 text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
            />
          </div>
          <button 
            onClick={handleSearch}
            disabled={loading || !productId}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg"
          >
            {loading ? 'Searching...' : 'Track Journey'}
          </button>
        </div>
      </motion.div>

      {journey && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Timeline Content */}
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border-2 border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
            >
              {/* Header Info */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-slate-900 flex items-center justify-center shadow-2xl rotate-3 hover:rotate-0 transition-transform cursor-pointer group">
                    <Package size={40} className="text-white group-hover:scale-110 transition-transform" strokeWidth={1} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{journey.productName}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                       <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-200">
                         Unit: {journey.qrCode}
                       </span>
                       <span className="px-3 py-1 bg-purple-100 text-purple-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-purple-200">
                         Batch: {journey.batchId}
                       </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <div className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 shadow-lg ${
                    journey.journeyHistory?.[journey.journeyHistory.length - 1]?.status === 'Verified' 
                      ? 'bg-emerald-500 text-white border-emerald-400' 
                      : 'bg-amber-500 text-white border-amber-400'
                  }`}>
                    {journey.journeyHistory?.[journey.journeyHistory.length - 1]?.status || 'Node Pending'}
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Authenticated</p>
                </div>
              </div>

              {/* Progress Tracker Layer */}
              <div className="mb-20 px-4">
                <div className="relative">
                  <div className="h-4 bg-slate-100 rounded-full w-full absolute top-1/2 -translate-y-1/2 left-0 z-0 border-2 border-slate-200 shadow-inner" />
                  <div 
                    className="h-4 bg-gradient-to-r from-purple-600 via-teal-500 to-emerald-500 rounded-full absolute top-1/2 -translate-y-1/2 left-0 z-10 transition-all duration-1000 border-2 border-white shadow-lg shadow-purple-500/20" 
                    style={{ width: `${Math.min((journey.journeyHistory?.length / 4) * 100, 100)}%` }}
                  />
                  
                  <div className="relative z-20 flex justify-between">
                    {['Manufacturer', 'Distributor', 'Retailer', 'Customer'].map((role, i) => {
                      const step = journey.journeyHistory?.find(s => s.role === role);
                      const isActive = !!step;
                      const Icon = roleIcons[role];
                      
                      return (
                        <div key={role} className="flex flex-col items-center">
                          <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 border-4 ${
                            isActive 
                              ? 'bg-white border-purple-500 text-purple-600 shadow-2xl scale-110' 
                              : 'bg-slate-50 border-slate-200 text-slate-300'
                          }`}>
                            <Icon size={24} strokeWidth={2} />
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-widest mt-4 ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                            {role}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Enhanced Vertical Journey */}
              <div className="space-y-12 relative">
                <div className="absolute left-8 top-8 bottom-8 w-1.5 bg-slate-100 rounded-full hidden md:block" />
                
                {journey.journeyHistory?.map((step, index) => {
                  const Icon = roleIcons[step.role] || Package;
                  const isFirst = index === 0;
                  const isLast = index === journey.journeyHistory.length - 1;

                  return (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      className="relative md:pl-24 group"
                    >
                      {/* Node Indicator */}
                      <div className={`absolute left-0 top-1/2 -translate-y-1/2 hidden md:flex w-16 h-16 rounded-2xl bg-gradient-to-br ${roleColors[step.role]} items-center justify-center text-white shadow-xl border-4 border-white z-10 transition-transform group-hover:scale-110`}>
                        <Icon size={28} />
                      </div>

                      <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-8 shadow-lg hover:border-purple-200 transition-all group-hover:shadow-2xl">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="text-xl font-black text-slate-900 tracking-tight">{step.role} Node</h4>
                              {isLast && <span className="px-3 py-0.5 bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase tracking-widest rounded-full border border-emerald-200">Current Site</span>}
                            </div>
                            <p className="text-sm font-black text-purple-600 uppercase tracking-widest">{step.user}</p>
                          </div>
                          <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColors[step.status]}`}>
                            {step.status}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
                           <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                               <MapPin size={20} />
                             </div>
                             <div>
                               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Facility Location</div>
                               <div className="text-sm font-bold text-slate-700">{step.city}, {step.country}</div>
                             </div>
                           </div>
                           <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                               <Clock size={20} />
                             </div>
                             <div>
                               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ingress Timestamp</div>
                               <div className="text-sm font-bold text-slate-700">{new Date(step.timestamp).toLocaleString()}</div>
                             </div>
                           </div>
                        </div>

                        {step.notes && (
                          <div className="mt-6 flex gap-3 items-start">
                             <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                               <TrendingUp size={12} />
                             </div>
                             <p className="text-sm font-bold text-slate-500 leading-relaxed italic">{step.notes}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Intelligence Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Risk Terminal */}
            {riskData && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden text-white border-2 border-slate-800`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h4 className="font-black text-xl tracking-tight">AI Intelligence</h4>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Risk Analysis Model 3.4</p>
                    </div>
                    <div className={`p-4 rounded-2xl bg-white/5 border-2 ${riskData.riskScore < 60 ? 'border-emerald-500/50' : 'border-red-500/50'}`}>
                       <div className={`text-3xl font-black ${riskData.riskScore < 60 ? 'text-emerald-400' : 'text-red-400'}`}>{riskData.riskScore}</div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-purple-500 rounded-full" style={{ width: `${riskData.riskScore}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                       <span>Low Risk</span>
                       <span>Current: {riskData.riskLevel}</span>
                       <span>Severe</span>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {(riskData.reasons || ["Authenticity confirmed via blockchain synchronization"]).map((reason, i) => (
                      <li key={i} className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5 text-sm font-bold leading-tight">
                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Live Network Feed */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border-2 border-slate-200 rounded-[2.5rem] p-8 shadow-xl"
            >
               <div className="flex items-center justify-between mb-8">
                 <h4 className="font-black text-slate-900">Live Network Feed</h4>
                 <div className="p-2 bg-emerald-100 rounded-lg">
                    <Activity size={16} className="text-emerald-600 animate-pulse" />
                 </div>
               </div>
               
               <div className="space-y-6">
                  {[
                    { node: 'Delhi Logistics', event: 'Inbound Verification', time: '2m ago' },
                    { node: 'Neo Retail Hub', event: 'Inventory Sync', time: '14m ago' },
                    { node: 'Mumbai Factory', event: 'Batch Serialized', time: '1h ago' },
                  ].map((evt, i) => (
                    <div key={i} className="flex gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer group">
                       <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                          <Activity size={18} />
                       </div>
                       <div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{evt.time}</div>
                          <div className="text-sm font-black text-slate-900">{evt.event}</div>
                          <div className="text-xs font-bold text-slate-500">{evt.node}</div>
                       </div>
                    </div>
                  ))}
               </div>

               <button 
                  onClick={() => navigate('/history')}
                  className="w-full mt-8 py-4 bg-slate-50 hover:bg-slate-100 text-slate-900 font-black rounded-2xl transition-all border border-slate-200 text-xs uppercase tracking-widest"
               >
                  View Full Network Logs
               </button>
            </motion.div>

            {/* Global Traceability Ledger */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
               <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:24px_24px]" />
               <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <Globe size={40} className="text-purple-400 animate-[spin_10s_linear_infinite]" />
                  </div>
                  <h4 className="text-white font-black text-xl mb-2 tracking-tight">Ledger Immutable</h4>
                  <p className="text-slate-500 text-xs font-bold mb-6">Cross-node consensus achieved across 4 continents.</p>
                  
                  <div className="w-full grid grid-cols-2 gap-4">
                     <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-white font-black">99.9%</div>
                        <div className="text-[8px] text-slate-500 font-black uppercase">Consensus</div>
                     </div>
                     <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-white font-black">256-bit</div>
                        <div className="text-[8px] text-slate-500 font-black uppercase">Hashing</div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {!journey && !loading && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-32 bg-white border-4 border-dashed border-slate-200 rounded-[3rem] shadow-2xl"
        >
          <div className="w-32 h-32 rounded-[2.5rem] bg-purple-50 flex items-center justify-center mx-auto mb-8 shadow-2xl rotate-3">
            <Search size={64} className="text-purple-600" strokeWidth={1} />
          </div>
          <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Trace Your Supply Chain</h3>
          <p className="text-slate-500 font-bold max-w-md mx-auto mb-10 text-lg">Enter a unique QR ID or Batch Reference to access the global immutable ledger.</p>
          
          <div className="flex justify-center gap-8">
             <div className="text-center">
                <div className="text-2xl font-black text-slate-900">1.2M+</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Units Tracked</div>
             </div>
             <div className="h-10 w-px bg-slate-200" />
             <div className="text-center">
                <div className="text-2xl font-black text-slate-900">0%</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Data Gaps</div>
             </div>
          </div>
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default ProductJourney;
