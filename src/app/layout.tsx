import "./globals.css";
import type { Metadata } from "next";
import WalletConnectionProvider from "./WalletConnectionProvider";

export const metadata: Metadata = {
  title: "Memefinderrz",
  description: "Find and swipe memes!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WalletConnectionProvider>{children}</WalletConnectionProvider>
      </body>
    </html>
  );
}
