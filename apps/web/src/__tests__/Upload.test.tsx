import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Upload from "../app/upload/page";
import { mockUseRouter } from "@webSrc/__mocks__/mockRouter";

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
