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
        }}
      >
        <div className="logo" style={{ color: "#fff", letterSpacing: ".01em" }}>
          <span className="logo-symbol" style={{ color: "var(--accent-green)", fontWeight: 800, fontSize: "1.25em" }}>✦</span>{" "}
          ReactChatSecure
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
          <span style={{ color: "#fff", fontSize: "1.01rem", fontWeight: 500 }}>
            {user?.email}
          </span>
          <button
            className="btn"
            onClick={onLogout}
            style={{
              marginLeft: 8,
              padding: "7px 18px",
              background: "var(--accent-green)",
              color: "#fff",
              fontWeight: 600,
              border: "none",
              boxShadow: "0 1px 10px 0 rgba(67,160,71,0.10)",
              transition: "background 0.18s",
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
