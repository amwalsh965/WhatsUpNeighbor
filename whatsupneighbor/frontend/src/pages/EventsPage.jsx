import { useState, useEffect, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import SearchBar from "../components/general/SearchBar";
import EventCard from "../components/events/EventCard";


import BottomNav from "../components/general/BottomNav";

export default function EventsPage() {

  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState(null);

  const [visibleEvents, setVisibleEvents] = useState(6);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [signedUpEvents, setSignedUpEvents] = useState([]);
  const [signedUpEventsData, setSignedUpEventsData] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [currentUsername, setCurrentUsername] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    description: "",
    address: "",
    photo: null
  });

  useEffect(() => {
  const fetchCurrentUser = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/main/current-user/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.username) setCurrentUsername(data.name);
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      }
    };
    fetchCurrentUser();
  }, [token]);

  const handleSignUp = async (eventId) => {
  try {
    const res = await fetch("http://127.0.0.1:8000/main/event-signup/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ event_id: eventId }),
    });
    const data = await res.json();
    if (data.success && data.signed_up) {
      setSignedUpEvents((prev) => [...prev, eventId]);
    }
  } catch (err) {
    console.error(err);
  }
};

const handleLeave = async (eventId) => {
  try {
    const res = await fetch("http://127.0.0.1:8000/main/event-signup/", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ event_id: eventId }),
    });
    const data = await res.json();
    if (data.success && !data.signed_up) {
      setSignedUpEvents((prev) => prev.filter((id) => id !== eventId));
    }
  } catch (err) {
    console.error(err);
  }
};

const fetchSignedUpEventsData = async () => {
  try {
    const res = await fetch("http://127.0.0.1:8000/main/event-signup/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (data.success && data.events) {
      setSignedUpEvents(data.events.map(e => e.id));
      setSignedUpEventsData(data.events);
    }
  } catch (err) {
    console.error(err);
  }
};

