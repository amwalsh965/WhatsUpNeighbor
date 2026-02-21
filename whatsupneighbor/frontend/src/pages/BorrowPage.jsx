import { useState, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";

/* ===== IMPORT LOCAL IMAGES ===== */
import ladderImg from "../assets/ladder.png";
import powerDrillImg from "../assets/powerdrill.png";
import projectorImg from "../assets/projector.png";
import tentImg from "../assets/tent.png";
import bikeImg from "../assets/bike.png";
import generatorImg from "../assets/generator.png";
import cameraImg from "../assets/camera.png";
import grillImg from "../assets/grill.png";
import snowImg from "../assets/snowb.png";
import pressureImg from "../assets/pressurew.png";
import kayakImg from "../assets/kayak.png";
import speakerImg from "../assets/speaker.png";
import campingImg from "../assets/campings.png";
import fishingImg from "../assets/fishingr.png";
import toolkitImg from "../assets/toolkit.png"; // if this errors, change to "../assets/toolkit.png"

export default function BorrowPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [visibleItems, setVisibleItems] = useState(12);
  const [selectedItem, setSelectedItem] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const categories = ["Tools", "Electronics", "Outdoor", "Sports", "Home", "Automotive"];

  const itemNames = [
    "Ladder", "Power Drill", "Projector", "Tent", "Bike",
    "Generator", "Camera", "Grill", "Snow Blower",
    "Pressure Washer", "Kayak", "Speakers",
    "Camping Stove", "Fishing Rod", "Tool Kit",
  ];

  const owners = ["Danielle", "Adam", "Evan", "Izabela", "Sophia", "Michael", "James", "Olivia"];

  const descriptions = [
    "Well maintained and ready to use.",
    "Available most weekends.",
    "Lightly used and in great condition.",
    "Perfect for short term projects.",
    "Message me before pickup.",
  ];

  /* ===== IMAGE MAP ===== */
  const imageMap = {
    "Ladder": ladderImg,
    "Power Drill": powerDrillImg,
    "Projector": projectorImg,
    "Tent": tentImg,
    "Bike": bikeImg,
    "Generator": generatorImg,
    "Camera": cameraImg,
    "Grill": grillImg,
    "Snow Blower": snowImg,
    "Pressure Washer": pressureImg,
    "Kayak": kayakImg,
    "Speakers": speakerImg,
    "Camping Stove": campingImg,
    "Fishing Rod": fishingImg,
    "Tool Kit": toolkitImg,
  };

  /* ===== FAVORITE TOGGLE ===== */
  const toggleFavorite = (id) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  /* ===== GENERATE 500 ITEMS ===== */
  const items = useMemo(
    () =>
      Array.from({ length: 500 }, (_, i) => {
        const baseName = itemNames[i % itemNames.length];
        return {
          id: i + 1,
          baseName,
          name: `${baseName} ${i + 1}`,
          owner: owners[i % owners.length],
          category: categories[i % categories.length],
          status: i % 4 === 0 ? "Borrowed" : "Available",
          description: descriptions[i % descriptions.length],
          image: imageMap[baseName],
        };
      }),
    []
  );

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="events-page">
      {/* TOP BAR */}
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
          <NavLink to="/events" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Events
          </NavLink>

          <NavLink to="/borrow" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Borrow
          </NavLink>

          <NavLink to="/lend" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
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

        <input
          className="event-search"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* GRID */}
      <h2 className="section-title">Available Items</h2>

      <div className="lend-grid">
        {filteredItems.slice(0, visibleItems).map((item) => {
          const isFav = favorites.includes(item.id);

          return (
            <div key={item.id} className="lend-card">
              {/* Heart ONLY inside the card */}
              <button
                type="button"
                className={`favorite-btn ${isFav ? "active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(item.id);
                }}
                aria-label="Favorite"
                title="Favorite"
              >
                {isFav ? "❤️" : "🤍"}
              </button>

              <img src={item.image} alt={item.name} className="borrow-img" />

              <div className="event-type">{item.category}</div>
              <h3>{item.name}</h3>
              <p>
                <b>Owner:</b> {item.owner}
              </p>
              <p>{item.description}</p>

              <span className={`status ${item.status === "Available" ? "ok" : "busy"}`}>{item.status}</span>

              <button disabled={item.status === "Borrowed"} onClick={() => setSelectedItem(item)}>
                {item.status === "Borrowed" ? "Unavailable" : "Request Item"}
              </button>
            </div>
          );
        })}
      </div>

      {visibleItems < filteredItems.length && (
        <div style={{ textAlign: "center", margin: "40px 0" }}>
          <button onClick={() => setVisibleItems((prev) => prev + 12)}>Load More Items</button>
        </div>
      )}

      {/* MODAL (NO HEARTS HERE) */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Request {selectedItem.name}</h2>

            <img src={selectedItem.image} alt={selectedItem.name} className="borrow-img" />

            <p>
              <b>Owner:</b> {selectedItem.owner}
            </p>
            <p>{selectedItem.description}</p>

            <textarea placeholder="Write a message to the owner..." rows="4" />

            <div className="modal-actions">
              <button onClick={() => setSelectedItem(null)}>Cancel</button>
              <button onClick={() => alert("Request Sent!")}>Send Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}