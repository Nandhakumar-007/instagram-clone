import { API_URL } from "../utils/constants";

function authHeaders(json = true) {
  const token = localStorage.getItem("token");
  return {
    ...(json ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse(res) {
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error((data && data.error) || "Something went wrong");
  return data;
}

// POST /api/files/upload -> { url: "/uploads/xyz.jpg" }
// Backend serves that url as http://localhost:8080/uploads/xyz.jpg
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/files/upload`, {
    method: "POST",
    headers: authHeaders(false), // don't set Content-Type, browser sets multipart boundary
    body: formData,
  });
  const data = await handleResponse(res);
  return data.url; // relative path e.g. "/uploads/xyz.jpg"
}

// POST /api/posts { imageUrl, caption }
export async function createPost(imageUrl, caption) {
  const res = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ imageUrl, caption }),
  });
  return handleResponse(res);
}

// GET /api/posts/feed
export async function getFeed() {
  const res = await fetch(`${API_URL}/posts/feed`, {
    method: "GET",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// GET /api/posts/user/{username}
export async function getUserPosts(username) {
  const res = await fetch(`${API_URL}/posts/user/${username}`, {
    method: "GET",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// POST /api/posts/{postId}/like -> returns updated PostResponse
export async function toggleLike(postId) {
  const res = await fetch(`${API_URL}/posts/${postId}/like`, {
    method: "POST",
    headers: authHeaders(),
  });
  return handleResponse(res);
}
// DELETE /api/posts/{postId}
export async function deletePost(postId) {
  const res = await fetch(`${API_URL}/posts/${postId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  return handleResponse(res);
}