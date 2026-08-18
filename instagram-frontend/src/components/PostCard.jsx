import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toggleLike } from "../Services/postService";
import { getComments, addComment } from "../Services/commentService";
import { resolveMediaUrl } from "../utils/constants";
import CommentList from "./CommentList";

function PostCard({ post }) {
  const [liked, setLiked] = useState(post.likedByCurrentUser);
  const [likes, setLikes] = useState(post.likeCount);

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (!showComments || commentsLoaded) return;
    getComments(post.id)
      .then((data) => {
        setComments(data);
        setCommentsLoaded(true);
      })
      .catch(() => setCommentsLoaded(true));
  }, [showComments, commentsLoaded, post.id]);

  async function handleLike() {
    // optimistic update
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikes((l) => l + (nextLiked ? 1 : -1));

    try {
      const updated = await toggleLike(post.id);
      setLiked(updated.likedByCurrentUser);
      setLikes(updated.likeCount);
    } catch (err) {
      // roll back on failure
      setLiked(!nextLiked);
      setLikes((l) => l - (nextLiked ? 1 : -1));
    }
  }

  async function handleAddComment() {
    if (comment.trim() === "" || posting) return;

    setPosting(true);
    try {
      const saved = await addComment(post.id, comment.trim());
      setComments((prev) => [...prev, saved]);
      setShowComments(true);
      setCommentsLoaded(true);
      setComment("");
    } catch (err) {
      alert(err.message || "Could not post comment");
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="post-card">
      <div className="post-header">
        <Link to={`/profile/${post.username}`}>
          <img
            src={resolveMediaUrl(post.userProfilePicUrl) || "https://i.pravatar.cc/150?u=" + post.username}
            alt={post.username}
          />
        </Link>
        <Link to={`/profile/${post.username}`}>
          <h4>{post.username}</h4>
        </Link>
      </div>

      <img className="post-image" src={resolveMediaUrl(post.imageUrl)} alt="post" />

      <div className="post-actions">
        <button onClick={handleLike}>
          {liked ? <i className="fa-solid fa-heart"></i> : <i className="fa-regular fa-heart"></i>}
        </button>

        <button onClick={() => setShowComments((s) => !s)}>
          <i className="fa-regular fa-comment"></i>
        </button>

        <button>
          <i className="fa-regular fa-paper-plane"></i>
        </button>
      </div>

      <p>{likes} likes</p>

      <p>
        <b>{post.username}</b> {post.caption}
      </p>

      {showComments && <CommentList comments={comments} />}

      <div className="comment-box">
        <input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
        />

        <button onClick={handleAddComment} disabled={posting}>
          Post
        </button>
      </div>
    </div>
  );
}

export default PostCard;