import { API_URL } from "../utils/constants";

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse(res) {
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error((data && data.error) || "Something went wrong");
  return data;
}

// GET /api/posts/{postId}/comments
export async function getComments(postId) {
  const res = await fetch(`${API_URL}/posts/${postId}/comments`, {
    method: "GET",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// POST /api/posts/{postId}/comments { text }
export async function addComment(postId, text) {
  const res = await fetch(`${API_URL}/posts/${postId}/comments`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ text }),
  });
  return handleResponse(res);
}