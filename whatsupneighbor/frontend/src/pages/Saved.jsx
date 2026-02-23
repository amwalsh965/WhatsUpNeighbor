import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import calIcon from "../assets/calendar.png";
import heartIcon from "../assets/heart.png";
import chatIcon from "../assets/speech-bubble.png";
import userIcon from "../assets/avatar-icon.png";
import heartOutline from "../assets/heart.png";

const STORAGE_KEY = "savedItems";

function loadSavedItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function SavedScreen() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [savedItems, setSavedItems] = useState([]);

  // Load saved items when page opens
  useEffect(() => {
    setSavedItems(loadSavedItems());
  }, []);

  // Keep localStorage synced if items removed here
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedItems));
  }, [savedItems]);

  const filteredItems = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return savedItems;

    return savedItems.filter((item) => {
      const haystack = `${item.title ?? ""} ${item.category ?? ""} ${item.owner ?? ""} ${item.description ?? ""}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [savedItems, searchText]);

  const removeFromSaved = (id) => {
    setSavedItems((prev) => prev.filter((x) => x.id !== id));
  };

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

        {savedItems.length === 0 ? (
          <div className="saved-empty">
            <div className="saved-empty-title">No saved items yet</div>
            <div className="saved-empty-subtitle">
              Tap the heart on an item to save it.
            </div>
            <button
              className="saved-empty-btn"
              onClick={() => navigate("/borrow")}
              type="button"
            >
              Browse Items
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="saved-empty">
            <div className="saved-empty-title">No matches found</div>
            <div className="saved-empty-subtitle">
              Try searching something else.
            </div>
          </div>
        ) : (
          <div className="saved-grid">
            {filteredItems.map((item) => (
              <div key={item.id} className="listing-card">
                <button
                  className="listing-heart-btn"
                  onClick={() => removeFromSaved(item.id)}
                  aria-label="Remove from saved"
                  type="button"
                >
                  <img
                    className="listing-heart-icon"
                    src={heartOutline}
                    alt=""
                  />
                </button>

                <div className="listing-image-wrap">
                  <img
                    className="listing-image"
                    src={item.imageUrl || item.image || ""}
                    alt={item.title || "Saved item"}
                  />
                </div>

                <div className="listing-category">{item.category}</div>
                <div className="listing-title">
                  {item.title || item.name}
                </div>

                <div className="listing-owner">
                  <span className="listing-owner-label">Owner:</span>{" "}
                  {item.owner}
                </div>

                <div className="listing-description">
                  {item.description}
                </div>

                <div className="listing-actions">
                  <span
                    className={[
                      "listing-status",
                      item.status === "available" &&
                        "listing-status--available",
                      item.status === "borrowed" &&
                        "listing-status--borrowed",
                      item.status === "unavailable" &&
                        "listing-status--unavailable",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {item.status === "available"
                      ? "Available"
                      : item.status === "borrowed"
                      ? "Borrowed"
                      : "Unavailable"}
                  </span>

                  <button
                    className={[
                      "listing-request-btn",
                      item.status !== "available" &&
                        "listing-request-btn--disabled",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    type="button"
                    disabled={item.status !== "available"}
                  >
                    Request Item
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button
          className="nav-item"
          onClick={() => navigate("/events")}
          type="button"
        >
          <img className="nav-icon" src={calIcon} alt="Events" />
        </button>

        <button
          className="nav-item"
          onClick={() => navigate("/saved")}
          type="button"
        >
          <img className="nav-icon" src={heartIcon} alt="Saved" />
        </button>

        <button
          className="nav-item"
          onClick={() => navigate("/messages")}
          type="button"
        >
          <img className="nav-icon" src={chatIcon} alt="Messages" />
        </button>

        <button
          className="nav-item"
          onClick={() => navigate("/profile")}
          type="button"
        >
          <img className="nav-icon" src={userIcon} alt="Profile" />
        </button>
      </nav>
    </div>
  );
}