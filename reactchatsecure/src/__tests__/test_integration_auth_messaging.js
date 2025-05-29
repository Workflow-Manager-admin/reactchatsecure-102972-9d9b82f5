import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import App from "../App";

// Mock Firebase authentication utilities
const loginMock = jest.fn();
const signupMock = jest.fn();
const logoutMock = jest.fn();
let authCallback = null;

// Mocked current user (simulate login/logout state)
const mockUser = { email: "user@example.com" };

jest.mock("../firebase", () => ({
  login: (...args) => loginMock(...args),
  signup: (...args) => signupMock(...args),
  logout: () => logoutMock(),
  // Simulate subscribeToAuthChange hooks (calls callback with user or null)
  subscribeToAuthChange: (cb) => {
    authCallback = cb;
    // Allow tests to trigger login/logout via callback
    // Call initial state: NOT logged in by default
    cb(null);
    return () => {};
  }
}));

// Socket.IO mock with event listener/call interception
const emitMock = jest.fn();
let socketOnHandlers = {};
let socketConnected = false;

const socketMock = {
  connect: jest.fn(() => { socketConnected = true; }),
  disconnect: jest.fn(() => { socketConnected = false; }),
  emit: (...args) => emitMock(...args),
  on: (event, handler) => { socketOnHandlers[event] = handler; },
  off: (event) => { delete socketOnHandlers[event]; },
  get connected() { return socketConnected; }
};

jest.mock("../socket", () => ({
  socket: socketMock
}));

describe("Integration: Auth and Messaging Flows", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset global socket mock state
    socketConnected = false;
    socketOnHandlers = {};
  });

  test("user can login (success path), and socket connects with UI update", async () => {
    // Mock login call: resolves without error
    loginMock.mockResolvedValue({});
    render(<App />);
    
    // Initially, should see auth pane but not chat
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.queryByText(/Welcome,/)).toBeNull();

    // Fill email and password
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "user@example.com" }});
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "pass123" }});
    // Click login
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(loginMock).toHaveBeenCalledWith("user@example.com", "pass123");

    // Simulate Firebase auth callback: now logged in
    await act(async () => {
      authCallback(mockUser);
    });

    // UI should update to chat pane, socket.connect called
    expect(socketMock.connect).toHaveBeenCalled();
    expect(screen.getByText(/Welcome, user@example.com/)).toBeInTheDocument();
    // Should see input box for messages
    expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument();
  });

  test("user can logout and socket disconnects and UI returns to login", async () => {
    // Start logged-in (simulate successful login as before)
    loginMock.mockResolvedValue({});
    render(<App />);
    // Log in
    await act(async () => { authCallback(mockUser); });

    expect(screen.getByText(/Welcome, user@example.com/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /logout/i }));
    expect(logoutMock).toHaveBeenCalled();
    // Now trigger logout at auth provider (simulate Firebase out)
    await act(async () => { authCallback(null); });
    // Should go back to the login screen
    expect(screen.getByText("Login")).toBeInTheDocument();
    // Socket disconnect should be called
    expect(socketMock.disconnect).toHaveBeenCalled();
    expect(socketConnected).toBe(false);
  });

  test("user registration triggers Firebase signup and returns to login tab", async () => {
    signupMock.mockResolvedValue({});
    render(<App />);
    // Switch to register mode
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    // Fill out registration
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "reg@sample.com" }});
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "abc12345" }});
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "abc12345" }});
    // Click register
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    expect(signupMock).toHaveBeenCalledWith("reg@sample.com", "abc12345");
    // Simulate registration success: UI should flip back to login
    // (simulate hook put user to login tab, not auth)
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("user can send a message and it is optimistically added to chat window", async () => {
    // Start in authenticated state
    render(<App />);
    await act(async () => { authCallback(mockUser); });
    // There should be no messages yet
    expect(screen.getByText(/No messages yet/i)).toBeInTheDocument();

    // Type a message and send
    fireEvent.change(screen.getByPlaceholderText(/type your message/i), { target: { value: "Hi there integration!" }});
    fireEvent.click(screen.getByRole("button", { name: /send/i }));
    // Should emit socket event and optimistically add to window
    expect(emitMock).toHaveBeenCalledWith("chat_message", { email: "user@example.com", text: "Hi there integration!" });
    expect(screen.getByText("Hi there integration!")).toBeInTheDocument();
    // (username shown as well)
    expect(screen.getByText("user@example.com")).toBeInTheDocument();
  });

  test("receiving a chat_message event appends message in chat window", async () => {
    // Authenticated state
    render(<App />);
    await act(async () => { authCallback(mockUser); });
    // Simulate receiving a network message from another user
    act(() => {
      // The App useEffect subscribes to socket.on('chat_message', ...)
      socketOnHandlers["chat_message"] &&
        socketOnHandlers["chat_message"]({ email: "other@peer.com", text: "Hey! 👋" });
    });
    expect(screen.getByText("Hey! 👋")).toBeInTheDocument();
    expect(screen.getByText("other@peer.com")).toBeInTheDocument();
  });

  test("failed login displays error message", async () => {
    loginMock.mockRejectedValueOnce(new Error("Invalid credentials!"));
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "fail@err.com" }});
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "badpasswd" }});
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    // Wait for login and error prop to propagate
    await act(async () => {});
    expect(loginMock).toHaveBeenCalled();
    // Error message should show
    expect(screen.getByText("Invalid credentials!")).toBeInTheDocument();
  });

  test("failed registration displays error", async () => {
    signupMock.mockRejectedValueOnce(new Error("Email exists!"));
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "fail2@err.com" }});
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "matchmatch" }});
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "matchmatch" }});
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    await act(async () => {});
    expect(signupMock).toHaveBeenCalled();
    expect(screen.getByText("Email exists!")).toBeInTheDocument();
  });
});
