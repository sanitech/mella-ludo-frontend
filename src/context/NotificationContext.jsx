import React, { createContext, useContext, useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const NotificationContext = createContext(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    byType: {
      finance_request: 0,
      user_ban: 0,
      system_alert: 0,
      topup_request: 0
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadNotifications = async () => {
    if (!isAuthenticated || !token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const [notificationsData, statsData] = await Promise.all([
        notificationService.getNotifications(),
        notificationService.getNotificationStats()
      ]);
      setNotifications(notificationsData || []);
      setStats(statsData || {
        total: 0,
        unread: 0,
        byType: {
          finance_request: 0,
          user_ban: 0,
          system_alert: 0,
          topup_request: 0
        }
      });
    } catch (error) {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const refreshNotifications = async () => {
    if (!isAuthenticated || !token) {
      return;
    }

    try {
      const [notificationsData, statsData] = await Promise.all([
        notificationService.getNotifications(),
        notificationService.getNotificationStats()
      ]);
      setNotifications(notificationsData || []);
      setStats(statsData || stats);
    } catch (error) {
      // Silent fail for polling
    }
  };

  const markAsRead = async (notificationId) => {
    if (!isAuthenticated) return;
    
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === notificationId 
            ? { ...notification, isRead: true }
            : notification
        )
      );
      setStats(prev => ({
        ...prev,
        unread: Math.max(0, prev.unread - 1)
      }));
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    if (!isAuthenticated) return;
    
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      setStats(prev => ({
        ...prev,
        unread: 0
      }));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all notifications as read');
    }
  };

  const deleteNotification = async (notificationId) => {
    if (!isAuthenticated) return;
    
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => 
        prev.filter(notification => notification._id !== notificationId)
      );
      setStats(prev => ({
        ...prev,
        total: prev.total - 1,
        unread: prev.unread - (notifications.find(n => n._id === notificationId)?.isRead ? 0 : 1)
      }));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      loadNotifications();
      
      const interval = setInterval(() => {
        refreshNotifications();
      }, 60000);

      return () => clearInterval(interval);
    } else {
      // Reset notifications when not authenticated
      setNotifications([]);
      setStats({
        total: 0,
        unread: 0,
        byType: {
          finance_request: 0,
          user_ban: 0,
          system_alert: 0,
          topup_request: 0
        }
      });
      setLoading(false);
      setError(null);
    }
  }, [isAuthenticated, token]);

  const value = {
    notifications,
    stats,
    loading,
    error,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 