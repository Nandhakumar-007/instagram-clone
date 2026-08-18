import { useEffect, useState } from "react";
import {
  getFollowers,
  getFollowing,
} from "../Services/userService";
import { resolveMediaUrl } from "../utils/constants";
import { useNavigate } from "react-router-dom";

function FollowListModal({
  username,
  type,
  onClose,
}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        setError("");

        const data =
          type === "followers"
            ? await getFollowers(username)
            : await getFollowing(username);

        setUsers(data);
      } catch (err) {
        setError(
          err.message || "Could not load users"
        );
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, [username, type]);

  /*
   * Open Messages page and tell it
   * which user we want to chat with.
   */
  function handleMessageClick(user) {
    onClose();

    navigate(
      `/messages?user=${encodeURIComponent(
        user.username
      )}`
    );
  }

  return (
    <div
      className="follow-modal-overlay"
      onClick={onClose}
    >
      <div
        className="follow-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}

        <div className="follow-modal-header">
          <h3>
            {type === "followers"
              ? "Followers"
              : "Following"}
          </h3>

          <button
            onClick={onClose}
            className="close-modal"
          >
            ×
          </button>
        </div>

        {/* Body */}

        <div className="follow-modal-body">

          {loading && (
            <p>Loading...</p>
          )}

          {error && (
            <p>{error}</p>
          )}

          {!loading &&
            !error &&
            users.length === 0 && (
              <p>
                No users found.
              </p>
            )}

          {users.map((person) => (
            <div
              className="follow-user-item"
              key={person.id}
            >

              {/* Profile image */}

              <img
                src={
                  resolveMediaUrl(
                    person.profilePicUrl
                  ) ||
                  `https://i.pravatar.cc/100?u=${person.username}`
                }
                alt={person.username}
              />

              {/* User information */}

              <div className="follow-user-info">

                <strong>
                  {person.username}
                </strong>

                {person.fullName && (
                  <span>
                    {person.fullName}
                  </span>
                )}

              </div>

              {/* Message */}

              <button
                className="message-user-button"
                onClick={() =>
                  handleMessageClick(person)
                }
              >
                Message
              </button>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

export default FollowListModal;