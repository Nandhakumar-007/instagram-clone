import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { getFeed } from "../Services/postService";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getFeed()
      .then(setPosts)
      .catch((err) => setError(err.message || "Could not load feed"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="feed">Loading feed...</div>;
  if (error) return <div className="feed">{error}</div>;
  if (posts.length === 0) return <div className="feed">No posts yet. Follow people or create your first post!</div>;

  return (
    <div className="feed">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default Feed;