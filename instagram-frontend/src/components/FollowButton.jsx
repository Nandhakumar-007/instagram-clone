import { useState } from "react";
import { toggleFollow } from "../Services/userService";

function FollowButton({ username, isFollowing: initialIsFollowing, onToggle }) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;
    setLoading(true);

    // optimistic update so the button feels instant
    const nextState = !isFollowing;
    setIsFollowing(nextState);

    try {
      await toggleFollow(username);
      if (onToggle) onToggle(nextState);
    } catch (err) {
      // roll back if the request failed
      setIsFollowing(!nextState);
      alert(err.message || "Could not update follow status");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      className={isFollowing ? "btn-following" : "btn-follow"}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? "..." : isFollowing ? "Following" : "Follow"}
    </button>
  );
}

export default FollowButton;