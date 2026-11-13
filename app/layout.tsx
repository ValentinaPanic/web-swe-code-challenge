import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import "@/styles/tokens.css";

export async function generateMetadata(): Promise<Metadata> {
  const { hero } = await getContent();
  return {
    title: "Solutions for Freight Brokers | DAT",
    description: hero.subheading,
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
