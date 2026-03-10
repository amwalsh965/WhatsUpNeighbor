import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";


import BottomNav from "../components/general/BottomNav";

export default function LendPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: ""
  });
  const [myItems, setMyItems] = useState([]);

  useEffect(() => {
    console.log("running");
    fetch("http://127.0.0.1:8000/main/user_listings/", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            })
      .then(res => {
        console.log("running 2");
        if (res.status === 401) {
            navigate("/auth");
            return;
          }
          return res.json();
        })
      .then(data => {
        console.log(data);
        setMyItems(data);
      });
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name || !formData.category) return;
  

  const formDataObj = new FormData();
  formDataObj.append("name", formData.name);
  formDataObj.append("category", formData.category);
  formDataObj.append("description", formData.description || "");
  formDataObj.append("status", "Available");

  if (formData.photo) {
    formDataObj.append("photo", formData.photo);
  }

      
  try {
    const res = await fetch("http://127.0.0.1:8000/main/user_listings/", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formDataObj,
    });

    const newItem = await res.json();

    setMyItems([newItem, ...myItems]);

    setFormData({
      name: "",
      category: "",
      description: "",
    });

  } catch (err) {
    console.error("Error posting item:", err);
  }
};

  const removeItem = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8000/main/user_listings/${id}/`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            
        method: "DELETE",
      });

      setMyItems(myItems.filter(item => item.id !== id));

    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

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

      <div className="lend-container">

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

            <label className="profile-ui__label" htmlFor="photo">
            Profile Photo
          </label>
          <input
            id="photo"
            type="file"
            accept="image/*"
            className="profile-ui__input"
            onChange={(e) => {
              setFormData({...formData, photo: e.target.files[0]})
            }}
          />
          {formData.photo && (
            <div style={{ marginTop: "10px" }}>
              <img
                src={URL.createObjectURL(formData.photo)}
                alt="Preview"
                width={120}
                style={{ borderRadius: "8px" }}
              />
            </div>
          )}

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
                  <img
                  src={item.photo ? `http://127.0.0.1:8000${item.photo}` : ""}
                  alt={item.name} />

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
      <BottomNav navigate={navigate} />
    </div>
  );
}
