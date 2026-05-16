import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Zap, AlertCircle } from 'lucide-react';
import axios from 'axios';

const NotificationTester = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const triggerTestNotification = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/alerts/test/trigger', {});
      setMessage('✅ Test notification sent successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Failed to send test notification');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-6 shadow-lg"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3 items-start flex-1">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg mt-1">
            <Zap size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Test Notifications</h3>
            <p className="text-sm text-slate-600 mb-4">
              Click the button to trigger a test notification and verify real-time updates are working.
            </p>
            
            {message && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`text-sm font-semibold px-3 py-2 rounded-lg ${
                  message.includes('✅')
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                    : 'bg-red-100 text-red-700 border border-red-300'
                }`}
              >
                {message}
              </motion.div>
            )}
          </div>
        </div>

        <motion.button
          onClick={triggerTestNotification}
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 disabled:from-slate-400 disabled:to-slate-300 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl flex-shrink-0"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send size={16} />
              Send Test
            </>
          )}
        </motion.button>
      </div>

      <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-lg flex gap-2 items-start">
        <AlertCircle size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700">
          <strong>Tip:</strong> Check the notification bell icon in the top right to see real-time updates appear instantly!
        </p>
      </div>
    </motion.div>
  );
};

export default NotificationTester;
