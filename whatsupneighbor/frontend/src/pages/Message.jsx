import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import calIcon from "../assets/calendar.png";
import heartIcon from "../assets/heart.png";
import chatIcon from "../assets/speech-bubble.png";
import userIcon from "../assets/avatar-icon.png";

export default function MessagesPage() {
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchChats() {
      try {
        const res = await fetch("http://127.0.0.1:8000/main/chats/my_chats/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (res.status === 401) {
            navigate("/auth");
            return;
          }


        const data = await res.json();

        const mappedChats = data.map((chat) => ({
          id: chat.id,
          name: chat.name,
          isGroup: chat.is_group,
          lastMessage: chat.last_message?.content || "",
          timestamp: chat.last_message?.timestamp || new Date().toISOString(),
          unread: chat.unread_count || 0,
          messages: (chat.messages || []).map((msg) => ({
            from: msg.sender_name,
            text: msg.content,
          })),
        }));

        setChats(mappedChats);
      } catch (err) {
        console.error(err);
        setError("Failed to load chats.");
      }
    }

    fetchChats();
  }, [token]);

  const filteredChats = chats
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .filter((chat) =>
      chat.name.toLowerCase().includes(search.toLowerCase())
    );

  const formatTime = (timestamp) => {
    const diff = Date.now() - new Date(timestamp);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedChat) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/main/chats/${selectedChat.id}/send_message/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: messageInput }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSelectedChat((prev) => ({
          ...prev,
          messages: [
            ...prev.messages,
            { from: "You", text: messageInput },
          ],
        }));

        setMessageInput("");
      } else {
        setError(data.error || "Failed to send message.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to send message.");
    }
  };

  return (
    <div className="messages-container">
      <div className="topbar">
        <div className="logo-left" onClick={() => navigate("/")}>
          🏠 Rae
        </div>
        <div className="profile-right" onClick={() => navigate("/profile")}>
          👤
        </div>
      </div>

      {error && <div className="sf-error">{error}</div>}

      {selectedChat ? (
        <div className="chat-container">
          <div className="chat-header">
            <button
              className="back-btn"
              onClick={() => setSelectedChat(null)}
            >
              ←
            </button>
            {selectedChat.name}
          </div>

          <div className="chat-messages">
            {selectedChat.messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-bubble ${
                  msg.from === "You" ? "me" : ""
                }`}
              >
                {selectedChat.isGroup && (
                  <div className="group-name">{msg.from}</div>
                )}
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chat-input-wrap">
            <input
              value={messageInput}
              placeholder="Type a message..."
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />

            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="messages-title">Messages</h1>

          <div className="messages-top">
            <input
              className="messages-search"
              placeholder="Search messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button className="primary-btn new-msg-btn">
              + New Message
            </button>
          </div>

          <div className="message-list">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                className="message-item"
                onClick={() => setSelectedChat(chat)}
              >
                <div className="message-avatar">
                  {chat.isGroup ? "👥" : chat.name[0]}
                </div>

                <div className="message-content">
                  <div className="message-top">
                    <span className="message-name">{chat.name}</span>

                    <span className="message-time">
                      {formatTime(chat.timestamp)}
                    </span>
                  </div>

                  <div className="message-preview">
                    {chat.lastMessage}
                  </div>
                </div>

                {chat.unread > 0 && (
                  <div className="unread-badge">{chat.unread}</div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <nav className="bottom-nav">
        <button className="nav-item" onClick={() => navigate("/events")}>
          <img className="nav-icon" src={calIcon} alt="Events" />
        </button>

        <button className="nav-item" onClick={() => navigate("/saved")}>
          <img className="nav-icon" src={heartIcon} alt="Saved" />
        </button>

        <button className="nav-item" onClick={() => navigate("/messages")}>
          <img className="nav-icon" src={chatIcon} alt="Messages" />
        </button>

        <button className="nav-item" onClick={() => navigate("/profile")}>
          <img className="nav-icon" src={userIcon} alt="Profile" />
        </button>
      </nav>
    </div>
  );
}