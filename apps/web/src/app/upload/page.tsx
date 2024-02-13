"use client"
import React, { useState, ChangeEvent } from "react";
import styles from "../../styles/Upload.module.css";

export default function UploadPage() {
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [fileError, setFileError] = useState<boolean>(false);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target?.files;
    if (files && files.length > 0) {
      const file = files[0];
      setCurrentFile(file);
      setFileError(false);
    }
  };

  const uploadCSV = async () => {
    if (!currentFile) {
      setFileError(true);
      setTimeout(() => {
        setFileError(false);
      }, 6000);
      return;
    }

    setUploadSuccess(true);

    setTimeout(() => {
      setUploadSuccess(false);
    }, 3000);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-90">
        <div className={styles["file-container"]}>
          <input
            type="file"
            onChange={onFileChange}
            name="file"
            placeholder="file"
            required
          />
        </div>

        <button
          className={styles["btn-upload"]}
          type="button"
          onClick={uploadCSV}
        >
          Upload
        </button>

        {/* Pop-up message for upload success */}
        {uploadSuccess && (
          <div className={styles.popup}>
            <p>Upload successful</p>
          </div>
        )}

        {/* Pop-up message for file selection error */}
        {fileError && (
          <div className={`${styles.popup} ${styles.error}`}>
            <p>Please select a file to upload</p>
          </div>
        )}
      </div>
    </main>
  );
}