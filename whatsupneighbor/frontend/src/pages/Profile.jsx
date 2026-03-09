import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import profileImage from "../assets/avatar-icon.png";
import backArrow from "../assets/leftpoint.png";
import calIcon from "../assets/calendar.png";
import heartIcon from "../assets/heart.png";
import chatIcon from "../assets/speech-bubble.png";
import userIcon from "../assets/avatar-icon.png";

export default function Profile() {
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const viewerRole = localStorage.getItem("role") || "user";
  const isAdmin = viewerRole === "admin";

  const isViewingMemberProfile =
    Boolean(id) && location.pathname.startsWith("/members/");
  const showTransactionHistoryBtn = isAdmin && isViewingMemberProfile;

  const [form, setForm] = useState({
    bio: "",
    website: "",
    photo: "",
    address: "",
    neighborhood: "",
  });

  const [assets, setAssets] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/main/profiles/me/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();

        setForm({
          bio: data.bio || "",
          website: data.website || "",
          photo: data.photo || "",
          address: data.address || "",
          neighborhood: data.neighborhood || "",
        });

        setAssets(data.assets || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile.");
      }
    }

    fetchProfile();
  }, [token]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
  try {
    const formData = new FormData();
    formData.append("bio", form.bio);
    formData.append("website", form.website);
    formData.append("address", form.address);
    if (form.photo_file) { // this is the File object from <input type="file">
      formData.append("photo", form.photo_file);
    }

    const res = await fetch(`http://127.0.0.1:8000/main/profiles/me/`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        // NOTE: Do NOT set Content-Type manually for FormData
      },
      body: formData,
    });

    const data = await res.json();
    if (!data.success) setError("Failed to save profile");
    else setForm((prev) => ({ ...prev, photo_url: data.photo_url }));
  } catch (err) {
    console.error(err);
    setError("Failed to save profile");
  }
};

  return (
    <div className="profile-ui">
      <header className="profile-ui__topbar">
        <button
          className="profile-ui__iconbtn"
          onClick={() => navigate(-1)}
        >
          <img className="profile-ui__backicon" src={backArrow} alt="Back" />
        </button>

        <div className="profile-ui__title">Profile</div>
        <div className="profile-ui__spacer" />
      </header>

      {error && <div className="sf-error">{error}</div>}

      <main className="profile-ui__content">
        <section className="profile-ui__left">

          <div className="profile-ui__avatarcard">
            <img
              src={form.photo_url || profileImage}
              alt="Profile"
              className="profile-ui__avatarimg"
            />

            <div className="profile-ui__name">Your Profile</div>

            <div className="profile-ui__stats">
              <div className="profile-ui__stat">
                <div className="profile-ui__statvalue">{assets.length}</div>
                <div className="profile-ui__statlabel">Items</div>
              </div>
            </div>
          </div>

          
          <label className="profile-ui__label">Bio</label>
          <textarea
            className="profile-ui__textarea"
            name="bio"
            value={form.bio}
            onChange={onChange}
            rows={4}
          />

          <label className="profile-ui__label">Website</label>
          <input
            className="profile-ui__input"
            name="website"
            value={form.website}
            onChange={onChange}
          />

          <label className="profile-ui__label">Address</label>
          <input
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
          <p className="profile-ui__readonly">
            {form.neighborhood || "N/A"}
          </p>
        </section>

        <section className="profile-ui__right">
          <div className="profile-ui__assetsheader">Assets</div>

          <div className="profile-ui__assetslist">
            {assets.map((asset) => (
              <div key={asset.id} className="profile-ui__assetrow">
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
              </div>
            ))}
          </div>

          <button
            className="profile-ui__primarybtn"
            type="button"
            onClick={() => navigate("/messages")}
          >
            Search Members
          </button>

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