import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  X,
  Trash2,
  Package,
  Eye,
  ArrowRight
} from 'lucide-react';
import { NotificationContext } from '../context/NotificationContext';

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'Critical':
      return 'bg-red-100 border-red-300 text-red-700';
    case 'High':
      return 'bg-orange-100 border-orange-300 text-orange-700';
    case 'Medium':
      return 'bg-yellow-100 border-yellow-300 text-yellow-700';
    case 'Low':
      return 'bg-emerald-100 border-emerald-300 text-emerald-700';
    default:
      return 'bg-slate-100 border-slate-300 text-slate-700';
  }
};

const getTypeIcon = (type) => {
  switch (type) {
    case 'Verified':
      return CheckCircle2;
    case 'Anomaly':
      return AlertTriangle;
    case 'Scan':
      return Package;
    case 'Rapid Scanning':
      return Zap;
    case 'Multiple Locations':
      return AlertTriangle;
    case 'High Risk':
      return XCircle;
    default:
      return Bell;
  }
};

const getTypeColor = (type) => {
  switch (type) {
    case 'Verified':
      return 'text-emerald-600 bg-emerald-50';
    case 'Anomaly':
      return 'text-red-600 bg-red-50';
    case 'Scan':
      return 'text-blue-600 bg-blue-50';
    case 'Rapid Scanning':
      return 'text-orange-600 bg-orange-50';
    case 'Multiple Locations':
      return 'text-purple-600 bg-purple-50';
    case 'High Risk':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-slate-600 bg-slate-50';
  }
};

const NotificationItem = ({ notification, onRead, onClose }) => {
  const TypeIcon = getTypeIcon(notification.type);
  const isRead = notification.read;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`relative group border-l-4 rounded-xl p-4 mb-3 transition-all ${
        isRead
          ? 'bg-white border-l-slate-300 border border-slate-200'
          : 'bg-gradient-to-r from-purple-50 to-slate-50 border-l-purple-500 border border-purple-200 shadow-md'
      }`}
    >
      {/* Read indicator */}
      {!isRead && (
        <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse" />
      )}

      <div className="flex gap-3">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getTypeColor(notification.type)}`}>
          <TypeIcon size={18} strokeWidth={2.5} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-sm font-bold text-slate-900 truncate">
              {notification.message}
            </h4>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 border ${getSeverityColor(notification.severity)}`}>
              {notification.severity}
            </span>
          </div>

          {notification.productName && (
            <p className="text-xs text-slate-600 font-medium mb-2">
              📦 {notification.productName} ({notification.productId})
            </p>
          )}

          {notification.details && (
            <p className="text-xs text-slate-600 mb-2 line-clamp-2">
              {notification.details}
            </p>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <Clock size={12} />
              {formatTime(notification.timestamp)}
            </span>

            {!isRead && (
              <button
                onClick={() => onRead(notification.id)}
                className="text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors flex items-center gap-1"
              >
                Mark read <Eye size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={() => onClose(notification.id)}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all flex-shrink-0"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};

const formatTime = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diff = Math.floor((now - time) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return time.toLocaleDateString();
};

const NotificationPanel = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAsRead, removeNotification, markAllAsRead, clearAll } = useContext(NotificationContext);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, x: 400 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 400 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <Bell size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Notifications</h2>
              {unreadCount > 0 && (
                <p className="text-xs text-slate-500">{unreadCount} unread</p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Toolbar */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 bg-slate-50">
            <button
              onClick={markAllAsRead}
              className="text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors"
            >
              Mark all as read
            </button>
            <button
              onClick={clearAll}
              className="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors flex items-center gap-1"
            >
              <Trash2 size={12} /> Clear all
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4">
          <AnimatePresence mode="popLayout">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={markAsRead}
                  onClose={removeNotification}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <Bell size={40} className="text-slate-300 mb-3" />
                <p className="text-slate-600 font-medium mb-1">No notifications yet</p>
                <p className="text-xs text-slate-500">
                  You're all caught up! Updates will appear here.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4 bg-gradient-to-t from-slate-50">
          <a
            href="/alerts"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            View All Alerts <ArrowRight size={14} />
          </a>
        </div>
      </motion.div>
    </>
  );
};

export default NotificationPanel;