const fetchParticipants = async (eventId) => {
  try {
    const res = await fetch(
      `http://127.0.0.1:8000/main/event-participants/?event_id=${eventId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    if (data.success) {
      setParticipants(data.attendees);
    } else {
      console.error("Failed to fetch participants:", data.error);
    }
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  fetchSignedUpEventsData();
}, []);

  const fetchEvents = async (offset = 0) => {
  try {
    const res = await fetch(
      `http://127.0.0.1:8000/main/events/?offset=${offset}&limit=6`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = await res.json();
    const newEvents = data.results || [];

    if (offset === 0) {
      setEvents(newEvents);
      setFilteredEvents(null);
      setVisibleEvents(Math.min(6, newEvents.length));
    } else {
      setEvents(prevEvents => {
        const updated = prevEvents ? [...prevEvents, ...newEvents] : [...newEvents];
        setVisibleEvents(prevVisible => prevVisible + newEvents.length);
        return updated;
      });
    }
  } catch (err) {
    console.error("Error fetching events:", err);
  }
};

  const fetchMyEvents = async (offset = 0) => {

    try {

      const res = await fetch(
        `http://127.0.0.1:8000/main/user-events/?offset=${offset}&limit=6`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if(offset === 0){

        setMyEvents(data.results);

      } else {

        setMyEvents(prev => [...prev, ...data.results]);

      }

    } catch(err){

      console.error(err);

    }

  };

  useEffect(() => {

    fetchEvents(0);
    fetchMyEvents(0);

  }, []);

  useEffect(() => {
  if (filteredEvents !== null) {
    setVisibleEvents(Math.min(6, filteredEvents.length));
  } else if (events.length && visibleEvents === 0) {
    setVisibleEvents(Math.min(6, events.length));
  }
}, [filteredEvents]);

  const handleSearchResults = useCallback((results) => {
  if (results === null || results.length === 0) {
    setFilteredEvents(null);
  } else {
    setFilteredEvents(results);
  }
}, []);

  const eventsToRender = filteredEvents !== null ? filteredEvents : events;

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (editingEvent) {

        await fetch(
          "http://127.0.0.1:8000/main/user-events/",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              id: editingEvent.id,
              ...formData
            })
          }
        );

      } else {

        const form = new FormData();

        form.append("title", formData.title);
        form.append("date", formData.date);
        form.append("description", formData.description);
        form.append("address", formData.address);

        if (formData.photo) {
          form.append("photo", formData.photo);
        }

        await fetch(
          "http://127.0.0.1:8000/main/user-events/",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`
            },
            body: form
          }
        );

      }

      await fetchEvents();
      await fetchMyEvents();

      setShowModal(false);
      setEditingEvent(null);

      setFormData({
        title: "",
        date: "",
        description: "",
        address: "",
        photo: null
      });

    } catch (err) {

      console.error(err);

    }

  };

  const deleteEvent = async (id) => {

    try {

      await fetch(
        "http://127.0.0.1:8000/main/user-events/",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ id })
        }
      );

      setMyEvents(prev => prev.filter(e => e.id !== id));

    } catch (err) {

      console.error(err);

    }

  };

  const openEdit = (event) => {

    setEditingEvent(event);

    setFormData({
      title: event.title,
      date: event.date,
      description: event.description,
      address: "",
      photo: null
    });

    setShowModal(true);

  };

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

        <h1>Neighborhood Hub</h1>
        <p>Events • Borrow • Lend • Connect</p>

        <div className="hero-links">

          <NavLink to="/events" className="nav-link active">
            Events
          </NavLink>

          <NavLink to="/borrow" className="nav-link">
            Borrow
          </NavLink>

          <NavLink to="/lend" className="nav-link">
            Lend
          </NavLink>

          <NavLink to="/connect" className="nav-link">
            Connect
          </NavLink>

        </div>

        <SearchBar
          models={["events"]}
          width="400px"
          onResults={handleSearchResults}
        />

      </div>

      <h2 className="section-title">Your Events</h2>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          className="primary-btn"
          onClick={() => {
            setEditingEvent(null);
            setFormData({
              title: "",
              date: "",
              description: "",
              address: "",
              photo: null,
            });
            setShowModal(true);
          }}
        >
          + Add Event
        </button>
      </div>

      <div className="event-grid">
        {myEvents.length === 0 ? (
          <p>You haven't created any events yet.</p>
        ) : (
          myEvents.map((e) => (
            <EventCard
              key={e.id}
              event={e}
              currentUsername={currentUsername}
              handleEdit={openEdit}
              showEditDelete={true}
              handleDelete={deleteEvent}
              handleSubmit={handleSubmit}
              formData={formData}
              setFormData={setFormData}
            />
          ))
        )}
      </div>
      {myEvents.length >= 6 && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <button
            className="primary-btn"
            onClick={() => fetchMyEvents(myEvents.length)}
          >
            Load More
          </button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingEvent ? "Edit Event" : "Create Event"}</h2>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <input
                type="file"
                onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })}
              />

              <div style={{ marginTop: "20px" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ marginRight: "10px" }}
                >
                  Cancel
                </button>
                <button className="primary-btn" type="submit">
                  {editingEvent ? "Update Event" : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <h2 className="section-title">Signed Up Events</h2>
      <div className="event-grid">
        {signedUpEventsData.length === 0 ? (
          <p style={{ textAlign: "center" }}>You haven't signed up for any events yet.</p>
        ) : (
          signedUpEventsData.map((e) => (
            <EventCard
              key={e.id}
              event={e}
              currentUsername={currentUsername}
              signedUpEvents={signedUpEvents}
              handleSignUp={handleSignUp}
              handleLeave={handleLeave}
              showSignUpButton={true}
              handleSubmit={handleSubmit}
              formData={formData}
              setFormData={setFormData}
            />
          ))
        )}
      </div>

      <h2 className="section-title">Upcoming Events</h2>
      <div className="event-grid">
        {eventsToRender.slice(0, visibleEvents).map((e) => (
          <EventCard
            key={e.id}
            event={e}
            currentUsername={currentUsername}
            signedUpEvents={signedUpEvents}
            handleSignUp={handleSignUp}
            handleLeave={handleLeave}
            showSignUpButton={true}
            handleSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
          />
        ))}
      </div>
      {eventsToRender.length > visibleEvents && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <button
            className="primary-btn"
            onClick={() => fetchEvents(eventsToRender.length)}
          >
            Load More Events
          </button>
        </div>
      )}

      <BottomNav navigate={navigate} />

    </div>

  );

}