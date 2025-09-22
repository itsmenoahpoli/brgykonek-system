import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DashboardLayoutComponent } from '../../../components/shared/dashboard-layout/dashboard-layout.component';
import { ReportsService, ReportItem } from '../../../services/reports.service';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-resident-list-of-reports',
  templateUrl: './list-of-reports.component.html',
  styleUrls: ['./list-of-reports.component.scss'],
  imports: [DashboardLayoutComponent, CommonModule, FormsModule, ReactiveFormsModule],
})
export class ListOfReportsComponent {
  reports: ReportItem[] = [];
  statusFilter: '' | 'pending' | 'in_progress' | 'resolved' = '';
  showRequestDoc = false;
  docForm: FormGroup;
  isSubmitting = false;

  constructor(private reportsService: ReportsService, private authService: AuthService, private fb: FormBuilder) {
    this.docForm = this.fb.group({
      document_type: ['Barangay Clearance', [Validators.required]],
      notes: ['']
    });
    this.loadReports();
  }

  get filteredReports() {
    return this.reports.filter(r => (this.statusFilter ? r.status === this.statusFilter : true));
  }

  async loadReports() {
    const user = this.authService.getCurrentUser();
    if (!user) return;
    const data = await this.reportsService.getReportsByResident(user.id);
    this.reports = data || [];
  }

  openRequestDoc() {
    this.showRequestDoc = true;
  }

  closeRequestDoc() {
    this.showRequestDoc = false;
    this.docForm.reset({ document_type: 'Barangay Clearance', notes: '' });
  }

  async submitDocRequest() {
    if (!this.docForm.valid) return;
    const user = this.authService.getCurrentUser();
    if (!user) return;
    this.isSubmitting = true;
    const payload = {
      resident_id: user.id,
      document_type: this.docForm.get('document_type')?.value,
      notes: this.docForm.get('notes')?.value,
    } as any;
    const res = await this.reportsService.requestDocument(payload);
    this.isSubmitting = false;
    if (res?.success) {
      this.closeRequestDoc();
      this.loadReports();
    }
  }
}
