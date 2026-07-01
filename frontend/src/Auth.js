import React, { useState } from "react";
import "./App.css";

/* ── Scale / gavel icon ── */
function ScaleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v1M3 12h1M20 12h1M5.6 5.6l.7.7M18.4 5.6l-.7.7"/>
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 16v5M8 21h8"/>
      <path d="M4 12l3 6h10l3-6"/>
    </svg>
  );
}

function Auth({ setToken }) {

  /* ── EXISTING STATE ── */
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");

  /* 🔥 NEW STATE (NAME) */
  const [name, setName] = useState("");

  const handleSubmit = async () => {
    const url = isLogin
      ? "http://127.0.0.1:8000/login/"
      : "http://127.0.0.1:8000/signup/";

    try {
      const res = await fetch(
        `${url}?email=${email}&password=${password}`,
        { method: "POST" }
      );

      const data = await res.json();

      if (isLogin) {
        /* ── LOGIN ── */
        localStorage.setItem("token", data.access_token);

        /* 🔥 GET NAME USING EMAIL */
        const storedName = localStorage.getItem(email);
        if (storedName) {
          localStorage.setItem("user", storedName);
        }

        setToken(data.access_token);

      } else {
        /* ── SIGNUP ── */

        /* 🔥 SAVE NAME WITH EMAIL */
        localStorage.setItem(email, name);

        alert("Signup successful! Now login.");
        setIsLogin(true);
      }

    } catch (err) {
      alert("Error");
    }
  };

  const onKey = (e) => { if (e.key === "Enter") handleSubmit(); };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo-wrap">
          <div className="auth-logo-icon">
            <ScaleIcon />
          </div>
          <h1>Legal<span>Lens</span></h1>
          <p>AI-powered document intelligence</p>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab-btn${isLogin ? " active" : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Sign In
          </button>

          <button
            className={`auth-tab-btn${!isLogin ? " active" : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Create Account
          </button>
        </div>

        {/* 🔥 NAME FIELD (ONLY IN SIGNUP) */}
        {!isLogin && (
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        {/* EMAIL */}
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            className="form-input"
            type="email"
            placeholder="you@lawfirm.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={onKey}
          />
        </div>

        {/* PASSWORD */}
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={onKey}
          />
        </div>

        {/* BUTTON */}
        <button className="auth-submit" onClick={handleSubmit}>
          {isLogin ? "Sign In" : "Sign Up"}
        </button>

        {/* SWITCH */}
        <p className="auth-switch">
          {isLogin ? "Don't have an account? " : "Already registered? "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Create one" : "Sign in"}
          </span>
        </p>

      </div>
    </div>
  );
}

export default Auth;