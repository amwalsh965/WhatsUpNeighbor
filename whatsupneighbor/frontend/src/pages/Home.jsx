import { useState } from "react";

import calIcon from "../assets/calendar.png";
import heartIcon from "../assets/heart.png";
import chatIcon from "../assets/speech-bubble.png";
import userIcon from "../assets/avatar-icon.png";

export default function HomeScreen() {
  const [searchText, setSearchText] = useState("");

  // replace later
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

          {/* lets dropdown appears automatically when user is typing */}
          {searchText.trim() !== "" && (
            <div className="home-dropdown">
              {filteredListings.length > 0 ? (
                filteredListings.map((item) => (
                  <div key={item} className="home-dropdown-item">
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

      <nav className="bottom-nav">
        <button className="nav-item">
          <img className="nav-icon" src={calIcon} alt="" />
        </button>
        <button className="nav-item">
          <img className="nav-icon" src={heartIcon} alt="" />
        </button>
        <button className="nav-item">
          <img className="nav-icon" src={chatIcon} alt="" />
        </button>
        <button className="nav-item">
          <img className="nav-icon" src={userIcon} alt="" />
        </button>
      </nav>
    </div>
  );
}
