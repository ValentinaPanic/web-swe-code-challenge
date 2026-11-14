import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import "@/styles/tokens.css";
import "@/styles/tokens.extensions.css";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const { hero } = await getContent();
  return {
    title: "Solutions for Freight Brokers | DAT",
    description: hero.subheading,
    // No favicon in the design; an empty icon stops the browser's /favicon.ico 404.
    icons: { icon: "data:," },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
