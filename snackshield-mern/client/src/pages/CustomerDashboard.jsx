import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Scan, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Package,
  Calendar,
  Factory,
  MapPin,
  Clock,
  Award,
  TrendingUp,
  Sparkles,
  Camera,
  X
} from 'lucide-react';
import { verifyProduct } from '../services/api';
import { Html5Qrcode } from 'html5-qrcode';
import QRCode from 'react-qr-code';

const CustomerDashboard = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentScans, setRecentScans] = useState([]);

  useEffect(() => {
    // Load recent scans from localStorage
    const saved = localStorage.getItem('customerScans');
    if (saved) {
      try {
        setRecentScans(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    let html5QrCode = null;
    
    const startScanner = async () => {
      if (scanning) {
        html5QrCode = new Html5Qrcode("customer-reader");
        
        try {
          await html5QrCode.start(
            { facingMode: "environment" },
            { fps: 30, qrbox: { width: 250, height: 250 } },
            (decodedText) => {
              html5QrCode.stop().then(() => {
                setScanning(false);
                handleVerify(decodedText);
              }).catch(() => {});
            },
            () => {}
          );
        } catch (err) {
          console.error("Scanner error:", err);
          setScanning(false);
        }
      }
    };

    startScanner();

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(() => {});
      }
    };
  }, [scanning]);

  const handleVerify = async (qrCode) => {
    if (!qrCode?.trim()) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      const res = await verifyProduct({ 
        qrCode: qrCode.trim(),
        role: 'Customer',
        location: 'Customer Location',
        user: 'Customer'
      });
      
      const data = res.data;
      setResult(data);
      
      // Save to recent scans
      const newScan = {
        qrCode: qrCode.trim(),
        status: data.status,
        productName: data.productName,
        timestamp: new Date().toISOString()
      };
      
      const updated = [newScan, ...recentScans].slice(0, 5);
      setRecentScans(updated);
      localStorage.setItem('customerScans', JSON.stringify(updated));
      
    } catch (e) {
      if (e.response?.status === 404 || e.response?.data?.status === 'Fake') {
        setResult({ 
          status: 'Fake', 
          message: 'This product is not registered in our system. It may be counterfeit.' 
        });
      } else {
        setResult({ 
          status: 'Error', 
          message: 'Unable to verify. Please check your internet connection.' 
        });
      }
    }
    
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Genuine': return { bg: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-200', light: 'bg-emerald-50' };
      case 'Fake': return { bg: 'bg-red-500', text: 'text-red-600', border: 'border-red-200', light: 'bg-red-50' };
      default: return { bg: 'bg-slate-400', text: 'text-slate-600', border: 'border-slate-200', light: 'bg-slate-50' };
    }
  };

  const colors = result ? getStatusColor(result.status) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                <ShieldCheck size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900">SnackShield</h1>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Product Verification</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-700">Online</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Card */}
        {!result && !scanning && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200 mb-8"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-2xl">
                <Scan size={40} className="text-white" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-3">Verify Your Product</h2>
              <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">
                Scan the QR code on your product to instantly verify its authenticity and view its journey from factory to you.
              </p>
            </div>

            <button
              onClick={() => setScanning(true)}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 text-xl"
            >
              <Camera size={28} />
              <span>Scan QR Code</span>
            </button>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-slate-50 rounded-2xl">
                <div className="text-2xl font-black text-emerald-600 mb-1">100%</div>
                <div className="text-xs font-bold text-slate-500 uppercase">Secure</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-2xl">
                <div className="text-2xl font-black text-emerald-600 mb-1">Instant</div>
                <div className="text-xs font-bold text-slate-500 uppercase">Results</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-2xl">
                <div className="text-2xl font-black text-emerald-600 mb-1">Free</div>
                <div className="text-xs font-bold text-slate-500 uppercase">Always</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Scanner */}
        <AnimatePresence>
          {scanning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900 mb-8"
            >
              <div className="relative">
                <div id="customer-reader" className="w-full min-h-[400px]" />
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-emerald-500 rounded-tl-3xl" />
                  <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-emerald-500 rounded-tr-3xl" />
                  <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-emerald-500 rounded-bl-3xl" />
                  <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-emerald-500 rounded-br-3xl" />
                </div>
              </div>
              <div className="p-6 bg-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-white font-bold text-sm uppercase tracking-wider">Scanning...</span>
                </div>
                <button
                  onClick={() => setScanning(false)}
                  className="px-6 py-2 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl transition-all flex items-center gap-2"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl p-12 shadow-xl border border-slate-200 mb-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xl font-bold text-slate-600">Verifying Product...</p>
            </div>
          </motion.div>
        )}

        {/* Result Card */}
        <AnimatePresence mode="wait">
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className={`rounded-3xl overflow-hidden shadow-2xl border-4 ${colors.border} mb-8`}
            >
              {/* Status Header */}
              <div className={`${colors.bg} p-8 text-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white/10" />
                <div className="relative z-10">
                  {result.status === 'Genuine' ? (
                    <CheckCircle size={80} className="text-white mx-auto mb-4" strokeWidth={2} />
                  ) : result.status === 'Fake' ? (
                    <XCircle size={80} className="text-white mx-auto mb-4" strokeWidth={2} />
                  ) : (
                    <AlertTriangle size={80} className="text-white mx-auto mb-4" strokeWidth={2} />
                  )}
                  <h2 className="text-4xl font-black text-white mb-2">
                    {result.status === 'Genuine' ? 'VERIFIED AUTHENTIC' : result.status === 'Fake' ? 'NOT VERIFIED' : 'VERIFICATION ERROR'}
                  </h2>
                  <p className="text-white/90 font-bold text-lg">
                    {result.message || (result.status === 'Genuine' 
                      ? 'This product is genuine and safe to use' 
                      : 'This product could not be verified')}
                  </p>
                </div>
              </div>

              {/* Product Details */}
              {result.status === 'Genuine' && (
                <div className="bg-white p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {result.productName && (
                      <div className={`p-5 rounded-2xl ${colors.light} border ${colors.border}`}>
                        <div className="flex items-center gap-3 mb-2">
                          <Package size={20} className={colors.text} />
                          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Product</span>
                        </div>
                        <p className="text-xl font-black text-slate-900">{result.productName}</p>
                      </div>
                    )}
                    
                    {result.company && (
                      <div className={`p-5 rounded-2xl ${colors.light} border ${colors.border}`}>
                        <div className="flex items-center gap-3 mb-2">
                          <Factory size={20} className={colors.text} />
                          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Manufacturer</span>
                        </div>
                        <p className="text-xl font-black text-slate-900">{result.company}</p>
                      </div>
                    )}
                    
                    {result.manufactureDate && (
                      <div className={`p-5 rounded-2xl ${colors.light} border ${colors.border}`}>
                        <div className="flex items-center gap-3 mb-2">
                          <Calendar size={20} className={colors.text} />
                          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Manufactured</span>
                        </div>
                        <p className="text-xl font-black text-slate-900">
                          {new Date(result.manufactureDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    )}
                    
                    {result.expiryDate && (
                      <div className={`p-5 rounded-2xl ${colors.light} border ${colors.border}`}>
                        <div className="flex items-center gap-3 mb-2">
                          <Clock size={20} className={colors.text} />
                          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Expires</span>
                        </div>
                        <p className="text-xl font-black text-slate-900">
                          {new Date(result.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Trust Badge */}
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
                      <Award size={32} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-black text-emerald-900 mb-1">Authenticity Guaranteed</h3>
                      <p className="text-sm font-bold text-emerald-700">
                        This product has been verified through our secure blockchain-backed system. 
                        {result.totalScans > 0 && ` Verified ${result.totalScans} time${result.totalScans > 1 ? 's' : ''}.`}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="bg-slate-50 p-6 flex gap-3">
                <button
                  onClick={() => {
                    setResult(null);
                    setScanning(true);
                  }}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Scan size={20} />
                  Scan Another
                </button>
                <button
                  onClick={() => setResult(null)}
                  className="px-6 py-4 bg-white hover:bg-slate-100 border-2 border-slate-200 text-slate-900 font-bold rounded-xl transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Scans */}
        {recentScans.length > 0 && !result && !scanning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200"
          >
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <Clock size={24} className="text-slate-400" />
              Recent Scans
            </h3>
            <div className="space-y-3">
              {recentScans.map((scan, i) => {
                const scanColors = getStatusColor(scan.status);
                return (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${scanColors.bg}`} />
                      <div>
                        <p className="font-bold text-slate-900">{scan.productName || scan.qrCode}</p>
                        <p className="text-xs text-slate-500 font-medium">
                          {new Date(scan.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${scanColors.light} ${scanColors.text}`}>
                      {scan.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Info Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 font-medium">
            Powered by <span className="font-black text-emerald-600">SnackShield</span> — 
            Protecting consumers with blockchain-verified authenticity
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
