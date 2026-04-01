import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MessageBubble from "../components/messages/MessageBubble";

export default function DMPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const [chat, setChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [error, setError] = useState("");
  const [currentUsername, setCurrentUsername] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [transaction, setTransaction] = useState(null);

  const [showTrustModal, setShowTrustModal] = useState(false);
  const [listing, setListing] = useState(null);
  const [trustData, setTrustData] = useState({
    transaction: "",
    borrower: "",
    lender: "",
    item_returned: false,
    return_timeliness: "on_time",
    item_condition: "good",
    rating_score: "",
  });
  const [trustCreated, setTrustCreated] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/main/current-user/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.username) setCurrentUsername(data.username);
        if (data.name) setCurrentName(data.name);

        console.log(data.name);
        console.log(data.username);
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      }
    };
    fetchCurrentUser();
  }, [token]);

  useEffect(() => {
  if (!chat) return;

  const interval = setInterval(async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/main/chats/${chat.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setChat(data);
    } catch (err) {
      console.error(err);
    }
  }, 2000);

  return () => clearInterval(interval);
}, [chat, token]);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/main/chats/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch chat");
        const data = await res.json();
        setChat(data);
        console.log(data);
        setTransaction(data.transaction || null);
        setListing(data.listing || null);
      } catch (err) {
        console.error(err);
        setError("Failed to load chat");
      }
    };
    fetchChat();
  }, [id, token]);

  const sendMessage = async () => {
    if (!messageInput.trim() || !chat) return;
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/main/chats/${chat.id}/send_message/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: messageInput }),
        }
      );
      if (!res.ok) throw new Error("Failed to send message");
      const newMsg = await res.json();
      setChat((prev) => ({
        ...prev,
        messages: [...prev.messages, { from: newMsg.sender_name, text: newMsg.content, id: newMsg.id }],
      }));
      setMessageInput("");
    } catch (err) {
      console.error(err);
      setError("Failed to send message");
    }
  };

  const approveBorrow = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/main/transactions/start/${chat.id}/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chat.id }),
      });
      if (!res.ok) throw new Error("Failed to start transaction");
      const data = await res.json();
      setTransaction(data);
    } catch (err) {
      console.error(err);
    }
  };

  const markReturned = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/main/transactions/${transaction.id}/return_item/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to mark returned");
      const data = await res.json();
      setTransaction(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (chat?.transaction) {
      setTrustData((prev) => ({
        ...prev,
        transaction: chat.transaction.id,
        lender: chat.transaction.lender_username,
        borrower: chat.transaction.borrower_username,
      }));
    }
  }, [chat]);

  if (!chat) return <div>Loading chat...</div>;

  const isLender = transaction?.lender_username === currentUsername;
  const isBorrower = transaction?.borrower_username === currentUsername;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>
        {chat.name}
      </div>

      {error && <div>{error}</div>}
      {listing && (
        <div className="lend-card" style={{ marginBottom: "10px" }}>

          {listing.photo && (
            <img
              src={`http://127.0.0.1:8000${listing.photo}`}
              alt={listing.name}
              style={{maxWidth: "400px", width: "100%"}}
            />
          )}

          <div className="event-type">{listing.category}</div>

          <h3>{listing.name}</h3>

          <p><b>Owner:</b> {listing.owner}</p>

          <p>{listing.description}</p>

          <span
            className={`status ${
              listing.status === "Available" ? "ok" : "busy"
            }`}
          >
            {listing.status}
          </span>

        </div>
      )}

      <div className="chat-messages">
        {chat.messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isMe={msg.from === currentUsername}
            isGroup={chat.is_group}
          />
        ))}
      </div>

      <div className="chat-input-wrap">
        <input
          value={messageInput}
          placeholder="Type a message..."
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      <div className="transaction-actions">
        {transaction?.status === "open" && isLender && (
          <button onClick={approveBorrow}>Approve Borrow / Start Transaction</button>
        )}
        {transaction?.status === "in_progress" && isBorrower && (
          <button onClick={markReturned}>I have returned the item</button>
        )}
        {transaction?.status === "completed" && isLender && (
          <button onClick={() => setShowTrustModal(true)}>Submit Trust Feedback</button>
        )}
      </div>

      {showTrustModal && (
        <div className="modal-overlay" onClick={() => setShowTrustModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Trust Feedback for Transaction #{trustData.transaction}</h2>

            <label>
              <input
                type="checkbox"
                name="item_returned"
                checked={trustData.item_returned}
                onChange={(e) =>
                  setTrustData({ ...trustData, item_returned: e.target.checked })
                }
              />
              Item Returned
            </label>

            <label>
              Return Timeliness:
              <select
                name="return_timeliness"
                value={trustData.return_timeliness}
                onChange={(e) =>
                  setTrustData({ ...trustData, return_timeliness: e.target.value })
                }
              >
                <option value="on_time">On Time</option>
                <option value="late">Late</option>
              </select>
            </label>

            <label>
              Item Condition:
              <select
                name="item_condition"
                value={trustData.item_condition}
                onChange={(e) =>
                  setTrustData({ ...trustData, item_condition: e.target.value })
                }
              >
                <option value="good">Good</option>
                <option value="damaged">Damaged</option>
              </select>
            </label>

            <label>
              Rating (1-5):
              <input
                type="number"
                min="1"
                max="5"
                name="rating_score"
                value={trustData.rating_score}
                onChange={(e) =>
                  setTrustData({ ...trustData, rating_score: e.target.value })
                }
              />
            </label>

            <div className="modal-actions">
              <button onClick={() => setShowTrustModal(false)}>Cancel</button>
              <button onClick={async () => {
                try {
                  const res = await fetch(`http://127.0.0.1:8000/main/trust_feedback/${transaction.id}/`, {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      ...trustData,
                      rating_score: trustData.rating_score ? parseInt(trustData.rating_score) : null,
                    }),
                  });
                  const data = await res.json();
                  setTrustCreated(data);
                  setShowTrustModal(false);
                  console.log("set show trust modal false");
                } catch (err) {
                  console.error("Failed to create feedback", err);
                }
              }}>Submit Feedback</button>
            </div>
          </div>
        </div>
      )}
    </div>

    
  );
}