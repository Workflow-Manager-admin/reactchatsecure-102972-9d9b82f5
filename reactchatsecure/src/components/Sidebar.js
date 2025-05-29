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
    <aside
      style={{
        width: 256,
        background: "var(--sidebar-bg)",
        borderRight: "1px solid var(--border-color)",
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 60px)",
      }}
    >
      <div
        style={{
          padding: "18px 20px 13px 22px",
          borderBottom: "1px solid var(--border-color)",
          fontWeight: 700,
          color: "#fff",
          fontSize: "1.09rem",
          letterSpacing: 0.01,
          background: "var(--primary-blue)",
        }}
      >
        Chats
      </div>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          background: "var(--sidebar-bg)",
        }}
      >
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`sidebar-chat-row${chat.active ? " active" : ""}`}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              padding: "12px 20px",
              background: chat.active
                ? "var(--sidebar-active)"
                : "var(--sidebar-bg)",
              borderLeft: chat.active
                ? "4px solid var(--accent-green)"
                : "4px solid transparent",
              cursor: "pointer",
              color: chat.active ? "#fff" : "var(--text-secondary)",
              transition: "background 0.10s, border 0.10s, color 0.13s",
              boxShadow: chat.active
                ? "0 2px 10px 0 rgba(67, 160, 71, 0.10)"
                : undefined,
            }}
          >
            <span
              style={{
                fontWeight: chat.active ? 700 : 500,
                fontSize: "1.16rem",
                color: chat.active
                  ? "var(--accent-green)"
                  : "var(--primary-blue)",
                letterSpacing: 0.01,
                marginBottom: 2,
              }}
            >
              {chat.name}
            </span>
            <span
              style={{
                color: "var(--text-secondary)",
                fontSize: "1rem",
                marginBottom: chat.unread ? 1 : 0,
              }}
            >
              {chat.lastMsg}
            </span>
            {chat.unread > 0 && (
              <span
                className="sidebar-badge"
                style={{
                  background: "var(--accent-green)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  marginTop: 4,
                  alignSelf: "flex-end",
                  padding: "2px 11px",
                  borderRadius: "1em",
                  letterSpacing: "0.04em",
                  boxShadow: "0 2px 8px 0 rgba(67, 160, 71, 0.08)",
                }}
              >
                {chat.unread}
              </span>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
