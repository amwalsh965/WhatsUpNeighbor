import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import BottomNav from "../components/general/BottomNav";

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

      <BottomNav navigate={navigate} />
    </div>
  );
}
