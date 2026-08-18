import { API_URL } from "../utils/constants";

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse(res) {
  // 204/empty-body responses (e.g. follow toggle) won't have JSON to parse
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error((data && data.error) || "Something went wrong");
  return data;
}

// GET /api/users/{username} -> profile + follower/following counts + isFollowing
export async function getUserProfile(username) {
  const res = await fetch(`${API_URL}/users/${username}`, {
    method: "GET",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// POST /api/users/{username}/follow -> toggles follow/unfollow, returns no body
export async function toggleFollow(username) {
  const res = await fetch(`${API_URL}/users/${username}/follow`, {
    method: "POST",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    throw new Error((data && data.error) || "Could not update follow status");
  }
  return true;
}

// PUT /api/users/me -> updates fullName/bio/profilePicUrl for the logged-in user
export async function updateProfile({ fullName, bio, profilePicUrl }) {
  const res = await fetch(`${API_URL}/users/me`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ fullName, bio, profilePicUrl }),
  });
  return handleResponse(res);
}

// GET /api/users/search?query=...
export async function searchUsers(query) {
  const res = await fetch(`${API_URL}/users/search?query=${encodeURIComponent(query)}`, {
    method: "GET",
    headers: authHeaders(),
  });
  return handleResponse(res);
}
// GET /api/users/{username}/followers -> list of users who follow this user
export async function getFollowers(username) {
  const res = await fetch(`${API_URL}/users/${username}/followers`, {
    method: "GET",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// GET /api/users/{username}/following -> list of users this user follows
export async function getFollowing(username) {
  const res = await fetch(`${API_URL}/users/${username}/following`, {
    method: "GET",
    headers: authHeaders(),
  });
  return handleResponse(res);
}