"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "./utils/supabaseClient";
import TinderCard from "react-tinder-card";
import Link from "next/link";
import { Chewy } from "next/font/google";
import { useWallet } from "@solana/wallet-adapter-react";

const chewy = Chewy({
  weight: "400",
  subsets: ["latin"],
});

const WalletMultiButton = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function Home() {
  const [memes, setMemes] = useState<any[]>([]);
  const { publicKey } = useWallet();
  const [comment, setComment] = useState("");

  useEffect(() => {
    async function fetchMemes() {
      const { data, error } = await supabase
        .from("memes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching memes:", error);
      } else {
        setMemes(data || []);
      }
    }

    fetchMemes();
  }, []);

  async function handleLike(memeId: number, currentLikes: number) {
    const { error } = await supabase
      .from("memes")
      .update({ likes: currentLikes + 1 })
      .eq("id", memeId);

    if (error) {
      console.error("Error updating likes:", error);
    }
  }

  const swiped = (dir: string, meme: any) => {
    if (dir === "right") {
      handleLike(meme.id, meme.likes);
    }
    setMemes((prev) => prev.filter((m) => m.id !== meme.id));
  };

  function handleCommentSubmit(memeId: number) {
    if (!comment.trim() || !publicKey) return;
    const allComments = JSON.parse(localStorage.getItem("comments") || "[]");
    allComments.push({ memeId, text: comment.trim(), wallet: publicKey.toBase58() });
    localStorage.setItem("comments", JSON.stringify(allComments));
    setComment("");
    alert("Comment posted!");
  }

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          display: "flex",
          alignItems: "center",
          backgroundColor: "#fff",
          borderRadius: "50px",
          padding: "5px 10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          zIndex: 1000,
        }}
      >
        <span style={{ marginLeft: "8px", fontWeight: "bold", color: "black" }}>
          $Glootie
        </span>
      </div>

      <main
        style={{
          padding: "2rem",
          textAlign: "center",
          backgroundColor: "#BB00FF",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        className={chewy.className}
      >
        <WalletMultiButton />
        <h1 style={{ marginTop: "2rem", color: "black", fontSize: "2.5rem", fontWeight: "bold" }}>
          Memefinderrz
        </h1>

        <Link
          href="/upload"
          style={{
            display: "inline-block",
            marginTop: "1rem",
            color: "#BB00FF",
            backgroundColor: "black",
            padding: "10px 20px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Create Your Own Meme
        </Link>

        <div style={{ position: "relative", width: "100%", maxWidth: "400px", height: "600px", marginTop: "2rem" }}>
          {memes.length === 0 ? (
            <p>No more memes! 😎</p>
          ) : (
            memes.map((meme) => (
              <TinderCard
                key={meme.id}
                onSwipe={(dir) => swiped(dir, meme)}
                preventSwipe={["up", "down"]}
              >
                <div
                  style={{
                    backgroundColor: "black",
                    width: "100%",
                    padding: "1rem",
                    borderRadius: "10px",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                    position: "absolute",
                    top: 0,
                  }}
                >
                  <img
                    src={meme.image_url}
                    alt={meme.caption}
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      maxHeight: "500px",
                      objectFit: "cover",
                      display: "block",
                      margin: "0 auto",
                    }}
                    draggable={false}
                  />
                  <p style={{ marginTop: "1rem", color: "#BB00FF" }}>{meme.caption}</p>

                  <input
                    type="text"
                    placeholder="Write a comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{
                      marginTop: "0.5rem",
                      padding: "0.4rem",
                      width: "90%",
                      borderRadius: "5px",
                      border: "none",
                    }}
                  />
                  <button
                    onClick={() => handleCommentSubmit(meme.id)}
                    style={{
                      marginTop: "0.5rem",
                      backgroundColor: "#BB00FF",
                      color: "black",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      border: "none",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Post
                  </button>
                </div>
              </TinderCard>
            ))
          )}
        </div>
      </main>
    </>
  );
}
