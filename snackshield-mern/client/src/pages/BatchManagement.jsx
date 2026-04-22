import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QrCode, 
  Package, 
  Plus, 
  Calendar, 
  Hash, 
  Boxes,
  Download,
  MoreVertical,
  CheckCircle2,
  Clock,
  Zap,
  ArrowRight,
  Eye,
  FileText,
  X,
  Loader2
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import api, { createBatch, getBatches, getBatchUnits, downloadBatchPDF } from '../services/api';
import QRCode from 'react-qr-code';
import ReportPreviewModal from '../components/modals/ReportPreviewModal';

const BatchManagement = () => {
  const [formData, setFormData] = useState({
    batchId: 'BCH-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
    productName: '',
    manufactureDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    quantity: 10
  });
  const [batches, setBatches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [generatedQr, setGeneratedQr] = useState(null);
  const [creating, setCreating] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batchUnits, setBatchUnits] = useState([]);
  const [loadingUnits, setLoadingUnits] = useState(false);

  // PDF Preview State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewTitle, setPreviewTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = () => {
    getBatches()
      .then(res => setBatches(res.data))
      .catch(e => console.error('Failed to fetch batches:', e));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const response = await createBatch(formData);
      setGeneratedQr(response.data.qrCode);
      fetchBatches();
      // Reset with a fresh batch ID
      setFormData(prev => ({
        ...prev,
        batchId: 'BCH-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        productName: '',
        expiryDate: '',
        quantity: 10
      }));
    } catch (e) {
      console.error('Batch creation error:', e);
      const msg = e.response?.data?.message || e.message || 'Unknown error';
      alert('Error creating batch: ' + msg);
    }
    setCreating(false);
  };

  const viewUnits = async (batch) => {
    setSelectedBatch(batch);
    setLoadingUnits(true);
    try {
        const res = await getBatchUnits(batch.batchId);
        setBatchUnits(res.data);
    } catch (e) {
        console.error('Error fetching units:', e);
        alert('Failed to load batch units.');
    }
    setLoadingUnits(false);
  };

  const handlePreview = async (batchId) => {
    try {
        setIsGenerating(true);
        setPreviewTitle(`Batch Identity Report: ${batchId}`);
        setIsPreviewOpen(true);
        setPreviewUrl(null);

        const response = await api.get(`/batches/${batchId}/download-pdf`, { responseType: 'arraybuffer' });
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        setPreviewUrl(url);
    } catch (error) {
        console.error('Preview Error:', error);
        alert('Failed to generate preview.');
        setIsPreviewOpen(false);
    } finally {
        setIsGenerating(false);
    }
  };

  const handleDownload = async (batchId) => {
    const targetBatchId = typeof batchId === 'string' ? batchId : selectedBatch?.batchId;
    if (!targetBatchId) return;

    try {
        setIsGenerating(true);
        const response = await api.get(`/batches/${targetBatchId}/download-pdf`, { responseType: 'arraybuffer' });
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `SnackShield_Batch_${targetBatchId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Download Error:', error);
        alert('Failed to download PDF.');
    } finally {
        setIsGenerating(false);
    }
  };

  const stats = [
    { label: 'Total Batches', value: batches.length || 0, icon: Boxes, color: 'from-purple-500 to-indigo-600' },
    { label: 'Active Products', value: batches.reduce((acc, b) => acc + (b.quantity || 0), 0).toLocaleString(), icon: Package, color: 'from-blue-500 to-cyan-600' },
    { label: 'Total QR Identity Codes', value: (batches.reduce((acc, b) => acc + (b.quantity || 0), 0) + batches.length).toLocaleString(), icon: QrCode, color: 'from-emerald-500 to-teal-600' },
  ];

  const mockBatches = batches;

  return (
    <DashboardLayout title="Batch Management">
      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Batch Management</h1>
            <p className="text-slate-500 font-medium max-w-2xl">
              Precision inventory control and encrypted QR generation for multi-stage product authentication.
            </p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-105 active:scale-95 text-white font-bold rounded-2xl shadow-xl shadow-purple-500/20 transition-all"
          >
            <Plus size={22} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
            <span>New Production Batch</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gradient-to-br from-white to-slate-50/50 border-2 border-slate-200 rounded-3xl p-6 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 hover:border-purple-300 transition-all duration-300 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-center gap-5">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon size={26} strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Create Batch Form */}
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4"
          >
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 shadow-2xl sticky top-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 shadow-inner">
                  <Package size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Configure Batch</h3>
                  <p className="text-sm font-semibold text-slate-500">Initialize new tracking IDs</p>
                </div>
              </div>

              <form onSubmit={handleCreate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Product Specification</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.productName} 
                    onChange={e => setFormData({...formData, productName: e.target.value})} 
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3.5 px-5 text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all"
                    placeholder="Enter product line..." 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">System Identifier</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} strokeWidth={2.5} />
                    <input 
                      type="text" 
                      value={formData.batchId} 
                      disabled 
                      className="w-full bg-slate-100 border-2 border-slate-200 rounded-2xl py-3.5 pl-12 pr-5 text-slate-500 font-mono font-black text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest text-[9px]">MFG Date</label>
                    <input 
                      required 
                      type="date" 
                      value={formData.manufactureDate} 
                      onChange={e => setFormData({...formData, manufactureDate: e.target.value})} 
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 px-4 text-slate-900 font-bold text-sm focus:outline-none focus:border-purple-500 transition-all font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest text-[9px]">EXP Date</label>
                    <input 
                      required 
                      type="date" 
                      value={formData.expiryDate} 
                      onChange={e => setFormData({...formData, expiryDate: e.target.value})} 
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 px-4 text-slate-900 font-bold text-sm focus:outline-none focus:border-purple-500 transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Unit Quantity</label>
                  <input 
                    required 
                    type="number" 
                    value={formData.quantity} 
                    onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} 
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3.5 px-5 text-slate-900 font-black focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={creating}
                  className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-purple-600 hover:to-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 group"
                >
                  <QrCode size={20} strokeWidth={2.5} className="group-hover:animate-pulse" />
                  <span>{creating ? 'Generating...' : 'Generate Security Assets'}</span>
                  {!creating && <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />}
                </button>
              </form>

              {generatedQr && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 p-6 bg-slate-900 rounded-2xl flex flex-col items-center text-center relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
                  <div className="bg-white p-4 rounded-2xl mb-4 shadow-2xl">
                    <QRCode value={generatedQr} size={150} />
                  </div>
                  <h4 className="text-white font-black mb-1">Batch Master QR</h4>
                  <p className="font-mono text-purple-400 font-bold text-sm select-all mb-4">{generatedQr}</p>
                  <div className="flex flex-col gap-2 w-full">
                    <button
                        onClick={() => handleDownload(generatedQr)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all"
                    >
                        <FileText size={16} strokeWidth={2.5} />
                        Download QR Labels
                    </button>
                    <button 
                      onClick={() => {
                        setGeneratedQr(null);
                        setShowForm(false);
                      }} 
                      className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all"
                    >
                      Dismiss
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Batches Table */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={showForm ? "lg:col-span-8" : "lg:col-span-12"}
        >
          <div className="bg-white border-2 border-slate-200 rounded-[2rem] overflow-hidden shadow-2xl relative">
            <div className="px-8 py-6 border-b-2 border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Active Production Logs</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.15em]">Live System Feed</span>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto px-4 pb-4 mt-4">
              <table className="w-full border-separate border-spacing-y-2">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Reference</th>
                    <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Product Identity</th>
                    <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Volume</th>
                    <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Expiry Period</th>
                    <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">System Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockBatches.map((batch, i) => (
                    <tr key={i} className="group transition-all duration-300">
                      <td className="px-6 py-5 bg-slate-50/50 first:rounded-l-2xl group-hover:bg-purple-50 transition-colors border-y-2 border-l-2 border-transparent group-hover:border-purple-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white border-2 border-slate-200 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:border-purple-200 transition-all">
                            <Hash size={16} className="text-slate-400 group-hover:text-purple-600" strokeWidth={2.5} />
                          </div>
                          <span className="font-mono text-sm font-black text-slate-900 group-hover:text-purple-700">{batch.batchId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 bg-slate-50/50 group-hover:bg-purple-50 transition-colors border-y-2 border-transparent group-hover:border-purple-100">
                        <span className="text-slate-900 font-bold tracking-tight text-base">{batch.productName}</span>
                      </td>
                      <td className="px-6 py-5 bg-slate-50/50 group-hover:bg-purple-50 transition-colors border-y-2 border-transparent group-hover:border-purple-100">
                        <div className="flex flex-col">
                          <span className="text-slate-900 font-black text-sm">{batch.quantity?.toLocaleString() || 0}</span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Units Total</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 bg-slate-50/50 group-hover:bg-purple-50 transition-colors border-y-2 border-transparent group-hover:border-purple-100">
                        <div className="flex items-center gap-2.5 text-slate-600 font-bold text-xs uppercase bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm w-fit">
                          <Calendar size={14} strokeWidth={2.5} className="text-purple-500" />
                          {batch.expiryDate ? new Date(batch.expiryDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-5 bg-slate-50/50 group-hover:bg-purple-50 transition-colors border-y-2 border-transparent group-hover:border-purple-100">
                        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border-2 shadow-sm ${
                          batch.status === 'Active' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${batch.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                          {batch.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-5 bg-slate-50/50 last:rounded-r-2xl group-hover:bg-purple-50 transition-colors border-y-2 border-r-2 border-transparent group-hover:border-purple-100 text-right">
                        <div className="flex items-center justify-end gap-2">
                            <button 
                                onClick={() => viewUnits(batch)}
                                className="p-2.5 rounded-xl bg-white text-slate-500 hover:text-purple-600 shadow-sm hover:shadow-lg transition-all border border-slate-200 hover:border-purple-200"
                                title="View Units"
                            >
                                <Eye size={18} strokeWidth={2.5} />
                            </button>
                            <button 
                                onClick={() => handlePreview(batch.batchId)}
                                disabled={isGenerating}
                                className="p-2.5 rounded-xl bg-white text-slate-500 hover:text-indigo-600 shadow-sm hover:shadow-lg transition-all border border-slate-200 hover:border-indigo-200 disabled:opacity-50 disabled:cursor-wait"
                                title="Preview Report"
                             >
                                {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Eye size={18} strokeWidth={2.5} />}
                             </button>
                             <button 
                                onClick={() => handleDownload(batch.batchId)}
                                disabled={isGenerating}
                                className="p-2.5 rounded-xl bg-white text-slate-500 hover:text-indigo-600 shadow-sm hover:shadow-lg transition-all border border-slate-200 hover:border-indigo-200 disabled:opacity-50 disabled:cursor-wait"
                                title="Download PDF"
                             >
                                {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} strokeWidth={2.5} />}
                             </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Units Modal */}
      <AnimatePresence>
        {selectedBatch && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col"
                >
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-white">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-lg">
                                <QrCode size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900">Batch Units: {selectedBatch.batchId}</h3>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{selectedBatch.productName}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setSelectedBatch(null)}
                            className="p-3 bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm"
                        >
                            <X size={20} strokeWidth={3} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
                        {loadingUnits ? (
                            <div className="h-64 flex flex-col items-center justify-center gap-4">
                                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                                <span className="font-black text-slate-400 uppercase tracking-widest text-xs">Retrieving Unit Identities...</span>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {batchUnits.map((unit, idx) => (
                                    <motion.div 
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-white p-5 rounded-2xl border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all group"
                                    >
                                        <div className="aspect-square bg-slate-50 rounded-xl mb-4 flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-300">
                                            <QRCode value={unit.qrCode} size={100} level="H" />
                                        </div>
                                        <div className="text-center">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Unit ID</div>
                                            <div className="font-mono text-sm font-black text-slate-900">{unit.qrCode}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-8 border-t border-slate-100 bg-white flex items-center justify-between">
                        <div className="text-sm font-bold text-slate-500">
                            Showing <span className="text-purple-600">{batchUnits.length}</span> unique production units
                        </div>
                        <button 
                            onClick={() => handleDownload(selectedBatch.batchId)}
                            className="flex items-center gap-3 px-8 py-4 bg-slate-900 hover:bg-purple-600 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 group"
                        >
                            <FileText size={20} strokeWidth={2.5} className="group-hover:animate-bounce" />
                            <span>Download Batch Report</span>
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      <ReportPreviewModal 
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        pdfUrl={previewUrl}
        onDownload={handleDownload}
        title={previewTitle}
        fileName={previewTitle.replace(/\s/g, '_') + '.pdf'}
      />
    </DashboardLayout>
  );
};

export default BatchManagement;
