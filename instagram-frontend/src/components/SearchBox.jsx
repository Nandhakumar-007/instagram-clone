import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { searchUsers } from "../Services/userService";
import { resolveMediaUrl } from "../utils/constants";

function SearchBox() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const timeoutId = setTimeout(() => {
      searchUsers(search)
        .then((data) => { if (!cancelled) setResults(data); })
        .catch(() => { if (!cancelled) setResults([]); })
        .finally(() => { if (!cancelled) setLoading(false); });
    }, 300);

    return () => { cancelled = true; clearTimeout(timeoutId); };
  }, [search]);

  return (
    <div className="search-page">
      <input
        className="search-input"
        type="text"
        placeholder="Search users"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="search-results">
        {loading && <p>Searching...</p>}

        {!loading && search.trim() && results.length === 0 && (
          <p className="search-no-results">No users found.</p>
        )}

        {!loading && results.map((user) => (
          <Link to={`/profile/${user.username}`} className="user-card" key={user.id}>
            <img
              src={resolveMediaUrl(user.profilePicUrl) || "https://i.pravatar.cc/150?u=" + user.username}
              alt={user.username}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://i.pravatar.cc/150?u=" + user.username;
              }}
            />
            <div className="user-card-info">
              <h4>{user.username}</h4>
              {user.fullName && <span className="user-card-fullname">{user.fullName}</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SearchBox;