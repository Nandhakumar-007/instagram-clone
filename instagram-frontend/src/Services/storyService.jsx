import { API_URL } from "../utils/constants";

const BASE_URL = `${API_URL}/stories`;

function getToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken")
  );
}

async function handleResponse(response) {
  let data = {};

  try {
    data = await response.json();
  } catch (error) {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        data.error ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
}

// =========================
// GET STORIES
// =========================

export async function getStories() {
  const token = getToken();

  const response = await fetch(
    BASE_URL,
    {
      method: "GET",
      headers: {
        "Content-Type":
          "application/json",

        ...(token && {
          Authorization:
            `Bearer ${token}`,
        }),
      },
    }
  );

  return handleResponse(response);
}

// =========================
// CREATE STORY
// =========================

export async function createStory(
  mediaUrl
) {
  const token = getToken();

  const response = await fetch(
    `${BASE_URL}?mediaUrl=${encodeURIComponent(
      mediaUrl
    )}`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        ...(token && {
          Authorization:
            `Bearer ${token}`,
        }),
      },
    }
  );

  return handleResponse(response);
}