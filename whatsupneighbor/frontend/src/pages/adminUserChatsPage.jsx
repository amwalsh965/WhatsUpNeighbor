import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import backArrow from "../assets/leftpoint.png";

export default function AdminUserChatsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("accessToken");

  const [chats, setChats] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchChats() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/main/admin/users/${id}/chats/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch chats");
        const data = await res.json();
        setChats(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load chats.");
      }
    }
    fetchChats();
  }, [id, token]);

  return (
    <div className="tx-page">
      <header className="tx-page__topbar">
        <button className="tx-page__iconbtn" onClick={() => navigate(-1)} aria-label="Back">
          <img className="tx-page__backicon" src={backArrow} alt="" style={{ width: "24px", height: "24px" }} />
        </button>
        <div className="tx-page__title">User's Chats</div>
        <div className="tx-page__spacer" />
      </header>

      <div className="tx-page__content">
        {error && <p style={{ color: "red" }}>{error}</p>}

        {chats.length === 0 ? (
          <div className="tx-page__empty">No chats found for this user.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
            {chats.map((chat) => (
              <button
                key={chat.id}
                type="button"
                onClick={() => navigate(`/chats/${chat.id}`)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "white",
                  border: "1px solid #4a90e2",
                  borderRadius: "14px",
                  padding: "14px 18px",
                  cursor: "pointer",
                  textAlign: "left",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  width: "100%",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "#f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "16px",
                    color: "#555",
                    flexShrink: 0,
                  }}>
                    {chat.name?.[0] || "?"}
                  </div>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "15px", color: "#111" }}>
                      {chat.name}
                    </div>
                    <div style={{ fontSize: "13px", color: "#888", marginTop: "2px" }}>
                      {chat.last_message?.content || "No messages yet"}
                    </div>
                  </div>
                </div>
                <div style={{ color: "#bbb", fontSize: "18px" }}>›</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}