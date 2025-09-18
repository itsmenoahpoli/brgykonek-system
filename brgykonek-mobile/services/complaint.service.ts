import api from '../api';

export interface Complaint {
  id: string;
  title: string;
  content: string;
  category: string;
  status: string;
  resident_name: string;
  created_at: string;
  updated_at: string;
}

const complaintService = {
  getComplaintsByResident: async (residentId: string) => {
    const res = await api.get(`/complaints/resident/${residentId}`);
    return res.data;
  },

  getComplaintsByResidentId: async () => {
    const res = await api.get('/complaints/my-complaints');
    return res.data;
  },

  getComplaints: async () => {
    const res = await api.get('/complaints');
    return res.data;
  },

  createComplaint: async (data: any) => {
    const res = await api.post('/complaints', data);
    return res.data;
  },

  updateComplaint: async (id: string, data: any) => {
    const res = await api.put(`/complaints/${id}`, data);
    return res.data;
  },

  updateComplaintStatus: async (id: string, status: string) => {
    const res = await api.patch(`/complaints/${id}/status`, { status });
    return res.data;
  },

  deleteComplaint: async (id: string) => {
    const res = await api.delete(`/complaints/${id}`);
    return res.data;
  },
};

export default complaintService;
export { complaintService };
