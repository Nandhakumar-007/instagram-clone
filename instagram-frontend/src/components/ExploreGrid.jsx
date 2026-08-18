import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFeed } from "../Services/postService";
import { resolveMediaUrl } from "../utils/constants";

function ExploreGrid() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeed()
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="explore-grid">Loading...</div>;
  if (posts.length === 0) return <div className="explore-grid">No posts to explore yet.</div>;

  return (
    <div className="explore-grid">
      {posts.map((post) => (
        <Link to={`/profile/${post.username}`} key={post.id}>
          <img src={resolveMediaUrl(post.imageUrl)} alt="explore post" />
        </Link>
      ))}
    </div>
  );
}

export default ExploreGrid;