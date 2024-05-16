import "@testing-library/jest-dom";

//ADD ACTUAL MOCKS HERE

// useRouter mock
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
