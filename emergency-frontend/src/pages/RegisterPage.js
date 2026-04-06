import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authApi";

function RegisterPage({ onLogin }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      setIsLoading(true);
      const response = await registerUser({ name, email, password, role });
      onLogin(response);
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>📝 Create Account</h1>
        <p className="auth-subtitle">Register as a USER, DRIVER, or ADMIN.</p>

        <label>Name</label>
        <input value={name} onChange={(event) => setName(event.target.value)} required placeholder="Full name" />

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
          minLength={6}
          placeholder="At least 6 characters"
        />

        <label>Role</label>
        <select value={role} onChange={(event) => setRole(event.target.value)}>
          <option value="USER">USER</option>
          <option value="DRIVER">DRIVER</option>
          <option value="ADMIN">ADMIN</option>
        </select>

        {errorMessage && <p className="field-error">{errorMessage}</p>}

        <button type="submit" className="danger-button" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Register"}
        </button>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
