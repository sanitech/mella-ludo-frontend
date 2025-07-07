import api from "./api";

export const dashboardService = {
  async getDashboardStats() {
    try {
      const response = await api.get("/dashboard/stats");
      return response.data;
    } catch (error) {
      throw error;
    }
  },



  async getSystemStatus() {
    try {
      const response = await api.get("/health");
      return {
        server: response.status === 200 ? "Online" : "Offline",
        database: response.status === 200 ? "Connected" : "Disconnected",
      };
    } catch (error) {
      return {
        server: "Offline",
        database: "Disconnected",
      };
    }
  },
};
