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

          <span className="connect-text">Connect</span>
        </div>
      </div>

      {/* ===== POST ITEM FORM ===== */}
      <h2 className="section-title">Post a New Item</h2>

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

        <button type="submit">Post Item</button>
      </form>

      {/* ===== MY LISTED ITEMS ===== */}
      <h2 className="section-title">My Listed Items</h2>

      {myItems.length === 0 && (
        <p style={{ marginTop: "10px" }}>
          You haven't posted anything yet.
        </p>
      )}

      <div className="lend-grid">
        {myItems.map(item => (
          <div key={item.id} className="lend-card">
            <div className="event-type">{item.category}</div>
            <h3>{item.name}</h3>
            <p>{item.description}</p>

            <span className="status ok">
              {item.status}
            </span>

            <div style={{ marginTop: "12px" }}>
              <button
                style={{ marginRight: "10px" }}
                onClick={() => alert("Edit feature coming soon")}
              >
                Edit
              </button>

              <button
                onClick={() => removeItem(item.id)}
                style={{ background: "#ff6b6b" }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
