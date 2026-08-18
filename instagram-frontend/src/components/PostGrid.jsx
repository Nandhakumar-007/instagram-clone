import { useEffect, useState } from "react";
import { getUserPosts, deletePost } from "../Services/postService";
import { resolveMediaUrl } from "../utils/constants";
import { useAuth } from "../Services/AuthContext";

function PostGrid({ username }) {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;

    let cancelled = false;

    setLoading(true);

    getUserPosts(username)
      .then((data) => {
        if (!cancelled) {
          setPosts(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPosts([]);
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

  async function handleDelete(postId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) return;

    try {
      await deletePost(postId);

      setPosts((currentPosts) =>
        currentPosts.filter(
          (post) => post.id !== postId
        )
      );
    } catch (err) {
      alert(err.message || "Could not delete post");
    }
  }

  if (loading) {
    return <p>Loading posts...</p>;
  }

  if (posts.length === 0) {
    return <p>No posts yet.</p>;
  }

  return (
    <div className="post-grid">

      {posts.map((post) => {

        /*
         * Check whether this post belongs
         * to the currently logged-in user.
         */
        const isOwner =
          String(post.userId) === String(user?.id);

        return (
          <div
            className="post-item"
            key={post.id}
          >

            <img
              src={resolveMediaUrl(post.imageUrl)}
              alt={post.caption || "Post"}
            />

            {/* Show Delete only to post owner */}
            {isOwner && (
              <button
                className="delete-post-btn"
                onClick={() =>
                  handleDelete(post.id)
                }
              >
                Delete
              </button>
            )}

          </div>
        );
      })}

    </div>
  );
}

export default PostGrid;