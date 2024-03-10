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

export default function UploadPage() {
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const props: BannerContextProps | undefined = useContext(BannerContext);

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
      if (props) {
        if (!currentFile) {
          props.showBanner(
            "Error! File must be selected before uploading",
            true
          );
        } else {
          const formData = new FormData();
          formData.append("schedule", currentFile);

          const response = await axios.post(
            `${config.apiUrl}/schedule`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          if (response.status === 200) {
            props.showBanner("Success! File has been uploaded", false);
          } else {
            props.showBanner(
              `Error in uploading ${currentFile.name}! ${response.data.err}`,
              true
            );
          }
        }
      }
    } catch (err) {
      console.error(err);
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
      <section className="flex flex-col items-center">
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
      </section>
    </>
  );
}
