"use client";
import { BannerContextProps } from "@webSrc/interfaces/BannerContextProps";
import { createContext, useState, ReactNode } from "react";

type BannerContextProviderProps = {
  children: ReactNode;
};

export const BannerContext = createContext<BannerContextProps | undefined>(
  undefined
);

export const BannerContextProvider = ({
  children,
}: BannerContextProviderProps) => {
  const [bannerText, setBannerText] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const showBanner = (text: string, isError: boolean = false) => {
    setBannerText(text);
    setIsError(isError);
    setIsVisible(true);
  };
  const hideBanner = (): void => {
    setIsVisible(false);
  };

  const BannerContextValue: BannerContextProps = {
    bannerText,
    isError,
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
