import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import App from "../App";

// Socket.io-client mock (all mock variables prefixed and in scope)
const mockEmit = jest.fn();
let mockSocketOnHandlers = {};
let mockSocketConnected = false;
const mockSocketObj = {
  connect: jest.fn(() => { mockSocketConnected = true; }),
  disconnect: jest.fn(() => { mockSocketConnected = false; }),
  emit: (...args) => mockEmit(...args),
  on: (event, handler) => { mockSocketOnHandlers[event] = handler; },
  off: (event) => { delete mockSocketOnHandlers[event]; },
  get connected() { return mockSocketConnected; }
};

/**
 * Integration test mocks must not use out-of-scope variables in jest.mock factories.
 * All mocks start with 'mock' prefix and are declared above each jest.mock.
 */

// Firebase authentication mocks (variables in scope for jest.mock)
const mockLogin = jest.fn();
const mockSignup = jest.fn();
const mockLogout = jest.fn();
let mockAuthCallback = null;
// Current user for authentication simulation
const mockUser = { email: "user@example.com" };

jest.mock("../firebase", () => ({
  login: (...args) => mockLogin(...args),
  signup: (...args) => mockSignup(...args),
  logout: () => mockLogout(),
  subscribeToAuthChange: (cb) => {
    mockAuthCallback = cb;
    cb(null);
    return () => {};
  }
}));

jest.mock("../socket", () => ({
  socket: mockSocketObj
}));

describe("Integration: Auth and Messaging Flows", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSocketConnected = false;
    mockSocketOnHandlers = {};
  });

  test("user can login (success path), and socket connects with UI update", async () => {
    mockLogin.mockResolvedValue({});
    render(<App />);
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.queryByText(/Welcome,/)).toBeNull();

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "user@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "pass123" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));    
    expect(mockLogin).toHaveBeenCalledWith("user@example.com", "pass123");

    await act(async () => {
      mockAuthCallback(mockUser);
    });

    expect(mockSocketObj.connect).toHaveBeenCalled();
    expect(screen.getByText(/Welcome, user@example.com/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument();
  });

  test("user can logout and socket disconnects and UI returns to login", async () => {
    mockLogin.mockResolvedValue({});
    render(<App />);
    await act(async () => { mockAuthCallback(mockUser); });

    expect(screen.getByText(/Welcome, user@example.com/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /logout/i }));
    expect(mockLogout).toHaveBeenCalled();

    await act(async () => { mockAuthCallback(null); });
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(mockSocketObj.disconnect).toHaveBeenCalled();
    expect(mockSocketConnected).toBe(false);
  });

  test("user registration triggers Firebase signup and returns to login tab", async () => {
    mockSignup.mockResolvedValue({});
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "reg@sample.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "abc12345" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "abc12345" } });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    expect(mockSignup).toHaveBeenCalledWith("reg@sample.com", "abc12345");
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("user can send a message and it is optimistically added to chat window", async () => {
    render(<App />);
    await act(async () => { mockAuthCallback(mockUser); });
    expect(screen.getByText(/No messages yet/i)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/type your message/i), { target: { value: "Hi there integration!" } });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));
    expect(mockEmit).toHaveBeenCalledWith("chat_message", { email: "user@example.com", text: "Hi there integration!" });
    expect(screen.getByText("Hi there integration!")).toBeInTheDocument();
    expect(screen.getByText("user@example.com")).toBeInTheDocument();
  });

  test("receiving a chat_message event appends message in chat window", async () => {
    render(<App />);
    await act(async () => { mockAuthCallback(mockUser); });
    act(() => {
      mockSocketOnHandlers["chat_message"] &&
        mockSocketOnHandlers["chat_message"]({ email: "other@peer.com", text: "Hey! 👋" });
    });
    expect(screen.getByText("Hey! 👋")).toBeInTheDocument();
    expect(screen.getByText("other@peer.com")).toBeInTheDocument();
  });

  test("failed login displays error message", async () => {
    mockLogin.mockRejectedValueOnce(new Error("Invalid credentials!"));
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "fail@err.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "badpasswd" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    await act(async () => {});
    expect(mockLogin).toHaveBeenCalled();
    expect(screen.getByText("Invalid credentials!")).toBeInTheDocument();
  });

  test("failed registration displays error", async () => {
    mockSignup.mockRejectedValueOnce(new Error("Email exists!"));
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "fail2@err.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "matchmatch" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "matchmatch" } });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    await act(async () => {});
    expect(mockSignup).toHaveBeenCalled();
    expect(screen.getByText("Email exists!")).toBeInTheDocument();
  });
});
