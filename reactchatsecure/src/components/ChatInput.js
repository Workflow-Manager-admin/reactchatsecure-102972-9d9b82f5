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
      />
      <button
        className="btn"
        type="submit"
        style={{
          background: "var(--primary-blue)",
          color: "#fff"
        }}
        disabled={disabled || !value.trim()}
      >
        Send
      </button>
    </form>
  );
}
