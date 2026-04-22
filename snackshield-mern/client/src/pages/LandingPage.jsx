import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Fingerprint, 
  Globe, 
  Zap, 
  Shield, 
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Lock,
  ScanLine,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Users,
  Award,
  MapPin,
  Activity,
  Eye,
  Layers,
  AlertTriangle,
  Factory,
  Camera,
  X,
  Package,
  Calendar,
  XCircle
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { verifyProduct } from '../services/api';

// Quick Scan Component
const QuickScanSection = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let html5QrCode = null;
    
    const startScanner = async () => {
      if (scanning) {
        html5QrCode = new Html5Qrcode("landing-scanner");
        
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
        location: 'Landing Page',
        user: 'Visitor'
      });
      
      setResult(res.data);
    } catch (e) {
      if (e.response?.status === 404 || e.response?.data?.status === 'Fake') {
        setResult({ 
          status: 'Fake', 
          message: 'Product not registered. Possible counterfeit.' 
        });
      } else {
        setResult({ 
          status: 'Error', 
          message: 'Unable to verify. Please try again.' 
        });
      }
    }
    
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Genuine': return { bg: 'from-emerald-600 to-teal-600', icon: CheckCircle2, text: 'VERIFIED AUTHENTIC' };
      case 'Fake': return { bg: 'from-red-600 to-rose-600', icon: XCircle, text: 'NOT VERIFIED' };
      default: return { bg: 'from-slate-600 to-slate-700', icon: AlertTriangle, text: 'VERIFICATION ERROR' };
    }
  };

  const colors = result ? getStatusColor(result.status) : null;

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-[#0B0F1A] to-[#0F1419] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
            <Sparkles size={16} className="text-emerald-400" />
            <span className="text-emerald-300 text-sm font-bold uppercase tracking-wider">Instant Verification</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
            Scan Any Product <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Right Now</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Point your camera at any SnackShield QR code to instantly verify authenticity. No app download required.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!scanning && !result && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-12 text-center"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                <Camera size={48} className="text-white" />
              </div>
              <button
                onClick={() => setScanning(true)}
                className="px-12 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-lg rounded-2xl shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all hover:-translate-y-1 flex items-center gap-3 mx-auto"
              >
                <ScanLine size={24} />
                Start Scanning
                <ArrowRight size={20} />
              </button>
              <p className="text-slate-400 text-sm mt-6">Works on any smartphone or tablet with a camera</p>
            </motion.div>
          )}

          {scanning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 rounded-3xl overflow-hidden border-4 border-emerald-500 shadow-2xl shadow-emerald-500/30"
            >
              <div className="relative">
                <div id="landing-scanner" className="w-full min-h-[400px]" />
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-emerald-400 rounded-tl-3xl" />
                  <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-emerald-400 rounded-tr-3xl" />
                  <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-emerald-400 rounded-bl-3xl" />
                  <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-emerald-400 rounded-br-3xl" />
                </div>
              </div>
              <div className="p-6 bg-slate-900 flex items-center justify-between border-t-4 border-emerald-500">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-white font-bold uppercase tracking-wider">Scanning...</span>
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

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-16 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xl font-bold text-white">Verifying Product...</p>
            </motion.div>
          )}

          {result && !loading && colors && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className={`bg-gradient-to-r ${colors.bg} p-10 text-center`}>
                <colors.icon size={80} className="text-white mx-auto mb-4" strokeWidth={2} />
                <h3 className="text-4xl font-black text-white mb-2">{colors.text}</h3>
                <p className="text-white/90 font-bold text-lg">
                  {result.message || (result.status === 'Genuine' 
                    ? 'This product is genuine and safe' 
                    : 'This product could not be verified')}
                </p>
              </div>

              {result.status === 'Genuine' && (
                <div className="bg-slate-900 p-8">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {result.productName && (
                      <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700">
                        <div className="flex items-center gap-2 mb-2">
                          <Package size={16} className="text-emerald-400" />
                          <span className="text-xs font-bold text-slate-400 uppercase">Product</span>
                        </div>
                        <p className="text-white font-bold">{result.productName}</p>
                      </div>
                    )}
                    {result.company && (
                      <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700">
                        <div className="flex items-center gap-2 mb-2">
                          <Factory size={16} className="text-emerald-400" />
                          <span className="text-xs font-bold text-slate-400 uppercase">Manufacturer</span>
                        </div>
                        <p className="text-white font-bold">{result.company}</p>
                      </div>
                    )}
                    {result.manufactureDate && (
                      <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar size={16} className="text-emerald-400" />
                          <span className="text-xs font-bold text-slate-400 uppercase">Manufactured</span>
                        </div>
                        <p className="text-white font-bold">
                          {new Date(result.manufactureDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {result.expiryDate && (
                      <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar size={16} className="text-emerald-400" />
                          <span className="text-xs font-bold text-slate-400 uppercase">Expires</span>
                        </div>
                        <p className="text-white font-bold">
                          {new Date(result.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 flex items-center gap-4">
                    <Award size={32} className="text-emerald-400 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-black mb-1">Authenticity Guaranteed</h4>
                      <p className="text-emerald-300 text-sm">
                        Verified through blockchain-backed security system
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-slate-800 p-6 flex gap-3">
                <button
                  onClick={() => {
                    setResult(null);
                    setScanning(true);
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all"
                >
                  Scan Another
                </button>
                <button
                  onClick={() => setResult(null)}
                  className="px-6 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            to="/customer"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
          >
            Or visit dedicated scanner page
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const features = [
    { 
      icon: BarChart3, 
      title: 'Real-Time Analytics', 
      desc: 'Comprehensive fraud detection reports and predictive insights with interactive charts to protect your brand proactively.',
      color: 'from-purple-600 to-purple-400',
      gradient: 'from-purple-500/20 to-purple-600/5',
      link: '/analytics'
    },
    { 
      icon: Shield, 
      title: 'Batch Management', 
      desc: 'Create, track, and manage product batches with QR code generation for complete supply chain visibility.',
      color: 'from-emerald-600 to-emerald-400',
      gradient: 'from-emerald-500/20 to-emerald-600/5',
      link: '/batch-management'
    },
    { 
      icon: AlertTriangle, 
      title: 'Fraud Alerts', 
      desc: 'Instant notifications for suspicious activities and counterfeit detection with real-time monitoring.',
      color: 'from-orange-600 to-orange-400',
      gradient: 'from-orange-500/20 to-orange-600/5',
      link: '/alerts'
    },
    { 
      icon: ScanLine, 
      title: 'Scan History', 
      desc: 'Complete audit trail of all product verifications with geolocation tracking and detailed scan analytics.',
      color: 'from-cyan-600 to-cyan-400',
      gradient: 'from-cyan-500/20 to-cyan-600/5',
      link: '/scan-history'
    },
  ];

  const stats = [
    { value: '99.9%', label: 'Detection Accuracy', icon: Award },
    { value: '50M+', label: 'Products Verified', icon: ShieldCheck },
    { value: '12K+', label: 'Global Partners', icon: Users },
    { value: '$2B+', label: 'Fraud Prevented', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-slate-100 font-sans overflow-x-hidden">
      {/* Animated Background Effects with Images */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-indigo-600/20 to-purple-600/10 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-cyan-600/15 to-teal-600/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-orange-600/10 to-pink-600/5 rounded-full blur-[180px]" />
        
        {/* QR Code Pattern Background */}
        <div className="absolute top-20 right-10 w-64 h-64 opacity-[0.03] animate-float">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect x="0" y="0" width="20" height="20" fill="currentColor" className="text-purple-400"/>
            <rect x="25" y="0" width="20" height="20" fill="currentColor" className="text-purple-400"/>
            <rect x="50" y="0" width="20" height="20" fill="currentColor" className="text-purple-400"/>
            <rect x="0" y="25" width="20" height="20" fill="currentColor" className="text-purple-400"/>
            <rect x="50" y="25" width="20" height="20" fill="currentColor" className="text-purple-400"/>
            <rect x="0" y="50" width="20" height="20" fill="currentColor" className="text-purple-400"/>
            <rect x="25" y="50" width="20" height="20" fill="currentColor" className="text-purple-400"/>
            <rect x="50" y="50" width="20" height="20" fill="currentColor" className="text-purple-400"/>
            <rect x="75" y="25" width="20" height="20" fill="currentColor" className="text-teal-400"/>
            <rect x="75" y="50" width="20" height="20" fill="currentColor" className="text-teal-400"/>
            <rect x="75" y="75" width="20" height="20" fill="currentColor" className="text-teal-400"/>
            <rect x="25" y="75" width="20" height="20" fill="currentColor" className="text-emerald-400"/>
            <rect x="50" y="75" width="20" height="20" fill="currentColor" className="text-emerald-400"/>
          </svg>
        </div>

        {/* Shield Pattern */}
        <div className="absolute bottom-32 left-10 w-48 h-48 opacity-[0.03]" style={{ animation: 'float 6s ease-in-out infinite', animationDelay: '1s' }}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50 10 L80 25 L80 50 Q80 75 50 90 Q20 75 20 50 L20 25 Z" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  className="text-purple-400"/>
            <path d="M50 25 L70 35 L70 50 Q70 65 50 75 Q30 65 30 50 L30 35 Z" 
                  fill="currentColor" 
                  className="text-purple-400/30"/>
            <path d="M45 45 L50 40 L55 45 L50 60 Z" 
                  fill="currentColor" 
                  className="text-purple-400"/>
          </svg>
        </div>

        {/* Blockchain Network Pattern */}
        <div className="absolute top-1/3 left-20 w-96 h-96 opacity-[0.04]" style={{ animation: 'float 8s ease-in-out infinite', animationDelay: '2s' }}>
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Nodes */}
            <circle cx="50" cy="50" r="8" fill="currentColor" className="text-purple-400"/>
            <circle cx="150" cy="50" r="8" fill="currentColor" className="text-teal-400"/>
            <circle cx="100" cy="100" r="8" fill="currentColor" className="text-emerald-400"/>
            <circle cx="50" cy="150" r="8" fill="currentColor" className="text-amber-400"/>
            <circle cx="150" cy="150" r="8" fill="currentColor" className="text-purple-400"/>
            {/* Connections */}
            <line x1="50" y1="50" x2="150" y2="50" stroke="currentColor" strokeWidth="1" className="text-purple-400/50"/>
            <line x1="50" y1="50" x2="100" y2="100" stroke="currentColor" strokeWidth="1" className="text-purple-400/50"/>
            <line x1="150" y1="50" x2="100" y2="100" stroke="currentColor" strokeWidth="1" className="text-teal-400/50"/>
            <line x1="100" y1="100" x2="50" y2="150" stroke="currentColor" strokeWidth="1" className="text-emerald-400/50"/>
            <line x1="100" y1="100" x2="150" y2="150" stroke="currentColor" strokeWidth="1" className="text-emerald-400/50"/>
            <line x1="50" y1="150" x2="150" y2="150" stroke="currentColor" strokeWidth="1" className="text-amber-400/50"/>
          </svg>
        </div>

        {/* Supply Chain Icons */}
        <div className="absolute top-1/2 right-20 w-80 h-80 opacity-[0.04]" style={{ animation: 'float 7s ease-in-out infinite' }}>
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Factory */}
            <rect x="20" y="60" width="40" height="40" fill="currentColor" className="text-purple-400"/>
            <rect x="30" y="50" width="5" height="15" fill="currentColor" className="text-purple-400"/>
            <rect x="45" y="45" width="5" height="20" fill="currentColor" className="text-purple-400"/>
            {/* Arrow */}
            <path d="M70 80 L90 80 L85 75 M90 80 L85 85" stroke="currentColor" strokeWidth="2" className="text-teal-400"/>
            {/* Truck */}
            <rect x="100" y="70" width="35" height="20" fill="currentColor" className="text-teal-400"/>
            <rect x="130" y="75" width="10" height="15" fill="currentColor" className="text-teal-400"/>
            <circle cx="110" cy="92" r="5" fill="currentColor" className="text-teal-400"/>
            <circle cx="130" cy="92" r="5" fill="currentColor" className="text-teal-400"/>
            {/* Arrow */}
            <path d="M70 120 L90 120 L85 115 M90 120 L85 125" stroke="currentColor" strokeWidth="2" className="text-emerald-400"/>
            {/* Store */}
            <rect x="100" y="110" width="40" height="30" fill="currentColor" className="text-emerald-400"/>
            <path d="M95 110 L120 95 L145 110" fill="currentColor" className="text-emerald-400"/>
          </svg>
        </div>

        {/* Scanning Animation */}
        <div className="absolute bottom-1/4 right-1/3 w-56 h-56 opacity-[0.04]" style={{ animation: 'float 5s ease-in-out infinite', animationDelay: '3s' }}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-400"/>
            <rect x="25" y="25" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="1" className="text-purple-400/50"/>
            <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="2" className="text-teal-400 animate-pulse"/>
            <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400"/>
            <path d="M50 40 L50 60 M40 50 L60 50" stroke="currentColor" strokeWidth="2" className="text-emerald-400"/>
          </svg>
        </div>

        {/* Checkmark Pattern */}
        <div className="absolute top-2/3 left-1/3 w-40 h-40 opacity-[0.04]" style={{ animation: 'float 6s ease-in-out infinite', animationDelay: '4s' }}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-400"/>
            <path d="M30 50 L45 65 L70 35" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"/>
          </svg>
        </div>

        {/* Data Flow Lines */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full">
            <defs>
              <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0"/>
                <stop offset="50%" stopColor="#a855f7" stopOpacity="1"/>
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0"/>
              </linearGradient>
              <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity="0"/>
                <stop offset="50%" stopColor="#14b8a6" stopOpacity="1"/>
                <stop offset="100%" stopColor="#14b8a6" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d="M0 100 Q400 50 800 100" fill="none" stroke="url(#lineGradient1)" strokeWidth="1">
              <animate attributeName="d" 
                       values="M0 100 Q400 50 800 100; M0 100 Q400 150 800 100; M0 100 Q400 50 800 100" 
                       dur="8s" 
                       repeatCount="indefinite"/>
            </path>
            <path d="M0 300 Q400 250 800 300" fill="none" stroke="url(#lineGradient2)" strokeWidth="1">
              <animate attributeName="d" 
                       values="M0 300 Q400 250 800 300; M0 300 Q400 350 800 300; M0 300 Q400 250 800 300" 
                       dur="10s" 
                       repeatCount="indefinite"/>
            </path>
          </svg>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      </div>
        {/* Floating Elements */}
        <motion.div 
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl"
        />
        <motion.div 
          animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 left-1/3 w-40 h-40 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-2xl"
        />

      {/* Glassmorphism Navbar */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-[#0B0F1A]/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl' 
            : 'bg-transparent border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <ShieldCheck size={22} strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">SnackShield</span>
                <div className="text-[10px] font-semibold text-indigo-400 tracking-wider">ENTERPRISE</div>
              </div>
            </Link>
            
            <div className="hidden lg:flex items-center gap-8">
              {['Features', 'Solutions', 'Pricing', 'About'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className="text-sm font-medium text-slate-400 hover:text-white transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Link 
                to="/login" 
                className="hidden sm:block text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="group relative px-6 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 hover:-translate-y-0.5"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center gap-2">
                  Get Started
                  <Sparkles size={14} />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - Split Screen */}
      <section className="relative pt-32 lg:pt-40 pb-20 lg:pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* LEFT: Content */}
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="relative z-10"
            >
              <motion.div 
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-8"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                Trusted by 12,000+ Enterprise Partners
              </motion.div>

              <motion.h1 
                variants={fadeInUp}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 leading-[1.1]"
              >
                Protect Your Brand From{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Counterfeits
                  </span>
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="absolute bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-sm -z-10"
                  />
                </span>
              </motion.h1>

              <motion.p 
                variants={fadeInUp}
                className="text-lg lg:text-xl text-slate-400 max-w-xl mb-10 leading-relaxed"
              >
                AI-powered product authentication and blockchain-verified supply chain security. 
                Detect fraud in real-time and safeguard your customers with enterprise-grade protection.
              </motion.p>

              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 mb-12"
              >
                <Link 
                  to="/customer" 
                  className="group px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold text-sm shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ScanLine size={18} />
                  Scan Product (Customer)
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/register" 
                  className="group px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm"
                >
                  Start Free Trial
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              {/* Trust Badges */}
              <motion.div 
                variants={fadeInUp}
                className="flex flex-wrap gap-6 text-slate-500 text-sm"
              >
                {['SOC 2 Certified', 'GDPR Compliant', 'ISO 27001'].map((badge) => (
                  <div key={badge} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span>{badge}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* RIGHT: Visual Dashboard Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative lg:h-[600px] hidden lg:block"
            >
              {/* Floating Dashboard Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-0 w-[400px] bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-semibold text-slate-300">Real-Time Analytics</div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs text-emerald-400">Live</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg border border-indigo-500/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <ShieldCheck size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">Verified Today</div>
                        <div className="text-xl font-bold text-white">2,847</div>
                      </div>
                    </div>
                    <div className="text-emerald-400 text-sm font-semibold">+12%</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 rounded-lg border border-cyan-500/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
                        <Activity size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">Active Scans</div>
                        <div className="text-xl font-bold text-white">156</div>
                      </div>
                    </div>
                    <div className="text-cyan-400 text-sm font-semibold">Live</div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Alert Card */}
              <motion.div
                animate={{ y: [0, 10, 0], x: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-40 left-0 w-[320px] bg-gradient-to-br from-red-900/90 to-orange-900/90 backdrop-blur-xl border border-red-500/30 rounded-2xl p-5 shadow-2xl"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle size={20} className="text-red-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-red-300 mb-1">Fraud Alert Detected</div>
                    <div className="text-xs text-red-200/70 mb-2">Suspicious scan pattern in Region 7</div>
                    <div className="flex items-center gap-2 text-xs text-red-300">
                      <MapPin size={12} />
                      <span>Mumbai, India</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating QR Scan Card */}
              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 right-10 w-[280px] bg-gradient-to-br from-emerald-900/90 to-teal-900/90 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-5 shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <ScanLine size={24} className="text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-emerald-300">QR Verified</div>
                    <div className="text-xs text-emerald-200/70">Product #SNK-4729</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-300">Status: Genuine</span>
                  <span className="text-emerald-400 font-semibold">✓ Authentic</span>
                </div>
              </motion.div>

              {/* Glow Effects */}
              <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px]" />
              <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px]" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section - Dark Background */}
      <section className="py-20 bg-gradient-to-b from-[#0B0F1A] via-[#0F1419] to-[#0B0F1A] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/30">
                  <stat.icon size={24} strokeWidth={2} />
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2 font-display">{stat.value}</div>
                <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Scan Section - Embedded Scanner */}
      <QuickScanSection />

      {/* Features Section - Dark Background with Cards */}
      <section id="features" className="py-24 lg:py-32 px-6 bg-gradient-to-b from-[#0B0F1A] via-[#0F1419] to-[#0B0F1A] relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-4">Features</span>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Fight Fraud</span>
            </h2>
            <p className="text-slate-400 text-lg">
              Comprehensive anti-counterfeiting solution powered by cutting-edge technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, i) => (
              <Link
                key={i}
                to={feature.link}
                className="block"
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative p-8 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 overflow-hidden cursor-pointer h-full"
                >
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Gradient Border on Hover */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl`} />
                  
                  <div className="relative z-10">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <feature.icon size={26} strokeWidth={2} />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-white">{feature.title}</h3>
                    <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 mb-4">{feature.desc}</p>
                    <div className="flex items-center gap-2 text-sm font-medium text-indigo-400 group-hover:text-indigo-300 transition-colors">
                      <span>Explore feature</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Gradient Divider Strip */}
      <section className="py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-8 text-white/90 text-sm font-medium"
          >
            <div className="flex items-center gap-2">
              <Eye size={16} />
              <span>Real-Time Monitoring</span>
            </div>
            <div className="w-px h-4 bg-white/30" />
            <div className="flex items-center gap-2">
              <Layers size={16} />
              <span>Multi-Layer Security</span>
            </div>
            <div className="w-px h-4 bg-white/30 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <Globe size={16} />
              <span>Global Coverage</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-24 lg:py-32 px-6 bg-gradient-to-b from-[#0B0F1A] via-[#0F1419] to-[#0B0F1A] relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-4">Solutions</span>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
              Industry-Leading{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Solutions</span>
            </h2>
            <p className="text-slate-400 text-lg">
              Tailored solutions for manufacturers, distributors, and retailers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'For Manufacturers',
                desc: 'Generate secure QR codes, manage batches, and track products throughout the supply chain.',
                icon: Factory,
                features: ['Batch Management', 'QR Generation', 'Supply Chain Tracking', 'Analytics Dashboard'],
                color: 'from-blue-500 to-cyan-500'
              },
              {
                title: 'For Distributors',
                desc: 'Monitor product authenticity, track shipments, and ensure supply chain integrity.',
                icon: Globe,
                features: ['Real-Time Tracking', 'Route Monitoring', 'Integrity Verification', 'Alert System'],
                color: 'from-purple-500 to-pink-500'
              },
              {
                title: 'For Retailers',
                desc: 'Verify products instantly, protect customers, and maintain brand reputation.',
                icon: ShieldCheck,
                features: ['Instant Verification', 'Customer Protection', 'Fraud Detection', 'Scan History'],
                color: 'from-emerald-500 to-teal-500'
              }
            ].map((solution, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative p-8 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${solution.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <solution.icon size={32} strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">{solution.title}</h3>
                <p className="text-slate-400 mb-6 leading-relaxed">{solution.desc}</p>
                <ul className="space-y-3">
                  {solution.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-slate-300">
                      <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 lg:py-32 px-6 bg-gradient-to-b from-[#0B0F1A] via-[#0F1419] to-[#0B0F1A] relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-4">Pricing</span>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
              Simple,{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Transparent Pricing</span>
            </h2>
            <p className="text-slate-400 text-lg">
              Choose the plan that fits your business needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Starter',
                price: '$99',
                period: '/month',
                desc: 'Perfect for small businesses',
                features: ['Up to 1,000 products', 'Basic analytics', 'Email support', 'QR code generation', 'Mobile app access'],
                color: 'from-blue-500 to-cyan-500',
                popular: false
              },
              {
                name: 'Professional',
                price: '$299',
                period: '/month',
                desc: 'For growing companies',
                features: ['Up to 10,000 products', 'Advanced analytics', 'Priority support', 'API access', 'Custom branding', 'Real-time alerts'],
                color: 'from-purple-500 to-pink-500',
                popular: true
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: '',
                desc: 'For large organizations',
                features: ['Unlimited products', 'Enterprise analytics', '24/7 dedicated support', 'Custom integration', 'White-label solution', 'SLA guarantee'],
                color: 'from-emerald-500 to-teal-500',
                popular: false
              }
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-8 rounded-2xl bg-slate-900/50 backdrop-blur-xl border transition-all duration-500 hover:shadow-2xl ${
                  plan.popular 
                    ? 'border-purple-500/50 shadow-lg shadow-purple-500/20 scale-105' 
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-slate-400 text-sm mb-4">{plan.desc}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-black text-white">{plan.price}</span>
                    <span className="text-slate-400">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-slate-300">
                      <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`block w-full py-3 rounded-xl font-semibold text-center transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/50'
                      : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 lg:py-32 px-6 bg-gradient-to-b from-[#0B0F1A] via-[#0F1419] to-[#0B0F1A] relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-6">About Us</span>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight">
                Protecting Brands with{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  AI-Powered Security
                </span>
              </h2>
              <p className="text-slate-400 text-lg mb-6 leading-relaxed">
                SnackShield is a cutting-edge product authentication platform that combines artificial intelligence, 
                blockchain technology, and real-time monitoring to protect brands from counterfeiting.
              </p>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Founded in 2024, we've helped over 12,000 companies secure their products and build customer trust 
                through our innovative verification system.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: '12K+', label: 'Companies Protected' },
                  { value: '50M+', label: 'Products Verified' },
                  { value: '99.9%', label: 'Detection Accuracy' },
                  { value: '$2B+', label: 'Fraud Prevented' }
                ].map((stat, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-white/10">
                <div className="space-y-6">
                  {[
                    { icon: ShieldCheck, title: 'Mission', desc: 'To eliminate counterfeit products and protect consumer safety through innovative technology.' },
                    { icon: Eye, title: 'Vision', desc: 'A world where every product is authentic, traceable, and trustworthy.' },
                    { icon: Sparkles, title: 'Values', desc: 'Innovation, integrity, and customer-first approach in everything we do.' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0">
                        <item.icon size={24} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-1">{item.title}</h4>
                        <p className="text-sm text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section - Dark Background */}
      <section className="py-24 px-6 bg-[#0B0F1A] relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-gradient-to-br from-indigo-600/20 to-purple-600/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-gradient-to-br from-pink-600/20 to-orange-600/10 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-12 lg:p-16 rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl"
          >
            {/* Animated Gradient Border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-xl" />
            
            <div className="relative z-10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white mb-6 shadow-lg shadow-indigo-500/50"
              >
                <Sparkles size={28} />
              </motion.div>
              
              <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-white">
                Ready to Protect Your Brand?
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
                Join thousands of companies using SnackShield to secure their products and build customer trust.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/register" 
                  className="group px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Start Free Trial
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/verify" 
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm text-white"
                >
                  Verify a Product
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Dark */}
      <footer className="border-t border-white/5 py-12 px-6 bg-[#0B0F1A]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center text-white">
                <ShieldCheck size={18} strokeWidth={2.5} />
              </div>
              <div>
                <span className="font-semibold text-white">SnackShield</span>
                <div className="text-[10px] text-slate-500">Enterprise Security</div>
              </div>
            </div>
            <p className="text-slate-500 text-sm">
              © 2026 SnackShield. All rights reserved. Enterprise Security Solutions.
            </p>
            <div className="flex gap-6">
              {['Privacy', 'Terms', 'Contact'].map((link) => (
                <a key={link} href="#" className="text-slate-500 hover:text-white text-sm transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
