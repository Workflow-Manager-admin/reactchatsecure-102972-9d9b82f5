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
      {messages.map((msg, idx) => {
        const isOwn = msg.email === userEmail;
        // Avatar initials: use email name-part as fallback
        let initials = '';
        if (msg.name) {
          initials = msg.name
            .split(' ')
            .map(word => word[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();
        } else if (msg.email) {
          const emailPart = msg.email.split('@')[0];
          initials = emailPart[0] ? emailPart[0].toUpperCase() : "?";
        } else {
          initials = "?";
        }
        return (
          <div
            key={idx}
            className={`message-row${isOwn ? " own-message" : ""}`}
          >
            <div className="message-avatar">{initials}</div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: isOwn ? "flex-end" : "flex-start", maxWidth: "84vw" }}>
              <span
                className="message-username"
                style={{
                  color: isOwn ? "var(--primary-blue)" : "var(--accent-green)",
                  fontWeight: isOwn ? 700 : 600,
                  fontSize: "0.98rem",
                  marginBottom: 2,
                  letterSpacing: ".007em",
                  opacity: 0.95,
                  userSelect: "text",
                  overflowWrap: "break-word"
                }}
              >
                {msg.email}
              </span>
              <div className="message-text">{msg.text}</div>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
