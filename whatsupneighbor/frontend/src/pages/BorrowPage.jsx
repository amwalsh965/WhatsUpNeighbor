import { useState, useCallback, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import SearchBar from "../components/general/SearchBar";

export default function BorrowPage() {

  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [visibleItems, setVisibleItems] = useState(12);
  const [selectedItem, setSelectedItem] = useState(null);
  const [favorites, setFavorites] = useState([]);

  /* ===== FAVORITES ===== */

  const toggleFavorite = (id) => {

    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );

  };

  useEffect(() => {

    async function fetchItems() {

      try {

        const res = await fetch(
          "http://127.0.0.1:8000/main/items/"
        );

        const data = await res.json();

        setItems(data.results || data);

      } catch (err) {
        console.error("Error loading items:", err);
      }

    }

    fetchItems();

  }, []);

  /* ===== SEARCH RESULTS FROM BACKEND ===== */

  const handleSearchResults = useCallback((results) => {

    if (!results) {
      setItems([]);
      return;
    }

    setItems(results);

  }, []);

  return (
    <div className="events-page">

      {/* ===== TOP BAR ===== */}

      <div className="topbar">

        <div className="logo-left" onClick={() => navigate("/")}>
          🏠 Rae
        </div>

        <div className="profile-right" onClick={() => navigate("/profile")}>
          👤
        </div>

      </div>


      {/* ===== HERO ===== */}

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


        {/* SEARCH BAR */}

        <SearchBar
          outline={true}
          models={["items"]}
          placeholder="Search items..."
          onResults={handleSearchResults}
        />

      </div>


      {/* ===== GRID ===== */}

      <h2 className="section-title">Available Items</h2>

      <div className="lend-grid">

        {items.slice(0, visibleItems).map((item) => {

          const isFav = favorites.includes(item.id);

          return (

            <div key={item.id} className="lend-card">

              <button
                type="button"
                className={`favorite-btn ${isFav ? "active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(item.id);
                }}
              >
                {isFav ? "❤️" : "🤍"}
              </button>

              <img
                src={item.image}
                alt={item.name}
                className="borrow-img"
              />

              <div className="event-type">{item.category}</div>

              <h3>{item.name}</h3>

              <p>
                <b>Owner:</b> {item.owner}
              </p>

              <p>{item.description}</p>

              <span
                className={`status ${
                  item.status === "Available" ? "ok" : "busy"
                }`}
              >
                {item.status}
              </span>

              <button
                disabled={item.status === "Borrowed"}
                onClick={() => setSelectedItem(item)}
              >
                {item.status === "Borrowed"
                  ? "Unavailable"
                  : "Request Item"}
              </button>

            </div>

          );

        })}

      </div>


      {/* LOAD MORE */}

      {visibleItems < items.length && (

        <div style={{ textAlign: "center", margin: "40px 0" }}>

          <button
            onClick={() =>
              setVisibleItems((prev) => prev + 12)
            }
          >
            Load More Items
          </button>

        </div>

      )}


      {/* ===== MODAL ===== */}

      {selectedItem && (

        <div
          className="modal-overlay"
          onClick={() => setSelectedItem(null)}
        >

          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >

            <h2>Request {selectedItem.name}</h2>

            <img
              src={selectedItem.image}
              alt={selectedItem.name}
              className="borrow-img"
            />

            <p>
              <b>Owner:</b> {selectedItem.owner}
            </p>

            <p>{selectedItem.description}</p>

            <textarea
              placeholder="Write a message to the owner..."
              rows="4"
            />

            <div className="modal-actions">

              <button onClick={() => setSelectedItem(null)}>
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
