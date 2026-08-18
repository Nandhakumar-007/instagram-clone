import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileHeader from "../components/ProfileHeader";
import PostGrid from "../components/PostGrid";
import FollowListModal from "../components/FollowListModal";
import { getUserProfile } from "../Services/userService";
import { useAuth } from "../Services/AuthContext";

function Profile() {
  const { username: usernameParam } = useParams();
  const { user } = useAuth();

  // "/profile" with no param means "my own profile"
  const username = usernameParam || user?.username;
  const isOwnProfile = username === user?.username;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Followers / Following modal
  const [followListType, setFollowListType] = useState(null);

  useEffect(() => {
    if (!username) return;

    let cancelled = false;

    setLoading(true);
    setError("");

    getUserProfile(username)
      .then((data) => {
        if (!cancelled) {
          setProfile(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Could not load profile");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [username]);

  function handleFollowChange(nowFollowing) {
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            followedByCurrentUser: nowFollowing,
            followerCount:
              prev.followerCount + (nowFollowing ? 1 : -1),
          }
        : prev
    );
  }

  if (loading) {
    return <div className="profile-page">Loading...</div>;
  }

  if (error) {
    return <div className="profile-page">{error}</div>;
  }

  return (
    <div className="profile-page">

      <ProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        onFollowChange={handleFollowChange}

        // Followers click
        onFollowersClick={() => setFollowListType("followers")}

        // Following click
        onFollowingClick={() => setFollowListType("following")}
      />

      <PostGrid username={username} />

      {/* Followers / Following Modal */}
      {followListType && (
        <FollowListModal
          username={username}
          type={followListType}
          onClose={() => setFollowListType(null)}
        />
      )}

    </div>
  );
}

export default Profile;