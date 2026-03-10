import { NavLink, useNavigate } from "react-router-dom";


import BottomNav from "../components/general/BottomNav";

export default function ConnectPage() {
  const navigate = useNavigate();

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
        <h1>Connect with Neighbors</h1>

        <div className="hero-links">
          <NavLink to="/events" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            Events
          </NavLink>

          <NavLink to="/borrow" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            Borrow
          </NavLink>

          <NavLink to="/lend" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            Lend
          </NavLink>

          <NavLink to="/connect" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            Connect
          </NavLink>
        </div>
      </div>

      <div className="lend-container">
        <div className="lend-section">
          <h2>Community Chat</h2>
          <p>
            Start conversations, organize meetups, and build stronger
            relationships with your neighborhood.
          </p>
        </div>
      </div>
    <BottomNav navigate={navigate} />
    </div>
  );
}