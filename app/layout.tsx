import type { Metadata } from "next";
import "@/styles/tokens.css";

export const metadata: Metadata = {
  title: "Solutions for Freight Brokers | DAT",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
