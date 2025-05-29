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
        {chats.map((chat) => {
          // Avatar initials logic
          const initials =
            chat.name
              ?.split(' ')
              .map(p => (p && p[0]) ? p[0].toUpperCase() : '')
              .slice(0, 2)
              .join('') || 'U';
          return (
            <div
              key={chat.id}
              className={`sidebar-chat-row${chat.active ? " active" : ""}`}
              style={{
                background: chat.active
                  ? "var(--sidebar-active)"
                  : "var(--sidebar-bg)",
                borderLeft: chat.active
                  ? "4px solid var(--accent-green)"
                  : "4px solid transparent",
                color: chat.active ? "#fff" : "var(--text-secondary)",
                transition: "background 0.10s, border 0.10s, color 0.13s",
                boxShadow: chat.active
                  ? "0 2px 10px 0 rgba(67, 160, 71, 0.10)"
                  : undefined,
                cursor: "pointer",
                padding: "0px 14px",
              }}
            >
              <div className="sidebar-avatar">{initials}</div>
              <div className="sidebar-info">
                <span
                  style={{
                    fontWeight: chat.active ? 700 : 500,
                    fontSize: "1.13rem",
                    color: chat.active
                      ? "var(--accent-green)"
                      : "var(--primary-blue)",
                    letterSpacing: 0.01
                  }}
                >
                  {chat.name}
                </span>
                <span
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.98rem",
                    opacity: .96,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: 164,
                  }}
                >
                  {chat.lastMsg}
                </span>
                {chat.unread > 0 && (
                  <span className="sidebar-badge">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
