import { useState, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function EventsPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [visibleEvents, setVisibleEvents] = useState(6);
  const [visibleItems, setVisibleItems] = useState(6);

  // ===== EVENT DATA =====
  const eventTypes = [
    "Community", "Private", "Sale", "Volunteer", "Sports",
    "Workshop", "Festival", "Fundraiser", "Networking",
    "Food Drive", "Art Show", "Farmers Market",
    "Yoga Session", "Book Club", "Music Night",
    "Tech Meetup", "Outdoor Movie", "Charity Run", "Block party :)", "Birthday Party"
  ];

  const locations = [
    "Maple St", "Oak Ave", "Central Park", "Riverfront",
    "City Hall", "Community Center", "Lakeside Pavilion",
    "Sunset Park", "Downtown Plaza", "Library Hall",
    "Highland Field", "Greenwood Garden", "Pine Street",
    "Hilltop Terrace", "Westside Court", "North End Park",
    "Harbor Walk", "Riverside Drive", "Eastwood Center"
  ];

  const eventDescriptions = [
    "Meet your neighbors and build stronger connections.",
    "A fun and engaging local experience for all ages.",
    "Bring friends and family for a memorable evening.",
    "Support a great cause and make a difference.",
    "Enjoy food, music, and entertainment.",
    "Expand your network and learn something new."
  ];

  // ===== ITEM DATA =====
  const itemNames = [
    "Ladder", "Drill", "Kayak", "Camera", "Tent",
    "Bike", "Projector", "Table", "Speakers", "Grill",
    "Snow Blower", "Pressure Washer", "Camping Stove",
    "Generator", "Power Saw", "Lawn Mower",
    "Fishing Rod", "Basketball Hoop", "Air Pump",
    "Extension Cord", "Tool Kit", "Car Jack",
    "Folding Chairs", "Cooler", "Hedge Trimmer"
  ];

  const owners = [
    "Danielle", "Adam", "Evan", "Izabela", "Sayman",
    "Sophia", "Michael", "James", "Olivia", "Noah",
    "Emma", "Lucas", "Ava", "Mason", "Liam",
    "Isabella", "Ethan", "Mia", "Harper", "Elijah"
  ];

  // ===== GENERATE EVENTS =====
  const events = useMemo(() =>
    Array.from({ length: 500 }, (_, i) => ({
      id: i + 1,
      title: `${eventTypes[i % eventTypes.length]} Event ${i + 1}`,
      type: eventTypes[i % eventTypes.length],
      date: `Mar ${1 + (i % 28)}`,
      location: locations[i % locations.length],
      description: eventDescriptions[i % eventDescriptions.length]
    })), []
  );

  // ===== GENERATE ITEMS =====
  const items = useMemo(() =>
    Array.from({ length: 500 }, (_, i) => ({
      id: i + 1,
      name: `${itemNames[i % itemNames.length]} ${i + 1}`,
      status: i % 4 === 0 ? "Borrowed" : "Available",
      owner: owners[i % owners.length]
    })), []
  );

  // ===== FILTER =====
  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.type.toLowerCase().includes(search.toLowerCase()) ||
    e.location.toLowerCase().includes(search.toLowerCase())
  );

  const filteredItems = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.owner.toLowerCase().includes(search.toLowerCase())
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

      {/* ===== HERO ===== */}
      <div className="events-hero">
        <h1>Neighborhood Hub</h1>

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
          placeholder="Search events or items..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* ===== EVENTS SECTION ===== */}
      <h2 className="section-title">Recent Events</h2>

      <div className="event-grid">
        {filteredEvents.slice(0, visibleEvents).map(e => (
          <div key={e.id} className="event-card">
            <div className="event-type">{e.type}</div>
            <h3>{e.title}</h3>
            <p><b>Date:</b> {e.date}</p>
            <p><b>Location:</b> {e.location}</p>
            <p>{e.description}</p>

            <button
              className="primary-btn"
              onClick={() => navigate(`/events/${e.id}`)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {visibleEvents < filteredEvents.length && (
        <div style={{ textAlign: "center", margin: "30px 0" }}>
          <button
            className="primary-btn"
            onClick={() => setVisibleEvents(prev => prev + 6)}
          >
            Load More Events
          </button>
        </div>
      )}

      {/* ===== BORROW SECTION ===== */}
      <h2 className="section-title">Recent Borrow & Lend</h2>

      <div className="lend-grid">
        {filteredItems.slice(0, visibleItems).map(i => (
          <div key={i.id} className="lend-card">
            <h3>{i.name}</h3>
            <p>Owner: {i.owner}</p>

            <span className={`status ${i.status === "Available" ? "ok" : "busy"}`}>
              {i.status}
            </span>

            <button
              className="primary-btn"
              disabled={i.status === "Borrowed"}
              onClick={() => navigate("/borrow")}
            >
              {i.status === "Borrowed" ? "Unavailable" : "Request Item"}
            </button>
          </div>
        ))}
      </div>

      {visibleItems < filteredItems.length && (
        <div style={{ textAlign: "center", margin: "30px 0" }}>
          <button
            className="primary-btn"
            onClick={() => setVisibleItems(prev => prev + 6)}
          >
            Load More Items
          </button>
        </div>
      )}

    </div>
  );
}
