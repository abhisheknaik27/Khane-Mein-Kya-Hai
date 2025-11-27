"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link"; // Changed: Import Link
import { User } from "firebase/auth";
import { UserProfile } from "@/types";
import {
  ChefHat,
  Globe,
  Check,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Zap,
  Crown,
  BookHeart,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LANGUAGES, t } from "@/lib/translations";
import { ChefLoader } from "@/components/ui/ChefLoader";
import Image from "next/image";

interface HeaderProps {
  user: User | null;
  userProfile: UserProfile | null;
  language: string;
  setLanguage: (lang: string) => void;
  onLoginClick: () => void;
  onLogout: () => void;
  onViewSaved?: () => void;
  showLanguage?: boolean;
}

export const Header = ({
  user,
  userProfile,
  language,
  setLanguage,
  onLoginClick,
  onLogout,
  onViewSaved,
  showLanguage = true,
}: HeaderProps) => {
  // Removed: const router = useRouter();
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setShowLangDropdown(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const maxRequests = userProfile?.userType === "pro" ? 24 : 8;
  const used = userProfile?.requestsUsed || 0;
  const remaining = Math.max(0, maxRequests - used);
  const isPro = userProfile?.userType === "pro";

  return (
    <header className="w-full px-4 md:px-12 py-4 flex items-center justify-between relative z-50">
      {/* LEFT: Logo & Name */}
      <div className="flex items-center gap-2">
        <div className="bg-[#c1dbe8] text-white p-2 rounded-lg shadow-sm">
          <ChefHat size={28} />
        </div>
        <span className="heading-merienda text-3xl font-bold text-stone-800 tracking-tight hidden sm:block pl-2">
          Khaane Mein Kya Hai
        </span>
      </div>

      {/* RIGHT: Language & User Dropdown */}
      <div className="flex items-center gap-4">
        {/* Language Dropdown */}
        {showLanguage && (
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-sm border border-stone-200 text-xs text-stone-600 hover:text-stone-800 transition-colors"
            >
              <Globe size={26} />
              <span className="uppercase font-medium text-[14px]">
                {language}
              </span>
            </button>
            {showLangDropdown && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-stone-100 overflow-hidden z-50 max-h-60 overflow-y-auto">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLangDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-md hover:bg-blue-50 transition-colors flex items-center justify-between ${
                      language === lang.code
                        ? "text-[#292f17] font-medium bg-blue-50"
                        : "text-stone-600"
                    }`}
                  >
                    {lang.name} {language === lang.code && <Check size={16} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* User Profile Dropdown */}
        {user ? (
          <div className="relative" ref={userRef}>
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm pl-1 pr-3 py-1 rounded-full border border-stone-200 shadow-sm hover:shadow-md transition-all"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  isPro
                    ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                    : "bg-stone-400"
                }`}
              >
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : user.displayName ? (
                  user.displayName.charAt(0).toUpperCase()
                ) : (
                  "U"
                )}
              </div>
              <ChevronDown size={16} className="text-stone-400" />
            </button>

            {showUserDropdown && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-stone-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {!userProfile ? (
                  <ChefLoader />
                ) : (
                  <>
                    <div className="p-4 border-b border-stone-100 bg-stone-50/50">
                      <p className="font-bold text-stone-800 truncate text-lg">
                        {user.displayName || "Chef"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                            isPro
                              ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                              : "bg-stone-100 text-stone-500 border-stone-200"
                          }`}
                        >
                          {isPro ? "PRO MEMBER" : "FREE USER"}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-stone-500 flex items-center gap-1">
                          <Zap size={14} /> Daily Requests
                        </span>
                        <span
                          className={`font-bold ${
                            remaining === 0 ? "text-red-500" : "text-stone-700"
                          }`}
                        >
                          {remaining} left
                        </span>
                      </div>
                      <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            isPro ? "bg-yellow-400" : "bg-[#c1dbe8]"
                          }`}
                          style={{
                            width: `${(remaining / maxRequests) * 100}%`,
                          }}
                        />
                      </div>
                      {!isPro && (
                        // Changed: Replaced <button> with <Link>
                        <Link
                          href="/buy-credits"
                          onClick={() => setShowUserDropdown(false)}
                          className="w-full mt-4 text-xs flex items-center justify-center gap-1 bg-gradient-to-r from-stone-800 to-stone-900 text-white py-2.5 rounded-lg hover:opacity-90 transition-opacity font-medium"
                        >
                          <Crown size={14} /> Buy More Credits
                        </Link>
                      )}
                    </div>

                    <div className="p-2 border-t border-stone-100 space-y-1">
                      <button
                        onClick={() => {
                          if (onViewSaved) onViewSaved();
                          setShowUserDropdown(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-stone-600 hover:bg-stone-50 rounded-lg transition-colors"
                      >
                        <BookHeart size={18} className="text-orange-500" />{" "}
                        Saved Recipes
                      </button>

                      <button
                        onClick={() => {
                          onLogout();
                          setShowUserDropdown(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <LogOut size={18} /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ) : (
          <Button
            variant="ghost"
            className="text-[16px] px-3 md:px-4 py-2 bg-white/90 shadow-sm border border-stone-100 text-stone-600 hover:text-[#c1dbe8] backdrop-blur-sm rounded-full"
            onClick={onLoginClick}
          >
            <UserIcon size={16} className="md:mr-2" />
            <span className="hidden md:inline">{t(language, "login")}</span>
          </Button>
        )}
      </div>
    </header>
  );
};
