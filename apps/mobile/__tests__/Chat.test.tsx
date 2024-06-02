import ChatPage from "../app/chat";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

jest.mock("axios");
jest.mock("socket.io-client");
jest.mock("../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

describe("Chat", () => {
  const mockAuth = {
    auth: {
      user: {
        id: 1,
        username: "testuser",
        unitId: "123",
      },
      socket: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    },
  };

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue(mockAuth);
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByText } = render(<ChatPage />);
    const textElement = getByText("Channel");
    expect(textElement).toBeTruthy();
  });

  it("allows the user to select a channel", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [{ name: "General", id: "1" }],
    });

    const { getByText, getByTestId } = render(<ChatPage />);
    fireEvent.press(getByTestId("channelDropdown"));

    await waitFor(() => {
      const generalChannel = getByText("General");
      expect(generalChannel).toBeTruthy();
      fireEvent.press(generalChannel);
    });

    await waitFor(() => {
      const selectedChannel = getByText("General");
      expect(selectedChannel).toBeTruthy();
    });
  });

  it("displays messages in the selected channel", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [{ name: "General", id: "1" }],
    });
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [
        {
          body: "Hello, world!",
          sender: { username: "testuser" },
          createdAt: new Date().toISOString(),
        },
      ],
    });

    const { getByText, getByTestId } = render(<ChatPage />);
    fireEvent.press(getByTestId("channelDropdown"));

    await waitFor(() => {
      const generalChannel = getByText("General");
      fireEvent.press(generalChannel);
    });

    await waitFor(() => {
      const messageElement = getByText("Hello, world!");
      expect(messageElement).toBeTruthy();
    });
  });
});
