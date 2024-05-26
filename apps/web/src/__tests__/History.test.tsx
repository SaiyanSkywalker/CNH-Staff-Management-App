import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ShiftHistoryPage from "../app/shift-history/page"; // Import the ShiftHistoryPage component
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
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
const mockUseRouter = useRouter as unknown as jest.Mock<Router>;
const mockUseSearchParams = useSearchParams as unknown as jest.Mock<any>;

// Mocking getAccessToken directly
const mockGetAccessToken = jest.fn().mockReturnValue("fake_token");

describe("Shift History Page", () => {
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

    // Mocking the implementation of useSearchParams before each test
    mockUseSearchParams.mockImplementation(() => ({
      get: jest.fn().mockReturnValue(null),
    }));
  });

  it("loads Shift History", async () => {
    // Mocking successful response for shift history fetch
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: [] });

    render(<ShiftHistoryPage />);

    // Wait for shift history to be loaded
    await waitFor(() => {
      // Assert that the Shift History page is rendered
      expect(screen.getByText("Shift History")).toBeInTheDocument();
      // Assert that axios.get is called once to fetch the data
      expect(axios.get).toHaveBeenCalledTimes(1);
    });
  });

  it("filters Shift History", async () => {
    // Mocking successful response for shift history fetch
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: [] });

    render(<ShiftHistoryPage />);

    // Implement filter interactions and verify filtered results
    fireEvent.change(screen.getByPlaceholderText("Employee ID"), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Employee Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Unit"), {
      target: { value: "Unit A" },
    });
    fireEvent.change(screen.getByPlaceholderText("Requested Date"), {
      target: { value: "2024-05-27" },
    });
    fireEvent.change(screen.getByPlaceholderText("Shift Date"), {
      target: { value: "2024-05-28" },
    });
    fireEvent.change(screen.getByPlaceholderText("Shift"), {
      target: { value: "07:00 - 11:00" },
    });
    fireEvent.change(screen.getByPlaceholderText("Status"), {
      target: { value: "Accepted" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    // Verify filtered results
    await waitFor(() => {
      // Assert that the Shift History page is rendered
      expect(screen.getByText("Shift History")).toBeInTheDocument();
      // Assert that axios.get is called twice, once for initial load and once for filtering
      expect(axios.get).toHaveBeenCalledTimes(2);
    });
  });

  it("accepts Shifts", async () => {
    // Mocking successful response for shift acceptance
    (axios.put as jest.Mock).mockResolvedValueOnce({ status: 200 });

    render(<ShiftHistoryPage />);

    // Implement interactions to accept a shift and verify the UI update
    fireEvent.click(screen.getByRole("button", { name: "Accept" }));

    // Wait for the success message to be displayed
    await waitFor(() => {
      // Assert that the success message is displayed
      expect(
        screen.getByText("Shift accepted successfully")
      ).toBeInTheDocument();
      // Assert that axios.put is called once to accept the shift
      expect(axios.put).toHaveBeenCalledTimes(1);
    });
  });

  it("rejects Shifts", async () => {
    // Mocking successful response for shift rejection
    (axios.put as jest.Mock).mockResolvedValueOnce({ status: 200 });

    render(<ShiftHistoryPage />);

    // Implement interactions to reject a shift and verify the UI update
    fireEvent.click(screen.getByRole("button", { name: "Reject" }));

    // Wait for the success message to be displayed
    await waitFor(() => {
      // Assert that the success message is displayed
      expect(
        screen.getByText("Shift rejected successfully")
      ).toBeInTheDocument();
      // Assert that axios.put is called once to reject the shift
      expect(axios.put).toHaveBeenCalledTimes(1);
    });
  });

  it("handles Shift History fetch failure", async () => {
    // Mocking failed response for shift history fetch
    (axios.get as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to fetch shift history")
    );

    render(<ShiftHistoryPage />);

    // Wait for error handling to be displayed
    await waitFor(() => {
      // Assert that the error message is displayed
      expect(
        screen.getByText("Failed to fetch shift history")
      ).toBeInTheDocument();
      // Assert that axios.get is called once to fetch the data
      expect(axios.get).toHaveBeenCalledTimes(1);
    });
  });

  it("handles Shift Acceptance or Denial failure", async () => {
    // Mocking failed response for shift acceptance or denial
    (axios.put as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to accept/reject shift")
    );

    render(<ShiftHistoryPage />);

    // Implement interactions to accept/reject a shift and verify error handling
    fireEvent.click(screen.getByRole("button", { name: "Accept" }));

    // Wait for the error message to be displayed
    await waitFor(() => {
      // Assert that the error message for shift acceptance failure is displayed
      expect(
        screen.getByText("Failed to accept/reject shift")
      ).toBeInTheDocument();
      // Assert that axios.put is called once to accept the shift
      expect(axios.put).toHaveBeenCalledTimes(1);
    });
  });
});
