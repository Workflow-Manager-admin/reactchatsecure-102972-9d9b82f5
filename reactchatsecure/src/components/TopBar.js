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
    <nav className="navbar"
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 110,
        background: "var(--primary-blue)",
        borderBottom: "1px solid var(--border-color)"
      }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
      }}>
        <div className="logo">
          <span className="logo-symbol">✦</span> ReactChatSecure
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
              color: "#fff"
            }}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
