import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import appIcon from "../assets/WhatsUpNeighborAppIcon.png";

export default function AuthPage() {
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const [username, setProfilename] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("http://127.0.0.1:8000/main/current-user/", {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.authenticated) navigate("/");
    }
    checkAuth();
  }, [navigate]);

  const handleLogin = async () => {
    const res = await fetch("http://127.0.0.1:8000/main/auth/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    console.log("LOGIN RESPONSE DATA:", data);
    if (res.ok) {
      console.log("ROLE VALUE:", data.role);
      localStorage.setItem("accessToken", data.access); 
      localStorage.setItem("refreshToken", data.refresh);
      localStorage.setItem("role", data.role); // testing -Es
      console.log("ROLE DATA VALUE AFTER FUNCTION CALL:", data.role); // 
      navigate("/");

    } else {
      console.error("Login Failed", data);
    }
    if (data.success) navigate("/");
    else setError(data.error);
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <img src={appIcon} alt="App Icon" className="auth-icon" />

        <label>Username</label>
        <input value={username} onChange={(e) => setProfilename(e.target.value)} />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="error-text">{error}</div>}

        <button onClick={handleLogin}>Login</button>
        <button onClick={() => navigate("/sign-up")}>Create Account</button>
      </div>
    </div>
  );
}