import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authApi";

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      setIsLoading(true);
      const response = await loginUser({ email, password });
      onLogin(response);
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>🚑 Emergency Login</h1>
        <p className="auth-subtitle">Sign in to your role-based dashboard.</p>

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          placeholder="you@example.com"
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          placeholder="Enter password"
        />

        {errorMessage && <p className="field-error">{errorMessage}</p>}

        <button type="submit" className="danger-button" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <p className="auth-footer">
          New user? <Link to="/register">Create account</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
