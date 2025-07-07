import api from "./api";
import { parseApiError } from "../utils/errorHandler";

export const topupService = {
  async getTopups(params) {
    try {
      const response = await api.get("/topup", { params });
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async getTopupById(topupId) {
    try {
      const response = await api.get(`/topup/${topupId}`);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async createTopup(topupData) {
    try {
      const response = await api.post("/topup", topupData);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async updateTopup(topupId, topupData) {
    try {
      const response = await api.put(`/topup/${topupId}`, topupData);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async deleteTopup(topupId) {
    try {
      const response = await api.delete(`/topup/${topupId}`);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async checkEligibility(phoneNumber, username) {
    try {
      const params = {};
      if (phoneNumber) params.phoneNumber = phoneNumber;
      if (username) params.username = username;
      
      const response = await api.get("/topup/eligibility", { params });
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },
}; 