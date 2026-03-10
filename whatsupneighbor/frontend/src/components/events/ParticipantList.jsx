export default function ParticipantsList({ participants }) {
  return (
    <div>
      {participants.length === 0 ? (
        <p>No one is going yet.</p>
      ) : (
        <ul>
          {participants.map((p) => (
            <li key={p.profile_id}>
              {p.first_name} {p.last_name} ({p.username})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}