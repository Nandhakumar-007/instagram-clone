import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadFile, createPost } from "../Services/postService";

function CreatePost() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [caption, setCaption] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  function handleImage(e) {
    const file = e.target.files[0];
    setImage(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!image) {
      setError("Please choose an image first");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const imageUrl = await uploadFile(image);
      await createPost(imageUrl, caption);
      navigate("/");
    } catch (err) {
      setError(err.message || "Could not create post");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="create-post">
      <h2>Create New Post</h2>

      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImage} />

        {previewUrl && (
          <img
            src={previewUrl}
            alt="preview"
            style={{ maxWidth: "100%", maxHeight: 300, objectFit: "cover", marginTop: 10 }}
          />
        )}

        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Sharing..." : "Share"}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;