import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Chat from "../app/chat/page";
import axios from "axios";
import { mockUseRouter } from "@webSrc/__mocks__/mockRouter";
import {
  mockAuthContextValue,
  mockBannerContextValue,
  renderWithProviders,
} from "@webSrc/__mocks__/mockContexts";

jest.mock("axios");
jest.mock("socket.io-client");

describe("Chat Functionality", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mocking the implementation of useRouter before each test
    mockUseRouter.mockImplementation(() => ({
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      push: jest.fn(),
      prefetch: jest.fn(),
    }));
  });

  it("renders new channel input and button", () => {
    renderWithProviders(<Chat />);
    const inputElement: HTMLElement =
      screen.getByPlaceholderText("Enter channel name");
    const buttonElement: HTMLElement = screen.getByRole("button", {
      name: "+ Add channel",
    });

    expect(inputElement).toBeInTheDocument();
    expect(buttonElement).toBeInTheDocument();
  });

  it("displays channels list", () => {
    renderWithProviders(<Chat />);
    const channelsElement: HTMLElement = screen.getByText("Channels");

    expect(channelsElement).toBeInTheDocument();
  });

  it("displays announcements container", () => {
    renderWithProviders(<Chat />);
    const announcementsElement: HTMLElement = screen.getByText("Announcements");

    expect(announcementsElement).toBeInTheDocument();
  });

  it("renders message input and send button", () => {
    renderWithProviders(<Chat />);
    const inputElement: HTMLElement = screen.getByPlaceholderText(
      "Type your message here..."
    );
    const buttonElement: HTMLElement = screen.getByRole("button", {
      name: "Send",
    });

    expect(inputElement).toBeInTheDocument();
    expect(buttonElement).toBeInTheDocument();
  });

  it("creates a new channel", async () => {
    (axios.post as jest.Mock).mockResolvedValueOnce({ status: 201 });
    renderWithProviders(<Chat />);
    fireEvent.change(screen.getByPlaceholderText("Enter channel name"), {
      target: { value: "New Channel" },
    });
    fireEvent.click(screen.getByRole("button", { name: "+ Add channel" }));

    // Ensure showBanner was called
    await waitFor(() => {
      expect(mockBannerContextValue.showBanner).toHaveBeenCalledWith(
        expect.stringMatching(
          /Success, the new channel .* successfully saved/i
        ),
        "success"
      );
    });
  });

  it("handles error when creating a new channel fails", async () => {
    (axios.post as jest.Mock).mockRejectedValue(
      new Error("Failed to create new channel")
    );

    renderWithProviders(<Chat />);
    fireEvent.change(screen.getByPlaceholderText("Enter channel name"), {
      target: { value: "New Channel" },
    });
    fireEvent.click(screen.getByRole("button", { name: "+ Add channel" }));

    // Wait for the error banner to be displayed
    await waitFor(() => {
      expect(mockBannerContextValue.showBanner).toHaveBeenCalledWith(
        expect.stringMatching(/Error in saving the new channel .*$/i),
        "error"
      );
    });
  });

  it("sends a message to the selected channel", async () => {
    renderWithProviders(<Chat />);
    fireEvent.change(screen.getByPlaceholderText("Type your message here..."), {
      target: { value: "Hello, world!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    // Wait for the message to be displayed
    await waitFor(() =>
      expect(screen.getByText("Hello, world!")).toBeInTheDocument()
    );
  });

  it("handles error when sending a message fails", async () => {
    renderWithProviders(<Chat />);
    fireEvent.change(screen.getByPlaceholderText("Type your message here..."), {
      target: { value: "Hello, world!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    // Find eventHandler for event name
    const eventHandler = mockAuthContextValue.auth.socket.on.mock.calls.find(
      (call: any) => call[0] === "message_failed"
    )?.[1];

    // If it exists, call event handler
    if (eventHandler) {
      eventHandler();
    }

    // Assert that error element appears on screen
    await waitFor(() => {
      const errorElement = screen.getByText(
        "Error occurred on server. Please try again!"
      );
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toBeVisible(); // Check if the element is visible
    });
  });
});
