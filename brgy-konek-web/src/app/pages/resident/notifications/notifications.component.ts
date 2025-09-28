import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayoutComponent } from '../../../components/shared/dashboard-layout/dashboard-layout.component';
import { NotificationsService, NotificationItem } from '../../../services/notifications.service';
import { AuthService } from '../../../services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-resident-notifications',
  standalone: true,
  imports: [CommonModule, DashboardLayoutComponent, DatePipe],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications: NotificationItem[] = [];
  loading = false;

  constructor(
    private notificationsService: NotificationsService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    await this.loadNotifications();
  }

  async loadNotifications() {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.loading = true;
    try {
      const data = await this.notificationsService.getUserNotifications(user.id);
      this.notifications = (data || []).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      this.loading = false;
    }
  }

  async markAsRead(notification: NotificationItem) {
    if (notification.read) return;

    try {
      await this.notificationsService.markAsRead(notification._id);
      notification.read = true;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  async markAllAsRead() {
    const unreadNotifications = this.notifications.filter(n => !n.read);
    
    try {
      await Promise.all(
        unreadNotifications.map(n => this.notificationsService.markAsRead(n._id))
      );
      unreadNotifications.forEach(n => n.read = true);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }

  get hasUnreadNotifications(): boolean {
    return this.notifications.some(n => !n.read);
  }

  getNotificationIconClass(type: string): string {
    switch (type) {
      case 'announcement':
        return 'bg-blue-500';
      case 'complaint_update':
        return 'bg-orange-500';
      case 'document_update':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  }
}
