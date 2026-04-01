import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/general/BottomNav";
import SearchBar from "../components/general/SearchBar";

export default function HomeScreen() {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchActive, setSearchActive] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("pendingDismissed");
    if (dismissed) return;

    fetch("http://127.0.0.1:8000/main/transactions/pending/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.count > 0) {
          setPendingCount(data.count);
          setShowBanner(true);
        }
      })
      .catch((err) => console.error("Failed to fetch pending requests:", err));
  }, []);

  const dismissBanner = () => {
    sessionStorage.setItem("pendingDismissed", "true");
    setShowBanner(false);
  };

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

      {showBanner && (
        <div style={{
          background: "#4caf50",
          color: "white",
          padding: "12px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "10px",
          margin: "10px",
        }}>
          <span>📬 You have {pendingCount} new borrow request{pendingCount > 1 ? "s" : ""}!</span>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => { navigate("/messages"); dismissBanner(); }}
              style={{ background: "white", color: "#4caf50", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}
            >
              View
            </button>
            <button
              onClick={dismissBanner}
              style={{ background: "transparent", color: "white", border: "1px solid white", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="home-content">
        <h1 className="home-title">What do you need?</h1>

        <div className="home-search-wrap">
          <div className="home-search-card">
            <SearchBar
              models={["events", "items"]}
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