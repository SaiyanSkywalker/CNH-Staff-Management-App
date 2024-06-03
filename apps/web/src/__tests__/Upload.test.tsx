import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Upload from "@webSrc/app/upload/page";
import { useRouter } from "next/navigation";
import { useAuth } from "@webSrc/contexts/AuthContext";
import axios from "axios";
import {
  mockBannerContextValue,
  mockLoadingContextValue,
} from "@webSrc/__mocks__/mockContexts";
import React, { useState, useContext } from "react";

jest.mock("socket.io-client");

// Mock auth context
jest.mock("../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("axios");

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
  useContext: jest.fn(() => ({
    showBanner: jest.fn(),
    hideBanner: jest.fn(),
    showLoading: jest.fn(),
    hideLoading: jest.fn(),
  })),
}));

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

describe("Upload Page", () => {
  let mockUser: any;
  const mockUseAuth = useAuth as jest.Mock;
  const mockUseState = useState as jest.Mock;
  const mockUseContextBanner = useContext as jest.Mock;
  const mockUseContextLoading = useContext as jest.Mock;
  const mockReplace = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    // Mocking the implementation of useRouter before each test
    mockUseRouter.mockImplementation(() => ({
      replace: mockReplace,
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

    mockUseContextBanner.mockReturnValueOnce(mockBannerContextValue);
    mockUseContextLoading.mockReturnValueOnce(mockLoadingContextValue);
  });

  it("renders success message when CSV given", async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: [] });
    mockUseAuth.mockReturnValue({
      auth: { user: mockUser, authenticated: true },
    });

    const setState = jest.fn();
    mockUseState.mockImplementation((file: File) => [file, setState]);

    const mockFile = new File(["file content"], "filename.csv", {
      type: "text/csv",
    });

    jest.spyOn(React, "useState").mockReturnValue([mockFile, setState]);

    render(<Upload />);

    fireEvent.click(screen.getByRole("button", { name: "Upload File" }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });

    expect(mockBannerContextValue.showBanner).toHaveBeenCalledWith(
      expect.stringMatching(
        /File upload has been started, notification will be shown once upload is complete/i
      ),
      "other"
    );
  });

  it("renders error message when CSV not given", async () => {
    mockUseAuth.mockReturnValue({
      auth: { user: mockUser, authenticated: true },
    });

    const setState = jest.fn();
    mockUseState.mockImplementation((init: any) => [init, setState]);

    jest.spyOn(React, "useState").mockReturnValue([null, setState]);

    render(<Upload />);

    fireEvent.click(screen.getByRole("button", { name: "Upload File" }));

    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();

      expect(mockBannerContextValue.showBanner).toHaveBeenCalledWith(
        expect.stringMatching(/Error! File must be selected before uploading/i),
        "error"
      );
    });
  });

  it("redirects when user does not have admin role", async () => {
    mockUser.roleId = 3;
    mockUseAuth.mockReturnValue({
      auth: { user: mockUser, authenticated: true },
    });

    render(<Upload />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/schedule");
    });
  });

  it("renders when user does have admin role", async () => {
    mockUseAuth.mockReturnValue({
      auth: { user: mockUser, authenticated: true },
    });

    render(<Upload />);

    const span: HTMLElement = screen.getByText(
      "Drop file here or click to upload"
    );

    expect(span).toBeInTheDocument();
  });
});
