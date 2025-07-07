import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { authService } from "../services/authService";
import toast from "react-hot-toast";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      if (initialized) return;
      
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const adminData = await authService.getAdminProfile(storedToken);
          setAdmin(adminData);
          setToken(storedToken);
        } catch (error) {
          localStorage.removeItem("token");
          setToken(null);
          setAdmin(null);
        }
      }
      setLoading(false);
      setInitialized(true);
    };

    initializeAuth();
  }, [initialized]);

  const adminLogin = async (username, password) => {
    try {
      const response = await authService.adminLogin(username, password);
      setAdmin(response.admin);
      setToken(response.token);
      localStorage.setItem("token", response.token);
      toast.success("Login successful!");
      return response;
    } catch (error) {
      const errorMessage = error.message || "Login failed";
      toast.error(errorMessage);
      throw error;
    }
  };

  const adminRegister = async (adminData) => {
    try {
      const response = await authService.adminRegister(adminData);
      toast.success("Admin registered successfully!");
      return response;
    } catch (error) {
      const errorMessage = error.message || "Registration failed";
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
  };

  const value = {
    admin,
    token,
    adminLogin,
    adminRegister,
    logout,
    loading,
    isAuthenticated: !!token && !!admin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 