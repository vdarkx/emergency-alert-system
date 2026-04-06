import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboard from "./pages/UserDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { clearAuth, loadAuth, saveAuth } from "./utils/authStorage";

function App() {
  const [auth, setAuth] = useState(loadAuth());

  const handleLogin = (authData) => {
    saveAuth(authData);
    setAuth(authData);
  };

  const handleLogout = () => {
    clearAuth();
    setAuth(null);
  };

  const renderDashboard = () => {
    if (!auth) {
      return <Navigate to="/login" replace />;
    }

    if (auth.role === "USER") {
      return <UserDashboard auth={auth} onLogout={handleLogout} />;
    }
    if (auth.role === "DRIVER") {
      return <DriverDashboard auth={auth} onLogout={handleLogout} />;
    }
    if (auth.role === "ADMIN") {
      return <AdminDashboard auth={auth} onLogout={handleLogout} />;
    }

    return <Navigate to="/login" replace />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={auth ? "/dashboard" : "/login"} replace />} />
        <Route path="/login" element={auth ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />} />
        <Route
          path="/register"
          element={auth ? <Navigate to="/dashboard" replace /> : <RegisterPage onLogin={handleLogin} />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute auth={auth}>
              {renderDashboard()}
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;