import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import App from "../App";

/**
 * System test mocks: all used mocks prefixed "mock" and in scope for jest.mock factories
 */
const mockLogin = jest.fn();
const mockSignup = jest.fn();
const mockLogout = jest.fn();
let mockAuthCallback = null;
const mockTestUser = { email: "sysuser@test.com" };

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

const mockEmit = jest.fn();
let mockSocketOnHandlers = {};
let mockSocketConnected = false;
const mockSocket = {
  connect: jest.fn(() => { mockSocketConnected = true; }),
  disconnect: jest.fn(() => { mockSocketConnected = false; }),
  emit: (...args) => mockEmit(...args),
  on: (e, h) => { mockSocketOnHandlers[e] = h; },
  off: (e) => { delete mockSocketOnHandlers[e]; },
  get connected() { return mockSocketConnected; }
};

jest.mock("../socket", () => ({
  socket: mockSocket
}));

describe("System/E2E: Complete user journey scenarios", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSocketConnected = false;
    mockSocketOnHandlers = {};
  });

  test("happy path: user registers, logs in, sends and receives, then logs out", async () => {
    render(<App />);
    mockSignup.mockResolvedValue({});
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "sysuser@test.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "strongpass" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "strongpass" } });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    expect(mockSignup).toHaveBeenCalledWith("sysuser@test.com", "strongpass");
    expect(screen.getByText("Login")).toBeInTheDocument();

    mockLogin.mockResolvedValue({});
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "sysuser@test.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "strongpass" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(mockLogin).toHaveBeenCalledWith("sysuser@test.com", "strongpass");
    await act(async () => { mockAuthCallback(mockTestUser); });
    expect(mockSocketConnected).toBe(true);
    expect(screen.getByText(/Welcome, sysuser@test.com/)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/type your message/i), { target: { value: "Hello system test!" } });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));
    expect(mockEmit).toHaveBeenCalledWith("chat_message", { email: mockTestUser.email, text: "Hello system test!" });
    expect(screen.getByText("Hello system test!")).toBeInTheDocument();

    act(() => {
      mockSocketOnHandlers["chat_message"] &&
        mockSocketOnHandlers["chat_message"]({ email: "attach@peer.com", text: "Hi sys!" });
    });
    expect(screen.getByText("Hi sys!")).toBeInTheDocument();
    expect(screen.getByText("attach@peer.com")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /logout/i }));
    await act(async () => { mockAuthCallback(null); });
    expect(mockLogout).toHaveBeenCalled();
    expect(mockSocketConnected).toBe(false);
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  test("shows error when messaging while socket not ready", async () => {
    render(<App />);
    await act(async () => { mockAuthCallback(mockTestUser); });
    mockSocketConnected = false;
    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: "Can't send?" } });
    expect(screen.getByRole("button", { name: /send/i })).toBeDisabled();
  });

  test("shows password mismatch error during registration", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "bob@e2e.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "abc" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "different" } });
    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /register/i })).toBeDisabled();
  });

  test("displays loading state when auth state is loading", () => {
    let internalCallback = null;
    jest.doMock("../firebase", () => ({
      ...jest.requireActual("../firebase"),
      subscribeToAuthChange: (cb) => {
        internalCallback = cb;
        return () => {};
      }
    }));
    render(<App />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    act(() => {
      internalCallback && internalCallback(null);
    });
  });

  test("shows auth/login and registration errors if provided", async () => {
    mockSignup.mockRejectedValueOnce(new Error("Failure: Already registered"));
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "err@sys.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "password" } });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    await act(async () => {});
    expect(screen.getByText(/already registered/i)).toBeInTheDocument();

    mockLogin.mockRejectedValueOnce(new Error("Failure: Bad login"));
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "err@sys.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "password" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    await act(async () => {});
    expect(screen.getByText(/bad login/i)).toBeInTheDocument();
  });
});
