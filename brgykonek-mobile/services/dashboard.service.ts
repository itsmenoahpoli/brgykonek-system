import { api } from '../api';

export interface OverviewStatistics {
  totalComplaints: number;
  totalAnnouncements: number;
  totalUsers: number;
  totalResolvedComplaints: number;
  complaintsPerMonth: Array<{ month: string; count: number }>;
  announcementsPerMonth: Array<{ month: string; count: number }>;
  usersPerMonth: Array<{ month: string; count: number }>;
}

export interface ResidentStats {
  totalComplaints: number;
  totalAnnouncements: number;
  resolvedComplaints: number;
  pendingComplaints: number;
}

export const dashboardService = {
  async getOverviewStatistics(): Promise<OverviewStatistics> {
    try {
      const response = await api.get('/dashboard/overview');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
      throw error;
    }
  },

  async getResidentStats(): Promise<ResidentStats> {
    try {
      const response = await api.get('/dashboard/resident-stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching resident stats:', error);
      throw error;
    }
  },

  async getComplaintsPerMonth(): Promise<Array<{ month: string; count: number }>> {
    try {
      const response = await api.get('/dashboard/complaints-per-month');
      return response.data;
    } catch (error) {
      console.error('Error fetching complaints per month:', error);
      throw error;
    }
  },

  async getAnnouncementsPerMonth(): Promise<Array<{ month: string; count: number }>> {
    try {
      const response = await api.get('/dashboard/announcements-per-month');
      return response.data;
    } catch (error) {
      console.error('Error fetching announcements per month:', error);
      throw error;
    }
  },
};