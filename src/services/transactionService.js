import api from "./api";
import { parseApiError } from "../utils/errorHandler";

export const transactionService = {
  async getTransactions(params) {
    try {
      const response = await api.get("/transaction/finance", { params });
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async getFinanceRecords(params) {
    try {
      const response = await api.get("/transaction/finance", { params });
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async getAllFinanceRecords(params) {
    try {
      const response = await api.get("/transaction/finance/all", { params });
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async getTransactionById(transactionId) {
    try {
      const response = await api.get(`/transaction/${transactionId}`);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async createTransaction(transactionData) {
    try {
      const response = await api.post("/transaction", transactionData);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async updateTransaction(transactionId, transactionData) {
    try {
      const response = await api.put(`/transaction/${transactionId}`, transactionData);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async deleteTransaction(transactionId) {
    try {
      const response = await api.delete(`/transaction/${transactionId}`);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async rollbackFinanceRecord(transactionId, rollbackData) {
    try {
      const response = await api.post(`/transaction/finance/rollback/${transactionId}`, rollbackData);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async getTransactionStatistics(period = "all") {
    try {
      const response = await api.get("/transaction/statistics", { 
        params: { period } 
      });
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async getGameTransactions(params) {
    try {
      const response = await api.get("/transaction/game", { params });
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async rollbackTransaction(transactionId, rollbackData) {
    try {
      const response = await api.post(`/transaction/rollback/${transactionId}`, rollbackData);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },
}; 