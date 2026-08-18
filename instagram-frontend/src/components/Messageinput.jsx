import React, {
  useState,
  useRef,
} from "react";

export default function Messageinput({
  onSend,
}) {

  const [text, setText] =
    useState("");

  const handleSend = () => {

    const trimmed =
      text.trim();

    if (!trimmed) return;

    onSend(trimmed);

    setText("");
  };


  const handleKeyDown = (e) => {

    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {

      e.preventDefault();

      handleSend();
    }
  };


  return (
    <div className="message-input-wrap">

      <div className="message-input-bar">

        <input
          type="text"
          placeholder="Message..."
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
          onKeyDown={handleKeyDown}
        />

        <button
          className="send-btn"
          onClick={handleSend}
        >
          Send
        </button>

      </div>

    </div>
  );
}