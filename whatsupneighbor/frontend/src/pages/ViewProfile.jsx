import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import backArrow from "../assets/leftpoint.png";
import avatar from "../assets/avatar-icon.png";
import calIcon from "../assets/calendar.png";
import heartIcon from "../assets/heart.png";
import chatIcon from "../assets/speech-bubble.png";
import userIcon from "../assets/avatar-icon.png";

export default function MemberProfile() {
  const navigate = useNavigate();
  const { id } = useParams();

  const members = [
    {
      id: 1,
      name: "Tyler Johnson",
      bio: "Enjoys lending outdoor gear, tools, and equipment to neighbors.",
      website: "www.tylerjohnson.com",
      rating: 4.8,
      itemsLent: 12,
      joined: "March 2024",
      image: avatar,
      items: [
        { name: "Kayak", status: "Available" },
        { name: "Grill", status: "Borrowed" },
        { name: "Tool Kit", status: "Available" },
      ],
    },
    {
      id: 2,
      name: "Danielle Brown",
      bio: "Happy to share kitchen items, folding tables, and home supplies.",
      website: "www.daniellebrown.com",
      rating: 4.9,
      itemsLent: 15,
      joined: "January 2024",
      image: avatar,
      items: [
        { name: "Mixer", status: "Available" },
        { name: "Folding Chairs", status: "Available" },
        { name: "Cooler", status: "Borrowed" },
      ],
    },
    {
      id: 3,
      name: "Adam Lee",
      bio: "Usually lends tools for quick home projects and repairs.",
      website: "www.adamlee.com",
      rating: 4.7,
      itemsLent: 8,
      joined: "April 2024",
      image: avatar,
      items: [
        { name: "Ladder", status: "Available" },
        { name: "Power Drill", status: "Available" },
        { name: "Pressure Washer", status: "Borrowed" },
      ],
    },
    {
      id: 4,
      name: "Izabela Camaj",
      bio: "Community member sharing tech equipment and event supplies.",
      website: "www.izabelacamaj.com",
      rating: 5.0,
      itemsLent: 10,
      joined: "February 2024",
      image: avatar,
      items: [
        { name: "Projector", status: "Available" },
        { name: "Speaker", status: "Available" },
        { name: "Ring Light", status: "Borrowed" },
      ],
    },
  ];

  const member = useMemo(() => {
    return members.find((person) => person.id === Number(id));
  }, [id]);

  if (!member) {
    return (
      <div className="member-profile-page">
        <header className="member-profile-page__topbar">
          <button
            className="member-profile-page__iconbtn"
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <img
              className="member-profile-page__backicon"
              src={backArrow}
              alt=""
            />
          </button>

          <div className="member-profile-page__title">View Profile</div>
          <div className="member-profile-page__spacer" />
        </header>

        <main className="member-profile-page__content">
          <div className="member-profile-page__empty">Member not found.</div>
        </main>
      </div>
    );
  }

  return (
    <div className="member-profile-page">
      <header className="member-profile-page__topbar">
        <button
          className="member-profile-page__iconbtn"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          <img
            className="member-profile-page__backicon"
            src={backArrow}
            alt=""
          />
        </button>

        <div className="member-profile-page__title">View Profile</div>
        <div className="member-profile-page__spacer" />
      </header>

      <main className="member-profile-page__content">
        <section className="member-profile-page__left">
          <div className="member-profile-page__card">
            <img
              src={member.image}
              alt={member.name}
              className="member-profile-page__avatar"
            />

            <h2 className="member-profile-page__name">{member.name}</h2>

            <div className="member-profile-page__stats">
              <div className="member-profile-page__statbox">
                <div className="member-profile-page__statvalue">
                  {member.itemsLent}
                </div>
                <div className="member-profile-page__statlabel">
                  Items Lent
                </div>
              </div>

              <div className="member-profile-page__statbox">
                <div className="member-profile-page__statvalue">
                  {member.rating}
                </div>
                <div className="member-profile-page__statlabel">Rating</div>
              </div>
            </div>

            <div className="member-profile-page__joined">
              Member since {member.joined}
            </div>
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
              <div key={item.name} className="member-profile-page__itemrow">
                <div className="member-profile-page__itemname">{item.name}</div>
                <span
                  className={[
                    "member-profile-page__status",
                    item.status === "Available" &&
                      "member-profile-page__status--available",
                    item.status === "Borrowed" &&
                      "member-profile-page__status--borrowed",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>

          <button
            className="member-profile-page__messagebtn"
            type="button"
            onClick={() => navigate("/messages")}
          >
            Message Member
          </button>
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
