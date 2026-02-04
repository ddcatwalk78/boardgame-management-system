import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Board Game Sleeve Manager",
  description: "Manage your board games and sleeves inventory",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${inter.className} min-h-screen bg-white text-gray-900`}
      >
        <Header />

        <main>{children}</main>
      </body>
    </html>
  );
}
