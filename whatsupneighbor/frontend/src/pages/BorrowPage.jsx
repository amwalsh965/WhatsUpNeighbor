import { useState, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function BorrowPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [visibleItems, setVisibleItems] = useState(12);
  const [selectedItem, setSelectedItem] = useState(null);

  const categories = [
    "Tools", "Electronics", "Outdoor",
    "Sports", "Home", "Automotive"
  ];

  const itemNames = [
    "Ladder", "Power Drill", "Projector", "Tent", "Bike",
    "Generator", "Camera", "Grill", "Snow Blower",
    "Pressure Washer", "Kayak", "Speakers",
    "Camping Stove", "Fishing Rod", "Tool Kit"
  ];

  const owners = [
    "Danielle", "Adam", "Evan", "Izabela",
    "Sophia", "Michael", "James", "Olivia"
  ];

  const descriptions = [
    "Well maintained and ready to use.",
    "Available most weekends.",
    "Lightly used and in great condition.",
    "Perfect for short term projects.",
    "Message me before pickup."
  ];

  // ===== Generate 500 Items =====
  const items = useMemo(() =>
    Array.from({ length: 500 }, (_, i) => ({
      id: i + 1,
      name: `${itemNames[i % itemNames.length]} ${i + 1}`,
      owner: owners[i % owners.length],
      category: categories[i % categories.length],
      status: i % 4 === 0 ? "Borrowed" : "Available",
      description: descriptions[i % descriptions.length]
    })), []
  );

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

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

      {/* ===== HERO SECTION (MATCHES EVENTS PAGE) ===== */}
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
            to="/borrow"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Lend
          </NavLink>

          <span className="connect-text">Connect</span>
        </div>

        <input
          className="event-search"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ===== ITEMS GRID ===== */}
      <h2 className="section-title">Available Items</h2>

      <div className="lend-grid">
        {filteredItems.slice(0, visibleItems).map(item => (
          <div key={item.id} className="lend-card">
            <div className="event-type">{item.category}</div>
            <h3>{item.name}</h3>
            <p><b>Owner:</b> {item.owner}</p>
            <p>{item.description}</p>

            <span className={`status ${item.status === "Available" ? "ok" : "busy"}`}>
              {item.status}
            </span>

            <button
              disabled={item.status === "Borrowed"}
              onClick={() => setSelectedItem(item)}
            >
              {item.status === "Borrowed" ? "Unavailable" : "Request Item"}
            </button>
          </div>
        ))}
      </div>

      {visibleItems < filteredItems.length && (
        <div style={{ textAlign: "center", margin: "40px 0" }}>
          <button onClick={() => setVisibleItems(prev => prev + 12)}>
            Load More Items
          </button>
        </div>
      )}

      {/* ===== REQUEST MODAL ===== */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Request {selectedItem.name}</h2>
            <p><b>Owner:</b> {selectedItem.owner}</p>
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
