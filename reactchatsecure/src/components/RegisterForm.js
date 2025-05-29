import React, { useState } from "react";

// PUBLIC_INTERFACE
export default function RegisterForm({ onRegister, error, loading }) {
  /** Registration form UI for new users */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (password !== confirm) return;
    if (email && password) onRegister(email, password);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2 className="subtitle">Register</h2>
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
        minLength={6}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <input
        className="auth-input"
        type="password"
        placeholder="Confirm Password"
        value={confirm}
        minLength={6}
        onChange={e => setConfirm(e.target.value)}
        required
      />
      {password && confirm && password !== confirm && <div className="auth-error">Passwords do not match</div>}
      {error && <div className="auth-error">{error}</div>}
      <button className="btn btn-large" type="submit" disabled={loading || password !== confirm}>
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
