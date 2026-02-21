import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function LendPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: ""
  });

  const [myItems, setMyItems] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category) return;

    const newItem = {
      id: Date.now(),
      ...formData,
      status: "Available"
    };

    setMyItems([newItem, ...myItems]);

    setFormData({
      name: "",
      category: "",
      description: ""
    });
  };

  const removeItem = (id) => {
    setMyItems(myItems.filter(item => item.id !== id));
  };

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
        <h1>Lend an Item</h1>

        <div className="hero-links">
          <NavLink to="/events" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Events
          </NavLink>

          <NavLink to="/borrow" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Borrow
          </NavLink>

          <NavLink to="/lend" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
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
      </div>

      {/* ===== MAIN CONTENT WRAPPER ===== */}
      <div className="lend-container">

        {/* ===== POST ITEM CARD ===== */}
        <div className="lend-section">
          <h2>Post a New Item</h2>

          <form className="lend-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Item Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Category (Tools, Electronics...)"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />

            <textarea
              placeholder="Description"
              rows="3"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <button type="submit" className="primary-btn">
              Post Item
            </button>
          </form>
        </div>

        {/* ===== MY LISTED ITEMS CARD ===== */}
        <div className="lend-section">
          <h2>My Listed Items</h2>

          {myItems.length === 0 ? (
            <div className="empty-state">
              <h3>No items posted yet</h3>
              <p>Your listed items will appear here once you post one.</p>
            </div>
          ) : (
            <div className="lend-grid">
              {myItems.map(item => (
                <div key={item.id} className="lend-card">
                  <div className="event-type">{item.category}</div>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>

                  <span className="status ok">
                    {item.status}
                  </span>

                  <div style={{ marginTop: "16px" }}>
                    <button
                      className="primary-btn"
                      style={{ marginRight: "10px" }}
                      onClick={() => alert("Edit feature coming soon")}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        background: "#ff6b6b",
                        color: "white",
                        border: "none",
                        padding: "10px 16px",
                        borderRadius: "12px",
                        cursor: "pointer"
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}