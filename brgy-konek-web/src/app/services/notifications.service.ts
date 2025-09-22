import { Injectable } from '@angular/core';
import apiClient from '../utils/api.util';

export type NotificationType = 'announcement' | 'complaint_update' | 'document_update';

export interface NotificationItem {
  _id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private baseUrl = '/notifications';

  async getUserNotifications(userId: string): Promise<NotificationItem[] | undefined> {
    try {
      const res = await apiClient.get(`${this.baseUrl}/user/${userId}`);
      return res?.data || [];
    } catch {
      return undefined;
    }
  }

  async markAsRead(id: string): Promise<boolean> {
    try {
      await apiClient.put(`${this.baseUrl}/${id}/read`, {});
      return true;
    } catch {
      return false;
    }
  }
}


