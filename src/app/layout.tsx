import type { Metadata } from "next";
import "./globals.css";
import { Roboto, Merienda } from "next/font/google";
import { Footer } from "@/components/layout/Footer";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

const merienda = Merienda({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-merienda",
});

export const metadata: Metadata = {
  title: "Genie Bites - Your AI Kitchen Assistant",
  description:
    "Genie Bites (Khane Mein Kya Hai) turns your leftover ingredients into delicious recipes instantly. The ultimate AI recipe generator for Indian cooking, supporting regional languages (Hindi, Marathi, etc.). Reduce food waste and cook smarter with what you have in your pantry.",
  keywords: [
    "AI recipe generator",
    "Indian cooking app",
    "pantry recipes",
    "food waste reducer",
    "Genie Bites",
    "cooking assistant",
    "recipe maker",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${merienda.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
