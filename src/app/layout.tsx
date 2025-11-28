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
  title: "Khane Mein Kya Hai",
  description:
    "Khane Mein Kya Hai is an AI-powered cooking assistant that creates personalized recipes based on what you already have at home. Select your ingredients, appliances, spices, and dietary preferences. The app instantly suggests delicious, easy-to-cook meals tailored to your kitchen. Zero waste, maximum flavor.",
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
        <Footer/>
      </body>
    </html>
  );
}
