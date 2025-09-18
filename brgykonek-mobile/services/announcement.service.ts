import api from '../api';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  body?: string;
  banner_image?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAnnouncementData {
  title: string;
  content: string;
  status: string;
}

const announcementService = {
  getAnnouncements: async (): Promise<Announcement[]> => {
    const res = await api.get('/announcements');
    return res.data;
  },

  createAnnouncement: async (data: CreateAnnouncementData): Promise<Announcement> => {
    const res = await api.post('/announcements', data);
    return res.data;
  },

  updateAnnouncement: async (id: string, data: Partial<CreateAnnouncementData>): Promise<Announcement> => {
    const res = await api.put(`/announcements/${id}`, data);
    return res.data;
  },

  deleteAnnouncement: async (id: string): Promise<void> => {
    const res = await api.delete(`/announcements/${id}`);
    return res.data;
  },
};

export default announcementService;
export { announcementService };
