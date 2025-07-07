import api from "./api";
import { parseApiError } from "../utils/errorHandler";

export const adminService = {
  async createAdmin(adminData) {
    try {
      const response = await api.post("/admin/register", adminData);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async getAdminProfile(adminId) {
    try {
      const response = await api.get(`/admin/${adminId}`);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async getAllAdmins() {
    try {
      const response = await api.get("/admin/list");
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async updateAdmin(adminId, updates) {
    try {
      const response = await api.put(`/admin/${adminId}`, updates);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async deleteAdmin(adminId) {
    try {
      const response = await api.delete(`/admin/${adminId}`);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async deactivateAdmin(adminId) {
    try {
      const response = await api.put(`/admin/${adminId}/deactivate`);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async activateAdmin(adminId) {
    try {
      const response = await api.put(`/admin/${adminId}/activate`);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },
};
