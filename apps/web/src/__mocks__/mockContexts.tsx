import React, { ReactNode } from "react";
import {
  BannerContext,
  BannerContextProps,
} from "@webSrc/contexts/BannerContext";
import {
  LoadingContext,
  LoadingContextProps,
} from "@webSrc/contexts/LoadingContext";
import { AuthContext } from "@webSrc/contexts/AuthContext";

// Mock implementations for BannerContext
export const mockBannerContextValue: BannerContextProps = {
  bannerText: "",
  status: "",
  isVisible: false,
  showBanner: jest.fn(),
  hideBanner: jest.fn(),
};

export const MockBannerContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => (
  <BannerContext.Provider value={mockBannerContextValue}>
    {children}
  </BannerContext.Provider>
);

// Mock implementations for LoadingContext
export const mockLoadingContextValue: LoadingContextProps = {
  isVisible: false,
  showLoader: jest.fn(),
  hideLoader: jest.fn(),
};

export const MockLoadingContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => (
  <LoadingContext.Provider value={mockLoadingContextValue}>
    {children}
  </LoadingContext.Provider>
);

const mockSocket: any = {
  on: jest.fn(),
  off: jest.fn(),
  emit: jest.fn(),
};
export const mockAuthContextValue = {
  auth: {
    user: null,
    authenticated: true,
    login: jest.fn(),
    logout: jest.fn(),
    socket: mockSocket,
  },
};
export const MockAuthContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => (
  <AuthContext.Provider value={mockAuthContextValue}>
    {children}
  </AuthContext.Provider>
);
