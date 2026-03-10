import { useState } from "react";
import ParticipantsList from "./ParticipantList";

export default function EventCard({
  event,
  currentUsername,
  signedUpEvents = [],
  handleSignUp,
  handleLeave,
  handleEdit,
  handleDelete,
  showSignUpButton = false,
  showEditDelete = false,
  handleSubmit,       // form submission for create/edit
  formData,
  setFormData,
}) {
  const [participants, setParticipants] = useState([]);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [showModal, setShowModal] = useState(false); // create/edit modal
  const isCreator = event.host === currentUsername;
  const isSignedUp = signedUpEvents.includes(event.id);

  const fetchParticipants = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/main/event-participants/?event_id=${event.id}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      const data = await res.json();
      if (data.success) {
        setParticipants(data.attendees);
        setShowParticipantsModal(true);
      } else {
        console.error("Failed to fetch participants:", data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="event-card">
        <h3>{event.title}</h3>
        <p><b>Host:</b> {event.host}</p>
        <p><b>Date:</b> {new Date(event.date).toLocaleDateString()}</p>
        <p><b>Location:</b> {event.address}</p>
        <p>{event.description}</p>

        <div style={{ marginTop: "10px" }}>
          {showSignUpButton && !isCreator && (
            <button
              className="primary-btn"
              onClick={() => isSignedUp ? handleLeave(event.id) : handleSignUp(event.id)}
              style={{ marginRight: "10px" }}
            >
              {isSignedUp ? "Leave Event" : "Sign Up"}
            </button>
          )}

          {showEditDelete && isCreator && (
            <div style={{ marginTop: "10px" }}>
                <button className="primary-btn" onClick={() => handleEdit(event)}>Edit</button>
                <button
                className="secondary-btn"
                style={{ background: "#ff6b6b", color: "white", border: "none" }}
                onClick={() => handleDelete(event.id)}
                >
                Delete
                </button>
            </div>
          )}

          <button className="secondary-btn" onClick={fetchParticipants}>
            Who's Going
          </button>
        </div>
      </div>

      {/* PARTICIPANTS MODAL */}
      {showParticipantsModal && (
        <div className="modal-overlay" onClick={() => setShowParticipantsModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Participants</h2>
            <ParticipantsList participants={participants} />
            <div style={{ marginTop: "20px" }}>
              <button
                className="primary-btn"
                onClick={() => setShowParticipantsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE/EDIT MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{formData?.id ? "Edit Event" : "Create Event"}</h2>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />

              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />

              <input
                type="text"
                placeholder="Address ID"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
              />

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              <input
                type="file"
                onChange={(e) =>
                  setFormData({ ...formData, photo: e.target.files[0] })
                }
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
                  {formData?.id ? "Update Event" : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}