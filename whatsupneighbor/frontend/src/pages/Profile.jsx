import React, { useState, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

// Images
import profileImage from "../assets/avatar-icon.png";
import backArrow from "../assets/leftpoint.png";
import calIcon from "../assets/calendar.png";
import heartIcon from "../assets/heart.png";
import chatIcon from "../assets/speech-bubble.png";
import userIcon from "../assets/avatar-icon.png";

export default function Profile() {
  const navigate = useNavigate();
  const { id } = useParams(); // when route is /members/:id
  const location = useLocation();

  // Viewer info (Option A)
  const viewerRole = localStorage.getItem("role") || "user"; // "admin" or "user"
  const viewerId = localStorage.getItem("userId") || "";     // optional

  const isAdmin = viewerRole === "admin";

  // If we're on /members/:id, we're viewing someone else's profile
  const isViewingMemberProfile = Boolean(id) && location.pathname.startsWith("/members/");
  const showTransactionHistoryBtn = isAdmin && isViewingMemberProfile;

  const [assets] = useState([
    { name: "Kayak", status: "available" },
    { name: "Grill", status: "lending", extra: "Lending to Dates" },
  ]);

  const [form, setForm] = useState({
    items: "Kayak, grill",
    bio: "",
    website: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onBack = () => {
    navigate(-1);
  };

  return (
    <div className="profile-ui">
      {/* top bar */}
      <header className="profile-ui__topbar">
        <button className="profile-ui__iconbtn" onClick={onBack} aria-label="Back">
          <img className="profile-ui__backicon" src={backArrow} alt="" />
        </button>

        <div className="profile-ui__title">Profile</div>
        <div className="profile-ui__spacer" />
      </header>

      <main className="profile-ui__content">
        {/* left side */}
        <section className="profile-ui__left">
          <div className="profile-ui__avatarcard">
            <img src={profileImage} alt="Profile" className="profile-ui__avatarimg" />
            <div className="profile-ui__name">Tyler Johnson</div>

            <div className="profile-ui__stats">
              <div className="profile-ui__stat">
                <div className="profile-ui__statvalue">2</div>
                <div className="profile-ui__statlabel">Items Lent</div>
              </div>
              <div className="profile-ui__stat">
                <div className="profile-ui__statvalue">4.5</div>
                <div className="profile-ui__statlabel">Rating</div>
              </div>
            </div>
          </div>

          <label className="profile-ui__label" htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            className="profile-ui__textarea"
            name="bio"
            value={form.bio}
            onChange={onChange}
            rows={4}
          />

          <label className="profile-ui__label" htmlFor="website">Website</label>
          <input
            id="website"
            className="profile-ui__input"
            name="website"
            value={form.website}
            onChange={onChange}
          />
        </section>

        {/* right side */}
        <section className="profile-ui__right">
          <div className="profile-ui__assetsheader">Assets</div>

          <div className="profile-ui__assetslist">
            {assets.map((asset) => (
              <div key={asset.name} className="profile-ui__assetrow">
                <div className="profile-ui__assetpill">
                  <span className="profile-ui__assetname">{asset.name}</span>
                  <span
                    className={`profile-ui__dot ${
                      asset.status === "available" ? "profile-ui__dot--green" : "profile-ui__dot--red"
                    }`}
                  />
                </div>
                {asset.extra && <div className="profile-ui__assetextra">{asset.extra}</div>}
              </div>
            ))}
          </div>

          <div className="profile-ui__formgrid">
            <label className="profile-ui__rightlabel" htmlFor="items">Items:</label>
            <input
              id="items"
              className="profile-ui__rightinput"
              name="items"
              value={form.items}
              onChange={onChange}
            />
          </div>

          {/* everyone sees Search Members */}
          <button
            className="profile-ui__primarybtn"
            type="button"
            onClick={() => navigate("/{/*need to make a search member page*/}")}
          >
            Search Members
          </button>


          {/* only admins viewing /members/:id see this */}
          {showTransactionHistoryBtn && (
            <button
              className="profile-ui__primarybtn"
              type="button"
              onClick={() => navigate(`/members/${id}/transactions`)}
            >
              Transaction History
            </button>
          )}
        </section>
      </main>

      {/* bottom nav */}
      <nav className="bottom-nav">
        <button className="nav-item" onClick={() => navigate("/events")}>
          <img className="nav-icon" src={calIcon} alt="Events" />
        </button>
        <button className="nav-item" onClick={() => navigate("/saved")}>
          <img className="nav-icon" src={heartIcon} alt="Saved" />
        </button>
        <button className="nav-item" onClick={() => navigate("/messages")}>
          <img className="nav-icon" src={chatIcon} alt="Messages" />
        </button>
        <button className="nav-item" onClick={() => navigate("/profile")}>
          <img className="nav-icon" src={userIcon} alt="Profile" />
        </button>
      </nav>
    </div>
  );
}
