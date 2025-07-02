"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Chewy } from "next/font/google";

const chewy = Chewy({
  weight: "400",
  subsets: ["latin"],
});

export default function UploadPage() {
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const maxChars = 50; // ✅ 50 char limit

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= maxChars) {
      setDescription(e.target.value);
    }
  };

  const handlePost = () => {
    if (!imagePreview || !description) {
      alert("Please add an image and description first!");
      return;
    }

    alert("Your meme has been posted! 😎 (Not actually saved yet)");

    // Clear form
    setDescription("");
    setImagePreview(null);
  };

  return (
    <div
      style={{
        padding: "2rem",
        textAlign: "center",
        backgroundColor: "#BB00FF",
        minHeight: "100vh",
      }}
    >
      <h1
        className={chewy.className}
        style={{
          color: "black",
          fontSize: "2rem",
          marginBottom: "1rem",
          fontWeight: "bold",
        }}
      >
        Upload a Meme
      </h1>
      <input
        type="text"
        placeholder={`Enter meme description (max ${maxChars} chars)`}
        value={description}
        onChange={handleDescriptionChange}
        className={chewy.className}
        style={{
          padding: "6px 10px",
          borderRadius: "6px",
          border: "2px solid black",
          outline: "none",
          width: "250px",
          marginBottom: "0.5rem",
        }}
      />
      <div
        className={chewy.className}
        style={{ color: "black", marginBottom: "1rem", fontSize: "0.9rem" }}
      >
        {description.length}/{maxChars} characters
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{
          marginBottom: "1rem",
        }}
      />
      {imagePreview && (
        <div>
          <img
            src={imagePreview}
            alt="Preview"
            style={{
              width: "300px",
              margin: "1rem auto",
              borderRadius: "10px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
            }}
          />
          <p
            className={chewy.className}
            style={{
              color: "#BB00FF",
              backgroundColor: "black",
              padding: "6px 10px",
              borderRadius: "6px",
              display: "inline-block",
              marginTop: "0.5rem",
              fontWeight: "bold",
            }}
          >
            {description}
          </p>
        </div>
      )}
      <br />
      <button
        onClick={handlePost}
        className={chewy.className}
        style={{
          backgroundColor: "black",
          color: "#BB00FF",
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          fontWeight: "bold",
          cursor: "pointer",
          marginBottom: "1rem",
        }}
      >
        Post Meme
      </button>
      <br />
      <Link
        href="/"
        className={chewy.className}
        style={{
          color: "#BB00FF",
          backgroundColor: "black",
          padding: "10px 20px",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        Back to Meme Swipe
      </Link>
    </div>
  );
}
