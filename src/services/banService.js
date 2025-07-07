import api from "./api";
import { parseApiError } from "../utils/errorHandler";

export const banService = {
  async getBans(params) {
    try {
      const response = await api.get("/ban", { params });
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async getBanById(banId) {
    try {
      const response = await api.get(`/ban/${banId}`);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async createBan(banData) {
    try {
      const response = await api.post("/ban", banData);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async updateBan(banId, banData) {
    try {
      const response = await api.put(`/ban/${banId}`, banData);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async deleteBan(banId) {
    try {
      const response = await api.delete(`/ban/${banId}`);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async getUserBanHistory(userId) {
    try {
      const response = await api.get(`/ban/user/${userId}`);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async banUser(
    userId,
    adminUsername,
    reason,
    banType = "PERMANENT",
    duration = 0,
    evidence = "",
    notes = "",
    severity
  ) {
    const response = await api.post(`/ban/${userId}`, {
      adminUsername,
      reason,
      banType,
      duration,
      evidence,
      notes,
      severity,
    });
    return response.data;
  },

  async unbanUser(userId, adminUsername, unbanReason) {
    const response = await api.post(`/ban/${userId}/unban`, {
      adminUsername,
      unbanReason,
    });
    return response.data;
  },

  async getBanStatistics() {
    const response = await api.get(`/ban/statistics`);
    return response.data;
  },

  async getActiveBans() {
    const response = await api.get(`/ban`, { params: { status: "ACTIVE" } });
    return response.data;
  },

  async getExpiredBans() {
    const response = await api.get(`/ban`, { params: { status: "EXPIRED" } });
    return response.data;
  },

  async getBansByType(banType) {
    const response = await api.get(`/ban`, { params: { banType } });
    return response.data;
  },

  async getBansByUser(username) {
    const response = await api.get(`/ban`, { params: { username } });
    return response.data;
  },

  async getBansByAdmin(adminUsername) {
    const response = await api.get(`/ban`, {
      params: { bannedBy: adminUsername },
    });
    return response.data;
  },

  async updateExpiredBans() {
    const response = await api.post(`/ban/update-expired`);
    return response.data;
  },

  async appealBan(banId, appealReason) {
    const response = await api.post(`/ban/${banId}/appeal`, {
      appealReason,
    });
    return response.data;
  },

  async reviewAppeal(banId, adminUsername, decision, notes) {
    const response = await api.post(`/ban/${banId}/review-appeal`, {
      adminUsername,
      decision,
      notes,
    });
    return response.data;
  },

  async bulkUnbanUsers(userIds, adminUsername, reason) {
    const response = await api.post(`/ban/bulk-unban`, {
      userIds,
      adminUsername,
      reason,
    });
    return response.data;
  },

  async bulkBanUsers(users, adminUsername) {
    const response = await api.post(`/ban/bulk-ban`, {
      users,
      adminUsername,
    });
    return response.data;
  },
};
