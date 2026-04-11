import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import backArrow from "../assets/leftpoint.png";

export default function AdminTrustFeedbackPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("accessToken");

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchFeedback() {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/main/admin/users/${id}/trust-feedback/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch feedback");

        const data = await res.json();
        setFeedbacks(data.results || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load trust feedback.");
      } finally {
        setLoading(false);
      }
    }

    fetchFeedback();
  }, [id, token]);

  const handleChange = (index, field, value) => {
    const updated = [...feedbacks];
    updated[index][field] = value;
    setFeedbacks(updated);
  };

  const handleSave = async (feedback) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/main/admin/users/${id}/trust-feedback/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: feedback.id,
            item_returned: feedback.item_returned,
            return_timeliness: feedback.return_timeliness,
            item_condition: feedback.item_condition,
            rating_score: feedback.rating_score,
          }),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      alert("Saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save changes");
    }
  };

  return (
    <div className="tx-page">
      <header className="tx-page__topbar">
        <button
          className="tx-page__iconbtn"
          onClick={() => navigate(-1)}
        >
          <img
            src={backArrow}
            alt=""
            style={{ width: "24px", height: "24px" }}
          />
        </button>
        <div className="tx-page__title">Trust Feedback</div>
        <div className="tx-page__spacer" />
      </header>

      <div className="tx-page__content">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : feedbacks.length === 0 ? (
          <div className="tx-page__empty">No feedback found.</div>
        ) : (
          feedbacks.map((f, index) => (
            <div
              key={f.id}
              style={{
                background: "#f9f9f9",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "12px",
                borderLeft: "4px solid #4a90e2",
              }}
            >
              <p><b>📦 {f.item || "Unknown Item"}</b></p>
              <p><b>Lender:</b> {f.lender}</p>
              <p><b>Borrower:</b> {f.borrower}</p>

              <label>
                <b>Returned:</b>{" "}
                <input
                  type="checkbox"
                  checked={f.item_returned}
                  onChange={(e) =>
                    handleChange(index, "item_returned", e.target.checked)
                  }
                />
              </label>

              <div>
                <b>Timeliness:</b>{" "}
                <select
                  value={f.return_timeliness}
                  onChange={(e) =>
                    handleChange(index, "return_timeliness", e.target.value)
                  }
                >
                  <option value="on_time">On Time</option>
                  <option value="late">Late</option>
                </select>
              </div>

              <div>
                <b>Condition:</b>{" "}
                <select
                  value={f.item_condition}
                  onChange={(e) =>
                    handleChange(index, "item_condition", e.target.value)
                  }
                >
                  <option value="good">Good</option>
                  <option value="damaged">Damaged</option>
                </select>
              </div>

              <div>
                <b>Rating:</b>{" "}
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={f.rating_score || ""}
                  onChange={(e) =>
                    handleChange(index, "rating_score", e.target.value)
                  }
                  style={{ width: "60px" }}
                />
              </div>

              <button
                onClick={() => handleSave(f)}
                style={{
                  marginTop: "10px",
                  padding: "6px 12px",
                  background: "#4a90e2",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}