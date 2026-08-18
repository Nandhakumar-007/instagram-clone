// https://your-backend.onrender.com
// Locally, it falls back to your Spring Boot dev server.
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
export const API_URL = `${BASE_URL}/api`;

// Backend returns relative paths like "/uploads/xyz.jpg" for uploaded files.
// This turns them into a full URL the browser can load.
export function resolveMediaUrl(path) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${BASE_URL}${path}`;
}