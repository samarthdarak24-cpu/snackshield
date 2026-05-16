import React, { createContext, useState, useCallback, useEffect } from 'react';
import io from 'socket.io-client';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      console.log('✅ Connected to notification server');
    });

    // Listen for new alerts
    newSocket.on('newAlert', (alert) => {
      console.log('🔔 New alert received:', alert);
      addNotification({
        id: alert._id || Date.now(),
        message: alert.message,
        type: alert.type,
        severity: alert.severity,
        productName: alert.productName,
        productId: alert.productId,
        details: alert.details,
        timestamp: alert.timestamp || new Date(),
        read: false
      });
    });

    // Listen for product verified events
    newSocket.on('productVerified', (data) => {
      console.log('✅ Product verified:', data);
      addNotification({
        id: data.id || Date.now(),
        message: `Product Verified: ${data.productName}`,
        type: 'Verified',
        severity: 'Low',
        productName: data.productName,
        productId: data.productId,
        details: `Successfully verified from ${data.location}`,
        timestamp: new Date(),
        read: false
      });
    });

    // Listen for scan updates
    newSocket.on('scanUpdate', (data) => {
      console.log('📊 Scan update:', data);
      addNotification({
        id: data.id || Date.now(),
        message: `New Scan: ${data.productName}`,
        type: 'Scan',
        severity: 'Medium',
        productName: data.productName,
        productId: data.productId,
        details: `Scanned ${data.count} times from ${data.location}`,
        timestamp: new Date(),
        read: false
      });
    });

    // Listen for anomaly detection
    newSocket.on('anomalyDetected', (data) => {
      console.log('⚠️ Anomaly detected:', data);
      addNotification({
        id: data.id || Date.now(),
        message: 'Anomaly Detected',
        type: 'Anomaly',
        severity: 'Critical',
        productName: data.productName,
        productId: data.productId,
        details: data.details || 'Suspicious scanning pattern detected',
        timestamp: new Date(),
        read: false
      });
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from notification server');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const addNotification = useCallback((notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Auto-remove after 10 seconds if not critical
    if (notification.severity !== 'Critical') {
      setTimeout(() => {
        removeNotification(notification.id);
      }, 10000);
    }
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  const value = {
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    socket
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
