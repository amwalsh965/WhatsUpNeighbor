import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import backArrow from "../assets/leftpoint.png";
import avatar from "../assets/avatar-icon.png";

export default function SearchMembers() {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");

  // Manual example data (like Borrow page)
  const members = [
    {
      id: 1,
      name: "Tyler Johnson",
      bio: "Enjoys lending outdoor gear and tools.",
      rating: 4.8,
      itemsLent: 12,
      image: avatar,
    },
    {
      id: 2,
      name: "Danielle Brown",
      bio: "Happy to share kitchen and home items.",
      rating: 4.9,
      itemsLent: 15,
      image: avatar,
    },
    {
      id: 3,
      name: "Adam Lee",
      bio: "Has plenty of tools for home projects.",
      rating: 4.7,
      itemsLent: 8,
      image: avatar,
    },
    {
      id: 4,
      name: "Izabela Camaj",
      bio: "Community member sharing tech equipment.",
      rating: 5.0,
      itemsLent: 10,
      image: avatar,
    },
    {
      id: 5,
      name: "Sophia Miller",
      bio: "Lends camping and hiking gear.",
      rating: 4.6,
      itemsLent: 6,
      image: avatar,
    },
    {
      id: 6,
      name: "Michael Carter",
      bio: "Shares automotive and garage tools.",
      rating: 4.5,
      itemsLent: 9,
      image: avatar,
    },
  ];

  // Filtering search results
  const filteredMembers = useMemo(() => {
    return members.filter((member) =>
      member.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText]);

  return (
    <div className="search-members-page">
      {/* Top Bar */}
      <header className="search-members-page__topbar">
        <button
          className="search-members-page__iconbtn"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          <img
            className="search-members-page__backicon"
            src={backArrow}
            alt=""
          />
        </button>

        <div className="search-members-page__title">Search Members</div>

        <div className="search-members-page__spacer" />
      </header>

      {/* Content */}
      <div className="search-members-page__content">
        <input
          className="search-members-page__input"
          placeholder="Search members..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <div className="search-members-page__results">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="search-members-page__member"
              onClick={() => navigate(`/members/${member.id}`)}
            >
              <img
                src={member.image}
                alt={member.name}
                className="search-members-page__avatar"
              />

              <div className="search-members-page__memberinfo">
                <div className="search-members-page__membername">
                  {member.name}
                </div>

                <div className="search-members-page__memberbio">
                  {member.bio}
                </div>

                <div className="search-members-page__memberstats">
                  ⭐ {member.rating} • {member.itemsLent} items lent
                </div>
              </div>
            </div>
          ))}

          {filteredMembers.length === 0 && (
            <div className="search-members-page__empty">
              No members found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
