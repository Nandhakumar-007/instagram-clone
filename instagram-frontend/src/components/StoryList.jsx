import React, {
  useRef,
  useState,
  useEffect,
} from "react";

import Story from "./Story";
import StoryViewer from "./StoryViewer";

import {
  getStories,
  createStory,
} from "../Services/storyService";

import { uploadFile } from "../Services/postService";

import { useAuth } from "../Services/AuthContext";

function StoryList() {
  const { user } = useAuth();

  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

  const [stories, setStories] = useState([]);

  const [canScrollLeft, setCanScrollLeft] =
    useState(false);

  const [canScrollRight, setCanScrollRight] =
    useState(false);

  const [viewerIndex, setViewerIndex] =
    useState(null);

  const [viewedIds, setViewedIds] =
    useState(new Set());

  const [myStories, setMyStories] =
    useState([]);

  // =========================
  // LOAD STORIES
  // =========================

  useEffect(() => {
    if (user?.id) {
      loadStories();
    }
  }, [user?.id]);

  async function loadStories() {
    try {
      const data = await getStories();

      const storyData = Array.isArray(data)
        ? data
        : [];

      setStories(storyData);

      const mine = storyData.filter(
        (story) =>
          String(story.userId) === String(user.id)
      );

      setMyStories(mine);
    } catch (error) {
      console.error(
        "Could not load stories:",
        error
      );
    }
  }

  // =========================
  // SCROLL BUTTONS
  // =========================

  const updateArrows = () => {
    const el = scrollRef.current;

    if (!el) return;

    setCanScrollLeft(
      el.scrollLeft > 0
    );

    setCanScrollRight(
      el.scrollLeft + el.clientWidth <
        el.scrollWidth - 1
    );
  };

  useEffect(() => {
    updateArrows();

    const el = scrollRef.current;

    if (!el) return;

    el.addEventListener(
      "scroll",
      updateArrows
    );

    window.addEventListener(
      "resize",
      updateArrows
    );

    return () => {
      el.removeEventListener(
        "scroll",
        updateArrows
      );

      window.removeEventListener(
        "resize",
        updateArrows
      );
    };
  }, [stories.length]);

  const scrollByAmount = (amount) => {
    scrollRef.current?.scrollBy({
      left: amount,
      behavior: "smooth",
    });
  };

  // =========================
  // STORY VIEWED
  // =========================

  const handleStoryViewed = (storyId) => {
    setViewedIds((prev) => {
      const updated = new Set(prev);
      updated.add(storyId);
      return updated;
    });
  };

  // =========================
  // ADD STORY
  // =========================

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  async function handleFileSelected(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      // Upload image/video
      const mediaUrl = await uploadFile(file);

      console.log(
        "Uploaded media URL:",
        mediaUrl
      );

      // Save story
      await createStory(mediaUrl);

      // Reload stories
      await loadStories();

    } catch (error) {
      console.error(
        "Story upload failed:",
        error
      );

      alert(
        error.message ||
          "Could not upload story"
      );
    } finally {
      e.target.value = "";
    }
  }

  // =========================
  // CURRENT USER
  // =========================

  const currentUser = {
    id: user?.id,
    username: user?.username || "you",
    avatar: user?.profilePicUrl,
  };

  // =========================
  // OTHER STORIES
  // =========================

  const otherStories = stories.filter(
    (story) =>
      String(story.userId) !==
      String(user?.id)
  );

  // =========================
  // MY STORY GROUP
  // =========================

  const myStoryEntry =
    myStories.length > 0
      ? {
          id: currentUser.id,
          username: currentUser.username,
          avatar: currentUser.avatar,
          isMine: true,
          media:
            myStories[
              myStories.length - 1
            ].media,
          items: myStories,
        }
      : null;

  // =========================
  // ALL STORIES
  // =========================

  const allStories = [
    ...(myStoryEntry
      ? [myStoryEntry]
      : []),
    ...otherStories,
  ];

  // =========================
  // RENDER
  // =========================

  return (
    <div className="stories-container">

      {canScrollLeft && (
        <button
          className="story-scroll-btn story-scroll-left"
          onClick={() =>
            scrollByAmount(-300)
          }
          title="Scroll left"
        >
          ‹
        </button>
      )}

      <div
        className="story-list"
        ref={scrollRef}
      >

        {/* =========================
            MY STORY
        ========================= */}

        <Story
          username={
            currentUser.username
          }
          avatar={currentUser.avatar}
          isMine={true}
          hasStory={
            myStories.length > 0
          }
          viewed={viewedIds.has(
            currentUser.id
          )}
          onClick={() => {
            if (myStories.length > 0) {
              setViewerIndex(0);
            } else {
              handleAddClick();
            }
          }}
          onAddClick={
            handleAddClick
          }
        />

        {/* =========================
            OTHER USERS
        ========================= */}

        {otherStories.map(
          (story, index) => (
            <Story
              key={story.id}
              username={story.username}
              avatar={story.avatar}
              viewed={viewedIds.has(
                story.id
              )}
              onClick={() => {
                setViewerIndex(
                  myStoryEntry
                    ? index + 1
                    : index
                );
              }}
            />
          )
        )}

      </div>

      {canScrollRight && (
        <button
          className="story-scroll-btn story-scroll-right"
          onClick={() =>
            scrollByAmount(300)
          }
          title="Scroll right"
        >
          ›
        </button>
      )}

      {/* =========================
          HIDDEN FILE INPUT
      ========================= */}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        style={{
          display: "none",
        }}
        onChange={
          handleFileSelected
        }
      />

      {/* =========================
          STORY VIEWER
      ========================= */}

      {viewerIndex !== null && (
        <StoryViewer
          stories={allStories}
          initialIndex={viewerIndex}
          onClose={() =>
            setViewerIndex(null)
          }
          onStoryViewed={
            handleStoryViewed
          }
        />
      )}

    </div>
  );
}

export default StoryList;