import config from "web/src/config";
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

jest.mock("axios");
jest.mock("socket.io-client");

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn(),
}));

const mockUseState = useState as jest.Mock;

describe('ShiftCapacity', () => {
  let mockUser: any;
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

    mockUser = {
      username: "test", 
      roleId: 2,
      unit: {
        laborLevelEntryId: 1,
      },
      unitId: 1,
    };

    mockUnits = [
        {
          laborLevelEntryId: 1,
          name: "Unit 1",
          description: "Description 1"
        },
        {
          laborLevelEntryId: 2,
          name: "Unit 2",
          description: "Description 2"
        }
    ];

    mockUseState
    .mockImplementationOnce((init: any) => [init,  jest.fn()]) // units
    .mockImplementationOnce((init: any) => [init, jest.fn()]) // capacities
    .mockImplementationOnce((init: any) => [init,  jest.fn()]) // shiftIndex
    .mockImplementationOnce((init: any) => [init,  jest.fn()]) // date
    .mockImplementationOnce((init: any) => [init,  jest.fn()]) // initialLoad
    .mockImplementationOnce((init: any) => [init,  jest.fn()]); // defaults checked
  });

  it('Cannot submit when no input values', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({
        status: 200,
        data: [],
    });

    jest.spyOn(React, 'useState')
    .mockReturnValueOnce([true, jest.fn()])
    .mockReturnValueOnce([[mockUnits], jest.fn()]);

    renderWithProviders(<ShiftCapacity />);

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
        expect(mockBannerContextValue.showBanner).toHaveBeenCalledWith(
          expect.stringMatching(/Please define capacities for at least one unit before saving/i),
         "other"
        );

        expect(axios.post).not.toHaveBeenCalled();
    });
  });
});
