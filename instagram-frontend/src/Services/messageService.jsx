import { API_URL } from "../utils/constants";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication token not found");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}


// ============================================
// GET ALL CONVERSATIONS
// ============================================

export async function getConversations() {
  const response = await fetch(
    `${API_URL}/messages/conversations`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to load conversations");
  }

  return response.json();
}


// ============================================
// OPEN / CREATE CONVERSATION
// ============================================

export async function openConversation(username) {
  const response = await fetch(
    `${API_URL}/messages/conversations/user/${encodeURIComponent(username)}`,
    {
      method: "POST",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to open conversation");
  }

  return response.json();
}


// ============================================
// GET MESSAGES
// ============================================

export async function getMessages(conversationId) {
  const response = await fetch(
    `${API_URL}/messages/conversations/${conversationId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to load messages");
  }

  return response.json();
}


// ============================================
// SEND TEXT MESSAGE
// ============================================

export async function sendMessage(conversationId, content) {
  if (!content || !content.trim()) {
    throw new Error("Message cannot be empty");
  }

  const response = await fetch(
    `${API_URL}/messages/conversations/${conversationId}`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        content: content.trim(),
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to send message");
  }

  return response.json();
}


// ============================================
// SHARE POST
// ============================================

export async function sharePost(conversationId, postId) {
  const response = await fetch(
    `${API_URL}/messages/conversations/${conversationId}/share-post/${postId}`,
    {
      method: "POST",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to share post");
  }

  return response.json();
}


// ============================================
// SHARE REEL
// ============================================

export async function shareReel(conversationId, reelId) {
  const response = await fetch(
    `${API_URL}/messages/conversations/${conversationId}/share-reel/${reelId}`,
    {
      method: "POST",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to share reel");
  }

  return response.json();
}