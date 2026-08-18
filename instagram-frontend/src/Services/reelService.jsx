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

// NOTE: this assumes your Spring backend exposes /api/reels the same way
// it exposes /api/posts. If your controller uses different paths, just
// update the URLs below to match your actual endpoints.

export async function createReel(videoUrl, caption) {
  const res = await fetch(`${API_URL}/reels`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ videoUrl, caption }),
  });
  return handleResponse(res);
}

export async function getReelsFeed() {
  const res = await fetch(`${API_URL}/reels/feed`, {
    method: "GET",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function getUserReels(username) {
  const res = await fetch(`${API_URL}/reels/user/${username}`, {
    method: "GET",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function toggleReelLike(reelId) {
  const res = await fetch(`${API_URL}/reels/${reelId}/like`, {
    method: "POST",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function deleteReel(reelId) {
  const res = await fetch(`${API_URL}/reels/${reelId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse(res);
}