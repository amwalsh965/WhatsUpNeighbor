// BottomNav.jsx
import React from "react";
import calIcon from "../../assets/calendar.png";
import heartIcon from "../../assets/heart.png";
import chatIcon from "../../assets/speech-bubble.png";
import userIcon from "../../assets/avatar-icon.png";


export default function BottomNav({ navigate }) {
  const navItems = [
    { icon: calIcon, alt: "Events", path: "/events" },
    { icon: heartIcon, alt: "Saved", path: "/saved" },
    { icon: chatIcon, alt: "Messages", path: "/messages" },
    { icon: userIcon, alt: "Profile", path: "/profile" },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <button
          key={item.path}
          className="nav-item"
          onClick={() => navigate(item.path)}
        >
          <img className="nav-icon" src={item.icon} alt={item.alt} />
        </button>
      ))}
    </nav>
  );
}