import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";



const RoleProtectedRoute = ({
  children,
  allowedRoles,
  fallbackPath = "/",
}) => {
  const { admin } = useAuth();

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(admin.role)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
