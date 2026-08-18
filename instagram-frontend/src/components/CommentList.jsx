import { formatDate } from "../utils/formatDate";

function CommentList({ comments }) {
  if (!comments || comments.length === 0) return null;

  return (
    <div className="comment-list">
      {comments.map((c) => (
        <p key={c.id}>
          <b>{c.username}</b> {c.text}{" "}
          <span className="comment-time">{formatDate(c.createdAt)}</span>
        </p>
      ))}
    </div>
  );
}

export default CommentList;