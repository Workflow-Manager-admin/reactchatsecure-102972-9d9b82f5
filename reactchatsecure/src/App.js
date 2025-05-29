import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './components/AuthProvider';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import { signup, login, logout } from './firebase';
import { socket } from './socket';

function AppMain() {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState("login"); // or 'register'
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [messages, setMessages] = useState([]);
  const [socketReady, setSocketReady] = useState(false);

  // Auth handlers
  const handleLogin = async (email, password) => {
    setAuthLoading(true); setAuthError('');
    try {
      await login(email, password);
      setAuthMode("login");
    } catch (err) {
      setAuthError(err.message);
    }
    setAuthLoading(false);
  };

  const handleRegister = async (email, password) => {
    setAuthLoading(true); setAuthError('');
    try {
      await signup(email, password);
      setAuthMode("login");
    } catch (err) {
      setAuthError(err.message);
    }
    setAuthLoading(false);
  };

  // Socket.IO setup/cleanup
  useEffect(() => {
    if (!user) {
      if (socket.connected) socket.disconnect();
      setSocketReady(false);
      setMessages([]);
      return;
    }
    // User is authenticated: connect socket, set up events
    socket.connect();
    setSocketReady(true);

    socket.emit("join", { email: user.email });
    // Listen for new messages
    socket.on("chat_message", msg => setMessages((msgs) => [...msgs, msg]));
    // Optionally listen for initial history

    return () => {
      socket.off("chat_message");
      socket.disconnect();
      setSocketReady(false);
    };
  }, [user]);

  const handleSendMessage = useCallback((text) => {
    if (!user || !text.trim()) return;
    // Optimistically add
    setMessages(msgs => [...msgs, { email: user.email, text }]);
    socket.emit("chat_message", { email: user.email, text });
  }, [user]);

  // Render logic
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <div className="logo">
            <span className="logo-symbol">*</span> ReactChatSecure
          </div>
          {user &&
            <button className="btn" onClick={logout} style={{ marginLeft: 10 }}>Logout</button>
          }
        </div>
      </nav>
      <main>
        <div className="container">
          {!user && !loading && (
            <div className="auth-pane">
              <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: "16px" }}>
                <button
                  className={`btn${authMode === "login" ? " btn-large" : ""}`}
                  onClick={() => { setAuthMode("login"); setAuthError(""); }}
                  disabled={authMode === "login"}
                >
                  Login
                </button>
                <button
                  className={`btn${authMode === "register" ? " btn-large" : ""}`}
                  onClick={() => { setAuthMode("register"); setAuthError(""); }}
                  disabled={authMode === "register"}
                >
                  Register
                </button>
              </div>
              {authMode === "login" ?
                <LoginForm onLogin={handleLogin} error={authError} loading={authLoading} /> :
                <RegisterForm onRegister={handleRegister} error={authError} loading={authLoading} />}
            </div>
          )}
          {user && (
            <div className="chat-pane">
              <div className="subtitle">Welcome, {user.email}</div>
              <ChatWindow messages={messages} userEmail={user.email} />
              <ChatInput onSend={handleSendMessage} disabled={!socketReady} />
            </div>
          )}
          {loading && <div className="description">Loading...</div>}
        </div>
      </main>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  return (
    <AuthProvider>
      <AppMain />
    </AuthProvider>
  );
}

export default App;