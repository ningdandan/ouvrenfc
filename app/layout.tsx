import type { Metadata } from "next";
import { Pixelify_Sans } from "next/font/google";
import "./globals.css";

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-pixelify",
});

export const metadata: Metadata = {
  title: "Industrial NFC Link",
  description: "Dynamic landing for NFC chips",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pixelify.variable} text-black`}>
      <body className="min-h-screen antialiased bg-[url('/bg.png')] bg-cover bg-center font-[family-name:var(--font-pixelify)]">
        {children}
      </body>
    </html>
  );
}
