import "@testing-library/jest-dom";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import ShiftHistoryPage from "@webSrc/app/shift-history/page";
import axios from "axios";
import {
  mockAuthContextValue,
  mockBannerContextValue,
  renderWithProviders,
} from "@webSrc/__mocks__/mockContexts";
import { mockUseRouter } from "@webSrc/__mocks__/mockRouter";

jest.mock("axios");
jest.mock("socket.io-client");

describe("Shift History Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseRouter.mockImplementation(() => ({
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      push: jest.fn(),
      prefetch: jest.fn(),
    }));
  });

  it("loads Shift History", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: [] });

    renderWithProviders(<ShiftHistoryPage />);

    await waitFor(() => {
      expect(screen.getByText("History")).toBeInTheDocument();
      expect(axios.get).toHaveBeenCalledTimes(1);
    });
  });

  it("filters Shift History", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: [] });

    renderWithProviders(<ShiftHistoryPage />);

    fireEvent.change(screen.getByLabelText("Employee ID"), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() => {
      expect(screen.getByText("History")).toBeInTheDocument();
      expect(axios.get).toHaveBeenCalledTimes(2);
    });
  });

  it("accepts Shifts", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [
        {
          id: 70,
          employeeId: 50392,
          employeeName: "John Doe",
          unit: "HKU",
          dateRequested: "04/30/2024",
          status: "Pending",
          shift: "15:00 - 23:00",
          createdAt: "2024-04-30T14:15:03.950Z",
        },
      ],
    });
    renderWithProviders(<ShiftHistoryPage />);

    // Attempt to accept a shift
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Accept" })
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Accept" }));

    // Assert that proper socket event was emitted
    await waitFor(() => {
      expect(mockAuthContextValue.auth.socket.emit).toHaveBeenCalledWith(
        "shift_accept",
        {
          shiftHistoryId: 70,
          isAccepted: true,
        }
      );
    });
  });

  it("rejects Shifts", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: [
        {
          id: 70,
          employeeId: 50392,
          employeeName: "John Doe",
          unit: "HKU",
          dateRequested: "04/30/2024",
          status: "Pending",
          shift: "15:00 - 23:00",
          createdAt: "2024-04-30T14:15:03.950Z",
        },
      ],
    });

    renderWithProviders(<ShiftHistoryPage />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Deny" })).toBeInTheDocument();
    });

    // Attempt to reject a shift
    fireEvent.click(screen.getByRole("button", { name: "Deny" }));

    // Assert that correct socket event is emitted
    await waitFor(() => {
      expect(mockAuthContextValue.auth.socket.emit).toHaveBeenCalledWith(
        "shift_accept",
        {
          shiftHistoryId: 70,
          isAccepted: false,
        }
      );
    });
  });

  it("handles Shift History fetch failure", async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to fetch shift history")
    );

    renderWithProviders(<ShiftHistoryPage />);

    await waitFor(() => {
      // Assert that the error message is displayed in Banner
      expect(mockBannerContextValue.showBanner).toHaveBeenCalledWith(
        expect.stringMatching(/Error in retrieving shift histories/i),
        "error"
      );
      expect(axios.get).toHaveBeenCalledTimes(1);
    });
  });
});
