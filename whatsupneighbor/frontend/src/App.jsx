import React, { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const URL_BASE = "http://127.0.0.1:8000/main/"

function App() {
  const [number, setNumber] = useState(null);
  const [userId, setUserId] = useState("");
  const [profileId, setProfileId] = useState("");
  const [results, setResults] = useState([]);
  const [feedbackId, setFeedbackId] = useState("");
  const [trustFeedback, setTrustFeedback] = useState(null);

  const [trustData, setTrustData] = useState({
    transaction: "",
    borrower: "",
    lender: "",
    item_returned: "",
    return_timeliness: "",
    item_condition: "",
    rating_score: "",
    timestamp: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setTrustData({
      ...trustData, [name]: type === "checkbox" ? checked : value,
    });
  };

  const FEEDBACK_BASE = URL_BASE + "trust_feedback/"

  //POST
  const createFeedback = async () => {
    const res = await fetch(FEEDBACK_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...trustData,
        rating_score: trustData.rating_score  ? parseInt(trustData.rating_score) : null,
      }),
    });

    const data = await res.json();
    alert("Feedback Id: " + data.id);
  }

  //GET

  const getFeedback = async () => {
    const res = await fetch(`${FEEDBACK_BASE}${feedbackId}/`);
    const data = await res.json();
    setTrustFeedback(data);
  }

  const getAllFeedback = async () => {
    const res = await fetch(FEEDBACK_BASE);
    const data = await res.json();
    setResults(data);
  }

  const filterByBorrower = async () => {
    const res = await fetch(`${FEEDBACK_BASE}?borrower_id=${trustData.borrower}`);
    const data = await res.json();
    setResults(data);
  }

  const filterByLender = async () => {
    const res = await fetch(`${FEEDBACK_BASE}?lender_id=${trustData.lender}`);
    const data = await res.json();
    setResults(data);
  }

  //PUT
  const updateFeedback = async () => {
    const res = await fetch(`${FEEDBACK_BASE}${feedbackId}/`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(trustData),
    });

    const data = await res.json();
    setTrustFeedback(data);
    alert("Updated");
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1> Trust Feedback Manager </h1>
      <h2> CREATE </h2>
      <input name="borrower" placeholder="Borrower ID" onChange={handleChange} />
      <br />

      <input name="lender" placeholder="Lender ID" onChange={handleChange} />
      <br />

      <input name="transaction" placeholder="Transaction ID" onChange={handleChange} />
      <br />

      <label>
        Item Returned:
        <input type="checkbox" name="item_returned" onChange={handleChange} />
      </label>
      <br />

      <label>
        Return Timeliness:
        <select name = "return_timeliness" onChange={handleChange}>
          <option value="on_time">On Time</option>
          <option value="late">Late</option>
        </select>
      </label>
      <br />

      <label>
        Item Condition:
        <select name = "item_condition" onChange={handleChange}>
          <option value="good">Good</option>
          <option value="damaged">Damaged</option>
        </select>
      </label>
      <br />

      <input name="rating_score" placeholder="Rating Score" onChange={handleChange} />
      <br /> <br />

      <button onClick={createFeedback}>✨Create Feedback</button>

      <hr />

      <h2> GET / UPDATE </h2>

      <input placeholder='Feedback ID' value={feedbackId} onChange={(e) => setFeedbackId(e.target.value)} />

      <button onClick={getFeedback}>1️⃣ Get One</button>
      <button onClick={updateFeedback}>♻️ Update</button>
      <button onClick={getAllFeedback}>➕ Get All</button>
      <button onClick={filterByBorrower}>🔍Filter by Borrower</button>
      <button onClick={filterByLender}>🔎 Filter by Lender</button>

      <hr />

      {trustFeedback && (
        <div>
          <h3>Single Feedback</h3>
          <pre>{JSON.stringify(trustFeedback, null, 2)}</pre>
        </div>
      )}

      {results.length > 0 && (
        <div><h3>Results</h3><pre>{JSON.stringify(results,null,2)}</pre></div>
      )}

    </div>
  );

  
}


//   useEffect(() => {
//     fetch('http://127.0.0.1:8000/api/example/').then(res => res.json()).then(data => setNumber(data.number))
//   }, [])

//   return (
//     <h1>Number: {number}</h1>
//   )
// }

export default App;
