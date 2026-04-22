import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Eye, FileText, Loader2 } from 'lucide-react';

const ReportPreviewModal = ({ isOpen, onClose, pdfUrl, onDownload, title, fileName }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-900/80 backdrop-blur-md"
            >
                <motion.div 
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                    className="bg-white rounded-[2.5rem] w-full max-w-6xl h-[90vh] overflow-hidden shadow-2xl flex flex-col relative"
                >
                    {/* Header */}
                    <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-200">
                                <FileText size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-none mb-1">{title || 'Document Preview'}</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{fileName || 'Report_Preview.pdf'}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={onDownload}
                                className="hidden md:flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl text-sm font-black transition-all shadow-lg shadow-slate-200 active:scale-95"
                            >
                                <Download size={18} />
                                <span>Download PDF</span>
                            </button>
                            <button 
                                onClick={onClose}
                                className="p-3 bg-white hover:bg-slate-100 border-2 border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm"
                            >
                                <X size={20} strokeWidth={3} />
                            </button>
                        </div>
                    </div>

                    {/* Preview Area */}
                    <div className="flex-1 bg-slate-100 relative">
                        {!pdfUrl ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                <Loader2 size={40} className="text-indigo-500 animate-spin" />
                                <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Generating Live Preview...</p>
                            </div>
                        ) : (
                            <iframe 
                                src={`${pdfUrl}#toolbar=0&navpanes=0`} 
                                width="100%" 
                                height="100%" 
                                className="border-none"
                                title="PDF Preview"
                            />
                        )}
                    </div>

                    {/* Mobile Footer */}
                    <div className="p-4 bg-white border-t border-slate-100 md:hidden">
                        <button 
                            onClick={onDownload}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl text-sm font-black transition-all"
                        >
                            <Download size={18} />
                            <span>Download PDF</span>
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ReportPreviewModal;
