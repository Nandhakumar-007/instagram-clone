import React, { useState } from "react";


// TEMPORARY mock data, same idea as Mockdata.js for Messages.
// Replace with a real call later, e.g.:
//   GET /api/notifications  -> list of notifications for logged-in user
// Keep the same shape (type, user, text, time, postThumbnail) so you don't
// have to rewrite the rendering below — just swap where `notifications` comes from.

const initialNotifications = {
  New: [
    {
      id: "n1",
      type: "like",
      user: { username: "ariana.codes", avatar: "https://i.pravatar.cc/150?img=5" },
      text: "liked your photo.",
      time: "2m",
      postThumbnail: "https://picsum.photos/seed/post1/80/80",
    },
    {
      id: "n2",
      type: "follow",
      user: { username: "dev_rahul", avatar: "https://i.pravatar.cc/150?img=8" },
      text: "started following you.",
      time: "10m",
      isFollowing: false,
    },
  ],
  Today: [
    {
      id: "n3",
      type: "comment",
      user: { username: "priya_designs", avatar: "https://i.pravatar.cc/150?img=9" },
      text: "commented: \"This is awesome 🔥\"",
      time: "3h",
      postThumbnail: "https://picsum.photos/seed/post2/80/80",
    },
    {
      id: "n4",
      type: "like",
      user: { username: "travel_with_me", avatar: "https://i.pravatar.cc/150?img=15" },
      text: "liked your comment.",
      time: "5h",
    },
  ],
  "This week": [
    {
      id: "n5",
      type: "follow",
      user: { username: "codewithsam", avatar: "https://i.pravatar.cc/150?img=20" },
      text: "started following you.",
      time: "2d",
      isFollowing: true,
    },
    {
      id: "n6",
      type: "mention",
      user: { username: "uiux_naina", avatar: "https://i.pravatar.cc/150?img=25" },
      text: "mentioned you in a comment.",
      time: "4d",
      postThumbnail: "https://picsum.photos/seed/post3/80/80",
    },
  ],
};

export default function Notification() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const toggleFollow = (sectionKey, id) => {
    // TODO (backend): call your userService here, e.g.
    //   userService.toggleFollow(targetUserId).then(...)
    setNotifications((prev) => ({
      ...prev,
      [sectionKey]: prev[sectionKey].map((n) =>
        n.id === id ? { ...n, isFollowing: !n.isFollowing } : n
      ),
    }));
  };

  const sections = Object.entries(notifications).filter(
    ([, items]) => items.length > 0
  );

  return (
    <div className="notif-page">
      <div className="notif-header">Notifications</div>

      {sections.length === 0 && (
        <div className="notif-empty">No notifications yet</div>
      )}

      {sections.map(([sectionKey, items]) => (
        <div key={sectionKey} className="notif-section">
          <div className="notif-section-label">{sectionKey}</div>

          {items.map((n) => (
            <div key={n.id} className="notif-item">
              <img src={n.user.avatar} alt={n.user.username} className="notif-avatar" />

              <div className="notif-text">
                <span className="notif-username">{n.user.username}</span>{" "}
                <span>{n.text}</span>{" "}
                <span className="notif-time">{n.time}</span>
              </div>

              {n.type === "follow" ? (
                <button
                  className={`notif-follow-btn ${n.isFollowing ? "following" : ""}`}
                  onClick={() => toggleFollow(sectionKey, n.id)}
                >
                  {n.isFollowing ? "Following" : "Follow"}
                </button>
              ) : (
                n.postThumbnail && (
                  <img src={n.postThumbnail} alt="post" className="notif-thumb" />
                )
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}