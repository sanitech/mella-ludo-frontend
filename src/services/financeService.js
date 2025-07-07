import api from "./api";
import { parseApiError } from "../utils/errorHandler";

export const financeService = {
  async getFinanceRequests(params) {
    try {
      const response = await api.get("/finance", { params });
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async getFinanceRequestById(requestId) {
    try {
      const response = await api.get(`/finance/${requestId}`);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async createFinanceRequest(requestData) {
    try {
      const response = await api.post("/finance", requestData);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async updateFinanceRequest(requestId, requestData) {
    try {
      const response = await api.put(`/finance/${requestId}`, requestData);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async updateRequestStatus(transactionId, status, adminUsername) {
    try {
      const response = await api.put(`/finance/request/${transactionId}`, {
        status,
        approvedByUsername: adminUsername
      });
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async deleteFinanceRequest(requestId) {
    try {
      const response = await api.delete(`/finance/${requestId}`);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async checkWithdrawalEligibility(userId) {
    try {
      const response = await api.get(`/finance/withdrawal-eligibility/${userId}`);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },
};
 