import React from "react";

/**
 * Sidebar component: shows the list of chats/conversations as vertical sidebar.
 * Uses placeholder data only. No real logic.
 *
 * @param {Array} chats - Array of chat objects {id, name, lastMsg, unread, active}
 */
 // PUBLIC_INTERFACE
export default function Sidebar({ chats }) {
  return (
    <aside style={{
      width: 256,
      background: "var(--sidebar-bg)",
      borderRight: "1px solid var(--border-color)",
      display: "flex",
      flexDirection: "column",
      height: "calc(100vh - 60px)"
    }}>
      <div style={{
        padding: "18px 20px 13px 22px",
        borderBottom: "1px solid var(--border-color)",
        fontWeight: 700,
        color: "#fff",
        fontSize: "1.09rem",
        letterSpacing: 0.01,
        background: "var(--primary-blue)"
      }}>
        Chats
      </div>
      <div style={{ flex: 1, overflowY: "auto", background: "var(--sidebar-bg)" }}>
        {chats.map(chat => (
          <div
            key={chat.id}
            className={`sidebar-chat-row${chat.active ? " active" : ""}`}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              padding: "12px 20px",
              background: chat.active ? "var(--sidebar-active)" : "var(--sidebar-bg)",
              borderLeft: chat.active ? '4px solid var(--accent-green)' : '4px solid transparent',
              cursor: "pointer",
              color: chat.active ? "#fff" : "#d7e3ed"
            }}
          >
            <span style={{
              fontWeight: chat.active ? 700 : 500,
              fontSize: "1.16rem",
              color: chat.active ? "var(--accent-green)" : "#fff"
            }}>{chat.name}</span>
            <span style={{
              color: "#bed6f5",
              fontSize: "1rem"
            }}>{chat.lastMsg}</span>
            {chat.unread > 0 && (
              <span className="sidebar-badge">{chat.unread}</span>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
