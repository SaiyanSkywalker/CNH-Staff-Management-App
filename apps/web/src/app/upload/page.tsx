"use client";

import React, {
  useState,
  ChangeEvent,
  useContext,
  DragEvent,
  MouseEvent,
  useRef,
} from "react";
import styles from "../../styles/Upload.module.css";
import {
  BannerContext,
  BannerContextProps,
} from "@webSrc/contexts/BannerContext";
import axios from "axios";
import config from "@webSrc/config";
import {
  LoadingContext,
  LoadingContextProps,
} from "@webSrc/contexts/LoadingContext";
import { useAuth } from "@webSrc/contexts/AuthContext";

export default function UploadPage() {
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const bannerContext: BannerContextProps | undefined =
    useContext(BannerContext);
  const loadingContext: LoadingContextProps | undefined =
    useContext(LoadingContext);
  const authContext = useAuth();
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputElement: HTMLInputElement | null = fileInputRef.current;
    const containerElement: HTMLDivElement | null = containerRef.current;

    if (inputElement && containerElement) {
      if (inputElement.files?.length) {
        buildThumbnail(containerElement, inputElement.files[0]);
        const file = inputElement.files[0];
        setCurrentFile(file);
      }
    }
  };
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const inputElement: HTMLInputElement | null = fileInputRef.current;
    inputElement?.click();
  };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const inputElement: HTMLInputElement | null = fileInputRef.current;
    const dropZoneElement: HTMLDivElement | null = containerRef.current;
    if (inputElement && dropZoneElement && e.dataTransfer?.files.length) {
      inputElement.files = e.dataTransfer.files;
      buildThumbnail(dropZoneElement, e.dataTransfer.files[0]);
      dropZoneElement.classList.remove(`${styles["drop-zone--over"]}`);
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropZoneElement: HTMLDivElement | null = containerRef.current;
    dropZoneElement?.classList.add(`${styles["drop-zone--over"]}`);
  };

  const handleDragOut = (e: DragEvent<HTMLDivElement>) => {
    const dropZoneElement: HTMLDivElement | null = containerRef.current;
    dropZoneElement?.classList.remove(`${styles["drop-zone--over"]}`);
  };
  const uploadCSV = async () => {
    try {
      if (bannerContext && loadingContext) {
        if (!currentFile) {
          bannerContext.showBanner(
            "Error! File must be selected before uploading",
            true
          );
        } else {
          const user = authContext.auth?.user?.username || "steve"; //TODO: Remove the steve
          const formData: FormData = new FormData();
          formData.append("username", user);
          formData.append("schedule", currentFile);
          loadingContext.showLoader();
          axios.post(`${config.apiUrl}/schedule`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          loadingContext.hideLoader();
          bannerContext.showBanner(
            "File upload has been started, notification will be shown once upload is complete",
            false
          );
        }
      }
    } catch (err) {
      if (bannerContext && loadingContext) {
        bannerContext.showBanner(
          "Error: Schedule data could not be saved to the database",
          true
        );
        loadingContext.hideLoader();
      }
    }
  };

  const buildThumbnail = (dropZoneElement: HTMLDivElement, file: File) => {
    const prompt = dropZoneElement.querySelector(
      `.${styles["drop-zone__prompt"]}`
    );
    if (prompt) {
      prompt.remove();
    }
    const thumbnailElement = (
      <div className={styles["drop-zone__thumb"]} data-label={file.name}></div>
    );

    return thumbnailElement;
  };

  return (
    <>
      <section className="h-full w-full flex justify-center items-center pt-32">
        <div className="flex flex-col items-center">
          <div
            className={`${styles["drop-zone"]}`}
            ref={containerRef}
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDrag}
            onDragLeave={handleDragOut}
            onDragEnd={handleDragOut}
          >
            <span className={`${styles["drop-zone__prompt"]}`}>
              Drop file here or click to upload
            </span>
            <input
              className={`${styles["file-container__input"]} ${styles["drop-zone__input"]}`}
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              name="file"
              placeholder="file"
              accept=".csv"
              required
            />
            {containerRef.current &&
              currentFile &&
              buildThumbnail(containerRef.current, currentFile)}
          </div>
          <button
            className={`${styles["btn-upload"]} mt-4`}
            type="button"
            onClick={uploadCSV}
          >
            Upload File
          </button>
        </div>
      </section>
    </>
  );
}
