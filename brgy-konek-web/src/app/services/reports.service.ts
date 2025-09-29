import { Injectable } from '@angular/core';
import apiClient from '../utils/api.util';

export type ReportStatus = 'pending' | 'in_progress' | 'resolved' | 'received' | 'seen';

export interface ReportItem {
  _id: string;
  type: 'complaint' | 'document_request';
  title: string;
  description?: string;
  status: ReportStatus;
  resolution_note?: string;
  attachments?: string[];
  created_at: string;
  updated_at: string;
}

export interface DocumentRequestPayload {
  resident_id: string;
  document_type: 'Barangay Clearance' | 'Residency' | 'Indigency' | 'Business Permit';
  notes?: string;
}

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private baseUrl = '/reports';
  private docsUrl = '/documents/requests';

  async getReportsByResident(residentId: string): Promise<ReportItem[] | undefined> {
    try {
      const complaintsRes = await apiClient.get(`/complaints/resident/${residentId}`);
      const documentsRes = await apiClient.get(`/documents/requests/resident/${residentId}`);
      
      const complaints = complaintsRes?.data?.map((complaint: any) => ({
        _id: complaint._id,
        type: 'complaint' as const,
        title: complaint.complaint_content.substring(0, 50) + '...',
        description: complaint.complaint_content,
        status: complaint.status === 'published' ? 'pending' : 'received',
        attachments: complaint.attachments,
        created_at: complaint.created_at,
        updated_at: complaint.updated_at
      })) || [];
      
      const documents = documentsRes?.data?.map((doc: any) => ({
        _id: doc._id,
        type: 'document_request' as const,
        title: doc.document_type,
        description: doc.notes || 'Document request',
        status: doc.status,
        resolution_note: doc.staff_notes,
        created_at: doc.created_at,
        updated_at: doc.updated_at
      })) || [];
      
      const allReports = [...complaints, ...documents];
      return allReports.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } catch (e) {
      return undefined;
    }
  }

  async requestDocument(payload: DocumentRequestPayload): Promise<{ success: boolean; id?: string } | undefined> {
    try {
      const res = await apiClient.post(this.docsUrl, payload);
      return res?.data || { success: true };
    } catch (e) {
      return { success: false };
    }
  }
}




