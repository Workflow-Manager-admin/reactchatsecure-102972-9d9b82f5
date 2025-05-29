import React, { useEffect, useRef } from "react";

// PUBLIC_INTERFACE
export default function ChatWindow({ messages, userEmail }) {
  /** Shows the list of messages and auto-scrolls to bottom */
  const bottomRef = useRef();

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-window">
      {messages.length === 0 && <div className="chat-placeholder">No messages yet. Start chatting!</div>}
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`message-row${msg.email === userEmail ? " own-message" : ""}`}
        >
          <span className="message-username">{msg.email}</span>
          <div className="message-text">{msg.text}</div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
