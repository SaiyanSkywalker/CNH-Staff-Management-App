import ChatPage from "../app/chat";
import { render } from "@testing-library/react-native";

jest.mock("axios");
jest.mock("socket.io-client");

describe("Chat", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("renders correctly", () => {
    const { getByText } = render(<ChatPage />);
    const textElement = getByText("Channel");
    expect(textElement).toBeTruthy();
  });
});
