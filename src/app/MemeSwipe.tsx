"use client";

import React, { useState, useEffect } from "react";
import TinderCard from "react-tinder-card";
import Image from "next/image";
import { Chewy } from "next/font/google";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import {
  Connection,
  clusterApiUrl,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
} from "@solana/spl-token";

const chewy = Chewy({
  weight: "400",
  subsets: ["latin"],
});

const sampleMemes = [
  {
    id: 1,
    url: "https://i.imgflip.com/30b1gx.jpg",
    caption: "When your Solana contract works first try.",
  },
  {
    id: 2,
    url: "https://i.imgflip.com/1bij.jpg",
    caption: "Running `npm run dev` and praying.",
  },
  {
    id: 3,
    url: "https://i.imgflip.com/26am.jpg",
    caption: "Debugging all night but finally works.",
  },
];

const connection = new Connection(clusterApiUrl("devnet"));
const glootieMint = new PublicKey("8nPLPo57wMcRbqDbUBmNAvbrbCSpny2VBHowgZ3Rpump");

export default function MemeSwipe() {
  const [memes, setMemes] = useState(sampleMemes);
  const { publicKey, signTransaction } = useWallet();

  useEffect(() => {
    if (publicKey) {
      localStorage.setItem("connectedWallet", publicKey.toBase58());
    }
  }, [publicKey]);

  const audioRight = typeof Audio !== "undefined" ? new Audio("/right.mp3") : null;
  const audioLeft = typeof Audio !== "undefined" ? new Audio("/left.mp3") : null;

  const handleLike = () => {
    if (!publicKey) return;

    const walletAddr = publicKey.toBase58();
    const allLikes = JSON.parse(localStorage.getItem("likes") || "[]");

    if (allLikes.some((l: any) => l.memeId === meme.id && l.wallet === walletAddr)) {
      return;
    }

    allLikes.push({
      memeId: meme.id,
      wallet: walletAddr,
      url: meme.url,
      caption: meme.caption,
    });

    localStorage.setItem("likes", JSON.stringify(allLikes));
  };

  const swiped = (dir: string) => {
    if (dir === "right") {
      handleLike();
      if (audioRight) {
        audioRight.currentTime = 0;
        audioRight.play();
      }
    } else if (dir === "left" && audioLeft) {
      audioLeft.currentTime = 0;
      audioLeft.play();
    }
    setMemes((prev) => prev.slice(1));
  };

  if (memes.length === 0) {
    return <p style={{ marginTop: "2rem", textAlign: "center" }}>No more memes! 😎</p>;
  }

  const meme = memes[0];

  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState<any[]>([]);
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("comments") || "[]");
    const memeComments = stored.filter((c: any) => c.memeId === meme.id);
    setAllComments(memeComments);
  }, [meme.id]);

  const handleComment = () => {
    if (!publicKey) {
      alert("Please connect your wallet first!");
      return;
    }
    if (!comment.trim()) return;

    const newComment = {
      memeId: meme.id,
      wallet: publicKey.toBase58(),
      text: comment.trim(),
      replies: [],
    };

    const stored = JSON.parse(localStorage.getItem("comments") || "[]");
    stored.push(newComment);
    localStorage.setItem("comments", JSON.stringify(stored));

    setAllComments([...allComments, newComment]);
    setComment("");
  };

  const handleReply = (commentIndex: number, replyText: string) => {
    if (!publicKey) {
      alert("Please connect your wallet first!");
      return;
    }
    if (!replyText.trim()) return;

    const stored = JSON.parse(localStorage.getItem("comments") || "[]");
    const memeComments = stored.filter((c: any) => c.memeId === meme.id);

    memeComments[commentIndex].replies = memeComments[commentIndex].replies || [];
    memeComments[commentIndex].replies.push({
      wallet: publicKey.toBase58(),
      text: replyText.trim(),
    });

    const updatedComments = stored.map((c: any) => {
      if (c.memeId === meme.id && c.wallet === memeComments[commentIndex].wallet && c.text === memeComments[commentIndex].text) {
        return memeComments[commentIndex];
      }
      return c;
    });
    localStorage.setItem("comments", JSON.stringify(updatedComments));

    setAllComments(memeComments);
  };

  const handleSend = () => {
    const address = prompt("Enter recipient wallet address:");
    if (address) {
      const sentMemes = JSON.parse(localStorage.getItem("sentMemes") || "[]");
      sentMemes.push({
        to: address,
        url: meme.url,
        caption: meme.caption,
      });
      localStorage.setItem("sentMemes", JSON.stringify(sentMemes));

      alert(`Meme sent to wallet: ${address} 🚀 (saved to inbox)`);
    }
  };

  const handleTip = async () => {
    if (!publicKey) {
      alert("Please connect your wallet first!");
      return;
    }

    const recipientAddress = prompt("Enter recipient wallet address to tip:");
    const amountStr = prompt("Enter amount of $Glootie to tip (example: 1):");
    if (!recipientAddress || !amountStr) return;

    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      alert("Invalid amount");
      return;
    }

    try {
      const fromATA = await getAssociatedTokenAddress(glootieMint, publicKey);
      const toATA = await getAssociatedTokenAddress(glootieMint, new PublicKey(recipientAddress));

      const tx = new Transaction().add(
        createTransferInstruction(
          fromATA,
          toATA,
          publicKey,
          amount * 1e6 // adjust decimals if different
        )
      );

      const signedTx = await signTransaction(tx);
      const sig = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(sig, "confirmed");

      alert(`Successfully tipped ${amount} $Glootie! 🎉`);
    } catch (error) {
      console.error(error);
      alert("Tip failed. Make sure both wallets have $Glootie accounts.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "120px",
        marginTop: "2rem",
        flexDirection: "column",
      }}
    >
      <TinderCard key={meme.id} onSwipe={swiped} preventSwipe={["up", "down"]}>
        <div
          style={{
            backgroundColor: "black",
            width: "350px",
            padding: "1rem",
            borderRadius: "10px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            overflow: "hidden",
          }}
        >
          <img
            src={meme.url}
            alt={meme.caption}
            style={{
              width: "100%",
              height: "300px",
              borderRadius: "8px",
              objectFit: "cover",
              userSelect: "none",
              pointerEvents: "none",
            }}
            draggable={false}
          />
          <p
            className={chewy.className}
            style={{
              marginTop: "0.5rem",
              textAlign: "center",
              userSelect: "none",
              color: "#BB00FF",
            }}
          >
            {meme.caption}
          </p>

          <div style={{ marginTop: "1rem" }}>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment"
              style={{
                padding: "6px 10px",
                borderRadius: "6px",
                border: "2px solid black",
                outline: "none",
                width: "80%",
                marginBottom: "0.5rem",
              }}
            />
            <br />
            <button
              onClick={handleComment}
              style={{
                backgroundColor: "black",
                color: "#BB00FF",
                padding: "6px 16px",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: comment.trim() ? "pointer" : "not-allowed",
                opacity: comment.trim() ? 1 : 0.5,
              }}
              disabled={!comment.trim()}
            >
              {comment.trim() ? "Post" : "Write a comment..."}
            </button>
            <div style={{ marginTop: "1rem", textAlign: "left" }}>
              {allComments.map((c, index) => (
                <div key={index} style={{ marginBottom: "1rem" }}>
                  <p style={{ color: "#BB00FF", marginBottom: "0.3rem" }}>
                    <strong>{c.wallet.slice(0, 4)}...:</strong> {c.text}
                  </p>
                  <ReplyInput
                    onReply={(replyText) => handleReply(index, replyText)}
                  />
                  {c.replies?.map((r: any, rIdx: number) => (
                    <p
                      key={rIdx}
                      style={{
                        color: "#BB00FF",
                        marginLeft: "1rem",
                        fontSize: "0.9rem",
                      }}
                    >
                      ↳ <strong>{r.wallet.slice(0, 4)}...:</strong> {r.text}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleTip}
            style={{
              marginTop: "1rem",
              backgroundColor: "black",
              color: "#BB00FF",
              padding: "8px 16px",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Tip in $Glootie
          </button>

          <button
            onClick={handleSend}
            style={{
              marginTop: "1rem",
              backgroundColor: "black",
              color: "#BB00FF",
              padding: "8px 16px",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Send to Wallet
          </button>
        </div>
      </TinderCard>

      {publicKey && (
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <Link href={`/profile/${publicKey.toBase58()}`}>
            <button
              style={{
                backgroundColor: "black",
                color: "#BB00FF",
                padding: "10px 20px",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              View My Profile
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

function ReplyInput({ onReply }: { onReply: (text: string) => void }) {
  const [reply, setReply] = useState("");

  return (
    <div style={{ marginTop: "0.5rem" }}>
      <input
        type="text"
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Write a reply"
        style={{
          padding: "4px 8px",
          borderRadius: "6px",
          border: "1px solid black",
          outline: "none",
          width: "75%",
          marginBottom: "0.3rem",
        }}
      />
      <button
        onClick={() => {
          onReply(reply);
          setReply("");
        }}
        style={{
          backgroundColor: "black",
          color: "#BB00FF",
          padding: "4px 10px",
          borderRadius: "6px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Reply
      </button>
    </div>
  );
}
