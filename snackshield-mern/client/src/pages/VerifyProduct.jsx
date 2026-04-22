import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Package, 
  Factory, 
  Barcode, 
  Calendar,
  ScanLine,
  CheckCircle2,
  XCircle,
  Loader2,
  MapPin,
  User
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { verifyProduct, recordScan } from '../services/api';
import { Html5Qrcode } from 'html5-qrcode';

const VerifyProduct = () => {
  const [pid, setPid] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [scanning, setScanning] = useState(false);

  React.useEffect(() => {
    let html5QrCode = null;
    
    const startScanner = async () => {
      if (scanning) {
        console.log('Initializing high-speed scanner...');
        html5QrCode = new Html5Qrcode("reader");
        
        const config = { 
          fps: 30, 
          qrbox: undefined, // Scan entire frame
          aspectRatio: undefined 
        };

        try {
          await html5QrCode.start(
            { facingMode: "environment" }, 
            config,
            (text) => {
              console.log('QR Scanned:', text);
              html5QrCode.stop().then(() => {
                setPid(text);
                setScanning(false);
                handleVerifyText(text);
              }).catch(err => console.error("Failed to stop scanner", err));
            },
            (err) => {
              // Frame-by-frame failures are normal
            }
          );
        } catch (err) {
          console.error("Failed to start scanner", err);
          setScanning(false);
        }
      }
    };

    startScanner();

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(err => console.error("Scanner cleanup failed", err));
      }
    };
  }, [scanning]);

  const handleVerifyText = async (scannedPid) => {
    if (!scannedPid?.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const res = await verifyProduct({ 
        qrCode: scannedPid.trim(),
        role: user.role || 'Customer',
        location: 'Mumbai, IN',
        user: user.company || 'Admin'
      });
      const data = res.data;
      setResult(data);
      setScanHistory(prev => [
        { id: scannedPid.trim(), status: data.status, timestamp: new Date().toLocaleTimeString() },
        ...prev
      ].slice(0, 5));
      // Record scan only if we got a real result
      try {
        await recordScan({ productId: scannedPid.trim(), result: data.status, location: 'Mumbai, IN', user: user.company || 'Admin' });
      } catch (_) {}
    } catch (e) {
      console.error('Verification error:', e);
      // Only show Fake if server explicitly said so (404 = not found = fake)
      // Network/server errors show a different message
      if (e.response?.status === 404 || e.response?.data?.status === 'Fake') {
        setResult({ status: 'Fake', message: 'No registered record found for this QR code. Possible counterfeit.' });
      } else if (e.response?.data?.status) {
        setResult(e.response.data);
      } else {
        setResult({ status: 'Error', message: 'Could not reach verification server. Check your connection.' });
      }
    }
    setLoading(false);
  };

  const handleVerify = async () => {
    if (!pid) return;
    await handleVerifyText(pid);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  return (
    <DashboardLayout title="Universal Verifier">
      {/* Header Overlay */}
      <div className="relative mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4 leading-none">
              Universal <span className="text-purple-600">Verifier</span>
            </h1>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                 {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />)}
              </div>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                Securing 4.2k Active Shipments Today
              </p>
            </div>
          </div>
          <div className="hidden lg:block">
             <div className="px-6 py-3 bg-emerald-100 rounded-2xl border-2 border-emerald-200 flex items-center gap-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Central Ledger Online</span>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Verification Core */}
        <div className="lg:col-span-8 space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border-2 border-slate-200 rounded-[3rem] p-8 md:p-14 shadow-2xl relative overflow-hidden"
          >
            {/* Background Aesthetics */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-6 mb-12">
                <div className="w-20 h-20 rounded-[2rem] bg-slate-900 flex items-center justify-center shadow-2xl rotate-3">
                  <ScanLine size={36} className="text-purple-400" strokeWidth={1} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">Identity Assessment</h3>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Cross-Reference Serial with Global Ledger</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="group">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">
                    Unit Identifier / QR Payload
                  </label>
                  <div className="relative">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3 border-r border-slate-200 pr-4">
                      <Barcode size={24} className="text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                    </div>
                    <input 
                      type="text" 
                      value={pid}
                      onChange={e => setPid(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-7 pl-20 pr-6 text-2xl font-black text-slate-900 placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-[12px] focus:ring-purple-500/5 transition-all shadow-inner"
                      placeholder="SCAN_ID_000000" 
                    />
                  </div>
                </div>

                {scanning && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="relative rounded-[2.5rem] overflow-hidden border-4 border-slate-900 shadow-2xl bg-black min-h-[300px] md:min-h-[400px] flex items-center justify-center group"
                  >
                    <div id="reader" className="w-full h-full" />
                    {/* HUD Overlay */}
                    <div className="absolute inset-0 pointer-events-none z-20">
                       <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-purple-500/50 rounded-tl-3xl" />
                       <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-purple-500/50 rounded-tr-3xl" />
                       <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-purple-500/50 rounded-bl-3xl" />
                       <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-purple-500/50 rounded-br-3xl" />
                       
                       <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent" />
                       <div className="absolute top-0 left-0 w-full h-1 bg-purple-500/50 blur-sm animate-[scan_3s_ease-in-out_infinite]" />
                       
                       <div className="absolute bottom-12 left-12 flex items-center gap-3">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                          <span className="text-white font-black uppercase tracking-[0.3em] text-[10px]">Active HUD Scan...</span>
                       </div>
                    </div>
                  </motion.div>
                )}

                <div className="flex flex-col md:flex-row gap-4 pt-4">
                  <button 
                    onClick={handleVerify}
                    disabled={loading || (!pid && !scanning)}
                    className="flex-[2] bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black py-7 rounded-[2rem] shadow-2xl hover:translate-y-[-4px] active:translate-y-[2px] transition-all flex items-center justify-center gap-4 text-xl uppercase tracking-widest border-b-8 border-slate-950"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={24} className="animate-spin text-purple-400" strokeWidth={3} />
                        Simulating Blockchain Sync...
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={24} className="text-purple-400" />
                        Execute Verification
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => setScanning(!scanning)}
                    className="flex-1 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-900 font-black rounded-[2rem] transition-all flex items-center justify-center gap-3 shadow-xl uppercase tracking-widest text-xs"
                  >
                    <ScanLine size={20} className={scanning ? 'text-purple-500' : ''} />
                    {scanning ? 'Halt Sensor' : 'Capture QR'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`rounded-[3rem] p-10 md:p-14 border-2 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] relative overflow-hidden ${
                  result.status === 'Genuine' 
                    ? 'bg-white border-emerald-100' 
                    : result.status === 'Error'
                    ? 'bg-white border-slate-200'
                    : 'bg-white border-red-100'
                }`}
              >
                <div className={`absolute inset-0 opacity-[0.03] pointer-events-none ${
                   result.status === 'Genuine' 
                     ? 'bg-gradient-to-br from-emerald-500 to-teal-500' 
                     : result.status === 'Error'
                     ? 'bg-gradient-to-br from-slate-400 to-slate-600'
                     : 'bg-gradient-to-br from-red-500 to-rose-500'
                }`} />

                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                   <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center shadow-2xl shrink-0 rotate-3 border-4 border-white ${
                      result.status === 'Genuine' ? 'bg-emerald-500' : result.status === 'Error' ? 'bg-slate-400' : 'bg-red-500'
                   }`}>
                      {result.status === 'Genuine' 
                        ? <ShieldCheck size={64} className="text-white" strokeWidth={1} /> 
                        : result.status === 'Error'
                        ? <Loader2 size={64} className="text-white" strokeWidth={1} />
                        : <ShieldAlert size={64} className="text-white" strokeWidth={1} />}
                   </div>
                   
                   <div className="text-center md:text-left flex-1">
                      <div className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${
                        result.status === 'Genuine' ? 'text-emerald-500' : result.status === 'Error' ? 'text-slate-400' : 'text-red-500'
                      }`}>
                         Security Report Generated
                      </div>
                      <h3 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter">
                         {result.status === 'Genuine' ? 'Authenticity Proven' : result.status === 'Error' ? 'Server Unreachable' : 'Threat Detected'}
                      </h3>
                      <p className="text-lg font-bold text-slate-500 leading-relaxed mb-8">
                         {result.message || (result.status === 'Genuine' 
                            ? 'Our AI-powered ledger consensus has successfully identified this item as a genuine factory asset. 100% Integrity guaranteed.' 
                            : 'No registered record found for this QR code. The asset may be counterfeit or unregistered.')}
                      </p>

                      {result.status === 'Genuine' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {result.productName && (
                           <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 group hover:border-emerald-200 transition-colors">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                    <Package size={24} />
                                 </div>
                                 <div className="text-left">
                                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Asset Name</span>
                                    <span className="font-black text-slate-900">{result.productName}</span>
                                 </div>
                              </div>
                           </div>
                           )}
                           {result.company && (
                           <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 group hover:border-emerald-200 transition-colors">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                    <User size={24} />
                                 </div>
                                 <div className="text-left">
                                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Manufacturer</span>
                                    <span className="font-black text-slate-900">{result.company}</span>
                                 </div>
                              </div>
                           </div>
                           )}
                           {result.batchId && (
                           <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 group hover:border-emerald-200 transition-colors">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                    <Barcode size={24} />
                                 </div>
                                 <div className="text-left">
                                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Batch ID</span>
                                    <span className="font-black text-slate-900">{result.batchId}</span>
                                 </div>
                              </div>
                           </div>
                           )}
                           {result.manufactureDate && (
                           <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 group hover:border-emerald-200 transition-colors">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                    <Calendar size={24} />
                                 </div>
                                 <div className="text-left">
                                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Production Date</span>
                                    <span className="font-black text-slate-900">{new Date(result.manufactureDate).toLocaleDateString()}</span>
                                 </div>
                              </div>
                           </div>
                           )}
                           {result.expiryDate && (
                           <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 group hover:border-emerald-200 transition-colors">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                    <Calendar size={24} />
                                 </div>
                                 <div className="text-left">
                                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Expiry Date</span>
                                    <span className="font-black text-slate-900">{new Date(result.expiryDate).toLocaleDateString()}</span>
                                 </div>
                              </div>
                           </div>
                           )}
                           {result.riskScore !== undefined && (
                           <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 group hover:border-emerald-200 transition-colors">
                              <div className="flex items-center gap-4">
                                 <div className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg transition-all ${result.riskScore > 60 ? 'text-red-500' : 'text-emerald-500'}`}>
                                    <ShieldCheck size={24} />
                                 </div>
                                 <div className="text-left">
                                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Risk Score</span>
                                    <span className={`font-black ${result.riskScore > 60 ? 'text-red-600' : 'text-emerald-600'}`}>{result.riskScore}/100 — {result.riskLevel || 'Low'}</span>
                                 </div>
                              </div>
                           </div>
                           )}
                        </div>
                      )}
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Intelligence Hub */}
        <div className="lg:col-span-4 space-y-8">
          {/* Security Scoreboard */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900 rounded-[3rem] p-10 text-white border-2 border-slate-800 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
            <h3 className="text-xl font-black mb-8 tracking-tight">Network Integrity</h3>
            
            <div className="space-y-8">
               <div>
                  <div className="flex justify-between items-end mb-4">
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Authenticity Rate</span>
                     <span className="text-3xl font-black text-emerald-400 leading-none">98.4%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-400 rounded-full" style={{ width: '98.4%' }} />
                  </div>
               </div>

               <div>
                  <div className="flex justify-between items-end mb-4">
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fraud Prevention</span>
                     <span className="text-3xl font-black text-purple-400 leading-none">42,019</span>
                  </div>
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Total Threats Mitigated Since Launch</div>
               </div>
            </div>
          </motion.div>

          {/* Node History */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border-2 border-slate-200 rounded-[3rem] p-10 shadow-xl"
          >
            <h3 className="text-xl font-black text-slate-900 mb-8">Node History</h3>
            {scanHistory.length > 0 ? (
              <div className="space-y-4">
                {scanHistory.map((scan, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group hover:bg-slate-900 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                       <div className={`w-3 h-3 rounded-full ${scan.status === 'Genuine' ? 'bg-emerald-500' : 'bg-red-500'} shadow-lg group-hover:scale-150 transition-transform`} />
                       <div className="text-sm font-black text-slate-900 group-hover:text-white transition-colors">{scan.id}</div>
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase">{scan.timestamp}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 opacity-30">
                <ScanLine size={48} className="mx-auto mb-4" strokeWidth={1} />
                <p className="font-black uppercase tracking-widest text-[10px]">No Signals Detected</p>
              </div>
            )}
          </motion.div>

          {/* Location Shield */}
          <div className="p-10 bg-indigo-600 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),transparent)]" />
             <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                      <MapPin size={24} />
                   </div>
                   <span className="font-black uppercase tracking-widest text-xs">Verified Node</span>
                </div>
                <h4 className="text-2xl font-black mb-2">Mumbai Digital Hub</h4>
                <p className="text-indigo-200 font-bold text-sm leading-relaxed mb-6">Cross-syncing verified batches with Singapore and Dubai clusters in real-time.</p>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Low Latency Sync</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const styles = `
  #reader video {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    border-radius: 2rem;
  }
  #reader {
    border: none !important;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default VerifyProduct;
