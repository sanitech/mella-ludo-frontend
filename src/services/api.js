import axios from "axios";
import config from "../config/environment.js";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  // Only access localStorage in browser environment
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    const isLogin = originalRequest && originalRequest.url && originalRequest.url.includes("/admin/login");
    
    // Only redirect if not on login page and not a login request
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      window.location.pathname !== "/login" &&
      !isLogin
    ) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    
    // Log errors in development
    if (config.app.isDevelopment) {
      console.error('API Error:', error);
    }
    
    return Promise.reject(error);
  }
);

// Export the configured axios instance
export default api;
