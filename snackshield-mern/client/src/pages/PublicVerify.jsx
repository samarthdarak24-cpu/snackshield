import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Package, 
  Factory, 
  Calendar,
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Flag,
  ScanLine
} from 'lucide-react';
import { verifyProduct, getProductJourney, getRiskScore } from '../services/api';
import { Html5Qrcode } from 'html5-qrcode';

const PublicVerify = () => {
  const [searchParams] = useSearchParams();
  const [productId, setProductId] = useState(searchParams.get('id') || '');
  const [result, setResult] = useState(null);
  const [journey, setJourney] = useState(null);
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (searchParams.get('id')) {
      handleVerify(searchParams.get('id'));
    }
  }, []);

  useEffect(() => {
    let html5QrCode = null;
    
    const startScanner = async () => {
      if (scanning) {
        html5QrCode = new Html5Qrcode("reader");
        const config = { 
          fps: 30, 
          qrbox: undefined 
        };

        try {
          await html5QrCode.start(
            { facingMode: "environment" },
            config,
            (text) => {
              html5QrCode.stop().then(() => {
                setProductId(text);
                setScanning(false);
                handleVerify(text);
              });
            },
            (err) => {}
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
        html5QrCode.stop().catch(e => {});
      }
    };
  }, [scanning]);

  const handleVerify = async (id = productId) => {
    if (!id) return;
    setLoading(true);
    try {
      const verifyRes = await verifyProduct({ 
        qrCode: id, 
        role: 'Customer', 
        location: 'Consumer Scan',
        user: 'Public User'
      });
      setResult(verifyRes.data);

      if (verifyRes.data.status === 'Genuine') {
        const [journeyRes, riskRes] = await Promise.all([
          getProductJourney(id).catch(() => null),
          getRiskScore(id).catch(() => null)
        ]);
        if (journeyRes) setJourney(journeyRes.data);
        if (riskRes) setRiskData(riskRes.data);
      }
    } catch (error) {
      setResult({ status: 'Fake', message: 'Product not found in our database' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-slate-100">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/8 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-surface/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white">
              <ShieldCheck size={22} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold">SnackShield</span>
          </Link>
          <Link 
            to="/login" 
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-all"
          >
            Business Login
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        {!result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-500/25">
              <ShieldCheck size={40} className="text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Verify Product <span className="gradient-text">Authenticity</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Scan the QR code or enter the product ID to instantly verify if your product is genuine
            </p>
          </motion.div>
        )}

        {/* Search/Scan Section */}
        {!result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="bg-surface-2/50 backdrop-blur border border-white/5 rounded-2xl p-8">
              <div className="flex gap-4 mb-6">
                <input 
                  type="text"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
                  placeholder="Enter Product ID (e.g., SNK-X00-1122)"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500/30 transition-all"
                />
                <button 
                  onClick={() => handleVerify()}
                  disabled={loading || !productId}
                  className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-all"
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
              </div>

              <div className="text-center">
                <button 
                  onClick={() => setScanning(!scanning)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-all"
                >
                  <ScanLine size={18} className={scanning ? 'text-primary-400' : ''} />
                  {scanning ? 'Cancel Scan' : 'Scan QR Code'}
                </button>
              </div>

              {scanning && (
                <div className="mt-6 bg-white/5 rounded-xl p-4 border border-white/10">
                  <div id="reader" className="w-full max-w-sm mx-auto overflow-hidden rounded-xl"></div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Result Section */}
        {result && (
          <div className="max-w-4xl mx-auto">
            {/* Status Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-3xl p-12 border-2 mb-8 ${
                result.status === 'Genuine' 
                  ? 'bg-emerald-500/5 border-emerald-500/20' 
                  : 'bg-red-500/5 border-red-500/20'
              }`}
            >
              <div className="text-center">
                <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 ${
                  result.status === 'Genuine' 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {result.status === 'Genuine' ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
                </div>
                <h2 className="text-4xl font-bold text-white mb-3">
                  {result.status === 'Genuine' ? 'Authentic Product ✓' : 'Counterfeit Detected ✗'}
                </h2>
                <p className="text-lg text-slate-400 max-w-xl mx-auto">
                  {result.status === 'Genuine' 
                    ? 'This product has been verified as genuine in our secure blockchain database.' 
                    : 'This product could not be verified. It may be counterfeit. Do not purchase or consume.'}
                </p>
              </div>
            </motion.div>

            {result.status === 'Genuine' && (
              <>
                {/* Product Details */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-surface-2/50 backdrop-blur border border-white/5 rounded-2xl p-8 mb-6"
                >
                  <h3 className="text-2xl font-bold text-white mb-6">Product Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: 'Product Name', value: result.productName, icon: Package },
                      { label: 'Manufacturer', value: result.company, icon: Factory },
                      { label: 'Batch ID', value: result.batchId, icon: TrendingUp },
                      { label: 'Manufacture Date', value: new Date(result.manufactureDate).toLocaleDateString(), icon: Calendar },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                        <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                          <item.icon size={24} className="text-primary-400" />
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 mb-1">{item.label}</div>
                          <div className="text-lg font-semibold text-white">{item.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Risk Score */}
                {riskData && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-surface-2/50 backdrop-blur border border-white/5 rounded-2xl p-8 mb-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-white">AI Trust Score</h3>
                      <div className={`text-4xl font-bold ${riskData.riskScore < 30 ? 'text-emerald-400' : riskData.riskScore < 60 ? 'text-amber-400' : 'text-red-400'}`}>
                        {100 - riskData.riskScore}%
                      </div>
                    </div>
                    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${riskData.riskScore < 30 ? 'bg-emerald-500' : riskData.riskScore < 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${100 - riskData.riskScore}%` }}
                      />
                    </div>
                    <p className="text-sm text-slate-400 mt-4">
                      This product has been scanned {result.totalScans} times and verified across multiple locations.
                    </p>
                  </motion.div>
                )}

                {/* Scan History Summary */}
                {journey && journey.journeyHistory && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-surface-2/50 backdrop-blur border border-white/5 rounded-2xl p-8 mb-6"
                  >
                    <h3 className="text-2xl font-bold text-white mb-6">Supply Chain Journey</h3>
                    <div className="space-y-4">
                      {journey.journeyHistory.slice(0, 3).map((step, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                          <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                            <MapPin size={20} className="text-primary-400" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-white">{step.role}</div>
                            <div className="text-sm text-slate-400">{step.city}, {step.country}</div>
                          </div>
                          <div className="text-xs text-slate-500">{new Date(step.timestamp).toLocaleDateString()}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </>
            )}

            {/* Report Button */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 font-medium transition-all">
                <Flag size={18} />
                Report Fake Product
              </button>
              <p className="text-sm text-slate-500 mt-4">
                Help us fight counterfeits by reporting suspicious products
              </p>
            </motion.div>

            {/* Verify Another */}
            <div className="text-center mt-8">
              <button 
                onClick={() => {
                  setResult(null);
                  setJourney(null);
                  setRiskData(null);
                  setProductId('');
                }}
                className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
              >
                ← Verify Another Product
              </button>
            </div>
          </div>
        )}

        {/* Trust Badges */}
        {!result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-8 text-slate-500 text-sm"
          >
            {['Blockchain Verified', 'AI-Powered Detection', 'Real-Time Tracking', 'Trusted by 12K+ Brands'].map((badge, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>{badge}</span>
              </div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
};

const styles = `
  #reader video {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    border-radius: 1rem;
  }
  #reader {
    border: none !important;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default PublicVerify;
