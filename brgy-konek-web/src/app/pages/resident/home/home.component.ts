import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayoutComponent } from '../../../components/shared/dashboard-layout/dashboard-layout.component';
import { AuthService, User } from '../../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, DashboardLayoutComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isPendingApproval = false;
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.checkPendingStatus();
  }

  private checkPendingStatus(): void {
    if (this.currentUser) {
      // Check if user is pending approval
      // This would typically come from the backend, but for now we'll simulate it
      // In a real implementation, you'd check the user's status from the API
      this.isPendingApproval = this.currentUser.role === 'resident' && !this.currentUser.approved;
    }
  }
}
