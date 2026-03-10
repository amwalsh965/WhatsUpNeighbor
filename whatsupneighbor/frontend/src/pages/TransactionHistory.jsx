import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import backArrow from "../assets/leftpoint.png";

export default function TransactionHistory() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="tx-page">
      <header className="tx-page__topbar">
        <button className="tx-page__iconbtn" onClick={() => navigate(-1)} aria-label="Back">
          <img className="tx-page__backicon" src={backArrow} alt="" />
        </button>
        <div className="tx-page__title">Transaction History</div>
        <div className="tx-page__spacer" />
      </header>

      <div className="tx-page__content">
        <p className="tx-page__subtitle">Member: {id}</p> 

        <div className="tx-page__empty">
          No transactions to show (placeholder).
        </div>
      </div>
    </div>
  );
}