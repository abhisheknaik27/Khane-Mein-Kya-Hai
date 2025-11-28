"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";

const EMOJIS = ["❤️", "🍕", "🍔", "🍜", "🍰", "🍫"];

export const Footer = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % EMOJIS.length);
    }, 2000); // Cycle every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="w-full py-4 text-center text-stone-600 text-lg z-10 mt-auto bg-white/50 backdrop-blur-md border-t border-white/20 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.05)] ">
      <style>
        {`
          @keyframes vertical-fade {
            0% { opacity: 0; transform: translateY(8px); }
            20% { opacity: 1; transform: translateY(0); }
            80% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-8px); }
          }
          .emoji-fade {
            animation: vertical-fade 2s ease-in-out forwards;
          }
        `}
      </style>

      <div className="flex flex-col items-center justify-center gap-2 px-4 font-medium mt-1">
        <div className="my-1 flex items-center gap-1.5 flex-wrap justify-center">
          <span>Made with</span>
          <span
            key={index}
            className="emoji-fade inline-block w-6 text-center text-xl"
          >
            {EMOJIS[index]}
          </span>
          <span>by</span>
          <span className="bg-gradient-to-r from-brand-primary to-brand-secondary inline-block text-transparent bg-clip-text font-bold">
            <Link
              href="https://www.instagram.com/abhi.naik27/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Abhishek Naik
            </Link>
          </span>
        </div>

        <div className="text-sm md:text-lg text-stone-500 pb-2">
          <span className="font-semibold bg-gradient-to-r from-brand-primary to-brand-secondary inline-block text-transparent bg-clip-text">
            &ldquo;Khaane Mein Kya Hai&rdquo;
          </span>
          : The Ultimate AI Food Assistant
        </div>
      </div>
    </footer>
  );
};
