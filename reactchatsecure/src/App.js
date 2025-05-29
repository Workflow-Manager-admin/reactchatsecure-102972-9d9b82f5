import React from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';

// PUBLIC_INTERFACE
function App() {
  // Static demo data for Messenger UI only (authentication logic removed!)
  // -- Realistic contacts
  const demoSidebarChats = [
    { id: 1, name: 'Sophia Martinez', lastMsg: 'Wait, when is your flight again?', unread: 1, active: false },
    { id: 2, name: 'Liam Patel', lastMsg: "Don't forget the slides! 😎", unread: 0, active: true },
    { id: 3, name: 'Emma Zhang', lastMsg: 'On my way, see you soon!', unread: 2, active: false },
    { id: 4, name: 'Work Group', lastMsg: 'Design review at 2pm. Join if you can.', unread: 3, active: false }
  ];
  // -- Realistic chat
  const demoMessages = [
    { email: "liam.patel@email.com", text: "Hey! Ready for our meeting this afternoon?" },
    { email: "sophie.martinez@mydomain.com", text: "I think so. Did you get my notes?" },
    { email: "liam.patel@email.com", text: "Yes, super helpful! By the way, bring the prototype?" },
    { email: "sophie.martinez@mydomain.com", text: "Already packed it in my bag 😁" },
    { email: "liam.patel@email.com", text: "Perfect. See you at 2. Want coffee first?" },
    { email: "sophie.martinez@mydomain.com", text: "Always! ☕ Meet at Roasted Bean lobby?" },
    { email: "liam.patel@email.com", text: "Absolutely, see you there in 30!" }
  ];
  const demoUser = { email: "sophie.martinez@mydomain.com" };

  // Render Messenger only (no Login/Register or auth logic)
  return (
    <div
      className="app"
      style={{
        minHeight: "100vh",
        background: "var(--neutral-bg)",
        color: "var(--text-color)",
      }}
    >
      <TopBar user={demoUser} onLogout={() => {}} />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginTop: "60px",
          minHeight: "85vh",
          height: "calc(100vh - 60px)",
          background: "var(--neutral-bg)",
        }}
      >
        <Sidebar chats={demoSidebarChats} />
        <main
          style={{
            flexGrow: 1,
            background: "var(--neutral-bg)",
            padding: 0,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "16px 0 0 0",
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <ChatWindow messages={demoMessages} userEmail={demoUser.email} />
            <ChatInput onSend={() => {}} disabled={false} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
