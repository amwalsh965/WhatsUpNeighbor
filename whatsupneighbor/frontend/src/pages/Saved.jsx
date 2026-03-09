import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import calIcon from "../assets/calendar.png";
import heartNavIcon from "../assets/heart.png";
import chatIcon from "../assets/speech-bubble.png";
import userIcon from "../assets/avatar-icon.png";
// import heartFilled from "../assets/heart-filled.png"; need to agree on one later 

export default function Saved({ savedListings = [], toggleSavedListing = () => {} }) {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");

  const filteredListings = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return savedListings;

    return savedListings.filter((item) => {
      const text = `${item.name ?? ""} ${item.owner ?? ""} ${item.category ?? ""} ${item.description ?? ""}`.toLowerCase();
      return text.includes(q);
    });
  }, [savedListings, searchText]);

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

        {savedListings.length === 0 ? (
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
        ) : filteredListings.length === 0 ? (
          <div className="saved-empty">
            <div className="saved-empty-title">No matches found</div>
            <div className="saved-empty-subtitle">
              Try a different search.
            </div>
          </div>
        ) : (
          <div className="saved-grid">
            {filteredListings.map((item) => (
              <div key={item.id} className="listing-card">
                <button
                  className="listing-heart-btn"
                  type="button"
                  onClick={() => toggleSavedListing(item)}
                  aria-label="Remove from saved"
                >
                  <img className="listing-heart-icon" src={heartFilled} alt="" />
                </button>

                <div className="listing-image-wrap">
                  <img
                    className="listing-image"
                    src={item.image}
                    alt={item.name}
                  />
                </div>

                <div className="listing-category">{item.category}</div>
                <div className="listing-title">{item.name}</div>

                <div className="listing-owner">
                  <span className="listing-owner-label">Owner:</span> {item.owner}
                </div>

                <div className="listing-description">{item.description}</div>

                <div className="listing-actions">
                  <span
                    className={[
                      "listing-status",
                      item.status === "Available" && "listing-status--available",
                      item.status === "Borrowed" && "listing-status--borrowed",
                      item.status === "Unavailable" && "listing-status--unavailable",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {item.status}
                  </span>

                  <button
                    className={[
                      "listing-request-btn",
                      item.status !== "Available" && "listing-request-btn--disabled",
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
        <button className="nav-item" type="button" onClick={() => navigate("/events")}>
          <img className="nav-icon" src={calIcon} alt="Events" />
        </button>

        <button className="nav-item" type="button" onClick={() => navigate("/saved")}>
          <img className="nav-icon" src={heartNavIcon} alt="Saved" />
        </button>

        <button className="nav-item" type="button" onClick={() => navigate("/messages")}>
          <img className="nav-icon" src={chatIcon} alt="Messages" />
        </button>

        <button className="nav-item" type="button" onClick={() => navigate("/profile")}>
          <img className="nav-icon" src={userIcon} alt="Profile" />
        </button>
      </nav>
    </div>
  );
}
