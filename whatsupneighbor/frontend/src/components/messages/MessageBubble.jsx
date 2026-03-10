import React from "react";

export default function MessageBubble({ message, isMe, isGroup }) {
  return (
    <div className={`message-row ${isMe ? "me" : "other"}`}>
      <div className={`chat-bubble ${isMe ? "me" : "other"}`}>
        {isGroup && !isMe && (
          <div className="group-name">{message.from}</div>
        )}
        {message.text}
      </div>
    </div>
  );
}