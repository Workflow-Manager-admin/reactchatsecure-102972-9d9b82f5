import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';

// PUBLIC_INTERFACE
function App() {
  // Responsive sidebar toggle state (mobile)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Static demo data for Messenger UI only (authentication logic removed!)
  // -- Realistic contacts
  const demoSidebarChats = [
    {
      id: 1,
      name: 'Sarah Lee',
      lastMsg: "Haha, you always know how to make me laugh 😂",
      unread: 0,
      active: false
    },
    {
      id: 2,
      name: 'Michael Carter',
      lastMsg: "Let me know when you’re free to call.",
      unread: 2,
      active: true
    },
    {
      id: 3,
      name: "Priya Menon",
      lastMsg: "Stepped out for coffee, back in 10!",
      unread: 1,
      active: false
    },
    {
      id: 4,
      name: "Alex Kim",
      lastMsg: "Sent you the doc, check your email.",
      unread: 0,
      active: false
    },
    {
      id: 5,
      name: "Family Group",
      lastMsg: "Dinner’s at 7pm, don’t be late!",
      unread: 3,
      active: false
    }
  ];
  // -- Realistic chat: conversation with Michael Carter
  const demoMessages = [
    { email: "michael.carter@workmail.com", text: "Hey, did you finish the project outline yet?" },
    { email: "sarah.lee@personalmail.com", text: "Almost! Adding a few more details, want me to share the doc?" },
    { email: "michael.carter@workmail.com", text: "Please, that would help. I need to send an update to Anna." },
    { email: "sarah.lee@personalmail.com", text: "Just shared it with you. Let me know if I missed anything!" },
    { email: "michael.carter@workmail.com", text: "Looks good! Let’s schedule a quick call later today?" },
    { email: "sarah.lee@personalmail.com", text: "Sure, free after 4pm. Ping me then 👍" },
    { email: "michael.carter@workmail.com", text: "Will do, thanks Sarah!" }
  ];
  const demoUser = { email: "sarah.lee@personalmail.com" };

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
        className="messenger-flex-row"
        style={{
          display: "flex",
          flexDirection: "row",
          marginTop: "60px",
          minHeight: "85vh",
          height: "calc(100vh - 60px)",
          background: "var(--neutral-bg)",
          alignItems: "stretch"
        }}
      >
        <div className="sidebar-pane">
          <Sidebar chats={demoSidebarChats} />
        </div>
        <main
          className="app-main-content"
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
              minHeight: 0,
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
