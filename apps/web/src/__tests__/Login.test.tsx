import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import Login from "../app/login/page"; // Adjust the import path if necessary
import { useAuth } from "@webSrc/contexts/AuthContext";
import { useRouter } from "next/navigation";

// Mocking useRouter hook
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock auth context
jest.mock("../contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

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

describe("Login Page Functionality", () => {
  let mockRouter: Router;

  beforeEach(() => {
    // Mocking the implementation of useRouter before each test
    mockRouter = {
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      push: jest.fn(),
      prefetch: jest.fn(),
    };
    mockUseRouter.mockReturnValue(mockRouter);
  });

  it("renders Login component when not authenticated", () => {
    (useAuth as jest.Mock).mockReturnValue({ auth: { authenticated: false } });
    render(<Login />);
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it("redirects to /schedule when authenticated", () => {
    (useAuth as jest.Mock).mockReturnValue({ auth: { authenticated: true } });
    render(<Login />);
    expect(mockRouter.push).toHaveBeenCalledWith("/schedule");
  });

  it("redirects to /schedule when auth state changes to authenticated", async () => {
    const { rerender } = render(<Login />);
    (useAuth as jest.Mock).mockReturnValue({ auth: { authenticated: false } });
    rerender(<Login />);
    (useAuth as jest.Mock).mockReturnValue({ auth: { authenticated: true } });
    rerender(<Login />);
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/schedule");
    });
  });

  it("renders Login component when auth state changes to not authenticated", () => {
    const { rerender } = render(<Login />);
    (useAuth as jest.Mock).mockReturnValue({ auth: { authenticated: true } });
    rerender(<Login />);
    (useAuth as jest.Mock).mockReturnValue({ auth: { authenticated: false } });
    rerender(<Login />);
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("handles undefined auth object", () => {
    (useAuth as jest.Mock).mockReturnValue({ auth: undefined });
    render(<Login />);
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it("handles undefined router object", () => {
    (mockUseRouter as jest.Mock).mockReturnValueOnce(undefined);
    (useAuth as jest.Mock).mockReturnValue({ auth: { authenticated: false } });
    render(<Login />);
    expect(screen.getByText("Login")).toBeInTheDocument();
  });
});
