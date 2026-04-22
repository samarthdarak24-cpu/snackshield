import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Key, 
  Bell, 
  ShieldCheck, 
  Mail, 
  Save, 
  Camera,
  Building2,
  Smartphone,
  Globe,
  Lock
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

const Settings = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{"name":"John Doe","email":"admin@snackshield.com","company":"Acme Corp","role":"Administrator"}');
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <DashboardLayout title="Settings">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-black text-slate-900 mb-1">Settings</h1>
        <p className="text-slate-600 font-semibold">Manage your account and system preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-2 shadow-xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-purple-100 text-purple-700 border-2 border-purple-300' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <tab.icon size={20} strokeWidth={2.5} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Info */}
          <div className="mt-6 bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center">
                <ShieldCheck size={22} className="text-emerald-600" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">Account Status</div>
                <div className="text-xs font-bold text-emerald-600">Verified</div>
              </div>
            </div>
            <div className="text-xs font-semibold text-slate-600">
              Your account is fully verified and has access to all enterprise features.
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-xl"
            >
              {/* Profile Header */}
              <div className="flex items-center gap-6 mb-8 pb-8 border-b-2 border-slate-200">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center text-white text-3xl font-black shadow-lg">
                    {user.name?.charAt(0) || 'A'}
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-white border-2 border-slate-300 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors">
                    <Camera size={16} strokeWidth={2.5} />
                  </button>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">{user.name || 'Admin User'}</h3>
                  <p className="text-slate-600 font-semibold text-sm">{user.role || 'Administrator'}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full border-2 border-purple-300">
                      Level 4 Access
                    </span>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue={user.name} 
                      className="w-full bg-white border-2 border-slate-300 rounded-xl py-3 px-4 text-slate-900 font-semibold focus:outline-none focus:border-purple-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={20} strokeWidth={2.5} />
                      <input 
                        type="email" 
                        defaultValue={user.email} 
                        className="w-full bg-white border-2 border-slate-300 rounded-xl py-3 pl-10 pr-4 text-slate-900 font-semibold focus:outline-none focus:border-purple-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Organization</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={20} strokeWidth={2.5} />
                      <input 
                        type="text" 
                        defaultValue={user.company} 
                        disabled
                        className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl py-3 pl-10 pr-4 text-slate-600 font-semibold cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Phone Number</label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={20} strokeWidth={2.5} />
                      <input 
                        type="tel" 
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-white border-2 border-slate-300 rounded-xl py-3 pl-10 pr-4 text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Timezone</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={20} strokeWidth={2.5} />
                    <select className="w-full bg-white border-2 border-slate-300 rounded-xl py-3 pl-10 pr-4 text-slate-900 font-semibold appearance-none focus:outline-none focus:border-purple-500 transition-all">
                      <option className="bg-white">UTC-08:00 Pacific Time</option>
                      <option className="bg-white">UTC-05:00 Eastern Time</option>
                      <option className="bg-white">UTC+00:00 London</option>
                      <option className="bg-white">UTC+05:30 India</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <button 
                    type="button" 
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold rounded-xl shadow-lg transition-all"
                  >
                    <Save size={20} strokeWidth={2.5} />
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-xl"
            >
              <h3 className="text-lg font-black text-slate-900 mb-6">Security Settings</h3>
              
              <div className="space-y-6">
                <div className="p-5 bg-slate-50 rounded-xl border-2 border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-slate-900">Change Password</h4>
                      <p className="text-sm font-semibold text-slate-600">Update your account password</p>
                    </div>
                    <Key size={22} className="text-slate-600" strokeWidth={2.5} />
                  </div>
                  <div className="space-y-4">
                    <input 
                      type="password" 
                      placeholder="Current password"
                      className="w-full bg-white border-2 border-slate-300 rounded-xl py-3 px-4 text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
                    />
                    <input 
                      type="password" 
                      placeholder="New password"
                      className="w-full bg-white border-2 border-slate-300 rounded-xl py-3 px-4 text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
                    />
                    <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-slate-900 text-sm font-bold rounded-lg transition-colors">
                      Update Password
                    </button>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 rounded-xl border-2 border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">Two-Factor Authentication</h4>
                      <p className="text-sm font-semibold text-slate-600">Add an extra layer of security</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-emerald-600">Enabled</span>
                      <div className="w-12 h-6 bg-emerald-500 rounded-full relative border-2 border-emerald-600">
                        <div className="absolute right-1 top-0.5 w-4 h-4 bg-white rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 rounded-xl border-2 border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900">Active Sessions</h4>
                      <p className="text-sm font-semibold text-slate-600">Manage your active devices</p>
                    </div>
                    <button className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors">
                      Sign out all
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-xl"
            >
              <h3 className="text-lg font-black text-slate-900 mb-6">Notification Preferences</h3>
              
              <div className="space-y-4">
                {[
                  { label: 'Fraud Alerts', desc: 'Get notified when counterfeit products are detected', enabled: true },
                  { label: 'Batch Updates', desc: 'Receive updates about batch status changes', enabled: true },
                  { label: 'System Maintenance', desc: 'Notifications about scheduled maintenance', enabled: false },
                  { label: 'Weekly Reports', desc: 'Receive weekly analytics reports', enabled: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border-2 border-slate-200">
                    <div>
                      <h4 className="font-bold text-slate-900">{item.label}</h4>
                      <p className="text-sm font-semibold text-slate-600">{item.desc}</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full relative transition-colors border-2 ${item.enabled ? 'bg-purple-500 border-purple-600' : 'bg-slate-300 border-slate-400'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${item.enabled ? 'right-1' : 'left-1'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
