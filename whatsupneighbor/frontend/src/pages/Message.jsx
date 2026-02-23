import { useState } from "react";
import { useNavigate } from "react-router-dom";

const users = [
  {
    id: 0,
    name: "Neighborhood Group",
    message: "Omar: Is everyone coming tonight?",
    timestamp: Date.now() - 1 * 60 * 1000,
    unread: 5,
    isGroup: true,
    chat: [
      { from: "Omar", text: "Is everyone coming tonight?" },
      { from: "Danielle", text: "Yes I'll be there!" },
      { from: "You", text: "I'll join too." },
    ],
  },
  {
    id: 1,
    name: "Danielle",
    message: "Is the ladder still available?",
    timestamp: Date.now() - 4 * 60 * 1000,
    unread: 2,
    chat: [
      { from: "Danielle", text: "Hi!" },
      { from: "Danielle", text: "Is the ladder still available?" },
      { from: "You", text: "Yes it is 👍" },
    ],
  },
  {
    id: 2,
    name: "Michael",
    message: "Can I borrow the drill?",
    timestamp: Date.now() - 7 * 60 * 1000,
    unread: 1,
    chat: [
      { from: "Michael", text: "Can I borrow the drill?" },
      { from: "You", text: "Sure, when do you need it?" },
      { from: "Michael", text: "Tomorrow morning works." },
    ],
  },
  {
    id: 3,
    name: "Evan",
    message: "Can you send me the details?",
    timestamp: Date.now() - 15 * 60 * 1000,
    unread: 1,
    chat: [
      { from: "Evan", text: "Hey!" },
      { from: "Evan", text: "Can you send me the details?" },
      { from: "You", text: "Yes, sending now." },
    ],
  },
  {
    id: 4,
    name: "Sayman",
    message: "I'll check and let you know.",
    timestamp: Date.now() - 25 * 60 * 1000,
    unread: 0,
    chat: [
      { from: "Sayman", text: "I'll check and let you know." },
      { from: "You", text: "No rush 👍" },
    ],
  },
  {
    id: 5,
    name: "Izabela",
    message: "Thanks again!",
    timestamp: Date.now() - 45 * 60 * 1000,
    unread: 0,
    chat: [
      { from: "Izabela", text: "Thanks again!" },
      { from: "You", text: "You're welcome 😊" },
    ],
  },
  {
    id: 6,
    name: "Adam",
    message: "I'll be there around 6.",
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    unread: 2,
    chat: [
      { from: "Adam", text: "I'll be there around 6." },
      { from: "You", text: "Perfect, see you then." },
    ],
  },
  {
    id: 7,
    name: "Sam",
    message: "Is this still available?",
    timestamp: Date.now() - 3 * 60 * 60 * 1000,
    unread: 0,
    chat: [
      { from: "Sam", text: "Is this still available?" },
      { from: "You", text: "Yes it is." },
    ],
  },
  {
    id: 8,
    name: "Olivia",
    message: "Looks good to me 👍",
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
    unread: 1,
    chat: [
      { from: "Olivia", text: "Looks good to me 👍" },
      { from: "You", text: "Awesome!" },
    ],
  },
  {
    id: 9,
    name: "Sophia",
    message: "Can we reschedule?",
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    unread: 0,
    chat: [
      { from: "Sophia", text: "Can we reschedule?" },
      { from: "You", text: "Sure, what works for you?" },
    ],
  },
];

export default function Message() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

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

    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <div className="messages-container">

      <div className="topbar">
        <div className="logo-left" onClick={() => navigate("/")}>
          🏠 Rae
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
                  msg.from === "You" ? "me" : ""
                }`}
              >
                {selectedUser.isGroup && (
                  <div className="group-name">
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
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="message-item"
                onClick={() => setSelectedUser(user)}
              >
                <div className="message-avatar">
                  {user.isGroup ? "👥" : user.name[0]}
                </div>

                <div className="message-content">
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