import React from "react";
import { render } from "@testing-library/react-native";
import Login from "../app/login";

describe("Login", () => {
  it("renders correctly", () => {
    const { getByText } = render(<Login />);
    const textElement = getByText("LOGIN");
    expect(textElement).toBeTruthy();
  });
});
