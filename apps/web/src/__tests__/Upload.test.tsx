import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Upload from "../app/upload/page";
import { useRouter } from "next/navigation";

// Mocking useRouter hook
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
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

describe("Upload", () => {
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
  it("renders a span", () => {
    render(<Upload />);

    const span: HTMLElement = screen.getByText(
      "Drop file here or click to upload"
    );

    expect(span).toBeInTheDocument();
  });
});
