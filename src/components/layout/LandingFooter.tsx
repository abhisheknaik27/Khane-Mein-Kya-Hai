"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChefHat, Instagram, Mail, Heart } from "lucide-react";

const EMOJIS = ["❤️", "🍕", "🍔", "🍜", "🍰", "🍫"];

export const LandingFooter = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % EMOJIS.length);
    }, 2000); // Cycle every 2 seconds

    return () => clearInterval(interval);
  }, []);
  return (
    <footer className="bg-stone-900 text-stone-300 py-12 border-t border-stone-800 relative z-50 px-4">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
        {/* Brand Column: Full width on mobile, 1/5 on desktop (Shifted Left) */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4 text-white">
            <ChefHat className="text-orange-500" size={24} />
            <span className="font-bold text-xl font-merienda">Genie Bites</span>
          </div>
          <p className="text-sm text-stone-400 leading-relaxed mb-4">
            Transforming your pantry ingredients into culinary masterpieces with
            the power of AI. Cook smarter, not harder.
          </p>
          <div className="flex gap-4">
            <Link
              href="https://www.instagram.com/abhi.naik27/"
              target="_blank"
              className="hover:text-orange-500 transition-colors"
            >
              <Instagram size={20} />
            </Link>
            <Link
              href="mailto:contact@geniebites.com"
              className="hover:text-orange-500 transition-colors"
            >
              <Mail size={20} />
            </Link>
          </div>
        </div>

        {/* Product: 50% on mobile, 1/5 on desktop */}
        <div className="col-span-1 md:col-span-1 md:ml-12">
          <h4 className="text-white font-semibold mb-4">Product</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/genie-bites"
                className="hover:text-white transition-colors"
              >
                Use App
              </Link>
            </li>
            <li>
              <Link
                href="/buy-credits"
                className="hover:text-white transition-colors"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                href="/login"
                className="hover:text-white transition-colors"
              >
                Login / Sign Up
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal: 50% on mobile, 1/5 on desktop */}
        <div className="col-span-1 md:col-span-1">
          <h4 className="text-white font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter: Full width on mobile, 2/5 on desktop */}
        <div className="col-span-2 md:col-span-2">
          <h4 className="text-white font-semibold mb-4">Stay Cooking</h4>
          <p className="text-xs text-stone-500 mb-2">
            Join our newsletter for weekly zero-waste tips.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="bg-stone-800 border-none rounded-lg px-3 py-2 text-sm w-full focus:ring-1 focus:ring-orange-500 outline-none"
            />
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto px-4 pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center text-sm text-stone-400">
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
        <p>© {new Date().getFullYear()} Genie Bites. All rights reserved.</p>
        <div className="flex items-center gap-1 mt-2 md:mt-0">
          <span>Made with</span>
          <span
            key={index}
            className="emoji-fade inline-block w-6 text-center text-xl"
          >
            {EMOJIS[index]}
          </span>
          {/* <Heart size={12} className="text-red-500 fill-red-500" /> */}
          <span>by Abhishek Naik</span>
        </div>
      </div>
    </footer>
  );
};
