import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import calIcon from "../assets/calendar.png";
import heartIcon from "../assets/heart.png";
import chatIcon from "../assets/speech-bubble.png";
import userIcon from "../assets/avatar-icon.png";

import SearchBar from "../components/general/SearchBar";

export default function HomeScreen() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");

  const [searchResults, setSearchResults] = useState([]);
  const [searchActive, setSearchActive] = useState(false);

  const handleSearchResults = useCallback((results) => {
    if (results === null) {
      setSearchActive(false);
      setSearchResults([]);
    } else {
      setSearchActive(true);
      setSearchResults(results);
    }
  }, []);

  return (
    <div className="home-screen">
      <div className="home-content">
        <h1 className="home-title">What do you need?</h1>

        <div className="home-search-wrap">
          <div className="home-search-card">
            <SearchBar
              models = {["events", "items"]}
              outline={true}
              width="100%"
              placeholder="Search for items..."
              onResults={handleSearchResults}
            />

            {searchActive && (
              <div className="home-dropdown">
                {searchResults.length > 0 ? (
                  searchResults.map((item) => (
                    <div
                      key={item.id}
                      className="home-dropdown-item"
                      onClick={() => navigate(`/items/${item.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      {item.name} — {item.category}
                    </div>
                  ))
                ) : (
                  <div className="home-dropdown-empty">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== Bottom Navigation ===== */}
      <nav className="bottom-nav">
        <button className="nav-item" onClick={() => navigate("/events")}>
          <img className="nav-icon" src={calIcon} alt="Events" />
        </button>

        <button className="nav-item" onClick={() => navigate("/saved")}>
          <img className="nav-icon" src={heartIcon} alt="Saved" />
        </button>

        <button className="nav-item" onClick={() => navigate("/messages")}>
          <img className="nav-icon" src={chatIcon} alt="Messages" />
        </button>

        <button className="nav-item" onClick={() => navigate("/profile")}>
          <img className="nav-icon" src={userIcon} alt="Profile" />
        </button>
      </nav>
    </div>
  );
}
