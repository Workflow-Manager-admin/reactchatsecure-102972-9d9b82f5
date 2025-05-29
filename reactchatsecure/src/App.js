import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

/**
 * AppMain is the main functional container for the static Messenger UI demo.
 * It does not interact with any APIs or logic; everything is static/mock.
 */
function AppMain() {
  // Simulate logged-in or not for demo UI
  const [demoAuth, setDemoAuth] = useState(false); // false = auth screen, true = main messenger
  const [authMode, setAuthMode] = useState("login"); // or 'register'

  // Placeholder static data for messenger mode
  const demoSidebarChats = [
    { id: 1, name: 'Alice', lastMsg: 'See you!', unread: 2, active: false },
    { id: 2, name: 'Bob', lastMsg: 'Call me?', unread: 0, active: true },
    { id: 3, name: 'Team Channel', lastMsg: 'Project updates sent.', unread: 3, active: false },
  ];  
  const demoMessages = [
    { email: "bob@test.com", text: "Hi! How are you?" },
    { email: "demo@demo.com", text: "Fine, Bob! And you?" },
    { email: "bob@test.com", text: "Let's catch up tonight?" },
    { email: "demo@demo.com", text: "Sure, ping me after 8." }
  ];
  const demoUser = { email: "demo@demo.com" };

  // Switch between "login/register" and "messenger" view in static demo
  if (!demoAuth) {
    return (
      <div className="app">
        <nav className="navbar">
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> ReactChatSecure
            </div>
          </div>
        </nav>
        <main>
          <div className="container">
            <div className="auth-pane">
              <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: "16px" }}>
                <button
                  className={`btn${authMode === "login" ? " btn-large" : ""}`}
                  onClick={() => setAuthMode("login")}
                  disabled={authMode === "login"}
                >
                  Login
                </button>
                <button
                  className={`btn${authMode === "register" ? " btn-large" : ""}`}
                  onClick={() => setAuthMode("register")}
                  disabled={authMode === "register"}
                >
                  Register
                </button>
              </div>
              {authMode === "login" ? 
                <LoginForm onLogin={() => setDemoAuth(true)} error={""} loading={false} /> :
                <RegisterForm onRegister={() => setDemoAuth(true)} error={""} loading={false} />}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Messenger view: layout with Sidebar, TopBar, ChatWindow, ChatInput.
  return (
    <div className="app" style={{ minHeight: "100vh", background: "var(--kavia-dark)" }}>
      <TopBar user={demoUser} onLogout={() => setDemoAuth(false)} />
      <div style={{
        display: "flex",
        flexDirection: "row",
        marginTop: "60px",
        minHeight: "85vh",
        height: "calc(100vh - 60px)"
      }}>
        <Sidebar chats={demoSidebarChats} />
        <main style={{ flexGrow: 1, background: "#19191c", padding: 0, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "16px 0 0 0", flex: 1, display: "flex", flexDirection: "column" }}>
            <ChatWindow messages={demoMessages} userEmail={demoUser.email} />
            <ChatInput onSend={() => {}} disabled={false} />
          </div>
        </main>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  return <AppMain />;
}

export default App;