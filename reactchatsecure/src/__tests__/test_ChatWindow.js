import React from "react";
import { render, screen } from "@testing-library/react";
import ChatWindow from "../components/ChatWindow";

describe("ChatWindow component", () => {
  it("shows 'No messages yet' placeholder when messages are empty", () => {
    render(<ChatWindow messages={[]} userEmail="u@test.com" />);
    expect(screen.getByText(/no messages yet/i)).toBeInTheDocument();
  });

  it("renders each message with email and text", () => {
    const msgs = [
      { email: "a@example.com", text: "First!" },
      { email: "b@example.com", text: "Hey!" },
    ];
    render(<ChatWindow messages={msgs} userEmail="tester@x.com" />);
    expect(screen.getByText("a@example.com")).toBeInTheDocument();
    expect(screen.getByText("b@example.com")).toBeInTheDocument();
    expect(screen.getByText("First!")).toBeInTheDocument();
    expect(screen.getByText("Hey!")).toBeInTheDocument();
  });

  it("applies 'own-message' class for user's messages", () => {
    const msgs = [{ email: "me@test.com", text: "mine" }, { email: "notme@", text: "not mine" }];
    const { container } = render(<ChatWindow messages={msgs} userEmail="me@test.com" />);
    const userRows = container.querySelectorAll(".message-row.own-message");
    expect(userRows).toHaveLength(1);
    expect(userRows[0].textContent).toContain("mine");
  });
});
