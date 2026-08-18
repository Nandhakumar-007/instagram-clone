import React, { useEffect, useState } from "react";

import Messageinput from "./Messageinput";

import {
  getMessages,
  sendMessage,
} from "../Services/messageService";

import {
  resolveMediaUrl,
} from "../utils/constants";

export default function Chatwindow({
  conversation,
  currentUser,
  onBack,
}) {

  const [messages, setMessages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);


  useEffect(() => {

    if (!conversation) {

      setMessages([]);

      return;
    }


    async function loadMessages() {

      try {

        setLoading(true);

        const data =
          await getMessages(
            conversation.id
          );

        setMessages(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }
    }


    loadMessages();

  }, [conversation]);


  async function handleSend(text) {

    if (!conversation) return;

    try {

      const saved =
        await sendMessage(
          conversation.id,
          text
        );

      setMessages((prev) => [
        ...prev,
        saved,
      ]);

    } catch (error) {

      console.error(error);

    }
  }


  if (!conversation) {

    return (
      <div className="empty-chat">
        <h2>Your Messages</h2>
        <p>
          Select someone to start chatting.
        </p>
      </div>
    );

  }


  return (

    <div className="chat-window">

      {/* Header */}

      <div className="chat-header">

        <button
          className="chat-back"
          onClick={onBack}
        >
          ←
        </button>

        <img
          src={
            resolveMediaUrl(
              conversation.user.profilePicUrl
            ) ||
            `https://i.pravatar.cc/100?u=${conversation.user.username}`
          }
          alt={conversation.user.username}
        />

        <strong>
          {conversation.user.username}
        </strong>

      </div>


      {/* Messages */}

      <div className="chat-messages">

        {loading && (
          <p>Loading...</p>
        )}


        {!loading &&
          messages.map((message) => (

            <div
              key={message.id}
              className={`message ${message.senderId === currentUser?.id
                  ? "message-own"
                  : "message-other"
                }`}
            >

              {message.type === "TEXT" && (

                <div className="message-bubble">
                  {message.content}
                </div>

              )}


              {message.type === "IMAGE" && (

                <img
                  className="message-image"
                  src={message.imageUrl}
                  alt="Shared"
                />

              )}


              {message.type === "POST" && (

                <div className="shared-content">

                  <div>
                    Shared Post
                  </div>

                  <strong>
                    Post #{message.sharedPostId}
                  </strong>

                </div>

              )}


              {message.type === "REEL" && (

                <div className="shared-content">

                  <div>
                    Shared Reel
                  </div>

                  <strong>
                    Reel #{message.sharedReelId}
                  </strong>

                </div>

              )}

            </div>

          ))}

      </div>


      {/* Input */}

      <Messageinput
        onSend={handleSend}
      />

    </div>

  );
}