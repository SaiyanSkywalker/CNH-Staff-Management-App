import config from "@webSrc/config";
import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ShiftCapacity from "@webSrc/app/shift-capacity/page";
import { mockUseRouter } from "@webSrc/__mocks__/mockRouter";
import axios from "axios";
import {
  mockAuthContextValue,
  mockBannerContextValue,
  mockLoadingContextValue,
  renderWithProviders,
} from "@webSrc/__mocks__/mockContexts";
import { useState } from "react";
import UnitAttributes from "@shared/src/interfaces/UnitAttributes";
import React from "react";
import { getAccessToken } from "@webSrc/utils/token";

jest.mock("axios");
jest.mock("socket.io-client");

const mockUseState = useState as jest.Mock;

describe("ShiftCapacity", () => {
  let mockUnits: UnitAttributes[];

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

    mockUnits = [
      { id: 1, laborLevelEntryId: 53040, name: "ECMO", description: "ECMO" },
      {
        id: 2,
        laborLevelEntryId: 42125,
        name: "CICU",
        description: "Cardiac Intensive Care Unit",
      },
    ];

  });

  it("Cannot submit when no capacities are defined", async () => {
    renderWithProviders(<ShiftCapacity />);

    const form = screen.getByTestId("shiftCapacity-form");
    expect(form).toBeVisible();
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockBannerContextValue.showBanner).toHaveBeenCalledWith(
        expect.stringMatching(
          /Please define capacities for at least one unit before saving/i
        ),
        "other"
      );

      expect(axios.post).not.toHaveBeenCalled();
    });
  });

  it("Successfully submits updated capacities", async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      status: 200,
      data: mockUnits,
    });
    renderWithProviders(<ShiftCapacity />);
    const expectedShiftCapacityRequest = {
      shiftDate: "2024-06-03",
      shiftTime: "07:00 - 11:00",
      capacities: {
        "1": 25,
      },
      isDefault: false,
    };
    await waitFor(() => {
      const input = screen.getByTestId("capacity-input-1");
      expect(input).toBeVisible();
      fireEvent.change(input, { target: { value: "25" } });

      (axios.post as jest.Mock).mockResolvedValueOnce({
        status: 200,
      });
      const form = screen.getByTestId("shiftCapacity-form");
      expect(form).toBeVisible();
      fireEvent.submit(form);

      expect(mockBannerContextValue.showBanner).toHaveBeenCalledWith(
        expect.stringMatching(
          /Success, Shift capacities were successfully saved/i
        ),
        "success"
      );
      expect(axios.post).toHaveBeenCalledWith(
        `${config.apiUrl}/shift-capacity`,
        expectedShiftCapacityRequest,
        expect.objectContaining({
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAccessToken()}`,
          },
        })
      );
    });
  });
  it("Successfully submits default capacities", async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      status: 200,
      data: mockUnits,
    });
    renderWithProviders(<ShiftCapacity />);
    const expectedShiftCapacityRequest = {
      shiftDate: "2024-06-03",
      shiftTime: "07:00 - 11:00",
      capacities: {
        "1": 25,
      },
      isDefault: true,
    };
    await waitFor(() => {
      const input = screen.getByTestId("capacity-input-1");
      expect(input).toBeVisible();
      fireEvent.change(input, { target: { value: "25" } });

      (axios.post as jest.Mock).mockResolvedValueOnce({
        status: 200,
      });

      const checkbox = screen.getByRole("checkbox", { name: "Set Defaults" });
      fireEvent.click(checkbox);

      const form = screen.getByTestId("shiftCapacity-form");
      expect(form).toBeVisible();
      fireEvent.submit(form);

      expect(mockBannerContextValue.showBanner).toHaveBeenCalledWith(
        expect.stringMatching(
          /Success, Shift capacities were successfully saved/i
        ),
        "success"
      );
      expect(axios.post).toHaveBeenCalledWith(
        `${config.apiUrl}/shift-capacity`,
        expectedShiftCapacityRequest,
        expect.objectContaining({
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAccessToken()}`,
          },
        })
      );
    });
  });
});
