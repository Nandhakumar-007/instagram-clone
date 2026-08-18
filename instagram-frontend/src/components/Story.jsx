import React from "react";

function Story({
  username,
  avatar,
  viewed,
  isMine,
  hasStory,
  onClick,
  onAddClick,
}) {
  const showPlus = isMine && !hasStory;

  const handleClick = (e) => {
    if (showPlus) {
      onAddClick?.(e);
    } else {
      onClick?.(e);
    }
  };

  return (
    <div className="story" onClick={handleClick}>
      <div
        className={`story-ring ${
          isMine
            ? hasStory
              ? viewed
                ? "viewed"
                : ""
              : "no-story"
            : viewed
            ? "viewed"
            : ""
        }`}
      >
        <img
          className="story-avatar"
          src={
            avatar ||
            `https://i.pravatar.cc/150?u=${username}`
          }
          alt={username}
        />

        {showPlus && (
          <span
            className="story-add-badge"
            onClick={(e) => {
              e.stopPropagation();
              onAddClick?.(e);
            }}
          >
            +
          </span>
        )}
      </div>

      <span className="story-username">
        {isMine ? "Your story" : username}
      </span>
    </div>
  );
}

export default Story;