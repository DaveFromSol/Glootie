"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Chewy } from "next/font/google";
import Link from "next/link";

const chewy = Chewy({
  weight: "400",
  subsets: ["latin"],
});

export default function ProfilePage() {
  const params = useParams();
  const wallet = params.wallet as string;

  const [likedMemes, setLikedMemes] = useState<any[]>([]);
  const [receivedMemes, setReceivedMemes] = useState<any[]>([]);

  useEffect(() => {
    const allLikes = JSON.parse(localStorage.getItem("likes") || "[]");
    const liked = allLikes.filter((l: any) => l.wallet === wallet);

    const allSent = JSON.parse(localStorage.getItem("sentMemes") || "[]");
    const received = allSent.filter((m: any) => m.to === wallet);

    setLikedMemes(liked);
    setReceivedMemes(received);
  }, [wallet]);

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#BB00FF",
        minHeight: "100vh",
        color: "black",
      }}
      className={chewy.className}
    >
      <h1>Profile: {wallet.slice(0, 4)}...{wallet.slice(-4)}</h1>

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

      <h2>❤️ Liked Memes</h2>
      {likedMemes.length === 0 ? <p>No liked memes yet.</p> : null}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
      {likedMemes.map((l, idx) => (
  <div
    key={idx}
    style={{
      backgroundColor: "black",
      padding: "0.5rem",
      borderRadius: "8px",
      width: "150px",
    }}
  >
    <Image
      src={l.url || "/default.png"}
      alt="Meme"
      width={150}
      height={150}
      style={{ borderRadius: "6px", objectFit: "cover" }}
    />
    <p style={{ color: "#BB00FF", fontSize: "0.8rem", marginTop: "0.5rem" }}>
      {l.caption || "No description"}
    </p>
  </div>
))}
      </div>

      <h2 style={{ marginTop: "2rem" }}>📬 Received Memes</h2>
      {receivedMemes.length === 0 ? <p>No memes received yet.</p> : null}
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
    </div>
  );
}
