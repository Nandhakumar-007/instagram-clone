import React, { useState, useEffect, useRef } from "react";


const STORY_DURATION = 5000; // ms per story

// TODO (backend): replace `stories` prop's mock media with the real
// GET /api/stories/:userId response, and call an endpoint like
// POST /api/stories/:id/view once a story finishes, to mark it as seen.

export default function StoryViewer({ stories, initialIndex, onClose, onStoryViewed }) {
  const [index, setIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  const current = stories[index];

  useEffect(() => {
    setProgress(0);
    onStoryViewed?.(current.id);

    clearInterval(intervalRef.current);
    const stepMs = 50;
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (stepMs / STORY_DURATION) * 100;
        if (next >= 100) {
          goNext();
          return 100;
        }
        return next;
      });
    }, stepMs);

    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const goNext = () => {
    setIndex((prev) => {
      if (prev + 1 >= stories.length) {
        onClose();
        return prev;
      }
      return prev + 1;
    });
  };

  const goPrev = () => {
    setIndex((prev) => (prev - 1 >= 0 ? prev - 1 : 0));
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") goNext();
    if (e.key === "ArrowLeft") goPrev();
    if (e.key === "Escape") onClose();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  if (!current) return null;

  return (
    <div className="story-viewer-overlay">
      <div className="story-viewer">
        <div className="story-progress-row">
          {stories.map((s, i) => (
            <div key={s.id} className="story-progress-track">
              <div
                className="story-progress-fill"
                style={{
                  width: i < index ? "100%" : i === index ? `${progress}%` : "0%",
                }}
              />
            </div>
          ))}
        </div>

        <div className="story-viewer-header">
          <img src={current.avatar} alt={current.username} className="story-viewer-avatar" />
          <span className="story-viewer-username">{current.username}</span>
          <span className="story-viewer-time">2h</span>
          <button className="story-viewer-close" type="button" onClick={onClose} title="Close">
            ×
          </button>
        </div>

        <img src={current.media} alt={`${current.username}'s story`} className="story-viewer-media" />

        <div className="story-tap-zone story-tap-left" onClick={goPrev} />
        <div className="story-tap-zone story-tap-right" onClick={goNext} />
      </div>
    </div>
  );
}