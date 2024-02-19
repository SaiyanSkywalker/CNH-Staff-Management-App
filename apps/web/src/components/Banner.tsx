"use client";
import { useContext } from "react";
import {
  BannerContext,
  BannerContextProps,
} from "@webSrc/contexts/BannerContext";
import styles from "@webSrc/styles/Banner.module.css";
const Banner = () => {
  const bannerContext: BannerContextProps | undefined =
    useContext(BannerContext);

  if (!bannerContext) {
    return null;
  }

  const { isError, isVisible, hideBanner, bannerText } = bannerContext;
  const bannerClassName = isError ? "bg-red-500" : "bg-green-500";
  const textColor = "text-white";
  return (
    <>
      {isVisible && (
        <div
          onAnimationEnd={() => hideBanner()}
          className={`${textColor} ${bannerClassName} ${
            bannerText ? `block ${styles["slideDown"]} ` : "hidden"
          } absolute w-screen py-6 text-center text-lg font-semibold`}
        >
          {bannerText}
        </div>
      )}
    </>
  );
};

export default Banner;
