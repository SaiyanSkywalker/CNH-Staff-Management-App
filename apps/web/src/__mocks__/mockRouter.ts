import { useRouter } from "next/navigation";

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
export const mockUseRouter = useRouter as jest.Mock<Router>;