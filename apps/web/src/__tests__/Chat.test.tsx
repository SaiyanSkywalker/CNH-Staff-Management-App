import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Chat from "../app/chat/page";
import axios from "axios";
import { mockUseRouter } from "@webSrc/__mocks__/mockRouter";
import {
  MockAuthContextProvider,
  MockBannerContextProvider,
  MockLoadingContextProvider,
  mockAuthContextValue,
  mockBannerContextValue,
  mockLoadingContextValue,
} from "@webSrc/__mocks__/mockContexts";
import { ReactNode } from "react";
import { io } from "socket.io-client";

// Mocking axios
jest.mock("axios");
jest.mock("socket.io-client", () => {
  const mockSocket = {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  };
  return {
    io: jest.fn(() => mockSocket),
  };
});

const renderWithProviders = (component: ReactNode) => {
  return render(
    <MockAuthContextProvider>
      <MockBannerContextProvider>
        <MockLoadingContextProvider>{component}</MockLoadingContextProvider>
      </MockBannerContextProvider>
    </MockAuthContextProvider>
  );
};

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

  // TODO: Need to figure out a way to mock handling events emitted by server on client

  // it("handles error when sending a message fails", async () => {
  //   (axios.post as jest.Mock).mockRejectedValue(
  //     new Error("Failed to send message")
  //   );
  //   renderWithProviders(<Chat />);
  //   fireEvent.change(screen.getByPlaceholderText("Type your message here..."), {
  //     target: { value: "Hello, world!" },
  //   });
  //   fireEvent.click(screen.getByRole("button", { name: "Send" }));
  //   const socket = mockAuthContextValue.auth.socket;
  //   if (socket) {
  //     socket.emit("message_failed", {});
  //     await waitFor(() => {
  //       console.log(screen.debug());
  //       const errorElement = screen.getByText(
  //         "Error occurred on server. Please try again!"
  //       );
  //       expect(errorElement).toBeInTheDocument();
  //       expect(errorElement).toBeVisible(); // Check if the element is visible
  //     });
  //   }
  // });
});
