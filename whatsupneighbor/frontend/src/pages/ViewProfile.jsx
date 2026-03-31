import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import backArrow from "../assets/leftpoint.png";
import avatar from "../assets/avatar-icon.png";
import calIcon from "../assets/calendar.png";
import heartIcon from "../assets/heart.png";
import chatIcon from "../assets/speech-bubble.png";
import userIcon from "../assets/avatar-icon.png";

export default function MemberProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const viewerRole = localStorage.getItem("role") || "user";
  const isAdmin = viewerRole === "admin";

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMember = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1:8000/main/members/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 404) {
          setError("Member not found");
          setMember(null);
          return;
        }

        const data = await res.json();
        setMember(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load member profile");
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id, token]);

  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <div>
        <button onClick={() => navigate(-1)}>Back</button>
        <p>{error}</p>
      </div>
    );

  return (
    <div className="member-profile-page">
      <header className="member-profile-page__topbar">
        <button
          className="member-profile-page__iconbtn"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          <img className="member-profile-page__backicon" src={backArrow} alt="" />
        </button>

        <div className="member-profile-page__title">View Profile</div>
        <div className="member-profile-page__spacer" />
      </header>

      <main className="member-profile-page__content">
        <section className="member-profile-page__left">
          <div className="member-profile-page__card">
            <img
              src={member.photo ? `http://127.0.0.1:8000${member.photo}` : avatar}
              alt={member.name}
              className="member-profile-page__avatar"
            />

            <h2 className="member-profile-page__name">{member.name}</h2>

            <div className="member-profile-page__stats">
              <div className="member-profile-page__statbox">
                <div className="member-profile-page__statvalue">{member.items_lent}</div>
                <div className="member-profile-page__statlabel">Items Lent</div>
              </div>

              <div className="member-profile-page__statbox">
                <div className="member-profile-page__statvalue">{member.rating}</div>
                <div className="member-profile-page__statlabel">Rating</div>
              </div>
            </div>

            <div className="member-profile-page__joined">Member since {member.joined}</div>
          </div>

          <div className="member-profile-page__info">
            <label className="member-profile-page__label">Bio</label>
            <div className="member-profile-page__readonly">{member.bio}</div>

            <label className="member-profile-page__label">Website</label>
            <div className="member-profile-page__readonly">{member.website}</div>
          </div>
        </section>

        <section className="member-profile-page__right">
          <div className="member-profile-page__itemsheader">Shared Items</div>

          <div className="member-profile-page__itemslist">
            {member.items.map((item) => (
              <div key={item.id} className="member-profile-page__itemrow">
                <div className="member-profile-page__itemname">{item.name}</div>
                <span
                  className={[
                    "member-profile-page__status",
                    item.status === "Available" && "member-profile-page__status--available",
                    item.status === "Borrowed" && "member-profile-page__status--borrowed",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
          {isAdmin && (
            <button
              className="member-profile-page__btn"
              type="button"
              onClick={() => navigate(`/members/${id}/transactions`)}
            >
              Transaction History
            </button>
          )}
        </section>
      </main>

      <nav className="bottom-nav">
        <button className="nav-item" type="button" onClick={() => navigate("/events")}>
          <img className="nav-icon" src={calIcon} alt="Events" />
        </button>
        <button className="nav-item" type="button" onClick={() => navigate("/saved")}>
          <img className="nav-icon" src={heartIcon} alt="Saved" />
        </button>
        <button className="nav-item" type="button" onClick={() => navigate("/messages")}>
          <img className="nav-icon" src={chatIcon} alt="Messages" />
        </button>
        <button className="nav-item" type="button" onClick={() => navigate("/profile")}>
          <img className="nav-icon" src={userIcon} alt="Profile" />
        </button>
      </nav>
    </div>
  );
}