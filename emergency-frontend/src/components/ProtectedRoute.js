import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ auth, allowedRoles, children }) {
  if (!auth?.token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
