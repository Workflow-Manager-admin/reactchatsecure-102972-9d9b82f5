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
      {messages.length === 0 && (
        <div
          className="chat-placeholder"
          style={{
            color: "var(--text-secondary)",
            textAlign: "center",
            marginTop: 60,
            fontSize: "1.12rem",
            letterSpacing: ".01em",
          }}
        >
          No messages yet. Start chatting!
        </div>
      )}
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`message-row${msg.email === userEmail ? " own-message" : ""}`}
        >
          <span
            className="message-username"
            style={{
              color:
                msg.email === userEmail
                  ? "var(--primary-blue)"
                  : "var(--accent-green)",
              fontWeight: msg.email === userEmail ? 700 : 600,
              fontSize: "1.01rem",
              marginBottom: 0,
              letterSpacing: ".007em",
            }}
          >
            {msg.email}
          </span>
          <div className="message-text">{msg.text}</div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
