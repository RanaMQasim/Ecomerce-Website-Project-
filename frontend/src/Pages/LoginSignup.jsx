import React, { useState, useContext } from "react";
import "./CSS/LoginSignup.css";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../store/AuthContext"; 

export default function LoginSignup() {
  const [state, setState] = useState("Login"); 
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const auth = useContext(AuthContext);

  const changeHandler = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAuthResponse = (resData) => {
    const token = resData.token;
    const user = resData.user;
    if (token) {
      auth?.setAuth({ token, user });
      return true;
    }
    return false;
  };

  const login = async () => {
    setMessage(null);
    if (!formData.email || !formData.password) {
      setMessage({ type: "error", text: "Please provide email and password." });
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      const ok = handleAuthResponse(res.data);
      if (ok) {
        setMessage({ type: "success", text: "Login successful — redirecting…" });
        navigate("/");
      } else {
        setMessage({ type: "error", text: res.data.message || "Login failed" });
      }
    } catch (err) {
      const text = err?.response?.data?.message || "Login failed. Please try again.";
      setMessage({ type: "error", text });
    } finally {
      setLoading(false);
    }
  };

  const signup = async () => {
    setMessage(null);
    if (!formData.username || !formData.email || !formData.password) {
      setMessage({ type: "error", text: "Please provide name, email and password." });
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/api/auth/signup", {
        name: formData.username,
        email: formData.email,
        password: formData.password,
      });
      const ok = handleAuthResponse(res.data);
      if (ok) {
        setMessage({ type: "success", text: "Registration successful — redirecting…" });
        navigate("/");
      } else {
        setMessage({ type: "error", text: res.data.message || "Signup failed" });
      }
    } catch (err) {
      const text = err?.response?.data?.message || "Signup failed. Please try again.";
      setMessage({ type: "error", text });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginSignup">
      <div className="loginSignup-container">
        <h1>{state}</h1>
        <div className="loginSignup-fields">
          {state === "Sign Up" && (
            <input
              name="username"
              value={formData.username}
              onChange={changeHandler}
              type="text"
              placeholder="Enter Your Name"
            />
          )}
          <input
            name="email"
            value={formData.email}
            onChange={changeHandler}
            type="email"
            placeholder="Email Address"
          />
          <input
            name="password"
            value={formData.password}
            onChange={changeHandler}
            type="password"
            placeholder="Password"
          />
        </div>
        <button onClick={() => (state === "Login" ? login() : signup())} disabled={loading}>
          {loading ? (state === "Login" ? "Logging in…" : "Signing up…") : "Continue"}
        </button>
        {state === "Sign Up" ? (
          <p className="loginSignup-login">
            Already have an account? <span onClick={() => setState("Login")}>Login Here</span>
          </p>
        ) : (
          <p className="loginSignup-login">
            Create an account? <span onClick={() => setState("Sign Up")}>Click Here</span>
          </p>
        )}
        <div className="loginSignup-agree">
          <input type="checkbox" />
          <p>By continuing, I agree to the terms and privacy policy.</p>
        </div>
        {message && (
          <div className={`auth-message ${message.type === "error" ? "error" : "success"}`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
