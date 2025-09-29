import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  type: 'announcement' | 'complaint' | 'document_request';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor() {
    this.loadNotifications();
  }

  private loadNotifications(): void {
    // Mock data for now - in production this would come from the API
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'announcement',
        title: 'Community Clean-up Drive',
        message: 'Join us this Saturday for our monthly community clean-up drive at 8:00 AM.',
        isRead: false,
        createdAt: new Date('2024-01-15T10:00:00Z'),
        data: { announcementId: 'ann-001' }
      },
      {
        id: '2',
        type: 'complaint',
        title: 'Complaint Status Update',
        message: 'Your complaint #12345 has been received and is under review.',
        isRead: false,
        createdAt: new Date('2024-01-14T14:30:00Z'),
        data: { complaintId: '12345' }
      },
      {
        id: '3',
        type: 'document_request',
        title: 'Document Request Approved',
        message: 'Your barangay clearance request has been approved and is ready for pickup.',
        isRead: true,
        createdAt: new Date('2024-01-13T09:15:00Z'),
        data: { documentType: 'Barangay Clearance' }
      }
    ];
    
    this.notificationsSubject.next(mockNotifications);
    this.updateUnreadCount();
  }

  getNotifications(): Observable<Notification[]> {
    return this.notifications$;
  }

  getUnreadCount(): Observable<number> {
    return this.unreadCount$;
  }

  markAsRead(notificationId: string): void {
    const notifications = this.notificationsSubject.value;
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount();
  }

  markAllAsRead(): void {
    const notifications = this.notificationsSubject.value;
    const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount();
  }

  createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      isRead: false,
      createdAt: new Date()
    };
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([newNotification, ...currentNotifications]);
    this.updateUnreadCount();
  }

  private updateUnreadCount(): void {
    const notifications = this.notificationsSubject.value;
    const unreadCount = notifications.filter(n => !n.isRead).length;
    this.unreadCountSubject.next(unreadCount);
  }

  // Real-time notification handling (would be implemented with WebSocket in production)
  handleRealtimeNotification(notification: Notification): void {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([notification, ...currentNotifications]);
    this.updateUnreadCount();
  }
}
