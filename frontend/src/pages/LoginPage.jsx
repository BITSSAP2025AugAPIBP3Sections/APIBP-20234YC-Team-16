import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./LoginPage.css";

const LoginPage = () => {
  const [mode, setMode] = useState("login"); // 'login' or 'register'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isRegister = mode === "register";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const payload = isRegister ? { name, email, password } : { email, password };

      const res = await api.post(endpoint, payload);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/book");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">
          {isRegister ? "Create Account" : "Welcome Back"}
        </h2>

        <div className="mode-toggle">
          <button
            onClick={() => setMode("login")}
            className={`mode-button ${mode === "login" ? "active" : ""}`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            className={`mode-button ${mode === "register" ? "active" : ""}`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {isRegister && (
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                value={name}
                name="name"
                onChange={(e) => setName(e.target.value)}
                required
                className="form-input"
                placeholder="Enter your name"
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p className="error-message">{error}</p>
          )}

          <button type="submit" className="submit-button">
            {isRegister ? "Register & Continue" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
