"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import MemeSwipe from "./MemeSwipe";
import Link from "next/link";
import { Chewy } from "next/font/google";

const chewy = Chewy({
  weight: "400",
  subsets: ["latin"],
});

const WalletMultiButton = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function Home() {
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
        <Image
          src="/glootie.png"
          alt="Glootie"
          width={40}
          height={40}
          style={{ borderRadius: "50%", objectFit: "cover" }}
        />
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
        }}
      >
        <WalletMultiButton />
        <h1
          className={chewy.className}
          style={{
            marginTop: "2rem",
            color: "black",
            fontSize: "2.5rem",
            fontWeight: "bold",
          }}
        >
        Memefinderzz
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

        <Link
          href="/inbox"
          style={{
            display: "inline-block",
            marginTop: "1rem",
            color: "#BB00FF",
            backgroundColor: "black",
            padding: "10px 20px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
            marginLeft: "1rem",
          }}
        >
          View Inbox
        </Link>

        <MemeSwipe />
      </main>
    </>
  );
}
