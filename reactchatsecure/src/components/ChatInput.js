import React, { useState } from "react";

// PUBLIC_INTERFACE
export default function ChatInput({ onSend, disabled }) {
  /** Text input and send button for new chat messages */
  const [value, setValue] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  return (
    <form className="chat-input-row" onSubmit={handleSend}>
      <input
        className="chat-input"
        type="text"
        placeholder="Type your message..."
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={disabled}
        maxLength={200}
        autoFocus
        style={{
          border: "1.5px solid var(--primary-blue)",
          background: "#fff",
          color: "var(--primary-blue)",
          borderRadius: 8,
          padding: "13px 13px",
          fontSize: "1rem",
          fontWeight: 500,
          transition: "border 0.18s",
          outline: "none",
          flex: 1
        }}
      />
      <button
        className="btn"
        type="submit"
        style={{
          background: "var(--accent-green)",
          color: "#fff",
          fontWeight: 600,
          borderRadius: 8,
          padding: "0 28px",
          fontSize: "1.13rem",
          letterSpacing: ".01em",
          border: "none",
          boxShadow: "0 1px 8px 0 rgba(67,160,71,0.11)",
          transition: "background 0.17s",
          minHeight: 46,
          alignSelf: "stretch"
        }}
        disabled={disabled || !value.trim()}
      >
        Send
      </button>
    </form>
  );
}
