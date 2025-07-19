import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HeyPlay - Sync. Stream. Enjoy Together.",
  description:
    "Create rooms, invite friends, and enjoy synchronized music and video playback together.",
  keywords: ["music", "streaming", "sync", "collaborative", "rooms", "social"],
  authors: [{ name: "HeyPlay Team" }],
  openGraph: {
    title: "HeyPlay - Sync. Stream. Enjoy Together.",
    description:
      "Create rooms, invite friends, and enjoy synchronized music and video playback together.",
    url: "https://heyplay.com",
    siteName: "HeyPlay",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HeyPlay - Sync. Stream. Enjoy Together.",
    description:
      "Create rooms, invite friends, and enjoy synchronized music and video playback together.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}
