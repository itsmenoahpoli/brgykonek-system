import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import { DashboardLayoutComponent } from '../../../components/shared/dashboard-layout/dashboard-layout.component';
import { ChartModule } from '../../../components/shared/chart.module';
import {
  DashboardService,
  OverviewStatistics,
} from '../../../services/dashboard.service';
import { Chart, registerables } from 'chart.js';
import {
  ComplaintsService,
  Complaint,
} from '../../../services/complaints.service';
import {
  AnnouncementsService,
  Announcement,
} from '../../../services/announcements.service';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    CommonModule,
    ChartModule,
    DashboardLayoutComponent,
    DatePipe,
  ],
  standalone: true,
})
export class DashboardComponent implements OnInit {
  statistics: OverviewStatistics | null = null;
  recentComplaints: Complaint[] = [];
  recentAnnouncements: Announcement[] = [];

  get resolvedComplaints(): number | string {
    if (!this.statistics) return '-';
    const resolvedCount = this.recentComplaints.filter(c => c.status === 'resolved').length;
    return resolvedCount > 0 ? resolvedCount : '-';
  }

  complaintsLineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [],
  };
  complaintsLineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
  };

  announcementsBarChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [],
  };
  announcementsBarChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };

  usersAreaChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [],
  };
  usersAreaChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
  };

  get topComplaintCategories(): { category: string; count: number }[] {
    const counts = new Map<string, number>();
    for (const c of this.recentComplaints) {
      const key = c.category || 'Unknown';
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  getComplaintsBySitio(): { sitio: string; count: number }[] {
    const counts = new Map<string, number>();
    for (const c of this.recentComplaints) {
      const key = (c as any).sitio || 'Unknown';
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([sitio, count]) => ({ sitio, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  constructor(
    private dashboardService: DashboardService,
    private complaintsService: ComplaintsService,
    private announcementsService: AnnouncementsService,
    private router: Router
  ) {
    Chart.register(...registerables);
  }

  async ngOnInit(): Promise<void> {
    this.dashboardService.getOverviewStatistics().subscribe((stats) => {
      this.statistics = stats;
      this.complaintsLineChartData = {
        labels: stats.complaintsPerMonth.map((d) => d.month),
        datasets: [
          {
            data: stats.complaintsPerMonth.map((d) => d.count),
            label: 'Complaints',
            fill: false,
            borderColor: '#ef4444',
            tension: 0.4,
          },
        ],
      };
      this.announcementsBarChartData = {
        labels: stats.announcementsPerMonth.map((d) => d.month),
        datasets: [
          {
            data: stats.announcementsPerMonth.map((d) => d.count),
            label: 'Announcements',
            backgroundColor: '#facc15',
          },
        ],
      };
      this.usersAreaChartData = {
        labels: stats.usersPerMonth.map((d) => d.month),
        datasets: [
          {
            data: stats.usersPerMonth.map((d) => d.count),
            label: 'User Activity',
            fill: true,
            backgroundColor: 'rgba(59,130,246,0.2)',
            borderColor: '#3b82f6',
            tension: 0.4,
          },
        ],
      };
    });
    const complaints = await this.complaintsService.getComplaints();
    this.recentComplaints = (complaints || [])
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 10);
    const announcements = await this.announcementsService.getAnnouncements();
    this.recentAnnouncements = (announcements || [])
      .sort((a, b) =>
        new Date(a.created_at) < new Date(b.created_at) ? 1 : -1
      )
      .slice(0, 10);
  }

  getAnnouncementDate(announcement: any): string {
    const date = announcement.created_at || announcement.updated_at;
    return date ? new Date(date).toLocaleString() : '-';
  }

  openComplaints() {
    this.router.navigate(['/admin/complaints']);
  }

  openAnnouncements() {
    this.router.navigate(['/admin/announcements']);
  }

  openUsers() {
    this.router.navigate(['/admin/accounts']);
  }

  openResolvedComplaints() {
    this.router.navigate(['/admin/complaints'], { queryParams: { status: 'resolved' } });
  }
}
