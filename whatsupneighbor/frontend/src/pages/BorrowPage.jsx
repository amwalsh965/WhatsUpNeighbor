import { useState, useCallback, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import SearchBar from "../components/general/SearchBar";

export default function BorrowPage() {
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [visibleListings, setVisibleListings] = useState(12);
  const [selectedlisting, setSelectedlisting] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = async (id) => {
    try {

      const res = await fetch(
        `http://127.0.0.1:8000/main/listings/${id}/favorite/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

    async function fetchListings() {

      try {

        const res = await fetch(
          "http://127.0.0.1:8000/main/listings/", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            }
        );

        if (res.status === 401) {
          navigate("/auth");
          return;
        }

        const data = await res.json();

        setListings(data.results || data);

      } catch (err) {
        console.error("Error loading Listings:", err);
      }

    }

    fetchListings();

  }, []);

  const handleSearchResults = useCallback((results) => {

    if (!results) {
      setListings([]);
      return;
    }

    setListings(results);

  }, []);

  return (
    <div className="events-page">

      <div className="topbar">

        <div className="logo-left" onClick={() => navigate("/")}>
          🏠 Rae
        </div>

        <div className="profile-right" onClick={() => navigate("/profile")}>
          👤
        </div>

      </div>

      {/* HERO */}
      <div className="events-hero">

        <h1>Borrow & Lend</h1>

        <div className="hero-links">

          <NavLink
            to="/events"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Events
          </NavLink>

          <NavLink
            to="/borrow"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Borrow
          </NavLink>

          <NavLink
            to="/lend"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Lend
          </NavLink>

          <NavLink
            to="/connect"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Connect
          </NavLink>

        </div>


        <SearchBar
          outline={true}
          models={["listings"]}
          placeholder="Search Listings..."
          onResults={handleSearchResults}
        />

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

              <p>
                <b>Owner:</b> {listing.owner}
              </p>

              <p>{listing.description}</p>

              <span
                className={`status ${
                  listing.status === "Available" ? "ok" : "busy"
                }`}
              >
                {listing.status}
              </span>

              <button
                disabled={listing.status === "Borrowed"}
                onClick={() => setSelectedlisting(listing)}
              >
                {listing.status === "Borrowed"
                  ? "Unavailable"
                  : "Request listing"}
              </button>
            </div>
          );
        })}
      </div>

      {visibleListings < listings.length && (

        <div style={{ textAlign: "center", margin: "40px 0" }}>

          <button
            onClick={() =>
              setVisibleListings((prev) => prev + 12)
            }
          >
            Load More Listings
          </button>

        </div>
      )}

      {/* MODAL (NO HEARTS HERE) */}
      {selectedlisting && (

        <div
          className="modal-overlay"
          onClick={() => setSelectedlisting(null)}
        >

          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >

            <h2>Request {selectedlisting.name}</h2>

            <img
              src={selectedlisting.photo}
              alt={selectedlisting.name}
              className="borrow-img"
            />

            <p>
              <b>Owner:</b> {selectedlisting.owner}
            </p>
            <p>{selectedlisting.description}</p>

            <textarea
              placeholder="Write a message to the owner..."
              rows="4"
            />

            <div className="modal-actions">

              <button onClick={() => setSelectedlisting(null)}>
                Cancel
              </button>

              <button onClick={() => alert("Request Sent!")}>
                Send Request
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
