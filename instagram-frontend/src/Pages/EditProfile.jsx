import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, updateProfile } from "../Services/userService";
import { uploadFile } from "../Services/postService";
import { useAuth } from "../Services/AuthContext";
import { resolveMediaUrl } from "../utils/constants";

function EditProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.username) return;
    getUserProfile(user.username)
      .then((data) => {
        setFullName(data.fullName || "");
        setBio(data.bio || "");
        setProfilePicUrl(data.profilePicUrl || "");
      })
      .catch((err) => setError(err.message || "Could not load profile"))
      .finally(() => setLoading(false));
  }, [user?.username]);

  async function handlePicChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const url = await uploadFile(file);
      setProfilePicUrl(url);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await updateProfile({ fullName, bio, profilePicUrl });
      navigate(`/profile/${user.username}`);
    } catch (err) {
      setError(err.message || "Could not save changes");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="auth-page">Loading...</div>;

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ width: 420 }}>
        <h1 className="auth-logo" style={{ fontSize: "1.6rem" }}>
          Edit Profile
        </h1>

        <div style={{ marginBottom: 16 }}>
          <img
            src={resolveMediaUrl(profilePicUrl) || "https://i.pravatar.cc/120?u=" + user?.username}
            alt={user?.username}
            style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }}
          />
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label style={{ textAlign: "left", fontSize: "0.85rem" }}>
            Profile photo
            <input type="file" accept="image/*" onChange={handlePicChange} disabled={uploading} />
          </label>

          <input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <textarea
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={500}
            rows={4}
            style={{
              padding: "10px 12px",
              border: "1px solid #dbdbdb",
              borderRadius: 4,
              background: "#fafafa",
              fontSize: "0.9rem",
              fontFamily: "inherit",
              resize: "vertical",
            }}
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" disabled={saving || uploading}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;