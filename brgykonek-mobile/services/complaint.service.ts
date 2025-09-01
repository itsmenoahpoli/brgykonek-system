import api from '../api';

const complaintService = {
  getComplaintsByResident: async (residentId: string) => {
    const res = await api.get(`/complaints/resident/${residentId}`);
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
};

export default complaintService;
