"use client";

import React, { useState, ChangeEvent, useEffect, useContext } from "react";
import styles from "../../styles/Upload.module.css";
import {
  BannerContext,
  BannerContextProps,
} from "@webSrc/contexts/BannerContext";

export default function UploadPage() {
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [fileError, setFileError] = useState<boolean>(false);
  const props: BannerContextProps | undefined = useContext(BannerContext);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target?.files;
    if (files && files.length > 0) {
      const file = files[0];
      setCurrentFile(file);
      setFileError(false);
    }
  };

  const uploadCSV = async () => {
    if (props) {
      if (!currentFile) {
        props.showBanner("Error! File must be selected before uploading", true);
      } else {
        props.showBanner("Success! File has been uploaded", false);
      }
    }
  };

  useEffect(() => {
    /**
     * Updates the thumbnail on a drop zone element.
     *
     * @param {HTMLElement} dropZoneElement
     * @param {File} file
     */
    function updateThumbnail(dropZoneElement, file) {
      let thumbnailElement = dropZoneElement.querySelector(
        `.${styles["drop-zone__thumb"]}`
      );

      // First time - remove the prompt
      if (dropZoneElement.querySelector(`.${styles["drop-zone__prompt"]}`)) {
        dropZoneElement
          .querySelector(`.${styles["drop-zone__prompt"]}`)
          .remove();
      }

      // First time - there is no thumbnail element, so lets create it
      if (!thumbnailElement) {
        thumbnailElement = document.createElement("div");
        thumbnailElement.classList.add(styles["drop-zone__thumb"]);
        dropZoneElement.appendChild(thumbnailElement);
      }

      thumbnailElement.dataset.label = file.name;
    }

    const inputElement: HTMLInputElement | null = document.querySelector(
      `.${styles["file-container__input"]}`
    );
    const dropZoneElement = inputElement?.closest(`.${styles["drop-zone"]}`);

    if (inputElement && dropZoneElement) {
      dropZoneElement.addEventListener("click", (e) => {
        inputElement.click();
      });
      inputElement.addEventListener("change", (e) => {
        if (inputElement.files.length) {
          updateThumbnail(dropZoneElement, inputElement.files[0]);
          const file = inputElement.files[0];
          console.log(file);
          setCurrentFile(file);
        }
      });
      dropZoneElement.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZoneElement.classList.add(`${styles["drop-zone--over"]}`);
      });

      ["dragleave", "dragend"].forEach((type) => {
        dropZoneElement.addEventListener(type, (e) => {
          dropZoneElement.classList.remove(`${styles["drop-zone--over"]}`);
        });
      });
      dropZoneElement.addEventListener("drop", (e) => {
        e.preventDefault();

        if (e.dataTransfer.files.length) {
          inputElement.files = e.dataTransfer.files;
          updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
        }

        dropZoneElement.classList.remove(`${styles["drop-zone--over"]}`);
      });
    }
  });

  return (
    <>
      <div>
        <div className={`${styles["drop-zone"]}`}>
          <span className={`${styles["drop-zone__prompt"]}`}>
            Drop file here or click to upload
          </span>
          <input
            className={`${styles["file-container__input"]} ${styles["drop-zone__input"]}`}
            type="file"
            // onChange={onFileChange}
            name="file"
            placeholder="file"
            accept=".csv"
            required
          />
        </div>
        <div className="flex justify-center">
          <button
            className={`${styles["btn-upload"]} mt-4`}
            type="button"
            onClick={uploadCSV}
          >
            Upload CSV File
          </button>
        </div>
      </div>
    </>
  );
}
