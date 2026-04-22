import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Scan, BarChart3, History,
  Building2, Package, Settings, LogOut, ShieldCheck,
  ChevronLeft, ChevronRight, Bell, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const getMenuItems = (role) => {
  if (role === 'Distributor') {
    return [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/distributor-dashboard' },
      { label: 'Verify Product', icon: Scan, path: '/verify' },
      { label: 'Product Journey', icon: History, path: '/journey' },
      { label: 'Alerts', icon: Bell, path: '/alerts' },
      { label: 'Analytics', icon: BarChart3, path: '/analytics' },
    ];
  }

  if (role === 'Retailer') {
    return [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/retailer-dashboard' },
      { label: 'Verify Product', icon: Scan, path: '/verify' },
      { label: 'Scan History', icon: History, path: '/history' },
      { label: 'Alerts', icon: Bell, path: '/alerts' },
    ];
  }

  // Admin / Manufacturer
  return [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Verify Product', icon: Scan, path: '/verify' },
    { label: 'Product Journey', icon: History, path: '/journey' },
    { label: 'Alerts', icon: Bell, path: '/alerts' },
    { label: 'Analytics', icon: BarChart3, path: '/analytics' },
  ];
};

const getOperationsItems = (role) => {
  if (role === 'Retailer') {
    return [
      { label: 'Settings', icon: Settings, path: '/settings' },
    ];
  }
  return [
    { label: 'Companies', icon: Building2, path: '/companies' },
    { label: 'Batches', icon: Package, path: '/batches' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];
};

const NavItem = ({ item, collapsed }) => {
  const { pathname } = useLocation();
  const isActive = pathname === item.path;

  return (
    <li>
      <Link
        to={item.path}
        className={`
          relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
          ${isActive 
            ? 'bg-gradient-to-r from-indigo-500/15 to-purple-500/10 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/10' 
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }
          ${collapsed ? 'justify-center' : ''}
        `}
        title={collapsed ? item.label : undefined}
      >
        {/* Active Glow Effect */}
        {isActive && (
          <motion.div
            layoutId="activeGlow"
            className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur-lg -z-10"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        
        {/* Icon with Glow */}
        <div className={`relative ${isActive ? 'text-indigo-400' : ''}`}>
          {isActive && (
            <div className="absolute inset-0 bg-indigo-500/30 rounded-lg blur-md" />
          )}
          <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className="relative z-10" />
        </div>
        
        {!collapsed && <span>{item.label}</span>}
        
        {isActive && !collapsed && (
          <motion.div
            layoutId="activeIndicator"
            className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-lg shadow-indigo-400/50"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </Link>
    </li>
  );
};

const Sidebar = ({ collapsed, onToggle }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const menuItems = getMenuItems(user.role);
  const operationsItems = getOperationsItems(user.role);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="h-screen bg-[#0B0F1A] border-r border-white/10 flex flex-col flex-shrink-0 sticky top-0 relative overflow-hidden shadow-2xl"
    >
      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/5 pointer-events-none" />
      
      {/* Logo */}
      <div className={`relative z-10 flex items-center gap-3 p-5 ${collapsed ? 'justify-center' : ''}`}>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-2xl flex-shrink-0 group-hover:scale-105 transition-transform">
            <ShieldCheck size={22} strokeWidth={2.5} />
          </div>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="text-white font-bold text-base tracking-tight">SnackShield</div>
            <div className="text-[10px] font-semibold text-purple-400 tracking-wider">ENTERPRISE</div>
          </div>
        )}
      </div>

      {/* Role Badge */}
      {!collapsed && user.role && (
        <div className="px-5 pb-3">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            user.role === 'Distributor' ? 'bg-cyan-500/20 text-cyan-400' :
            user.role === 'Retailer' ? 'bg-emerald-500/20 text-emerald-400' :
            user.role === 'Admin' ? 'bg-red-500/20 text-red-400' :
            'bg-purple-500/20 text-purple-400'
          }`}>
            {user.role?.toUpperCase()}
          </span>
        </div>
      )}

      {/* Navigation */}
      <nav className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {!collapsed && (
          <div className="px-3 mb-3">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Menu</span>
          </div>
        )}
        <ul className="space-y-1">
          {menuItems.map(item => (
            <NavItem key={item.path} item={item} collapsed={collapsed} />
          ))}
        </ul>

        {!collapsed && (
          <div className="px-3 mb-3 mt-6">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Operations</span>
          </div>
        )}
        <ul className="space-y-1">
          {operationsItems.map(item => (
            <NavItem key={item.path} item={item} collapsed={collapsed} />
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="relative z-10 p-3 border-t border-white/10">
        <button 
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 
            hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group
            ${collapsed ? 'justify-center' : ''}
          `}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={20} className="group-hover:scale-110 transition-transform" />
          {!collapsed && <span>Logout</span>}
        </button>

        <button 
          onClick={onToggle} 
          className="w-full mt-2 flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all group"
        >
          {collapsed ? (
            <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
          ) : (
            <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          )}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
