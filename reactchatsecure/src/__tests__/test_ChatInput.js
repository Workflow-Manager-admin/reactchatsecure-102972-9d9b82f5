import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ChatInput from "../components/ChatInput";

describe("ChatInput component", () => {
  it("renders input and submit button", () => {
    render(<ChatInput onSend={jest.fn()} disabled={false} />);
    expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });

  it("disables send button if input is empty or only whitespace", () => {
    render(<ChatInput onSend={jest.fn()} disabled={false} />);
    expect(screen.getByRole("button", { name: /send/i })).toBeDisabled();
    fireEvent.change(screen.getByPlaceholderText(/type your message/i), { target: { value: "    " } });
    expect(screen.getByRole("button", { name: /send/i })).toBeDisabled();
  });

  it("calls onSend and resets field on valid submit", () => {
    const onSend = jest.fn();
    render(<ChatInput onSend={onSend} disabled={false} />);
    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: "Hello world!" } });
    fireEvent.click(screen.getByRole("button", { name: /send/i }));
    expect(onSend).toHaveBeenCalledWith("Hello world!");
    expect(input.value).toBe("");
  });

  it("disables input and button if disabled prop is true", () => {
    render(<ChatInput onSend={jest.fn()} disabled={true} />);
    expect(screen.getByPlaceholderText(/type your message/i)).toBeDisabled();
    expect(screen.getByRole("button", { name: /send/i })).toBeDisabled();
  });
});
