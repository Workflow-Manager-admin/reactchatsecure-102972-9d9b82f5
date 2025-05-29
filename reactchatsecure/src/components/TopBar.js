import React from "react";

/**
 * TopBar displays the top horizontal bar in messenger mode.
 * Shows current user and logout.
 *
 * @param {object} props
 * - user: {email: string}
 * - onLogout: function
 */
 // PUBLIC_INTERFACE
export default function TopBar({ user, onLogout }) {
  return (
    <nav
      className="navbar"
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 110,
        background: "var(--primary-blue)",
        borderBottom: "1px solid var(--border-color)",
        boxShadow: "0 2px 12px 0 rgba(25,118,210,0.10)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          minHeight: 56,
          padding: "2px 0",
        }}
      >
        <div className="logo" style={{ color: "#fff", letterSpacing: ".01em", fontSize: "1.22rem" }}>
          <span className="logo-symbol" style={{ color: "var(--accent-green)", fontWeight: 800, fontSize: "1.28em" }}>✦</span>{" "}
          ReactChatSecure
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "11px", minWidth: 0 }}>
          <span style={{ color: "#fff", fontSize: "1.01rem", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", maxWidth: 140 }}>
            {user?.email}
          </span>
          <button
            className="btn"
            onClick={onLogout}
            style={{
              marginLeft: 8,
              padding: "9px 19px",
              background: "var(--accent-green)",
              color: "#fff",
              fontWeight: 600,
              border: "none",
              boxShadow: "0 1px 10px 0 rgba(67,160,71,0.10)",
              transition: "background 0.18s",
              fontSize: "1.02rem"
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
