
import React from "react";
import appIcon from "../assets/WhatsUpNeighborAppIcon.png";
import "../index.css";

export default function AuthPage() {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          {/* App Icon */}
          <img
            src={appIcon}
            alt="App Icon"
            className="auth-icon"
          />
  
          {/* Username */}
          <label className="auth-label">Username</label>
          <input
            className="auth-input"
            placeholder="Type Here"
          />
  
          {/* Password */}
          <label className="auth-label">Password</label>
          <input
            className="auth-input"
            type="password"
            placeholder="Type Here"
          />
  
          {/* Buttons */}
          <button className="auth-button primary">
            Login
          </button>
  
          <button className="auth-button secondary">
            Create Account
          </button>
        </div>
      </div>
    );
  }