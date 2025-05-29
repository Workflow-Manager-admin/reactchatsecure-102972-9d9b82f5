import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RegisterForm from "../components/RegisterForm";

describe("RegisterForm component", () => {
  const setup = (props = {}) =>
    render(
      <RegisterForm onRegister={jest.fn()} error="" loading={false} {...props} />
    );

  it("renders email, password, and confirm inputs", () => {
    setup();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText(/password/i)).toHaveLength(2);
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
  });

  it("disables submit if passwords do not match", () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "onepass" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "otherpass" } });
    expect(screen.getByRole("button", { name: /register/i })).toBeDisabled();
    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it("calls onRegister if form is valid and passwords match", () => {
    const onRegister = jest.fn();
    setup({ onRegister });
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "register@x.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "mypassword" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "mypassword" } });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    expect(onRegister).toHaveBeenCalledWith("register@x.com", "mypassword");
  });

  it("shows error from error prop", () => {
    render(
      <RegisterForm onRegister={jest.fn()} error="Already exists" loading={false} />
    );
    expect(screen.getByText("Already exists")).toBeInTheDocument();
  });

  it("disables button and shows registering text when loading", () => {
    render(
      <RegisterForm onRegister={jest.fn()} error="" loading={true} />
    );
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    expect(btn.textContent.toLowerCase()).toContain("registering");
  });
});
