import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ComplaintsService,
  Complaint,
} from '../../../services/complaints.service';
import { Observable } from 'rxjs';
import { DashboardLayoutComponent } from '../../../components/shared/dashboard-layout/dashboard-layout.component';

@Component({
  selector: 'app-complaints',
  standalone: true,
  imports: [CommonModule, DashboardLayoutComponent],
  templateUrl: './complaints.component.html',
  styleUrls: ['./complaints.component.scss'],
})
export class ComplaintsComponent implements OnInit {
  complaints: Complaint[] = [];
  showViewModal = false;
  selectedComplaint: Complaint | null = null;
  showCreateModal = false;
  createForm = {
    resident_id: '',
    category: '',
    date_of_report: '',
    location_of_incident: '',
    complaint_content: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: 'draft',
    attachments: [] as File[],
  };
  displayedColumns = [
    'resident_id',
    'category',
    'date_of_report',
    'complaint_content',
    'attachments',
    'status',
    'created_at',
    'updated_at',
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
      status: 'draft',
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
    const attachments = await this.mockUploadFiles(this.createForm.attachments);
    const payload: any = {
      resident_id: this.createForm.resident_id,
      category: this.createForm.category,
      date_of_report: new Date(this.createForm.date_of_report).toISOString(),
      location_of_incident: this.createForm.location_of_incident,
      complaint_content: this.createForm.complaint_content,
      attachments,
      status: this.createForm.status,
      priority: this.createForm.priority,
    };
    await this.complaintsService.createComplaint(payload);
    this.closeCreateModal();
    await this.ngOnInit();
  }

  async updateComplaintStatus(id: string, status: string) {
    await this.complaintsService.updateComplaint(id, { status });
    await this.ngOnInit();
  }

  async updateComplaintResolution(id: string, note: string) {
    await this.complaintsService.updateComplaint(id, { resolution_note: note, status: 'resolved' });
    await this.ngOnInit();
  }

  async updateComplaintPriority(id: string, priority: 'low' | 'medium' | 'high') {
    await this.complaintsService.updateComplaint(id, { priority });
    await this.ngOnInit();
  }

  async mockUploadFiles(files: File[]): Promise<string[]> {
    const results: string[] = [];
    for (const file of files) {
      const base64 = await this.fileToBase64(file);
      results.push(base64 as string);
    }
    return results;
  }

  fileToBase64(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
