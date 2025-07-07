import api from "./api";
import { parseApiError } from "../utils/errorHandler";

export const notificationService = {
  async getNotifications() {
    try {
      const response = await api.get("/notifications");
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async getNotificationStats() {
    try {
      const response = await api.get("/notifications/stats");
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async markAsRead(notificationId) {
    try {
      const response = await api.patch(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async markAllAsRead() {
    try {
      const response = await api.patch("/notifications/read-all");
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async deleteNotification(notificationId) {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },
};
