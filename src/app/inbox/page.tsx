"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Chewy } from "next/font/google";
import Link from "next/link";

const chewy = Chewy({
  weight: "400",
  subsets: ["latin"],
});

export default function InboxPage() {
  const { publicKey } = useWallet();
  const [receivedMemes, setReceivedMemes] = useState<any[]>([]);

  useEffect(() => {
    if (!publicKey) return;
    const allSent = JSON.parse(localStorage.getItem("sentMemes") || "[]");
    const received = allSent.filter((m: any) => m.to === publicKey.toBase58());
    setReceivedMemes(received);
  }, [publicKey]);

  return (
    <main
      style={{
        padding: "2rem",
        backgroundColor: "#BB00FF",
        minHeight: "100vh",
        color: "black",
      }}
      className={chewy.className}
    >
      <h1>📬 Your Inbox</h1>

      <Link
        href="/"
        style={{
          display: "inline-block",
          marginBottom: "1rem",
          padding: "8px 16px",
          backgroundColor: "black",
          color: "#BB00FF",
          borderRadius: "6px",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        ← Back to Memes
      </Link>

      {receivedMemes.length === 0 ? (
        <p>No memes received yet.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {receivedMemes.map((m, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: "black",
                padding: "0.5rem",
                borderRadius: "8px",
                width: "150px",
              }}
            >
              <img
                src={m.url}
                alt={m.caption}
                style={{
                  width: "100%",
                  borderRadius: "6px",
                  objectFit: "cover",
                }}
              />
              <p style={{ color: "#BB00FF", fontSize: "0.8rem" }}>{m.caption}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
