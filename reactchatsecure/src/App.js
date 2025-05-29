import React from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';

// PUBLIC_INTERFACE
function App() {
  // Static demo data for Messenger UI only (authentication logic removed!)
  const demoSidebarChats = [
    { id: 1, name: 'Alice', lastMsg: 'See you!', unread: 2, active: false },
    { id: 2, name: 'Bob', lastMsg: 'Call me?', unread: 0, active: true },
    { id: 3, name: 'Team Channel', lastMsg: 'Project updates sent.', unread: 3, active: false }
  ];
  const demoMessages = [
    { email: "bob@test.com", text: "Hi! How are you?" },
    { email: "demo@demo.com", text: "Fine, Bob! And you?" },
    { email: "bob@test.com", text: "Let's catch up tonight?" },
    { email: "demo@demo.com", text: "Sure, ping me after 8." }
  ];
  const demoUser = { email: "demo@demo.com" };

  // Render Messenger only (no Login/Register or auth logic)
  return (
    <div className="app" style={{ minHeight: "100vh", background: "var(--kavia-dark)" }}>
      <TopBar user={demoUser} onLogout={() => {}} />
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

export default App;
