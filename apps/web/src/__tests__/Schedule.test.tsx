import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Schedule from "@webSrc/app/schedule/page";
import axios from "axios";
import { useAuth } from "@webSrc/contexts/AuthContext";
import { useRouter } from "next/navigation";
import moment from "moment";

// Define the type for useRouter
interface Router {
  replace: jest.Mock<any, any>;
  back: jest.Mock<any, any>;
  forward: jest.Mock<any, any>;
  refresh: jest.Mock<any, any>;
  push: jest.Mock<any, any>;
  prefetch: jest.Mock<any, any>;
}

// Mocking axios
jest.mock("axios");

// Mocking useAuth hook
jest.mock("../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Mocking getAccessToken directly
jest.mock("../utils/token", () => ({
  getAccessToken: jest.fn().mockReturnValue("fake_token"),
}));

const mockUseRouter = useRouter as unknown as jest.Mock<Router>;
describe("Schedule Functionality", () => {
  const mockUseAuth = useAuth as jest.Mock;
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
    // Mocking the implementation of useAuth before each test
    mockUseAuth.mockReturnValue({
      auth: {
        authenticated: true,
        user: {
          roleId: 3,
          unit: {
            laborLevelEntryId: 1,
          },
          unitId: 1,
        },
      },
    });
  });

  it("allows user to filter schedule views by shift hours", async () => {
    jest
      .spyOn(axios, "get")
      .mockResolvedValueOnce({ data: [] }) // Mock response for units
      .mockResolvedValueOnce({ data: {} }); // Mock response for schedules

    render(<Schedule />);

    // Check if 4-hour shift filter is selected by default
    const fourHourShiftFilter = screen.getByLabelText("4 Hour");
    expect(fourHourShiftFilter).toBeChecked();

    // Change to 8-hour shift filter
    fireEvent.click(screen.getByLabelText("8 Hour"));
    await waitFor(() => {
      expect(fourHourShiftFilter).not.toBeChecked();
      expect(screen.getByLabelText("8 Hour")).toBeChecked();
    });

    // Change to 12-hour shift filter
    fireEvent.click(screen.getByLabelText("12 Hour"));
    await waitFor(() => {
      expect(screen.getByLabelText("8 Hour")).not.toBeChecked();
      expect(screen.getByLabelText("12 Hour")).toBeChecked();
    });
  });

  it("immediately reflects changes to unit capacities on the schedule", async () => {
    const today = new Date();
    const dateString = moment(today).format("YYYY-MM-DD");
    const isoString = today.toISOString();
    const mockSchedules = {
      1: [
        {
          shiftDate: isoString,
          startTime: "07:00",
          endTime: "15:00",
        },
      ],
    };
    const mockCapacities = {
      default: [],
      updated: [
        {
          shift: "07:00 - 15:00",
          shiftDate: dateString,
          laborLevelEntryId: 1,
          capacity: 10,
        },
      ],
    };

    jest
      .spyOn(axios, "get")
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({ data: mockCapacities })
      .mockResolvedValueOnce({ data: mockSchedules });

    render(<Schedule />);

    await waitFor(() => {
      const events = document.querySelectorAll(
        'div.rbc-event.bg-red-500[title="07:00 - 11:00: Cost Center: 1, 1/25 "]'
      );
      expect(events.length).toBeGreaterThan(0);
    });
  });
});
