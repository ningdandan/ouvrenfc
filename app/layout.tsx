import type { Metadata } from "next";
import "./globals.css";
import { NetworkToast } from "./network-toast";

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
      </body>
    </html>
  );
}
