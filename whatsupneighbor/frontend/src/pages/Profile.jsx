import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Images
import profileImage from "../assets/avatar-icon.png";
import backArrow from "../assets/leftpoint.png";
import calIcon from "../assets/calendar.png";
import heartIcon from "../assets/heart.png";
import chatIcon from "../assets/speech-bubble.png";
import userIcon from "../assets/avatar-icon.png";

export default function ProfilePage() {
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const [form, setForm] = useState({
    bio: "",
    website: "",
    photo_url: "",
    address: "",
    neighborhood: "",
  });
  const [assets, setAssets] = useState([
    { name: "Kayak", status: "available" },
    { name: "Grill", status: "lending", extra: "Lending to Dates" },
  ]);
  const [error, setError] = useState("");

  // Fetch profile
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("http://127.0.0.1:8000/main/profiles/me/", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            });
        const data = await res.json();
        setForm({
          bio: data.bio || "",
          website: data.website || "",
          photo_url: data.photo_url || "",
          address: data.address || "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load profile.");
      }
    }

    fetchProfile();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/main/profiles/me/", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            });
      const data = await res.json();
      if (!data.success) setError(data.error || "Failed to save profile.");
    } catch (err) {
      console.error(err);
      setError("Failed to save profile.");
    }
  };

  return (
    <div className="profile-ui">
      {/* Top bar */}
      <header className="profile-ui__topbar">
        <button
          className="profile-ui__iconbtn"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          <img className="profile-ui__backicon" src={backArrow} alt="Back" />
        </button>
        <div className="profile-ui__title">Profile</div>
        <div className="profile-ui__spacer" />
      </header>

      {error && <div className="sf-error">{error}</div>}

      <main className="profile-ui__content">
        {/* Left side: profile info */}
        <section className="profile-ui__left">
          <div className="profile-ui__avatarcard">
            <img
              src={form.photo_url || profileImage}
              alt="Profile"
              className="profile-ui__avatarimg"
            />
            <div className="profile-ui__name">{/* Optional: username */}</div>
          </div>

          <label className="profile-ui__label" htmlFor="bio">
            Bio
          </label>
          <textarea
            id="bio"
            className="profile-ui__textarea"
            name="bio"
            value={form.bio}
            onChange={onChange}
            rows={4}
          />

          <label className="profile-ui__label" htmlFor="website">
            Website
          </label>
          <input
            id="website"
            className="profile-ui__input"
            name="website"
            value={form.website}
            onChange={onChange}
          />

          <label className="profile-ui__label" htmlFor="address">
            Address
          </label>
          <input
            id="address"
            className="profile-ui__input"
            name="address"
            value={form.address}
            onChange={onChange}
          />

          <button
            className="profile-ui__primarybtn"
            type="button"
            onClick={saveProfile}
          >
            Save Profile
          </button>

          <label className="profile-ui__label">Neighborhood</label>
          <p className="profile-ui__readonly">{form.neighborhood || "N/A"}</p>
        </section>

        {/* Right side: assets */}
        <section className="profile-ui__right">
          <div className="profile-ui__assetsheader">Assets</div>
          <div className="profile-ui__assetslist">
            {assets.map((asset) => (
              <div key={asset.name} className="profile-ui__assetrow">
                <div className="profile-ui__assetpill">
                  <span className="profile-ui__assetname">{asset.name}</span>
                  <span
                    className={`profile-ui__dot ${
                      asset.status === "available"
                        ? "profile-ui__dot--green"
                        : "profile-ui__dot--red"
                    }`}
                  />
                </div>
                {asset.extra && (
                  <div className="profile-ui__assetextra">{asset.extra}</div>
                )}
              </div>
            ))}
          </div>

          <div className="profile-ui__formgrid">
            <label className="profile-ui__rightlabel" htmlFor="items">
              Items:
            </label>
            <input
              id="items"
              className="profile-ui__rightinput"
              name="items"
              value={form.items || ""}
              onChange={onChange}
            />
          </div>

          <button
            className="profile-ui__primarybtn"
            type="button"
            onClick={() => navigate("/messages")}
          >
            Search Members
          </button>
        </section>
      </main>

      {/* Bottom navigation */}
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