import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  BarChart3, 
  History, 
  Fingerprint, 
  Building2, 
  Box, 
  Truck, 
  Network, 
  UserCircle, 
  Bell, 
  Search,
  LogOut,
  ChevronDown
} from 'lucide-react';

const StatCard = ({ title, value, color, icon: Icon }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group flex items-start justify-between">
    <div>
      <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 group-hover:scale-105 transition-transform duration-300">{value}</h3>
    </div>
    <div className={`p-2 rounded-lg ${color} bg-opacity-10 text-${color}`}>
      <Icon size={20} className={`text-${color}`} />
    </div>
  </div>
);

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-all mb-1 ${active ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`}
  >
    <Icon size={18} />
    <span className="font-medium text-sm">{label}</span>
  </div>
);

const Dashboard = () => {
  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-poppins">Global Security Dashboard</h1>
          <p className="text-gray-500 mt-1">Real-time supply chain monitoring & threat intelligence</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center gap-2 text-sm text-gray-600">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            System Operational
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Audits" value="854,231" color="indigo-600" icon={Activity} />
        <StatCard title="Genuine Verified" value="842,109" color="green-500" icon={ShieldCheck} />
        <StatCard title="Counterfeits Blocked" value="12,122" color="red-500" icon={ShieldAlert} />
        <StatCard title="Global Risk Score" value="0.04%" color="amber-500" icon={Zap} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-gray-900">Verification Analytics (24h)</h3>
            <select className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] flex items-center justify-center text-gray-400 italic">
            [Interactive Chart Component - Loading Dynamic Data]
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Security Incident Alerts</h3>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Batch Cloning Attempt</p>
                  <p className="text-xs text-gray-500 mt-0.5">Location ID: LON-821-X3</p>
                  <p className="text-[10px] text-gray-400 mt-1">2m ago • Neural Engine Triggered</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition-colors">
            View All Alerts
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-[260px] bg-[#111827] flex flex-col fixed h-screen z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <ShieldCheck size={22} weight="bold" />
          </div>
          <div>
            <span className="text-white font-bold text-lg tracking-tight font-poppins">SnackShield</span>
            <div className="text-[10px] text-indigo-400 font-mono tracking-widest uppercase font-bold">Enterprise AI</div>
          </div>
        </div>

        <nav className="flex-1 px-3 mt-4">
          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest px-4 mb-3">Core Platform</div>
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={ShieldCheck} label="Verify Product" active={activeTab === 'verify'} onClick={() => setActiveTab('verify')} />
          <SidebarItem icon={BarChart3} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
          <SidebarItem icon={History} label="Scan History" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
          <SidebarItem icon={Fingerprint} label="Neural Engine" active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} />

          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest px-4 mb-3 mt-8">Supply Chain</div>
          <SidebarItem icon={Building2} label="Companies" active={activeTab === 'companies'} onClick={() => setActiveTab('companies')} />
          <SidebarItem icon={Box} label="Batches" active={activeTab === 'batches'} onClick={() => setActiveTab('batches')} />
          <SidebarItem icon={Truck} label="Distributors" active={activeTab === 'distributors'} onClick={() => setActiveTab('distributors')} />
          <SidebarItem icon={Network} label="Fraud Clusters" active={activeTab === 'clusters'} onClick={() => setActiveTab('clusters')} />
        </nav>

        <div className="p-4 border-t border-gray-800">
          <SidebarItem icon={LogOut} label="Log Out" active={false} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-[260px]">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-6 flex-1 max-w-2xl">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-indigo-500 transition-colors" size={17} />
              <input 
                type="text" 
                placeholder="Search encrypted product ID, batch, or facility..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-200 mx-1"></div>
            <div className="flex items-center gap-3 pl-2 group cursor-pointer">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">Admin Panel</p>
                <p className="text-[10px] text-green-500 font-bold tracking-tighter -mt-0.5">SUPERUSER</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-100 to-indigo-50 border-2 border-white shadow-sm flex items-center justify-center text-indigo-600 font-bold overflow-hidden ring-2 ring-indigo-500/10 group-hover:ring-indigo-500/30 transition-all">
                A
              </div>
              <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab !== 'dashboard' && (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] p-12 text-center">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
              <Network size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Module Initializing</h2>
            <p className="text-gray-500 max-w-sm">
              We are connecting this interface to the Enterprise AI Neural engine. 
              The backend data pipelines are being synchronized.
            </p>
            <div className="mt-8 flex gap-4">
              <div className="h-1.5 w-12 bg-indigo-500 rounded-full animate-pulse"></div>
              <div className="h-1.5 w-12 bg-indigo-300 rounded-full animate-pulse delay-75"></div>
              <div className="h-1.5 w-12 bg-indigo-100 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
