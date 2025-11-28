import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google Auth images usually come from here
      },
      {
        protocol: "https",
        hostname: "googleusercontent.com", // Fallback
      },
    ],
  },
};

export default nextConfig;
