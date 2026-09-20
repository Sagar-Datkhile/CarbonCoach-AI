import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CarbonCoach AI — Understand your energy. Make practical changes.",
  description:
    "Turn electricity bills into understandable insights and achievable energy-saving actions with deterministic modeling and private data control.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body
        className="min-h-full flex flex-col font-sans bg-[#FAFBF8] text-[#111827]"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
