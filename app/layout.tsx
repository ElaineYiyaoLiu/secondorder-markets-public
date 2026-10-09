import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SecondOrder Markets | Markets, translated. [Under Construction]",
  description: "把行情讲明白。Bilingual explanations of candlesticks, volume and changes in US stocks and ETFs.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
