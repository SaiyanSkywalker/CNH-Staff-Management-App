/**
 * File: LoadingContext.tsx
 * Purpose: handle the showing/hiding of the Loading component
 */
"use client";
import { createContext, useState, ReactNode } from "react";

type LoadingContextProviderProps = {
  children: ReactNode;
};
export interface LoadingContextProps {
  isVisible: boolean;
  showLoader: () => void;
  hideLoader: () => void;
}
export const LoadingContext = createContext<LoadingContextProps | undefined>(
  undefined
);
export const LoadingContextProvider = ({
  children,
}: LoadingContextProviderProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const showLoader = () => {
    setIsVisible(true);
  };
  const hideLoader = (): void => {
    setIsVisible(false);
  };

  const LoadingContextValue: LoadingContextProps = {
    isVisible,
    showLoader,
    hideLoader,
  };
  return (
    <LoadingContext.Provider value={LoadingContextValue}>
      {children}
    </LoadingContext.Provider>
  );
};
