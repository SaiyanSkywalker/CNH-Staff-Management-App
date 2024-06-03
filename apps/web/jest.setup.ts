import "@testing-library/jest-dom";
import { usePathname, useSearchParams } from "next/navigation";

//ADD ACTUAL MOCKS HERE

// useRouter mock
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(() => {
    return {
      get: jest.fn(),
    };
  }),
}));
