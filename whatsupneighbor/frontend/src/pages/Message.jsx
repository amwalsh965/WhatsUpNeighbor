import { useState } from "react";
import { useNavigate } from "react-router-dom";

const users = [
  // COMMUNITY GROUP CHAT
  {
    id: 0,
    name: "Neighborhood Group",
    message: "Omar: Is everyone coming tonight?",
    timestamp: Date.now() - 1 * 60 * 1000,
    unread: 5,
    online: true,
    isGroup: true,
    chat: [
      { from: "Omar", text: "Is everyone coming tonight?" },
      { from: "Danielle", text: "Yes I'll be there!" },
      { from: "You", text: "I'll join too." },
    ],
  },

  // REGULAR USERS
  {
    id: 1,
    name: "Danielle",
    message: "Is the ladder still available?",
    timestamp: Date.now() - 4 * 60 * 1000,
    unread: 2,
    online: true,
    chat: [
      { from: "them", text: "Hi!" },
      { from: "them", text: "Is the ladder still available?" },
      { from: "me", text: "Yes it is 👍" },
    ],
  },
  {
    id: 2,
    name: "Michael",
    message: "Can I borrow the drill?",
    timestamp: Date.now() - 7 * 60 * 1000,
    unread: 1,
    online: true,
    chat: [
      { from: "them", text: "Can I borrow the drill?" },
      { from: "me", text: "Yes, when do you need it?" },
    ],
  },
  {
    id: 3,
    name: "Sarah",
    message: "I'll return it tonight.",
    timestamp: Date.now() - 32 * 60 * 1000,
    unread: 0,
    online: false,
    chat: [
      { from: "them", text: "I'll return it tonight." },
      { from: "me", text: "Perfect!" },
    ],
  },
  {
    id: 4,
    name: "Adam",
    message: "I can pick it up tomorrow.",
    timestamp: Date.now() - 60 * 60 * 1000,
    unread: 0,
    online: false,
    chat: [
      { from: "them", text: "I can pick it up tomorrow." },
      { from: "me", text: "Sounds good." },
    ],
  },
  {
    id: 5,
    name: "Omar",
    message: "Is the event still happening?",
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    unread: 3,
    online: true,
    chat: [
      { from: "them", text: "Is the event still happening?" },
      { from: "me", text: "Yes, 6pm." },
    ],
  },
  {
    id: 6,
    name: "Izabela",
    message: "Thanks again!",
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    unread: 0,
    online: true,
    chat: [
      { from: "them", text: "Thanks again!" },
      { from: "me", text: "No problem 😊" },
    ],
  },
  {
    id: 7,
    name: "Carlos",
    message: "Can you send the address?",
    timestamp: Date.now() - 3 * 60 * 60 * 1000,
    unread: 1,
    online: true,
    chat: [
      { from: "them", text: "Can you send the address?" },
      { from: "me", text: "123 Maple Street." },
    ],
  },
  {
    id: 8,
    name: "Lina",
    message: "I’ll confirm soon.",
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
    unread: 0,
    online: false,
    chat: [
      { from: "them", text: "I’ll confirm soon." },
      { from: "me", text: "Sounds good." },
    ],
  },
];

export default function Message() {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  const sortedUsers = [...users].sort(
    (a, b) => b.timestamp - a.timestamp
  );

  const filteredUsers = sortedUsers.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatTime = (timestamp) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="msg-page">

      <div className="topbar">
        <div className="logo-left" onClick={() => navigate("/")}>
          <span className="home-icon">🏠</span>
          Rae
        </div>
        <div className="profile-right">👤</div>
      </div>

      {selectedUser ? (
        <div className="chat-container">

          <div className="chat-header">
            <button
              className="back-btn"
              onClick={() => setSelectedUser(null)}
            >
              ←
            </button>
            {selectedUser.name}
          </div>

          <div className="chat-messages">
            {selectedUser.chat.map((msg, index) => (
              <div
                key={index}
                className={`chat-bubble ${
                  msg.from === "me" ? "me" : ""
                }`}
              >
                {selectedUser.isGroup && (
                  <div style={{ fontSize: "11px", fontWeight: "600" }}>
                    {msg.from}
                  </div>
                )}
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chat-input-wrap">
            <input placeholder="Type a message..." />
            <button>Send</button>
          </div>
        </div>
      ) : (
        <>
          <h1>Messages</h1>

          <input
            className="msg-search"
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="new-msg-btn">+ New Message</button>

          <div className="message-list">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="message-item"
                onClick={() => setSelectedUser(user)}
              >
                <div className="message-avatar">
                  {user.isGroup ? "👥" : user.name[0]}
                </div>

                <div className="message-info">
                  <div className="message-top">
                    <span className="message-name">
                      {user.name}
                    </span>
                    <span className="message-time">
                      {formatTime(user.timestamp)}
                    </span>
                  </div>
                  <div className="message-preview">
                    {user.message}
                  </div>
                </div>

                {user.unread > 0 && (
                  <div className="unread-badge">
                    {user.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
