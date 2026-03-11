import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/general/SearchBar";
import avatar from "../assets/avatar-icon.png";
import backArrow from "../assets/leftpoint.png";

export default function SearchMembers() {
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/main/search/?search=&models=users,profiles",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      const profileResults = data.results.filter(
        (r) => r.type === "profile" || r.type === "user"
      );
      setMembers(profileResults);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSearchResults = (results) => {
    if (!results) {
      fetchMembers();
      return;
    }

    const profileResults = results.filter(
      (r) => r.type === "profile" || r.type === "user"
    );
    setMembers(profileResults);
  };

  return (
    <div className="search-members-page">
      <header className="search-members-page__topbar">
        <button
          className="search-members-page__iconbtn"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          <img className="search-members-page__backicon" src={backArrow} alt="" />
        </button>
        <div className="search-members-page__title">Search Members</div>
        <div className="search-members-page__spacer" />
      </header>

      <div className="search-members-page__content">
        <SearchBar
          outline={true}
          models={["users", "profiles"]}
          width="100%"
          placeholder="Search members..."
          onResults={handleSearchResults}
        />

        {error && <div className="search-members-page__error">{error}</div>}
        {loading && <div className="search-members-page__loading">Loading...</div>}

        <div className="search-members-page__results">
          {members.length === 0 && !loading ? (
            <div className="search-members-page__empty">No members found</div>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className="search-members-page__member"
                onClick={() => navigate(`/members/${member.id}`)}
              >
                <img
                  src={member.photo ? `http://127.0.0.1:8000${member.photo}` : avatar}
                  alt={member.name}
                  className="search-members-page__avatar"
                />
                <div className="search-members-page__memberinfo">
                  <div className="search-members-page__membername">{member.name}</div>
                  <div className="search-members-page__memberbio">{member.bio}</div>
                  <div className="search-members-page__memberstats">
                    ⭐ {member.rating} • {member.items_lent || 0} items lent
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}