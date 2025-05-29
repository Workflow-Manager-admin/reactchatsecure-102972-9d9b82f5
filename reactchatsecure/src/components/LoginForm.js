import React, { useState } from "react";

// PUBLIC_INTERFACE
export default function LoginForm({ onLogin, error, loading }) {
  /** Login form UI for user authentication */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (email && password) onLogin(email, password);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2 className="subtitle">Login</h2>
      <input
        className="auth-input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        autoFocus
        required
      />
      <input
        className="auth-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      {error && <div className="auth-error">{error}</div>}
      <button className="btn btn-large" type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
