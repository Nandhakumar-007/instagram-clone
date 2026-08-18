import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ConversationList from "./Conversationlist";
import Chatwindow from "./Chatwindow";
import NewMessageModal from "./NewMessageModal";

import { getConversations, openConversation } from "../Services/messageService";
import { useAuth } from "../Services/AuthContext";

export default function Messages() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNewMessage, setShowNewMessage] = useState(false);

  const handleSelectUser = useCallback(async function handleSelectUser(username) {
    const conversation = await openConversation(username);

    setConversations((prev) => {
      const exists = prev.some((c) => c.id === conversation.id);
      if (exists) return prev;
      return [conversation, ...prev];
    });

    setActiveId(conversation.id);
    setShowNewMessage(false);

    return conversation;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadConversations() {
      try {
        setLoading(true);
        const data = await getConversations();
        if (cancelled) return;

        setConversations(data);

        if (data.length > 0 && !searchParams.get("user")) {
          setActiveId(data[0].id);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadConversations();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const targetUsername = searchParams.get("user");
    if (!targetUsername) return;

    let cancelled = false;

    handleSelectUser(targetUsername)
      .catch((error) => {
        console.error(error);
        alert(error.message || "Could not open that conversation");
      })
      .finally(() => {
        if (cancelled) return;
        const next = new URLSearchParams(searchParams);
        next.delete("user");
        setSearchParams(next, { replace: true });
      });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get("user")]);

  const activeConversation = conversations.find((c) => c.id === activeId) || null;

  if (loading) {
    return <div className="messages-page">Loading messages...</div>;
  }

  return (
    <div className="messages-page">
      <div className="conv-panel">
        <ConversationList
          conversations={conversations}
          activeId={activeId}
          onSelect={setActiveId}
          onNewMessage={() => setShowNewMessage(true)}
        />
      </div>

      <div className="chat-panel">
        <Chatwindow
          conversation={activeConversation}
          currentUser={user}
          onBack={() => setActiveId(null)}
        />
      </div>

      {showNewMessage && (
        <NewMessageModal
          onClose={() => setShowNewMessage(false)}
          onSelectUser={handleSelectUser}
        />
      )}
    </div>
  );
}