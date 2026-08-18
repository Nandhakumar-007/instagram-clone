import { Link, useNavigate } from "react-router-dom";
import FollowButton from "./FollowButton";
import { resolveMediaUrl } from "../utils/constants";

function ProfileHeader({
  profile,
  isOwnProfile,
  onFollowChange,
  onFollowersClick,
  onFollowingClick,
}) {
  const navigate = useNavigate();

  if (!profile) return null;

  const {
    username,
    fullName,
    bio,
    profilePicUrl,
    postCount,
    followerCount,
    followingCount,
    followedByCurrentUser,
  } = profile;

  // Takes you straight to the messages page and opens/creates a chat
  // with this person - this is what makes the "Message" button work.
  function handleMessageClick() {
    navigate(`/messages?user=${encodeURIComponent(username)}`);
  }

  return (
    <div className="profile-header">
      <div className="profile-image">
        <img
          src={
            resolveMediaUrl(profilePicUrl) ||
            "https://i.pravatar.cc/200?u=" + username
          }
          alt={username}
        />
      </div>

      <div className="profile-info">
        <div className="profile-top">
          <h2>{username}</h2>

          {isOwnProfile ? (
            <Link to="/edit-profile">
              <button>Edit Profile</button>
            </Link>
          ) : (
            <div className="profile-actions">
              <FollowButton
                username={username}
                isFollowing={followedByCurrentUser}
                onToggle={onFollowChange}
              />

              <button
                className="profile-message-btn"
                onClick={handleMessageClick}
              >
                Message
              </button>
            </div>
          )}
        </div>

        <div className="profile-stats">
          <span>
            <b>{postCount}</b> Posts
          </span>

          <span className="profile-stat-clickable" onClick={onFollowersClick}>
            <b>{followerCount}</b> Followers
          </span>

          <span className="profile-stat-clickable" onClick={onFollowingClick}>
            <b>{followingCount}</b> Following
          </span>
        </div>

        {fullName && <p className="profile-fullname">{fullName}</p>}
        {bio && <p>{bio}</p>}
      </div>
    </div>
  );
}

export default ProfileHeader;