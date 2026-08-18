import React from "react";
import { resolveMediaUrl } from "../utils/constants";

export default function ConversationList({ conversations, activeId, onSelect, onNewMessage }) {
  return (
    <div className="conversation-list">
      <div className="conversation-title">
        <span>Messages</span>
        <button type="button" className="new-message-btn" onClick={onNewMessage} title="New message">
          ✎
        </button>
      </div>

      <button type="button" className="new-message-cta" onClick={onNewMessage}>
        + New Message
      </button>

      {conversations.length === 0 && (
        <div className="empty-conversations">
          No conversations yet. Tap "New Message" above to message someone you follow or who follows you.
        </div>
      )}

      {conversations.map((conversation) => {
        const person = conversation.user;
        if (!person) return null;

        return (
          <div
            key={conversation.id}
            className={`conversation-item ${activeId === conversation.id ? "active" : ""}`}
            onClick={() => onSelect(conversation.id)}
          >
            <img
              src={resolveMediaUrl(person.profilePicUrl) || `https://i.pravatar.cc/100?u=${person.username}`}
              alt={person.username}
            />
            <div className="conversation-info">
              <strong>{person.username}</strong>
              {conversation.lastMessage && <span>{conversation.lastMessage}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}