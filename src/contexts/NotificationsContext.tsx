import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { NotificationsService, Notification } from '../lib/services/notifications';
import { createModuleLogger } from '../lib/logger';

const logger = createModuleLogger('notifications-context');

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const notificationsService = NotificationsService.getInstance();
      const data = await notificationsService.getNotifications();
      setNotifications(data);
    } catch (error) {
      logger.error('Failed to load notifications', { error });
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const notificationsService = NotificationsService.getInstance();
      await notificationsService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      logger.error('Failed to mark notification as read', { error });
      throw error;
    }
  };

  const markAllAsRead = async () => {
    try {
      const notificationsService = NotificationsService.getInstance();
      await notificationsService.markAllAsRead();
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      logger.error('Failed to mark all notifications as read', { error });
      throw error;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}