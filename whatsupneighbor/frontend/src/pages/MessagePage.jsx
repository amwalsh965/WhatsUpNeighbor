import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


import BottomNav from "../components/general/BottomNav";

import ChatThread from "./ChatThread";

export default function MessagesPage() {
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [chats, setChats] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchChats() {
      try {
        const res = await fetch("http://127.0.0.1:8000/main/chats/my_chats/", {
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
  }, [token]);

  const filteredChats = chats
    .filter((chat) => chat.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.last_message?.timestamp) - new Date(a.last_message?.timestamp));

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const diff = Date.now() - new Date(timestamp);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <div className="messages-container">
      <div className="topbar">
        <div className="logo-left" onClick={() => navigate("/")}>🏠 Rae</div>
        <div className="profile-right" onClick={() => navigate("/profile")}>👤</div>
      </div>

      {error && <div className="sf-error">{error}</div>}

      <h1 className="messages-title">Messages</h1>

      <div className="messages-top">
        <input
          className="messages-search"
          placeholder="Search messages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="message-list">
        {filteredChats.map((chat) => (
          <ChatThread
            key={chat.id}
            chat={chat}
            formatTime={formatTime}
            onClick={() => navigate(`/chats/${chat.id}`)}
          />
        ))}
      </div>

      <BottomNav navigate={navigate} />
    </div>
  );
}