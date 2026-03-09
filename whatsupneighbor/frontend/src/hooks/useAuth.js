import { useState, useEffect } from "react";

export default function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("http://127.0.0.1:8000/main/current_user/", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            });
        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Auth check failed", err);
        setIsLoggedIn(false);
      }
    }
    checkAuth();
  }, []);

  return isLoggedIn;
}