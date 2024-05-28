/**
 * File: BannerContext.tsx
 * Purpose: handle the showing/hiding of Banner component with
 * configurable message
 */
"use client";
import { createContext, useState, ReactNode } from "react";

type BannerContextProviderProps = {
  children: ReactNode;
};
export interface BannerContextProps {
  bannerText: string;
  status: string;
  isVisible: boolean;
  showBanner: (bannerText: string, status: string) => void;
  hideBanner: () => void;
}

export const BannerContext = createContext<BannerContextProps | undefined>(
  undefined
);

export const BannerContextProvider = ({
  children,
}: BannerContextProviderProps) => {
  const [bannerText, setBannerText] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const showBanner = (bannerText: string, status: string = "other") => {
    setBannerText(bannerText);
    setStatus(status);
    setIsVisible(true);
  };
  const hideBanner = (): void => {
    setIsVisible(false);
  };

  const BannerContextValue: BannerContextProps = {
    bannerText,
    status,
    isVisible,
    showBanner,
    hideBanner,
  };
  return (
    <BannerContext.Provider value={BannerContextValue}>
      {children}
    </BannerContext.Provider>
  );
};
