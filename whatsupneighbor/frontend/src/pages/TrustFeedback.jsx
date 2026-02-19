import { useState } from "react";

export default function TrustFeedback() {
  const [feedbackId, setFeedbackId] = useState("");
  const [singleFeedback, setSingleFeedback] = useState(null);
  const [allFeedback, setAllFeedback] = useState([]);

  const [trustData, setTrustData] = useState({
    transaction: "",
    borrower: "",
    lender: "",
    item_returned: false,
    return_timeliness: "on_time",
    item_condition: "good",
    rating_score: ""
  });

  const FEEDBACK_BASE = "http://127.0.0.1:8000/main/trust_feedback/";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTrustData({
      ...trustData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const createFeedback = async () => {
    const res = await fetch(FEEDBACK_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...trustData,
        rating_score: trustData.rating_score
          ? parseInt(trustData.rating_score)
          : null,
      }),
    });

    const data = await res.json();
    setSingleFeedback(data);
  };

  const getFeedback = async () => {
    const res = await fetch(`${FEEDBACK_BASE}${feedbackId}/`);
    const data = await res.json();
    setSingleFeedback(data);
  };

  const getAllFeedback = async () => {
    const res = await fetch(FEEDBACK_BASE);
    const data = await res.json();
    setAllFeedback(data);
    setSingleFeedback(null);
  };

  return (
    <div className="events-page">

      <div className="events-hero">
        <h1>Trust Feedback</h1>
        <p>Build trust in your neighborhood community</p>
      </div>

      <h2 className="section-title">Create Trust Feedback</h2>

      <div className="event-card form-card">

        <input name="borrower" placeholder="Borrower ID" onChange={handleChange} />
        <input name="lender" placeholder="Lender ID" onChange={handleChange} />
        <input name="transaction" placeholder="Transaction ID" onChange={handleChange} />

        <label>
          <input type="checkbox" name="item_returned" onChange={handleChange} />
          Item Returned
        </label>

        <select name="return_timeliness" onChange={handleChange}>
          <option value="on_time">On Time</option>
          <option value="late">Late</option>
        </select>

        <select name="item_condition" onChange={handleChange}>
          <option value="good">Good</option>
          <option value="damaged">Damaged</option>
        </select>

        <input name="rating_score" placeholder="Rating (1-5)" onChange={handleChange} />

        <button onClick={createFeedback}>Create Trust Feedback</button>
      </div>

      <h2 className="section-title">View Feedback</h2>

      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <input
          placeholder="Feedback ID"
          value={feedbackId}
          onChange={(e) => setFeedbackId(e.target.value)}
        />
        <button onClick={getFeedback}>Show One</button>
        <button onClick={getAllFeedback}>Show All</button>
      </div>

      {singleFeedback && (
        <div className="event-grid">
          <TrustCard feedback={singleFeedback} />
        </div>
      )}

      {allFeedback.length > 0 && (
        <div className="event-grid">
          {allFeedback.map(f => (
            <TrustCard key={f.id} feedback={f} />
          ))}
        </div>
      )}

    </div>
  );
}

function TrustCard({ feedback }) {
  return (
    <div className="event-card trust-card">
      <div className="event-type">
        ⭐ {feedback.rating_score}/5
      </div>

      <h3>Transaction #{feedback.transaction}</h3>

      <p><b>Borrower:</b> {feedback.borrower}</p>
      <p><b>Lender:</b> {feedback.lender}</p>

      <p>
        <b>Returned:</b>{" "}
        {feedback.item_returned ? "✅ Yes" : "❌ No"}
      </p>

      <p>
        <b>Timeliness:</b>{" "}
        {feedback.return_timeliness === "on_time" ? "⏰ On Time" : "⚠️ Late"}
      </p>

      <p>
        <b>Condition:</b>{" "}
        {feedback.item_condition === "good" ? "👍 Good" : "💥 Damaged"}
      </p>
    </div>
  );
}
