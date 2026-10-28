import api from "./api";

const dashboardService = {
  getStats: async () => {
    const response = await api.get("/api/stock-items/stats");
    return response.data;
  },
};

export default dashboardService;