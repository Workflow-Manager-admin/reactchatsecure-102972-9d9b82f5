import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginForm from "../components/LoginForm";

describe("LoginForm component", () => {
  const setup = (props = {}) =>
    render(<LoginForm onLogin={jest.fn()} error="" loading={false} {...props} />);

  it("renders input fields and a submit button", () => {
    setup();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("disables submit button when loading is true", () => {
    render(<LoginForm onLogin={jest.fn()} error="" loading={true} />);
    expect(screen.getByRole("button", { name: /log/i })).toBeDisabled();
  });

  it("calls onLogin with email and password when form is submitted", () => {
    const onLogin = jest.fn();
    setup({ onLogin });
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "secret" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(onLogin).toHaveBeenCalledWith("test@example.com", "secret");
  });

  it("shows error when error prop is set", () => {
    render(<LoginForm onLogin={jest.fn()} error="Bad credentials" loading={false} />);
    expect(screen.getByText("Bad credentials")).toBeInTheDocument();
  });
});
