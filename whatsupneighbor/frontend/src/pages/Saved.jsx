import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import calIcon from "../assets/calendar.png";
import heartNavIcon from "../assets/heart.png";
import chatIcon from "../assets/speech-bubble.png";
import userIcon from "../assets/avatar-icon.png";

export default function Saved() {
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    async function fetchSaved() {
      try {
        const res = await fetch("http://127.0.0.1:8000/main/saved-listings/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.status === 401) {
          navigate("/auth");
          return;
        }

        const data = await res.json();

        // Normalize backend fields to what frontend expects
        const normalized = (data.results || data).map((saved) => ({
          id: saved.id,
          name: saved.title,
          description: saved.bio,
          photo: saved.photo,
          category: saved.category || "Unknown", // backend may not have category
          owner: saved.owner || "Unknown", // backend may not have owner
          status: saved.status || "Available", // default if missing
        }));

        setItems(normalized);
      } catch (err) {
        console.error("Error fetching saved items:", err);
      }
    }

    fetchSaved();
  }, [token]);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="saved-screen">
      <div className="saved-content">
        <div className="saved-header">
          <h1 className="saved-title">Saved Items</h1>

          <input
            className="saved-search-input"
            placeholder="Search saved..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {items.length === 0 ? (
          <div className="saved-empty">
            <div className="saved-empty-title">No saved items yet</div>
            <div className="saved-empty-subtitle">
              Tap the heart on a listing to save it.
            </div>
            <button
              className="saved-empty-btn"
              type="button"
              onClick={() => navigate("/borrow")}
            >
              Browse Items
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="saved-empty">
            <div className="saved-empty-title">No matches found</div>
            <div className="saved-empty-subtitle">
              Try a different search.
            </div>
          </div>
        ) : (
          <div className="saved-grid">
            {filteredItems.map((item) => (
              <div key={item.id} className="listing-card">
                <div className="listing-image-wrap">
                  <img
                    className="listing-image"
                    src={item.photo ? `http://127.0.0.1:8000${item.photo}` : ""}
                    alt={item.name}
                  />
                </div>

                <div className="listing-category">{item.category}</div>
                <div className="listing-title">{item.name}</div>

                <div className="listing-owner">
                  <span className="listing-owner-label">Owner:</span>{" "}
                  {item.owner}
                </div>

                <div className="listing-description">{item.description}</div>

                <div className="listing-actions">
                  <span
                    className={[
                      "listing-status",
                      item.status === "Available" &&
                        "listing-status--available",
                      item.status === "Borrowed" &&
                        "listing-status--borrowed",
                      item.status === "Unavailable" &&
                        "listing-status--unavailable",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {item.status}
                  </span>

                  <button
                    className={[
                      "listing-request-btn",
                      item.status !== "Available" &&
                        "listing-request-btn--disabled",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    type="button"
                    disabled={item.status !== "Available"}
                  >
                    Request Item
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <nav className="bottom-nav">
        <button
          className="nav-item"
          type="button"
          onClick={() => navigate("/events")}
        >
          <img className="nav-icon" src={calIcon} alt="Events" />
        </button>

        <button
          className="nav-item"
          type="button"
          onClick={() => navigate("/saved")}
        >
          <img className="nav-icon" src={heartNavIcon} alt="Saved" />
        </button>

        <button
          className="nav-item"
          type="button"
          onClick={() => navigate("/messages")}
        >
          <img className="nav-icon" src={chatIcon} alt="Messages" />
        </button>

        <button
          className="nav-item"
          type="button"
          onClick={() => navigate("/profile")}
        >
          <img className="nav-icon" src={userIcon} alt="Profile" />
        </button>
      </nav>
    </div>
  );
}