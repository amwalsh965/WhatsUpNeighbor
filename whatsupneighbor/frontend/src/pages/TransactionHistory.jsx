import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import backArrow from "../assets/leftpoint.png";

export default function TransactionHistory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("accessToken");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/main/members/${id}/transactions/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTransactions(data.results || []);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, [id, token]);

  return (
    <div className="tx-page">
      <header className="tx-page__topbar">
        <button className="tx-page__iconbtn" onClick={() => navigate(-1)} aria-label="Back">
          <img className="tx-page__backicon" src={backArrow} alt="" style={{ width: "24px", height: "24px" }} />
        </button>
        <div className="tx-page__title">Transaction History</div>
        <div className="tx-page__spacer" />
      </header>

      <div className="tx-page__content">
        {loading ? (
          <p>Loading...</p>
        ) : transactions.length === 0 ? (
          <div className="tx-page__empty">No transactions yet.</div>
        ) : (
          transactions.map((t) => (
            <div key={t.id} style={{
              background: "#f9f9f9",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "12px",
              borderLeft: `4px solid ${t.status === "completed" ? "#4caf50" : "#ff6b6b"}`,
            }}>
              <p><b>📦 {t.item}</b></p>
              <p><b>Lender:</b> {t.lender}</p>
              <p><b>Borrower:</b> {t.borrower}</p>
              <p><b>Dates:</b> {t.start_date ? new Date(t.start_date).toLocaleDateString() : "N/A"} – {t.end_date ? new Date(t.end_date).toLocaleDateString() : "N/A"}</p>
              <p><b>Status:</b> {t.status === "completed" ? "✅ Completed" : "❌ Declined"}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}