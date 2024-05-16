import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Chat from "../src/app/chat/page";
import { useRouter } from "next/navigation";
import axios from "axios";

// Mocking useRouter hook
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

// Mocking axios
jest.mock("axios");

// Define the type for useRouter
interface Router {
    replace: jest.Mock<any, any>;
    back: jest.Mock<any, any>;
    forward: jest.Mock<any, any>;
    refresh: jest.Mock<any, any>;
    push: jest.Mock<any, any>;
    prefetch: jest.Mock<any, any>;
}

// Router (type of useRouter) needs to be mocked for usage
const mockUseRouter = useRouter as jest.Mock<Router>;

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
        const inputElement: HTMLElement = screen.getByPlaceholderText("Enter channel name");
        const buttonElement: HTMLElement = screen.getByRole("button", { name: "+ Add channel" });

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
        const inputElement: HTMLElement = screen.getByPlaceholderText("Type your message here...");
        const buttonElement: HTMLElement = screen.getByRole("button", { name: "Send" });

        expect(inputElement).toBeInTheDocument();
        expect(buttonElement).toBeInTheDocument();
    });

    it("creates a new channel", async () => {
        (axios.post as jest.Mock).mockResolvedValueOnce({ status: 201 });
        render(<Chat />);
        fireEvent.change(screen.getByPlaceholderText("Enter channel name"), { target: { value: "New Channel" } });
        fireEvent.click(screen.getByRole("button", { name: "+ Add channel" }));
    
        // Wait for the success banner to be displayed
        await waitFor(() => {
            console.log(screen.debug());
            expect(screen.getByText(/Success, the new channel .* succesfully saved/i)).toBeInTheDocument();
        });
    });

    it("handles error when creating a new channel fails", async () => {
        (axios.post as jest.Mock).mockRejectedValueOnce(new Error("Failed to create new channel"));
        render(<Chat />);
        fireEvent.change(screen.getByPlaceholderText("Enter channel name"), { target: { value: "New Channel" } });
        fireEvent.click(screen.getByRole("button", { name: "+ Add channel" }));
    
        // Wait for the error banner to be displayed
        await waitFor(() => {
            console.log(screen.debug());
            expect(screen.getByText(/Error in saving the new channel .*$/i)).toBeInTheDocument();
        });
    });

    it("sends a message to the selected channel", async () => {
        render(<Chat />);
        fireEvent.change(screen.getByPlaceholderText("Type your message here..."), { target: { value: "Hello, world!" } });
        fireEvent.click(screen.getByRole("button", { name: "Send" }));

        // Wait for the message to be displayed
        await waitFor(() => expect(screen.getByText("Hello, world!")).toBeInTheDocument());
    });

    it("handles error when sending a message fails", async () => {
        (axios.post as jest.Mock).mockRejectedValueOnce(new Error("Failed to send message"));
        render(<Chat />);
        fireEvent.change(screen.getByPlaceholderText("Type your message here..."), { target: { value: "Hello, world!" } });
        fireEvent.click(screen.getByRole("button", { name: "Send" }));
    
        // Wait for the error banner to be displayed
        await waitFor(() => {
            console.log(screen.debug());
            expect(screen.getByText(/Error in sending message: .*$/i)).toBeInTheDocument();
        });
    });
});
