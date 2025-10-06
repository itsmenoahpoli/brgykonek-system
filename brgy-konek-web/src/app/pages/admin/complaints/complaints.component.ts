import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ComplaintsService,
  Complaint,
} from '../../../services/complaints.service';
import { Observable } from 'rxjs';
import { DashboardLayoutComponent } from '../../../components/shared/dashboard-layout/dashboard-layout.component';
import { StatusModalComponent } from '../../../components/shared/status-modal/status-modal.component';

@Component({
  selector: 'app-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule, DashboardLayoutComponent, StatusModalComponent],
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.scss'],
})
export class ComplaintsComponent implements OnInit {
  complaints: Complaint[] = [];
  showViewModal = false;
  selectedComplaint: Complaint | null = null;
  showCreateModal = false;
  showSuccessModal = false;
  successTitle = '';
  successMessage = '';
  createForm = {
    resident_id: '',
    category: '',
    date_of_report: '',
    location_of_incident: '',
    complaint_content: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: 'pending',
    attachments: [] as File[],
  };
  displayedColumns = [
    'resident_id',
    'category',
    'date_of_report',
    'complaint_content',
    'attachments',
    'priority',
    'status',
    'actions',
  ];
  constructor(private complaintsService: ComplaintsService) {}
  async ngOnInit(): Promise<void> {
    const response = await this.complaintsService.getComplaints();
    if (!response) {
      this.complaints = [];
      return;
    }
    const complaintsWithResidents = await Promise.all(
      response.map(async (complaint) => {
        if (typeof complaint.resident_id === 'string') {
          const resident = await this.complaintsService.getResidentById(
            complaint.resident_id
          );
          return {
            ...complaint,
            resident_id: resident ?? {
              _id: complaint.resident_id,
              name: 'Unknown',
              email: '',
              mobile_number: '',
              user_type: '',
              address: '',
              birthdate: '',
              barangay_clearance: '',
            },
          };
        }
        return complaint;
      })
    );
    this.complaints = complaintsWithResidents;
  }
  openViewModal(complaint: Complaint) {
    this.selectedComplaint = complaint;
    this.showViewModal = true;
  }
  closeViewModal() {
    this.showViewModal = false;
    this.selectedComplaint = null;
  }

  openCreateModal() {
    this.showCreateModal = true;
    this.createForm = {
      resident_id: '',
      category: '',
      date_of_report: '',
      location_of_incident: '',
      complaint_content: '',
      priority: 'medium',
      status: 'pending',
      attachments: [],
    };
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.createForm.attachments = Array.from(input.files);
    }
  }

  async createComplaint() {
    const formData = new FormData();
    formData.append('resident_id', this.createForm.resident_id);
    formData.append('category', this.createForm.category);
    formData.append('date_of_report', new Date(this.createForm.date_of_report).toISOString());
    formData.append('location_of_incident', this.createForm.location_of_incident);
    formData.append('complaint_content', this.createForm.complaint_content);
    formData.append('status', this.createForm.status);
    formData.append('priority', this.createForm.priority);
    for (const f of this.createForm.attachments) {
      formData.append('attachments', f);
    }
    await this.complaintsService.createComplaint(formData);
    this.closeCreateModal();
    await this.ngOnInit();
  }

  async updateComplaintResolution(id: string, note: string) {
    await this.complaintsService.updateComplaint(id, { resolution_note: note, status: 'resolved' });
    this.showViewModal = false;
    this.selectedComplaint = null;
    this.successTitle = 'Complaint Resolved';
    this.successMessage = 'Complaint marked as resolved successfully.';
    this.showSuccessModal = true;
    await this.ngOnInit();
  }

  async updateComplaintPriority(id: string, priority: 'low' | 'medium' | 'high') {
    await this.complaintsService.updateComplaint(id, { priority });
    this.successTitle = 'Priority Updated';
    this.successMessage = 'Complaint priority updated successfully.';
    this.showSuccessModal = true;
    await this.ngOnInit();
  }

  async updateComplaintStatus(id: string, status: string) {
    await this.complaintsService.updateComplaint(id, { status });
    this.successTitle = 'Status Updated';
    this.successMessage = 'Complaint status updated successfully.';
    this.showSuccessModal = true;
    await this.ngOnInit();
  }

  async mockUploadFiles(files: File[]): Promise<string[]> { return []; }
  fileToBase64(file: File): Promise<string | ArrayBuffer | null> { return Promise.resolve(null); }

  getPriorityClass(priority?: string): string {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  }

  onSuccessModalClosed(): void {
    this.showSuccessModal = false;
  }
}
