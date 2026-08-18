import { useEffect, useMemo, useState } from "react";
import { getFollowers, getFollowing } from "../Services/userService";
import { resolveMediaUrl } from "../utils/constants";
import { useAuth } from "../Services/AuthContext";

export default function NewMessageModal({ onClose, onSelectUser }) {
  const { user } = useAuth();

  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [opening, setOpening] = useState(null);

  useEffect(() => {
    if (!user?.username) return;
    let cancelled = false;

    async function loadPeople() {
      try {
        setLoading(true);
        setError("");

        const [followers, following] = await Promise.all([
          getFollowers(user.username),
          getFollowing(user.username),
        ]);

        if (cancelled) return;

        const merged = new Map();
        [...followers, ...following].forEach((p) => merged.set(p.username, p));
        setPeople(Array.from(merged.values()));
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not load your followers/following");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPeople();
    return () => { cancelled = true; };
  }, [user?.username]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return people;
    return people.filter(
      (p) => p.username.toLowerCase().includes(q) || (p.fullName && p.fullName.toLowerCase().includes(q))
    );
  }, [people, search]);

  async function handlePick(person) {
    if (opening) return;
    setOpening(person.username);
    try {
      await onSelectUser(person.username);
    } catch (err) {
      alert(err.message || "Could not start conversation");
    } finally {
      setOpening(null);
    }
  }

  return (
    <div className="new-message-modal-overlay" onClick={onClose}>
      <div className="new-message-modal" onClick={(e) => e.stopPropagation()}>
        <div className="new-message-modal-header">
          <h3>New Message</h3>
          <button className="close-modal" onClick={onClose}>×</button>
        </div>

        <div className="new-message-modal-search">
          <input
            type="text"
            placeholder="Search followers & following..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="new-message-modal-body">
          {loading && <p className="new-message-status">Loading...</p>}
          {!loading && error && <p className="new-message-status">{error}</p>}

          {!loading && !error && filtered.length === 0 && (
            <p className="new-message-status">
              {people.length === 0
                ? "Follow people (or get followers) to start messaging them."
                : "No matches found."}
            </p>
          )}

          {!loading && !error && filtered.map((person) => (
            <div key={person.username} className="new-message-user-item" onClick={() => handlePick(person)}>
              <img
                src={resolveMediaUrl(person.profilePicUrl) || `https://i.pravatar.cc/100?u=${person.username}`}
                alt={person.username}
              />
              <div className="new-message-user-info">
                <strong>{person.username}</strong>
                {person.fullName && <span>{person.fullName}</span>}
              </div>
              <button type="button" className="new-message-select-btn" disabled={opening === person.username}>
                {opening === person.username ? "..." : "Chat"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}