import type { Metadata } from "next";
import { Inter, Cinzel, Cinzel_Decorative } from "next/font/google";
import "./globals.css";
import Preloader from "@/components/Preloader"; // <-- Imported Preloader

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-cinzel-decorative",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Mahabali: Lost on the Open Web",
  description: "An online Onam-themed mystery hunt by FOSS Club.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Added data-scroll-behavior="smooth" to fix the Next.js transition warning
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${cinzel.variable} ${cinzelDecorative.variable} antialiased bg-onam-ivory text-onam-green`}
      >
        <Preloader /> {/* <-- Injected the cinematic preloader here */}
        {children}
      </body>
    </html>
  );
}