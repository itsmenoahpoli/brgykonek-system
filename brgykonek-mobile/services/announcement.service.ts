import api from '../api';

const announcementService = {
  getAnnouncements: async () => {
    const res = await api.get('/announcements');
    return res.data;
  },
};

export default announcementService;
