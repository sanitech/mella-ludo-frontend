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
};
 