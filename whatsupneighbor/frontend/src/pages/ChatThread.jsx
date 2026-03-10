import React from "react";

export default function ChatThread({ chat, onClick, formatTime }) {
  return (
    <div className="message-item" onClick={onClick}>
      <div className="message-avatar">
        {chat.is_group ? "👥" : chat.name[0]}
      </div>

      <div className="message-content">
        <div className="message-top">
          <span className="message-name">{chat.name}</span>
          <span className="message-time">{formatTime(chat.last_message?.timestamp)}</span>
        </div>

        <div className="message-preview">
          {chat.last_message?.content || ""}
        </div>
      </div>

      {chat.unread > 0 && <div className="unread-badge">{chat.unread}</div>}
    </div>
  );
}