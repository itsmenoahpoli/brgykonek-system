import api from '../api';

const dashboardService = {
  getOverviewStatistics: async () => {
    const res = await api.get('/administrator/overview-statistics');
    return res.data;
  },
};

export default dashboardService;
