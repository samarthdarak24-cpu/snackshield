import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Zap,
  Package,
  X
} from 'lucide-react';
import { NotificationContext } from '../context/NotificationContext';

const getToastIcon = (severity) => {
  switch (severity) {
    case 'Critical':
      return AlertTriangle;
    case 'High':
      return AlertTriangle;
    case 'Medium':
      return Zap;
    case 'Low':
      return CheckCircle2;
    default:
      return Bell;
  }
};

const getToastColor = (severity) => {
  switch (severity) {
    case 'Critical':
      return {
        bg: 'bg-red-600',
        text: 'text-white',
        icon: 'text-red-100',
        border: 'border-red-700'
      };
    case 'High':
      return {
        bg: 'bg-orange-600',
        text: 'text-white',
        icon: 'text-orange-100',
        border: 'border-orange-700'
      };
    case 'Medium':
      return {
        bg: 'bg-amber-600',
        text: 'text-white',
        icon: 'text-amber-100',
        border: 'border-amber-700'
      };
    case 'Low':
      return {
        bg: 'bg-emerald-600',
        text: 'text-white',
        icon: 'text-emerald-100',
        border: 'border-emerald-700'
      };
    default:
      return {
        bg: 'bg-purple-600',
        text: 'text-white',
        icon: 'text-purple-100',
        border: 'border-purple-700'
      };
  }
};

const ToastNotification = ({ notification, onClose }) => {
  const Icon = getToastIcon(notification.severity);
  const colors = getToastColor(notification.severity);

  // Auto-close after 8 seconds if not critical
  React.useEffect(() => {
    if (notification.severity !== 'Critical') {
      const timer = setTimeout(() => {
        onClose();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 400, y: 0 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 400 }}
      className={`${colors.bg} ${colors.text} rounded-xl shadow-2xl p-4 flex items-start gap-3 max-w-md border-l-4 ${colors.border}`}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colors.icon}`}>
        <Icon size={20} strokeWidth={2.5} />
      </div>

      <div className="flex-1 min-w-0 pt-0.5">
        <p className="font-bold text-sm">{notification.message}</p>
        {notification.productName && (
          <p className="text-xs opacity-90 mt-1">
            📦 {notification.productName}
          </p>
        )}
      </div>

      <button
        onClick={onClose}
        className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

const ToastContainer = () => {
  const { notifications, removeNotification } = useContext(NotificationContext);

  // Only show first 3 notifications as toasts
  const toastNotifications = notifications.slice(0, 3);

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toastNotifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <ToastNotification
              notification={notification}
              onClose={() => removeNotification(notification.id)}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
