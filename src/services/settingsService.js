import api from "./api";
import { parseApiError } from "../utils/errorHandler";

export const settingsService = {
  async getSettings() {
    try {
      const response = await api.get("/settings");
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async getSetting(key) {
    try {
      const response = await api.get(`/settings/${key}`);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async updateSetting(key, value) {
    try {
      const response = await api.put(`/settings/${key}`, { value });
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async createSetting(settingData) {
    try {
      const response = await api.post("/settings", settingData);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async deleteSetting(key) {
    try {
      const response = await api.delete(`/settings/${key}`);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async changePassword(currentPassword, newPassword, confirmNewPassword) {
    try {
      const response = await api.post("/admin/change-password", {
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async listSessions() {
    try {
      const response = await api.get("/admin/sessions");
      return response.data.sessions;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async logoutOtherSessions() {
    try {
      const response = await api.post("/admin/logout-others");
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async logoutAllSessions() {
    try {
      const response = await api.post("/admin/logout-all");
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },
};
 