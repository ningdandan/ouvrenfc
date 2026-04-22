import type { Metadata } from "next";
import "./globals.css";
import { NetworkToast } from "./network-toast";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ouvre connect",
  description: "Dynamic landing for Ouvre NFC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-[100svh] min-h-dvh antialiased">
        <NetworkToast />
        {children}
        <div className="fixed inset-0 z-[100] pointer-events-none">
          <div className="w-full max-w-[420px] mx-auto h-full relative">
            <a
              href="https://www.ouvre.nyc"
              target="_blank"
              rel="noreferrer"
              className={`powered-by-ouvre pointer-events-auto absolute bottom-4 left-4 text-xs tracking-[0.04em] text-white hover:opacity-85 transition-opacity ${spaceGrotesk.className}`}
            >
              powered by ouvre
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
