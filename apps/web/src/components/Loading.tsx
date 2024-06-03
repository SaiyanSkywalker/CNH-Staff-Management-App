/**
 * File: Loading.tsx
 * Purpose: Loading spinner component that is triggered by LoadingContext
 */
"use client";
import {
  LoadingContext,
  LoadingContextProps,
} from "@webSrc/contexts/LoadingContext";
import styles from "@webSrc/styles/Loading.module.css";
import { useContext } from "react";

const Loading = () => {
  const loadingContext: LoadingContextProps | undefined =
    useContext(LoadingContext);
  if (!loadingContext) {
    return null;
  }
  const { isVisible } = loadingContext;
  return (
    <>
      {isVisible && (
        <div className={styles["loading-container"]}>
          <div className={styles["loading-icon"]}></div>
        </div>
      )}
    </>
  );
};

export default Loading;
