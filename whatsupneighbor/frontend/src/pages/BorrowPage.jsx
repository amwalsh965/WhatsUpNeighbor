import { useState, useCallback, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import BottomNav from "../components/general/BottomNav";
import SearchBar from "../components/general/SearchBar";

export default function BorrowPage() {
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("role") === "admin";

  const [listings, setListings] = useState([]);
  const [visibleListings, setVisibleListings] = useState(12);
  const [favorites, setFavorites] = useState([]);
  const [borrowedItems, setBorrowedItems] = useState([]);
  const [confirmRemoveId, setConfirmRemoveId] = useState(null);

  // Modal state
  const [selectedlisting, setSelectedlisting] = useState(null);
  const [modalMode, setModalMode] = useState(null); // "new" or "existing"
  const [requestSent, setRequestSent] = useState(false);
  const [existingChatId, setExistingChatId] = useState(null);

  const closeModal = () => {
    setSelectedlisting(null);
    setModalMode(null);
    setRequestSent(false);
    setExistingChatId(null);
  };

  const handleRequestClick = async (listing) => {
  try {
    const res = await fetch(`http://127.0.0.1:8000/main/messages/check/?listing_id=${listing.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (data.exists) {
      setExistingChatId(data.chat_id);
      setModalMode("existing");
      setSelectedlisting(listing);
    } else {
      setModalMode("new");
      setSelectedlisting(listing);
    }
  } catch (err) {
    console.error("Check failed:", err);
    setModalMode("new");
    setSelectedlisting(listing);
  }
};

  const sendRequest = async () => {
    try {
      const message = document.querySelector("textarea").value.trim();
      if (!message) return;

      const res = await fetch("http://127.0.0.1:8000/main/messages/start/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listing_id: selectedlisting.id,
          message: message,
        }),
      });

      if (!res.ok) throw new Error("Failed to send");
      setRequestSent(true);
    } catch (err) {
      console.error("Request failed:", err);
    }
  };

  const handleAdminRemove = async (listingId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/main/user_listings/${listingId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setListings((prev) => prev.filter((l) => l.id !== listingId));
        setConfirmRemoveId(null);
      }
    } catch (err) {
      console.error("Remove failed:", err);
    }
  };

  const toggleFavorite = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/main/listings/${id}/favorite/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.saved) {
        setFavorites((prev) => [...prev, id]);
      } else {
        setFavorites((prev) => prev.filter((x) => x !== id));
      }
    } catch (err) {
      console.error("Favorite error:", err);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const listingsRes = await fetch("http://127.0.0.1:8000/main/listings/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (listingsRes.status === 401) {
          navigate("/auth");
          return;
        }
        const listingsData = (await listingsRes.json()).results || await listingsRes.json();
        setListings(listingsData);

        const borrowedRes = await fetch("http://127.0.0.1:8000/main/transactions/borrowed/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const borrowedData = await borrowedRes.json();
        setBorrowedItems(borrowedData);

        const savedRes = await fetch("http://127.0.0.1:8000/main/saved-listings/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const savedData = await savedRes.json();
        const savedIds = savedData.results.map((saved) => saved.listing_id);
        setFavorites(savedIds);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
    fetchData();
  }, [token, navigate]);

  const handleSearchResults = useCallback((results) => {
    setListings(results || []);
  }, []);

  return (
    <div className="events-page">
      <div className="topbar">
        <div className="logo-left" onClick={() => navigate("/")}>🏠 Rae</div>
        <div className="profile-right" onClick={() => navigate("/profile")}>👤</div>
      </div>

      <div className="events-hero">
        <h1>Borrow & Lend</h1>
        <div className="hero-links">
          <NavLink to="/events" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Events</NavLink>
          <NavLink to="/borrow" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Borrow</NavLink>
          <NavLink to="/lend" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Lend</NavLink>
          <NavLink to="/connect" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Connect</NavLink>
        </div>
        <SearchBar
          outline
          models={["listings"]}
          placeholder="Search Listings..."
          onResults={handleSearchResults}
        />
      </div>

      <h2 className="section-title">Current Borrowed</h2>
      <div className="lend-grid">
        {borrowedItems.length === 0 ? (
          <p>You are not currently borrowing any items.</p>
        ) : (
          borrowedItems.map((item) => (
            <div key={item.transaction_id} className="lend-card">
              <img
                src={item.photo ? `http://127.0.0.1:8000${item.photo}` : ""}
                alt={item.name}
                className="borrow-img"
              />
              <h3>{item.name}</h3>
              <p><b>Lender:</b> {item.lender}</p>
              <button onClick={() => navigate(`/chats/${item.chat_id}`)}>Open Chat</button>
            </div>
          ))
        )}
      </div>

      <h2 className="section-title">Available Listings</h2>
      <div className="lend-grid">
        {listings.slice(0, visibleListings).map((listing) => {
          const isFav = favorites.includes(listing.id);
          return (
            <div key={listing.id} className="lend-card">
              <button
                type="button"
                className={`favorite-btn ${isFav ? "active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(listing.id);
                }}
              >
                {isFav ? "❤️" : "🤍"}
              </button>

              <img
                src={listing.photo ? `http://127.0.0.1:8000${listing.photo}` : ""}
                alt={listing.name}
                className="borrow-img"
              />
              <div className="event-type">{listing.category}</div>
              <h3>{listing.name}</h3>
              <p><b>Owner:</b> {listing.owner}</p>
              <p>{listing.description}</p>
              <span className={`status ${listing.status === "Available" ? "ok" : "busy"}`}>{listing.status}</span>
              <button
                disabled={listing.status === "Borrowed"}
                onClick={() => handleRequestClick(listing)}
              >
                {listing.status === "Borrowed" ? "Unavailable" : "Request listing"}
              </button>

              {isAdmin && (
                <div style={{ marginTop: "10px" }}>
                  {confirmRemoveId === listing.id ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <p style={{ color: "#ff6b6b", fontWeight: "bold", margin: 0 }}>Are you sure?</p>
                      <button
                        onClick={() => handleAdminRemove(listing.id)}
                        style={{ background: "#ff6b6b", color: "white", border: "none", padding: "8px", borderRadius: "10px", cursor: "pointer" }}
                      >
                        Yes, Remove
                      </button>
                      <button
                        onClick={() => setConfirmRemoveId(null)}
                        style={{ background: "transparent", border: "1px solid #ccc", padding: "8px", borderRadius: "10px", cursor: "pointer" }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmRemoveId(listing.id)}
                      style={{ background: "#ff6b6b", color: "white", border: "none", padding: "8px 12px", borderRadius: "10px", cursor: "pointer", width: "100%" }}
                    >
                      Remove Listing
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {visibleListings < listings.length && (
        <div style={{ textAlign: "center", margin: "40px 0" }}>
          <button onClick={() => setVisibleListings((prev) => prev + 12)}>Load More Listings</button>
        </div>
      )}

      {selectedlisting && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>

            {modalMode === "existing" ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <div style={{ fontSize: "48px" }}>💬</div>
                <h2>Already in Contact</h2>
                <p>You already have an open chat for <b>{selectedlisting.name}</b>.</p>
                <div className="modal-actions">
                  <button onClick={() => navigate(`/chats/${existingChatId}`)}>Open Chat</button>
                  <button onClick={closeModal}>Close</button>
                </div>
              </div>

            ) : requestSent ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <div style={{ fontSize: "48px" }}>✅</div>
                <h2>Request Sent!</h2>
                <p>Your message was sent to the owner of <b>{selectedlisting.name}</b>.</p>
                <div className="modal-actions">
                  <button onClick={() => navigate("/messages")}>View Messages</button>
                  <button onClick={closeModal}>Close</button>
                </div>
              </div>

            ) : (
              <>
                <h2>Request {selectedlisting.name}</h2>
                <img src={`http://127.0.0.1:8000${selectedlisting.photo}`} alt={selectedlisting.name} className="borrow-img" />
                <p><b>Owner:</b> {selectedlisting.owner}</p>
                <p>{selectedlisting.description}</p>
                <textarea placeholder="Write a message to the owner..." rows="4" />
                <div className="modal-actions">
                  <button onClick={closeModal}>Cancel</button>
                  <button onClick={sendRequest}>Send Request</button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      <BottomNav navigate={navigate} />
    </div>
  );
}