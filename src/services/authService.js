import api from "./api";
import { parseApiError } from "../utils/errorHandler";

export const authService = {
  async adminLogin(username, password) {
    try {
      const response = await api.post("/admin/login", {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async adminRegister(adminData) {
    try {
      const response = await api.post("/admin/register", adminData);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async getAdminProfile() {
    try {
      const response = await api.get("/admin/profile");
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async userRegister(userData) {
    try {
      const response = await api.post("/users/register", userData);
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },

  async getProfile() {
    try {
      const response = await api.get("/users/profile");
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  },
};
