import React, { useState } from "react";
import { api } from "../api";
import "./FileUpload.css";

export default function FileUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return setMessage("⚠ Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.message || "✅ Upload successful");
      onUploadSuccess && onUploadSuccess(); // refresh table
      setFile(null);
    } catch (err) {
      setMessage(err.response?.data?.error || "❌ Upload failed");
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Student Grades</h2>

      <div className="file-input-wrapper">
        <label htmlFor="file-upload" className="custom-file-btn">
          {file ? file.name : "Choose File"}
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".xlsx,.csv"
          onChange={handleFileChange}
        />
      </div>

      <button className="upload-btn" onClick={handleUpload}>
        Upload
      </button>

      {message && <p className="message">{message}</p>}
    </div>
  );
}
