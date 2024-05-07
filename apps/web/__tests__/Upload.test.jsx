import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Upload from "../src/app/upload/page";

describe("Upload", () => {
  it("renders a span", () => {
    render(<Upload />);

    const span = screen.getByText("Drop file here or click to upload");

    expect(span).toBeInTheDocument();
  });
});
