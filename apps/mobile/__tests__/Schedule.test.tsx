import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import Schedule from "../app/schedule";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";
import { Alert } from "react-native";
jest.mock("../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("axios");
jest.mock("socket.io-client");

jest.spyOn(Alert, "alert");

describe("Schedule", () => {
  const mockedIo = io as jest.MockedFunction<typeof io>;
  const mockSocket: any = {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  };
  mockedIo.mockReturnValue(mockSocket);
  const mockAuth = {
    auth: {
      user: {
        username: "testuser",
        unitId: "123",
      },
      socket: mockSocket,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue(mockAuth);
  });

  it("renders correctly", async () => {
    const { getByText } = render(<Schedule />);
    const textElement = getByText("Schedule Shift");
    expect(textElement).toBeTruthy();
  });

  it("should send shift request when submit button is pressed", async () => {
    const { getByTestId, getByText, getByPlaceholderText } = render(
      <Schedule />
    );
    const mockCapacitiesResponse: any = { default: [], updated: [] };
    const mockShiftInfoResponse: any = [];

    // Mocks for getShiftInfo and getCapacities API calls
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: mockShiftInfoResponse,
    });
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: mockCapacitiesResponse,
    });

    const dateButton = getByTestId("dateSelectedBtn");
    fireEvent.press(dateButton);

    let datePickerModal: any;
    await waitFor(() => {
      datePickerModal = getByTestId("dateTimePickerModal");
      expect(datePickerModal).toBeTruthy();
    });

    fireEvent(datePickerModal, "change", {
      nativeEvent: { timestamp: "05/30/2024" },
    });

    let confirmButton: any;
    await waitFor(() => (confirmButton = getByText("Confirm")));
    fireEvent.press(confirmButton);

    const dropdown = getByTestId("shiftDropwdown");
    fireEvent.press(dropdown);
    await waitFor(() => {
      expect(getByText("07:00 - 11:00")).toBeTruthy();
    });
    fireEvent.press(getByText("07:00 - 11:00"));

    fireEvent.press(getByTestId("submitRequestBtn"));

    // Verify socket.emit was called with correct data
    await waitFor(() => {
      expect(mockAuth.auth.socket.emit).toHaveBeenCalledWith(
        "shift_submission",
        {
          user: "testuser",
          shiftDate: "05/30/2024",
          shift: "07:00 - 11:00",
        }
      );
    });
  });

  it("shows an alert when user tries to submit request without selecting a date", async () => {
    const { getByText, getByTestId } = render(<Schedule />);

    const submitButton = getByTestId("submitRequestBtn");
    fireEvent.press(submitButton);

    // Assert that alert pops up
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Submission Failed",
        "Please provide a shift date and shift before submitting"
      );
    });
  });

  it("shows an alert when user tries to submit request without selecting a shift interval", async () => {
    const { getByText, getByTestId } = render(<Schedule />);

    const dateButton = getByTestId("dateSelectedBtn");
    fireEvent.press(dateButton);

    let datePickerModal: any;
    await waitFor(() => {
      datePickerModal = getByTestId("dateTimePickerModal");
      expect(datePickerModal).toBeTruthy();
    });

    fireEvent(datePickerModal, "change", {
      nativeEvent: { timestamp: "05/30/2024" },
    });

    let confirmButton: any;
    await waitFor(() => (confirmButton = getByText("Confirm")));
    fireEvent.press(confirmButton);

    fireEvent.press(getByTestId("submitRequestBtn"));

    // Assert that alert is shown
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Submission Failed",
        "Please provide a shift date and shift before submitting"
      );
    });
  });

  it("displays no shift intervals in dropdown when there are no shifts available", async () => {
    const { getByText, getByTestId } = render(<Schedule />);

    const dateButton = getByTestId("dateSelectedBtn");
    fireEvent.press(dateButton);
    let datePickerModal: any;
    await waitFor(() => {
      datePickerModal = getByTestId("dateTimePickerModal");
      expect(datePickerModal).toBeTruthy();
    });

    fireEvent(datePickerModal, "change", {
      nativeEvent: { timestamp: "05/30/2024" },
    });

    let confirmButton: any;
    await waitFor(() => (confirmButton = getByText("Confirm")));
    fireEvent.press(confirmButton);

    const dropdown = getByTestId("shiftDropwdown");
    fireEvent.press(dropdown);
    await waitFor(() => {
      expect(getByText("There's nothing to show!")).toBeTruthy();
    });
  });

  it("displays correct shift intervals when user changes filter", async () => {
    const { getByText, getByTestId } = render(<Schedule />);
    const mockCapacitiesResponse: any = { default: [], updated: [] };
    const mockShiftInfoResponse: any = [];

    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: mockShiftInfoResponse,
    });
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: mockCapacitiesResponse,
    });

    const dateButton = getByTestId("dateSelectedBtn");
    fireEvent.press(dateButton);

    let datePickerModal: any;
    await waitFor(() => {
      datePickerModal = getByTestId("dateTimePickerModal");
      expect(datePickerModal).toBeTruthy();
    });

    fireEvent(datePickerModal, "change", {
      nativeEvent: { timestamp: "05/30/2024" },
    });

    let confirmButton: any;
    await waitFor(() => (confirmButton = getByText("Confirm")));
    fireEvent.press(confirmButton);

    const dropdown = getByTestId("shiftDropwdown");
    fireEvent.press(dropdown);
    await waitFor(() => {
      expect(getByText("07:00 - 11:00")).toBeTruthy();
    });

    const filterBtn = getByTestId("12hr");
    fireEvent.press(filterBtn);

    // Assert that new shift intervals are rendered
    await waitFor(() => {
      expect(getByText("07:00 - 19:00")).toBeTruthy();
    });
  });
});
