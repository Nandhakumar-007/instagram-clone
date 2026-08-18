import { useState } from "react";

export default function CreateReelModal({ onClose, onShare }) {
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [caption, setCaption] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState("");

  function handlePickFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    setVideoFile(file);
    setVideoUrl(URL.createObjectURL(file));
    setError("");
  }

  function handleRemoveVideo() {
    setVideoFile(null);
    setVideoUrl(null);
  }

  // onShare is provided by Reels.jsx and does the real upload + save,
  // so we wait for it to finish before closing the modal.
  const handleShare = async () => {
    if (!videoFile) return;
    setIsSharing(true);
    setError("");

    try {
      await onShare({ caption, file: videoFile });
    } catch (err) {
      setError(err.message || "Failed to upload reel. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="reel-modal-overlay" onClick={onClose}>
      <div className="reel-modal" onClick={(e) => e.stopPropagation()}>
        <div className="reel-modal-header">
          <span>Create new reel</span>
          <button type="button" className="reel-modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="reel-modal-body">
          {!videoUrl && (
            <label className="reel-dropzone">
              <input
                type="file"
                accept="video/*"
                onChange={handlePickFile}
                hidden
              />
              <span style={{ fontSize: 40 }}>🎬</span>
              <p>Select a video to share as a reel</p>
            </label>
          )}

          {videoUrl && (
            <div className="reel-preview-row">
              <div className="reel-video-preview">
                <video src={videoUrl} controls loop />
                <button
                  type="button"
                  className="reel-remove-video"
                  onClick={handleRemoveVideo}
                  disabled={isSharing}
                >
                  &times;
                </button>
              </div>

              <div className="reel-caption-col">
                <textarea
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  disabled={isSharing}
                />
                {error && <p className="auth-error">{error}</p>}
              </div>
            </div>
          )}
        </div>

        <div className="reel-modal-footer">
          <button
            type="button"
            className="reels-upload-btn"
            onClick={handleShare}
            disabled={!videoFile || isSharing}
          >
            {isSharing ? "Sharing..." : "Share"}
          </button>
        </div>
      </div>
    </div>
  );
}