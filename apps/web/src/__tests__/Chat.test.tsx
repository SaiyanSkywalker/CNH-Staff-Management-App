import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Chat from "../app/chat/page";
import axios from "axios";
import { mockUseRouter } from "@webSrc/__mocks__/mockRouter";

// Mocking axios
jest.mock("axios");

// Mocking getAccessToken directly
const mockGetAccessToken = jest.fn().mockReturnValue("fake_token");

describe("Chat Functionality", () => {
  beforeEach(() => {
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
    render(<Chat />);
    const inputElement: HTMLElement =
      screen.getByPlaceholderText("Enter channel name");
    const buttonElement: HTMLElement = screen.getByRole("button", {
      name: "+ Add channel",
    });

    expect(inputElement).toBeInTheDocument();
    expect(buttonElement).toBeInTheDocument();
  });

  it("displays channels list", () => {
    render(<Chat />);
    const channelsElement: HTMLElement = screen.getByText("Channels");

    expect(channelsElement).toBeInTheDocument();
  });

  it("displays announcements container", () => {
    render(<Chat />);
    const announcementsElement: HTMLElement = screen.getByText("Announcements");

    expect(announcementsElement).toBeInTheDocument();
  });

  it("renders message input and send button", () => {
    render(<Chat />);
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
    render(<Chat />);
    fireEvent.change(screen.getByPlaceholderText("Enter channel name"), {
      target: { value: "New Channel" },
    });
    fireEvent.click(screen.getByRole("button", { name: "+ Add channel" }));

    // Wait for the success banner to be displayed
    await waitFor(() => {
      console.log(screen.debug());
      expect(
        screen.getByText(/Success, the new channel .* succesfully saved/i)
      ).toBeInTheDocument();
    });
  });

  it("handles error when creating a new channel fails", async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to create new channel")
    );
    render(<Chat />);
    fireEvent.change(screen.getByPlaceholderText("Enter channel name"), {
      target: { value: "New Channel" },
    });
    fireEvent.click(screen.getByRole("button", { name: "+ Add channel" }));

    // Wait for the error banner to be displayed
    await waitFor(() => {
    //   console.log(screen.debug());
      expect(
        screen.getByText(/Error in saving the new channel .*$/i)
      ).toBeInTheDocument();
    });
  });

  it("sends a message to the selected channel", async () => {
    render(<Chat />);
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
    (axios.post as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to send message")
    );
    render(<Chat />);
    fireEvent.change(screen.getByPlaceholderText("Type your message here..."), {
      target: { value: "Hello, world!" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    // Wait for the error banner to be displayed
    await waitFor(() => {
    //   console.log(screen.debug());
      expect(
        screen.getByText(/Error in sending message: .*$/i)
      ).toBeInTheDocument();
    });
  });
});
