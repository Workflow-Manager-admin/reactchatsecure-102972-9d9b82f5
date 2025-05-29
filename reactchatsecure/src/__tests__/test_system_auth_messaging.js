import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import App from "../App";

// --- Mocks ---
const loginMock = jest.fn();
const signupMock = jest.fn();
const logoutMock = jest.fn();
let authCallback = null;
const testUser = { email: "sysuser@test.com" };

jest.mock("../firebase", () => ({
  login: (...args) => loginMock(...args),
  signup: (...args) => signupMock(...args),
  logout: () => logoutMock(),
  subscribeToAuthChange: (cb) => {
    authCallback = cb;
    cb(null);
    return () => {};
  }
}));

const emitMock = jest.fn();
let socketOnHandlers = {};
let socketConnected = false;
const fakeSocket = {
  connect: jest.fn(() => { socketConnected = true; }),
  disconnect: jest.fn(() => { socketConnected = false; }),
  emit: (...args) => emitMock(...args),
  on: (e, h) => { socketOnHandlers[e] = h; },
  off: (e) => { delete socketOnHandlers[e]; },
  get connected() { return socketConnected; }
};

jest.mock("../socket", () => ({
  socket: fakeSocket
}));

describe("System/E2E: Complete user journey scenarios", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    socketConnected = false;
    socketOnHandlers = {};
  });

  test("happy path: user registers, logs in, sends and receives, then logs out", async () => {
    // Full user journey
    render(<App />);
    // Registration
    signupMock.mockResolvedValue({});
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "sysuser@test.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "strongpass" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "strongpass" } });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    expect(signupMock).toHaveBeenCalledWith("sysuser@test.com", "strongpass");
    // Should switch to Login view
    expect(screen.getByText("Login")).toBeInTheDocument();

    // Login
    loginMock.mockResolvedValue({});
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "sysuser@test.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "strongpass" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(loginMock).toHaveBeenCalledWith("sysuser@test.com", "strongpass");
    // Auth callback for login
    await act(async () => { authCallback(testUser); });
    expect(socketConnected).toBe(true);
    expect(screen.getByText(/Welcome, sysuser@test.com/)).toBeInTheDocument();

    // Send a chat message
    fireEvent.change(screen.getByPlaceholderText(/type your message/i), { target: { value: "Hello system test!" } });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));
    expect(emitMock).toHaveBeenCalledWith("chat_message", { email: testUser.email, text: "Hello system test!" });
    expect(screen.getByText("Hello system test!")).toBeInTheDocument();

    // Receive a message from another user (simulate socket event)
    act(() => {
      socketOnHandlers["chat_message"] &&
        socketOnHandlers["chat_message"]({ email: "attach@peer.com", text: "Hi sys!" });
    });
    expect(screen.getByText("Hi sys!")).toBeInTheDocument();
    expect(screen.getByText("attach@peer.com")).toBeInTheDocument();

    // Logout
    fireEvent.click(screen.getByRole("button", { name: /logout/i }));
    await act(async () => { authCallback(null); });
    expect(logoutMock).toHaveBeenCalled();
    expect(socketConnected).toBe(false);
    // Should see login
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("shows error when messaging while socket not ready", async () => {
    render(<App />);
    await act(async () => { authCallback(testUser); });
    // Simulate the socket never connected
    socketConnected = false;
    // Try sending a message (button will be disabled)
    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: "Can't send?" } });
    // Button is disabled if socketReady false
    expect(screen.getByRole("button", { name: /send/i })).toBeDisabled();
  });

  test("shows password mismatch error during registration", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "bob@e2e.com" }});
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "abc" }});
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "different" }});
    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /register/i })).toBeDisabled();
  });

  test("displays loading state when auth state is loading", () => {
    // Simulate the loading state by calling subscribeToAuthChange and not invoking callback yet
    let internalCallback = null;
    jest.doMock("../firebase", () => ({
      ...jest.requireActual("../firebase"),
      subscribeToAuthChange: (cb) => {
        internalCallback = cb;
        // Don't call callback yet (loading)
        return () => {};
      }
    }));
    render(<App />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    // Now complete loading
    act(() => {
      internalCallback && internalCallback(null);
    });
  });

  test("shows auth/login and registration errors if provided", async () => {
    // Registration error
    signupMock.mockRejectedValueOnce(new Error("Failure: Already registered"));
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "err@sys.com" }});
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password" }});
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "password" }});
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    await act(async () => {});
    expect(screen.getByText(/already registered/i)).toBeInTheDocument();

    // Login error
    loginMock.mockRejectedValueOnce(new Error("Failure: Bad login"));
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "err@sys.com" }});
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "password" }});
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    await act(async () => {});
    expect(screen.getByText(/bad login/i)).toBeInTheDocument();
  });
});
