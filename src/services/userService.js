import api from "./api";
import { parseApiError } from "../utils/errorHandler";

export const userService = {
  async getUsers(params) {
    try {
      const response = await api.get("/user", { params });
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async getUserById(userId) {
    try {
      const response = await api.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async createUser(userData) {
    try {
      const response = await api.post("/user/register", userData);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async updateUser(userId, userData) {
    try {
      const response = await api.put(`/user/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async deleteUser(userId) {
    try {
      const response = await api.delete(`/user/${userId}`);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async resetUserBalance(userId, adminUsername, reason) {
    try {
      const response = await api.post(`/user/${userId}/reset-balance`, {
        adminUsername,
        reason,
      });
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async getUserProfile(params) {
    try {
      const cleanParams = {};
      if (params?.username) cleanParams.username = params.username;
      if (params?.chatId) cleanParams.chatId = params.chatId;
      if (params?.phoneNumber) cleanParams.phoneNumber = params.phoneNumber;
      
      const response = await api.get("/user/profile", { params: cleanParams });
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },
};
 