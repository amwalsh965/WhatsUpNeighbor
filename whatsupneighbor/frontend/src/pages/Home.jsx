import { useState } from "react";
import { useNavigate } from "react-router-dom";

import calIcon from "../assets/calendar.png";
import heartIcon from "../assets/heart.png";
import chatIcon from "../assets/speech-bubble.png";
import userIcon from "../assets/avatar-icon.png";

export default function HomeScreen() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");

  // Replace later with real data
  const listings = ["Kayak", "Camera", "Lawn Mower", "Drill"];

  const filteredListings = listings.filter((item) =>
    item.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="home-screen">
      <div className="home-content">
        <h1 className="home-title">What do you need?</h1>

        <div className="home-search-wrap">
          <div className="home-search-card">
            <input
              className="home-search-input"
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            {/* Dropdown appears automatically when typing */}
            {searchText.trim() !== "" && (
              <div className="home-dropdown">
                {filteredListings.length > 0 ? (
                  filteredListings.map((item) => (
                    <div
                      key={item}
                      className="home-dropdown-item"
                      onClick={() => navigate("/borrow")}
                      style={{ cursor: "pointer" }}
                    >
                      {item}
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

        {/* Events */}
        <button
          className="nav-item"
          onClick={() => navigate("/events")}
        >
          <img className="nav-icon" src={calIcon} alt="Events" />
        </button>

        {/* Saved */}
        <button
          className="nav-item"
          onClick={() => navigate("/saved")}
        >
          <img className="nav-icon" src={heartIcon} alt="Saved" />
        </button>

        {/* Messages */}
        <button
          className="nav-item"
          onClick={() => navigate("/messages")}
        >
          <img className="nav-icon" src={chatIcon} alt="Messages" />
        </button>

        {/* Profile */}
        <button
          className="nav-item"
          onClick={() => navigate("/profile")}
        >
          <img className="nav-icon" src={userIcon} alt="Profile" />
        </button>

      </nav>
    </div>
  );
}
