import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import Layout from "./components/layout/Layout";
import AdminLogin from "./pages/auth/AdminLogin";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import UserProfile from "./pages/admin/UserProfile";
import BanManagement from "./pages/admin/BanManagement";
import TopupManagement from "./pages/admin/TopupManagement";
import FinanceManagement from "./pages/admin/FinanceManagement";
import TransactionHistory from "./pages/admin/TransactionHistory";
import AdminManagement from "./pages/admin/AdminManagement";
import Settings from "./pages/admin/Settings";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleProtectedRoute from "./components/auth/RoleProtectedRoute";
import ErrorBoundary from "./components/common/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 5000,
                  style: {
                    background: "#363636",
                    color: "#fff",
                  },
                }}
              />
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<AdminLogin />} />

                {/* Protected Routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="users/profile" element={<UserProfile />} />
                  <Route path="bans" element={<BanManagement />} />
                  <Route
                    path="admins"
                    element={
                      <RoleProtectedRoute allowedRoles={["super_admin"]}>
                        <AdminManagement />
                      </RoleProtectedRoute>
                    }
                  />
                  {/* <Route path="users/:userId" element={<UserProfile />} /> */}
                  <Route path="topup" element={<TopupManagement />} />
                  <Route path="finance" element={<FinanceManagement />} />
                  <Route path="transactions" element={<TransactionHistory />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Routes>
            </div>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
