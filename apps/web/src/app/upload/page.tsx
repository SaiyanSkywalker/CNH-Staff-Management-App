"use client"
import { useState, ChangeEvent } from "react";
import styles from "../../styles/Upload.module.css";

export default function UploadPage() {
  const [currentFile, setCurrentFile] = useState(null);

  const onFileChange = (e: any) => {
    const file = e.target?.files[0];
    setCurrentFile(file);
  };

  const uploadCSV = async () => {
    if (!currentFile) {
      return;
    }

    const data = new FormData();
    data.append('file', currentFile);
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
      </div>
    </main>
  );
}