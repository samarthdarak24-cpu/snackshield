import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock,
  MapPin,
  Filter,
  X,
  Eye,
  Package,
  Shield,
  TrendingUp
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { getAlerts, markAlertAsRead, resolveAlert } from '../services/api';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null);

  // Mock data for demonstration
  const mockAlerts = [
    {
      _id: '1',
      message: 'Suspicious Scanning Pattern Detected',
      type: 'Rapid Scanning',
      productName: 'Premium Protein Bar - Chocolate',
      productId: 'SNK-2847',
      severity: 'Critical',
      details: 'Same QR code scanned 15 times in 2 minutes from different locations',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      locations: ['Mumbai, India', 'Delhi, India'],
      read: false,
      resolved: false
    },
    {
      _id: '2',
      message: 'Multiple Location Verification Attempt',
      type: 'Multiple Locations',
      productName: 'Organic Energy Drink Mix',
      productId: 'SNK-1923',
      severity: 'High',
      details: 'Product verified from 3 different countries within 24 hours',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      locations: ['Singapore', 'Thailand', 'Malaysia'],
      read: false,
      resolved: false
    },
    {
      _id: '3',
      message: 'Counterfeit Product Identified',
      type: 'High Risk',
      productName: 'Vitamin C Supplement Pack',
      productId: 'SNK-4521',
      severity: 'Critical',
      details: 'AI detection flagged packaging inconsistencies and invalid batch number',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      locations: ['Lagos, Nigeria'],
      read: true,
      resolved: false
    },
    {
      _id: '4',
      message: 'Unusual Verification Time',
      type: 'Rapid Scanning',
      productName: 'Whey Protein Isolate 2kg',
      productId: 'SNK-7834',
      severity: 'Medium',
      details: 'Product scanned outside of normal business hours',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      locations: ['São Paulo, Brazil'],
      read: true,
      resolved: true
    },
    {
      _id: '5',
      message: 'Batch Verification Alert',
      type: 'High Risk',
      productName: 'Collagen Peptides Powder',
      productId: 'SNK-9102',
      severity: 'High',
      details: 'Multiple products from same batch flagged in different regions',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      locations: ['London, UK', 'Paris, France'],
      read: true,
      resolved: false
    },
    {
      _id: '6',
      message: 'Low Risk Verification',
      type: 'Multiple Locations',
      productName: 'Granola Bar Variety Pack',
      productId: 'SNK-3456',
      severity: 'Low',
      details: 'Standard verification from authorized distributor',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      locations: ['New York, USA'],
      read: true,
      resolved: true
    },
    {
      _id: '7',
      message: 'Expired Product Scan Detected',
      type: 'High Risk',
      productName: 'Pre-Workout Formula',
      productId: 'SNK-6789',
      severity: 'Medium',
      details: 'Product scanned after expiration date - possible resale attempt',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 days ago
      locations: ['Toronto, Canada'],
      read: true,
      resolved: true
    }
  ];

  // Load saved alert states from localStorage
  const loadSavedAlerts = () => {
    const saved = localStorage.getItem('snackshield_alerts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge saved states with mock data
        return mockAlerts.map(alert => {
          const savedAlert = parsed.find(s => s._id === alert._id);
          return savedAlert ? { ...alert, read: savedAlert.read, resolved: savedAlert.resolved } : alert;
        });
      } catch (e) {
        return mockAlerts;
      }
    }
    return mockAlerts;
  };

  // Save alert states to localStorage
  const saveAlerts = (alertsToSave) => {
    const toSave = alertsToSave.map(a => ({ _id: a._id, read: a.read, resolved: a.resolved }));
    localStorage.setItem('snackshield_alerts', JSON.stringify(toSave));
  };

  useEffect(() => {
    fetchAlerts();
    // Poll for new alerts every 10 seconds
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, [filter]);

  const fetchAlerts = async () => {
    try {
      const params = {};
      if (filter !== 'all') {
        if (filter === 'unread') params.read = 'false';
        else params.severity = filter;
      }
      
      // Try to fetch from API
      try {
        const res = await getAlerts(params);
        if (res.data.alerts && res.data.alerts.length > 0) {
          setAlerts(res.data.alerts);
          setUnreadCount(res.data.unreadCount);
          setLoading(false);
          return;
        }
      } catch (apiError) {
        console.log('API not available, using mock data');
      }
      
      // Load alerts with saved states from localStorage
      let allAlerts = loadSavedAlerts();
      
      // Apply filters
      let filteredAlerts = [...allAlerts];
      if (filter === 'unread') {
        filteredAlerts = filteredAlerts.filter(a => !a.read);
      } else if (filter !== 'all') {
        filteredAlerts = filteredAlerts.filter(a => a.severity === filter);
      }
      
      setAlerts(filteredAlerts);
      setUnreadCount(allAlerts.filter(a => !a.read).length);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (alertId) => {
    try {
      // Try API first
      try {
        await markAlertAsRead(alertId);
      } catch (apiError) {
        console.log('API not available, updating locally');
      }
      
      // Update local state
      const updatedAlerts = alerts.map(alert => 
        alert._id === alertId ? { ...alert, read: true } : alert
      );
      setAlerts(updatedAlerts);
      
      // Save to localStorage
      const allAlerts = loadSavedAlerts().map(alert =>
        alert._id === alertId ? { ...alert, read: true } : alert
      );
      saveAlerts(allAlerts);
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const handleResolve = async (alertId) => {
    try {
      // Try API first
      try {
        await resolveAlert(alertId);
      } catch (apiError) {
        console.log('API not available, updating locally');
      }
      
      // Update local state
      const updatedAlerts = alerts.map(alert => 
        alert._id === alertId ? { ...alert, resolved: true, read: true } : alert
      );
      setAlerts(updatedAlerts);
      
      // Save to localStorage
      const allAlerts = loadSavedAlerts().map(alert =>
        alert._id === alertId ? { ...alert, resolved: true, read: true } : alert
      );
      saveAlerts(allAlerts);
      
      // Update unread count if it was unread
      const alert = alerts.find(a => a._id === alertId);
      if (alert && !alert.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'text-red-700 bg-red-50 border-red-300';
      case 'High': return 'text-orange-700 bg-orange-50 border-orange-300';
      case 'Medium': return 'text-amber-700 bg-amber-50 border-amber-300';
      case 'Low': return 'text-emerald-700 bg-emerald-50 border-emerald-300';
      default: return 'text-slate-700 bg-slate-50 border-slate-300';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'High Risk': return AlertTriangle;
      case 'Multiple Locations': return MapPin;
      case 'Rapid Scanning': return Clock;
      default: return Bell;
    }
  };

  return (
    <DashboardLayout title="Alerts">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 mb-2">Real-Time Fraud Alerts</h1>
            <p className="text-slate-600 font-semibold">Live monitoring and instant fraud detection notifications</p>
          </div>
          {unreadCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border-2 border-red-200 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-600 font-bold">{unreadCount} Unread Alerts</span>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-3 mb-6"
      >
        {['all', 'unread', 'Critical', 'High', 'Medium', 'Low'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              filter === f
                ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </motion.div>

      {/* Alerts List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {alerts.map((alert, index) => {
            const Icon = getTypeIcon(alert.type);
            return (
              <motion.div
                key={alert._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white border-2 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all ${
                  !alert.read ? 'border-purple-300 bg-purple-50/30' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 border-2 ${getSeverityColor(alert.severity)}`}>
                    <Icon size={26} strokeWidth={2.5} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-black text-slate-900">{alert.message}</h3>
                          {!alert.read && (
                            <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" />
                          )}
                        </div>
                        <p className="text-sm font-semibold text-slate-600">{alert.type} • {alert.productName}</p>
                      </div>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 flex-shrink-0 ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </div>

                    {alert.details && (
                      <p className="text-sm font-semibold text-slate-700 mb-3">{alert.details}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-600 mb-4">
                      <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                        <Clock size={16} strokeWidth={2.5} className="text-purple-600" />
                        <span>
                          {new Date(alert.timestamp).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                          {' • '}
                          {new Date(alert.timestamp).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      {alert.locations && alert.locations.length > 0 && (
                        <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                          <MapPin size={16} strokeWidth={2.5} className="text-purple-600" />
                          <span>{alert.locations.join(', ')}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200">
                        <span className="text-slate-600">ID:</span>
                        <span className="font-mono font-bold text-purple-600">{alert.productId}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedAlert(alert)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 border-2 border-purple-700 rounded-lg text-sm font-bold text-white transition-all flex items-center gap-2 shadow-lg"
                      >
                        <Eye size={16} strokeWidth={2.5} />
                        View Details
                      </button>
                      {!alert.read && (
                        <button
                          onClick={() => handleMarkAsRead(alert._id)}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 rounded-lg text-sm font-bold text-slate-900 transition-all flex items-center gap-2"
                        >
                          <CheckCircle2 size={16} strokeWidth={2.5} />
                          Mark as Read
                        </button>
                      )}
                      {!alert.resolved && (
                        <button
                          onClick={() => handleResolve(alert._id)}
                          className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 rounded-lg text-sm font-bold text-emerald-700 transition-all flex items-center gap-2"
                        >
                          <CheckCircle2 size={16} strokeWidth={2.5} />
                          Resolve
                        </button>
                      )}
                      {alert.resolved && (
                        <span className="px-4 py-2 bg-emerald-50 border-2 border-emerald-300 rounded-lg text-sm font-bold text-emerald-700 flex items-center gap-2">
                          <CheckCircle2 size={16} strokeWidth={2.5} />
                          Resolved
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {alerts.length === 0 && !loading && (
          <div className="text-center py-20 bg-white border-2 border-slate-200 rounded-2xl shadow-xl">
            <div className="w-20 h-20 rounded-2xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={40} className="text-emerald-600" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">All Clear!</h3>
            <p className="text-slate-600 font-semibold">No alerts to display. Your system is running smoothly.</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedAlert(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-500 p-6 rounded-t-3xl">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 ${getSeverityColor(selectedAlert.severity)} bg-white`}>
                      {(() => {
                        const Icon = getTypeIcon(selectedAlert.type);
                        return <Icon size={32} strokeWidth={2.5} />;
                      })()}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white mb-2">{selectedAlert.message}</h2>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 ${getSeverityColor(selectedAlert.severity)}`}>
                          {selectedAlert.severity}
                        </span>
                        <span className="text-purple-100 text-sm font-semibold">{selectedAlert.type}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedAlert(null)}
                    className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all"
                  >
                    <X size={24} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Product Information */}
                <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Package size={20} className="text-purple-600" strokeWidth={2.5} />
                    <h3 className="text-lg font-black text-slate-900">Product Information</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase mb-1">Product Name</p>
                      <p className="text-sm font-bold text-slate-900">{selectedAlert.productName}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase mb-1">Product ID</p>
                      <p className="text-sm font-mono font-bold text-purple-600">{selectedAlert.productId}</p>
                    </div>
                  </div>
                </div>

                {/* Alert Details */}
                <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield size={20} className="text-purple-600" strokeWidth={2.5} />
                    <h3 className="text-lg font-black text-slate-900">Alert Details</h3>
                  </div>
                  <p className="text-sm font-semibold text-slate-700 leading-relaxed">{selectedAlert.details}</p>
                </div>

                {/* Timeline & Location */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock size={18} className="text-purple-600" strokeWidth={2.5} />
                      <h3 className="text-sm font-black text-slate-900">Timestamp</h3>
                    </div>
                    <p className="text-sm font-bold text-slate-700">
                      {new Date(selectedAlert.timestamp).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                    <p className="text-sm font-bold text-slate-600 mt-1">
                      {new Date(selectedAlert.timestamp).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </p>
                  </div>

                  {selectedAlert.locations && selectedAlert.locations.length > 0 && (
                    <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin size={18} className="text-purple-600" strokeWidth={2.5} />
                        <h3 className="text-sm font-black text-slate-900">Locations</h3>
                      </div>
                      <div className="space-y-2">
                        {selectedAlert.locations.map((loc, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-600" />
                            <p className="text-sm font-bold text-slate-700">{loc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={20} className="text-purple-600" strokeWidth={2.5} />
                    <h3 className="text-lg font-black text-slate-900">Status</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${selectedAlert.read ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span className="text-sm font-bold text-slate-700">
                        {selectedAlert.read ? 'Read' : 'Unread'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${selectedAlert.resolved ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span className="text-sm font-bold text-slate-700">
                        {selectedAlert.resolved ? 'Resolved' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  {!selectedAlert.read && (
                    <button
                      onClick={() => {
                        handleMarkAsRead(selectedAlert._id);
                        setSelectedAlert({ ...selectedAlert, read: true });
                      }}
                      className="flex-1 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={18} strokeWidth={2.5} />
                      Mark as Read
                    </button>
                  )}
                  {!selectedAlert.resolved && (
                    <button
                      onClick={() => {
                        handleResolve(selectedAlert._id);
                        setSelectedAlert({ ...selectedAlert, resolved: true, read: true });
                      }}
                      className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={18} strokeWidth={2.5} />
                      Resolve Alert
                    </button>
                  )}
                  {selectedAlert.resolved && (
                    <div className="flex-1 px-6 py-3 bg-emerald-50 border-2 border-emerald-300 text-emerald-700 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                      <CheckCircle2 size={18} strokeWidth={2.5} />
                      Alert Resolved
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default Alerts;
