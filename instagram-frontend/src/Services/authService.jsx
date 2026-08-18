import { API_URL } from "../utils/constants";

const BASE_URL = `${API_URL}/auth`;

async function handleResponse(res) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
}

export async function loginUser(usernameOrEmail, password) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usernameOrEmail, password }),
  });
  return handleResponse(res);
}

export async function registerUser(username, email, password, fullName) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, fullName }),
  });
  return handleResponse(res);
}