"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function InboxPage() {
  const [receivedMemes, setReceivedMemes] = useState<any[]>([]);

  useEffect(() => {
    const walletAddress = localStorage.getItem("connectedWallet");
    const stored = JSON.parse(localStorage.getItem("sentMemes") || "[]");
    const filtered = stored.filter((meme: any) => meme.to === walletAddress);
    setReceivedMemes(filtered);
  }, []);

  return (
    <div
      style={{
        padding: "2rem",
        textAlign: "center",
        backgroundColor: "#BB00FF",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ color: "black", fontSize: "2rem", fontWeight: "bold" }}>
        Your Meme Inbox 📥
      </h1>
      {receivedMemes.length === 0 ? (
        <p style={{ marginTop: "2rem" }}>No memes received yet! 🥲</p>
      ) : (
        receivedMemes.map((meme, index) => (
          <div
            key={index}
            style={{
              margin: "1rem auto",
              maxWidth: "400px",
              backgroundColor: "black",
              borderRadius: "10px",
              padding: "1rem",
            }}
          >
            <img
              src={meme.url}
              alt={meme.caption}
              style={{
                width: "100%",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
            <p style={{ color: "#BB00FF", marginTop: "0.5rem" }}>{meme.caption}</p>
          </div>
        ))
      )}
      <br />
      <Link
        href="/"
        style={{
          color: "#BB00FF",
          backgroundColor: "black",
          padding: "10px 20px",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        Back to Home
      </Link>
    </div>
  );
}
