import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Bell, Search, ChevronDown, User, Settings, Bot, Coins } from 'lucide-react';
import Sidebar from './Sidebar';
import { getProfile } from '../../services/api';

const DashboardLayout = ({ children, title = 'Dashboard' }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sstBalance, setSstBalance] = useState('0.0');

  const user = JSON.parse(localStorage.getItem('user') || '{"name":"Admin","role":"Administrator"}');

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await getProfile();
        setSstBalance(res.data.sstBalance);
      } catch (err) {
        console.error("Failed to fetch balance", err);
      }
    };
    fetchBalance();
    
    // Refresh balance every 30 seconds
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Glassmorphism Topbar */}
        <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
            >
              <Menu size={18} />
            </button>

            <div className="h-5 w-px bg-slate-200 hidden sm:block" />

            <div className="relative hidden md:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search products, batches..."
                className="w-64 bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* SST Token Balance */}
            <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-purple-600/10 to-purple-500/5 border border-purple-200 rounded-full shadow-sm hover:shadow-md transition-all group">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <Coins size={12} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest leading-none mb-0.5">SST Balance</span>
                <span className="text-xs font-bold text-slate-900 leading-none">{parseFloat(sstBalance).toFixed(2)} SST</span>
              </div>
            </div>

            {/* System Status */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-emerald-700">System Online</span>
            </div>

            {/* AI Agent Status */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full cursor-pointer hover:bg-purple-100 transition-colors">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-xs font-medium text-purple-700">AI Agent Active</span>
            </div>

            {/* Notifications */}
            <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full border-2 border-white" />
            </button>

            <div className="h-5 w-px bg-slate-200" />

            {/* User Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-100 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow-lg">
                  {user.name?.charAt(0) || 'A'}
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium text-slate-900 leading-none">{user.name || 'Admin'}</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">{user.role || 'Administrator'}</span>
                </div>
                <ChevronDown size={14} className={`text-slate-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-2xl py-2 z-50"
                  >
                    <a href="/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                      <Settings size={16} />
                      Settings
                    </a>
                    <a href="/" className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors">
                      <span>Logout</span>
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
