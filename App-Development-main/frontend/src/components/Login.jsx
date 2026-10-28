// src/components/Login.jsx

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginThunk } from "../store/slices/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(loginThunk(credentials)).unwrap();

      // Navigate after successful login
      navigate("/");
    } catch (err) {
      // Error is handled through Redux state
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="login-container">
      <h1>WareWing Login</h1>

      <form onSubmit={handleSubmit}>
        {/* Username */}
        <div>
          <label htmlFor="username">Username</label>

          <input
            id="username"
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Error */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Submit */}
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <p>
  Don't have an account?{" "}
  <Link to="/register">Register</Link>
</p>
      </form>
    </div>
  );
};

export default Login;