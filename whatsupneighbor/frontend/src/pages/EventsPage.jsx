import { useState } from "react";

export default function EventsPage() {
  const [search, setSearch] = useState("");

  const events = [
    { id: 1, title: "Neighborhood Block Party", type: "Community", date: "Mar 12", location: "Maple St" },
    { id: 2, title: "Birthday Party", type: "Private", date: "Mar 18", location: "Oak Ave" },
    { id: 3, title: "Garage Sale", type: "Sale", date: "Mar 22", location: "Multi-home" },
    { id: 4, title: "Community Cleanup", type: "Volunteer", date: "Mar 25", location: "Central Park" },
  ];

  const items = [
    { id: 1, name: "Ladder", status: "Available", owner: "Danielle" },
    { id: 2, name: "Power Drill", status: "Available", owner: "Adam" },
    { id: 3, name: "Kayak", status: "Borrowed", owner: "Evan" },
    { id: 4, name: "Camera", status: "Available", owner: "Izabela" },
  ];

  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.type.toLowerCase().includes(search.toLowerCase()) ||
    e.location.toLowerCase().includes(search.toLowerCase())
  );

  const filteredItems = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="events-page">

      {/* ===== TOP BAR ===== */}
      <div className="topbar">

        <div className="logo-left">
          🏠 Rae
        </div>

        <div className="profile-right">
          👤
        </div>

      </div>

      {/* ===== HERO ===== */}
      <div className="events-hero">
        <h1>Neighborhood Hub</h1>
        <p>Events • Borrow • Lend • Connect</p>

        <input
          className="event-search"
          placeholder="Search events or items..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* ===== EVENTS ===== */}
      <h2 className="section-title">Upcoming Events</h2>

      <div className="event-grid">
        {filteredEvents.map(e => (
          <div key={e.id} className="event-card">
            <div className="event-type">{e.type}</div>
            <h3>{e.title}</h3>
            <p><b>Date:</b> {e.date}</p>
            <p><b>Location:</b> {e.location}</p>
            <button>View Details</button>
          </div>
        ))}
      </div>

      {/* ===== BORROW / LEND ===== */}
      <h2 className="section-title">Borrow & Lend</h2>

      <div className="lend-grid">
        {filteredItems.map(i => (
          <div key={i.id} className="lend-card">
            <h3>{i.name}</h3>
            <p>Owner: {i.owner}</p>
            <span className={`status ${i.status === "Available" ? "ok" : "busy"}`}>
              {i.status}
            </span>
            <button>Request Item</button>
          </div>
        ))}
      </div>

    </div>
  );
}
