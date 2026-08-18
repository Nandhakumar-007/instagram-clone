import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import CreateReelModal from "../components/CreateReelModal";
import { uploadFile } from "../Services/postService";
import { createReel, getReelsFeed, toggleReelLike } from "../Services/reelService";
import { resolveMediaUrl } from "../utils/constants";

export default function Reels() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadReels() {
      try {
        setLoading(true);
        setError("");
        const data = await getReelsFeed();
        if (!cancelled) setReels(data);
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not load reels");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadReels();
    return () => { cancelled = true; };
  }, []);

  const handleShare = async ({ caption, file }) => {
    if (!file) return;

    // 1. Upload the raw video file (same endpoint used for post images)
    const uploadedPath = await uploadFile(file);

    // 2. Create the reel record so it's actually persisted
    const savedReel = await createReel(uploadedPath, caption);

    setReels((prev) => [savedReel, ...prev]);
    setShowModal(false);
  };

  async function handleLike(reelId) {
    setReels((prev) =>
      prev.map((r) =>
        r.id === reelId
          ? { ...r, likedByCurrentUser: !r.likedByCurrentUser, likeCount: r.likeCount + (r.likedByCurrentUser ? -1 : 1) }
          : r
      )
    );

    try {
      const updated = await toggleReelLike(reelId);
      setReels((prev) => prev.map((r) => (r.id === reelId ? { ...r, ...updated } : r)));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Layout>
      <div className="reels-page">
        <div className="reels-header">
          <span>Reels</span>
          <button className="reels-upload-btn" onClick={() => setShowModal(true)}>
            + Create
          </button>
        </div>

        {loading && <p className="reels-status">Loading reels...</p>}
        {!loading && error && <p className="reels-status">{error}</p>}
        {!loading && !error && reels.length === 0 && (
          <p className="reels-status">No reels yet. Be the first to share one!</p>
        )}

        <div className="reels-feed">
          {reels.map((r) => (
            <div key={r.id} className="reel-card">
              <video src={resolveMediaUrl(r.videoUrl)} controls loop playsInline className="reel-video" />

              <div className="reel-overlay">
                <div className="reel-user">
                  <img
                    src={resolveMediaUrl(r.userProfilePicUrl) || `https://i.pravatar.cc/150?u=${r.username}`}
                    alt={r.username}
                  />
                  <span>{r.username}</span>
                </div>
                <div className="reel-caption">{r.caption}</div>
                <button className="reel-likes" onClick={() => handleLike(r.id)}>
                  {r.likedByCurrentUser ? "❤️" : "🤍"} {r.likeCount}
                </button>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <CreateReelModal onClose={() => setShowModal(false)} onShare={handleShare} />
        )}
      </div>
    </Layout>
  );
}