"use client";

import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useWallet } from "@solana/wallet-adapter-react";
import { Chewy } from "next/font/google";
import Link from "next/link";
import dynamic from "next/dynamic";

const chewy = Chewy({
  weight: "400",
  subsets: ["latin"],
});

const WalletMultiButton = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function UploadPage() {
  const { publicKey } = useWallet();
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");

  async function handleUpload() {
    if (!file || !caption.trim() || !publicKey) {
      alert("Please connect wallet, select a file, and add a caption first!");
      return;
    }

    const walletAddress = publicKey.toBase58();
    const filePath = `${Date.now()}_${file.name}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("memes")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      alert("Failed to upload image.");
      return;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("memes")
      .getPublicUrl(filePath);

    const imageUrl = urlData.publicUrl;

    // Insert meme data into table
    const { error: insertError } = await supabase.from("memes").insert([
      {
        image_url: imageUrl,
        caption: caption,
        wallet: walletAddress,
        likes: 0,
      },
    ]);

    if (insertError) {
      console.error("Insert error:", insertError);
      alert("Failed to save meme data: " + insertError.message);
      return;
    }

    alert("Meme uploaded successfully!");
    setFile(null);
    setCaption("");
  }

  return (
    <main
      style={{
        padding: "2rem",
        textAlign: "center",
        backgroundColor: "#BB00FF",
        minHeight: "100vh",
      }}
      className={chewy.className}
    >
      <WalletMultiButton />
      <h1 style={{ marginTop: "2rem", color: "black", fontSize: "2.5rem", fontWeight: "bold" }}>
        Upload Meme
      </h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
        style={{ marginTop: "1rem" }}
      />
      <br />
      <input
        type="text"
        placeholder="Caption (max 50 chars)"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        maxLength={50}
        style={{
          marginTop: "1rem",
          padding: "0.5rem",
          width: "250px",
          borderRadius: "6px",
          border: "none",
        }}
      />
      <br />
      <button
        onClick={handleUpload}
        style={{
          marginTop: "1rem",
          backgroundColor: "black",
          color: "#BB00FF",
          padding: "10px 20px",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: "pointer",
          border: "none",
        }}
      >
        Upload
      </button>
      <br />
      <Link
        href="/"
        style={{
          display: "inline-block",
          marginTop: "1rem",
          color: "black",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        ← Back to Home
      </Link>
    </main>
  );
}
