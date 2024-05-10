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

  const bannerColors: { [key: string]: string } = {
    success: "bg-green-500",
    error: "bg-red-500",
    other: "bg-yellow-500",
  };
  if (!bannerContext) {
    return null;
  }
  const { status, isVisible, hideBanner, bannerText } = bannerContext;
  const bannerClassName = bannerColors[status] || "bg-yellow-500";
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
