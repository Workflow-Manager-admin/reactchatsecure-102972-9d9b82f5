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
      width: 250, background: "#202124", borderRight: "1px solid var(--border-color)",
      display: "flex", flexDirection: "column", height: "calc(100vh - 60px)"
    }}>
      <div style={{
        padding: "16px 18px 12px 18px", borderBottom: "1px solid var(--border-color)",
        fontWeight: 600, color: "var(--kavia-orange)", fontSize: "1.06rem"
      }}>
        Chats
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {chats.map(chat => (
          <div
            key={chat.id}
            className={`sidebar-chat-row${chat.active ? " active" : ""}`}
            style={{
              display: "flex", flexDirection: "column", gap:1,
              padding: "12px 20px",
              background: chat.active ? "#24243e" : "none",
              borderLeft: chat.active ? '4px solid var(--kavia-orange)': '4px solid transparent',
              cursor: "pointer"
            }}
          >
            <span style={{
              fontWeight: 500,
              fontSize: "1.12rem",
              color: chat.active ? "var(--kavia-orange)" : "#fff"
            }}>{chat.name}</span>
            <span style={{
              color: "#bbb",
              fontSize: "0.99rem"
            }}>{chat.lastMsg}</span>
            {chat.unread > 0 && (
              <span style={{
                alignSelf: "flex-end",
                background: "var(--kavia-orange)",
                color: "#fff", fontSize: "0.8rem", borderRadius: "1em",
                padding: "2px 9px", marginTop:2, marginRight:0
              }}>{chat.unread}</span>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
