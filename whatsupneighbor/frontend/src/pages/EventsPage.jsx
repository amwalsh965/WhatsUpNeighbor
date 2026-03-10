import { useState, useEffect, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import SearchBar from "../components/general/SearchBar";

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [visibleEvents, setVisibleEvents] = useState(6);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    async function fetchEvents() {

      try {

        const res = await fetch("http://127.0.0.1:8000/main/events/", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            });
        if (!res.ok) {
          console.error("Request failed:", res.status);

          if (res.status === 401) {
            navigate("/auth");
            return;
          }

          setEvents([]);
          setFilteredEvents([]);
          return;
        }
        const data = await res.json();

        const results = data.results || data;

        setEvents(results);
        setFilteredEvents(results);

      } catch (err) {

        console.error("Error fetching events:", err);

      } finally {

        setLoading(false);

      }

    }

    fetchEvents();

  }, []);


  useEffect(() => {
    setVisibleEvents(Math.min(6, filteredEvents.length));
  }, [filteredEvents]);

  const handleSearchResults = useCallback((results) => {

    if (results === null) {
      setFilteredEvents(events);
      return;
    }

    setFilteredEvents(results);

  }, [events]);

  const eventsToRender = filteredEvents.length ? filteredEvents : events;

  return (
    <div className="events-page">

      {/* ===== TOP BAR ===== */}
      <div className="topbar">

        <div className="logo-left" onClick={() => navigate("/")}>
          🏠 Rae
        </div>

        <div className="profile-right" onClick={() => navigate("/profile")}>
          👤
        </div>

      </div>

      {/* ===== HERO ===== */}
      <div className="events-hero">
        <h1>Neighborhood Hub</h1>
        <p>Events • Borrow • Lend • Connect</p>

        <div className="hero-links">

          <NavLink
            to="/events"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Events
          </NavLink>

          <NavLink
            to="/borrow"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Borrow
          </NavLink>

          <NavLink
            to="/lend"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
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

        <SearchBar
          models={["events"]}
          width="400px"
          onResults={handleSearchResults}
        />

      </div>

      <h2 className="section-title">Upcoming Events</h2>


      <h2 className="section-title">Recent Events</h2>

      {loading ? (

        <p style={{ textAlign: "center" }}>
          Loading events...
        </p>

      ) : (

        <>
          <div className="event-grid">

            {eventsToRender
              .slice(0, visibleEvents)
              .map((e) => (

                <div key={e.id} className="event-card">

                  <div className="event-type">{e.type}</div>

                  <h3>{e.title}</h3>

                  <p>
                    <b>Date:</b> {new Date(e.date).toLocaleDateString()}
                  </p>

                  <p>
                    <b>Location:</b> {e.address}
                  </p>

                  <p>{e.description}</p>

                  <button
                    className="primary-btn"
                    onClick={() =>
                      navigate(`/events/${e.id}`)
                    }
                  >
                    View Details
                  </button>

                </div>

              ))}

          </div>
        



          {visibleEvents < eventsToRender.length && (

            <div
              style={{
                textAlign: "center",
                margin: "30px 0",
              }}
            >

              <button
                className="primary-btn"
                onClick={() =>
                  setVisibleEvents((prev) => prev + 6)
                }
              >
                Load More Events
              </button>

            </div>

          )}

        </>

      )}

    </div>
  );
}
