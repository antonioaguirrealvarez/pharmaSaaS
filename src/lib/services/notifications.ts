import { createModuleLogger } from '../logger';
import { apiClient } from '../api/client';
import { analytics } from '../analytics';

const logger = createModuleLogger('notifications');

export type NotificationType = 'info' | 'warning' | 'error' | 'success';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  created_at: string;
}

class NotificationsService {
  private static instance: NotificationsService;

  private constructor() {}

  public static getInstance(): NotificationsService {
    if (!NotificationsService.instance) {
      NotificationsService.instance = new NotificationsService();
    }
    return NotificationsService.instance;
  }

  public async getNotifications(): Promise<Notification[]> {
    try {
      const { data, error } = await apiClient.getSupabase()
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Failed to get notifications', { error });
      throw error;
    }
  }

  public async markAsRead(notificationId: string): Promise<void> {
    try {
      const { error } = await apiClient.getSupabase()
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
      analytics.track('notification_marked_as_read', { notificationId });
    } catch (error) {
      logger.error('Failed to mark notification as read', { error, notificationId });
      throw error;
    }
  }

  public async markAllAsRead(): Promise<void> {
    try {
      const { error } = await apiClient.getSupabase()
        .from('notifications')
        .update({ read: true })
        .eq('read', false);

      if (error) throw error;
      analytics.track('all_notifications_marked_as_read');
    } catch (error) {
      logger.error('Failed to mark all notifications as read', { error });
      throw error;
    }
  }

  public async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    link?: string
  ): Promise<void> {
    try {
      const { error } = await apiClient.getSupabase()
        .from('notifications')
        .insert([
          { user_id: userId, type, title, message, link }
        ]);

      if (error) throw error;
      analytics.track('notification_created', { type, title });
    } catch (error) {
      logger.error('Failed to create notification', { error, type, title });
      throw error;
    }
  }
}