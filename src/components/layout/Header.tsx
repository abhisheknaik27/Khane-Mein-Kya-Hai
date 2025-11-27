import React, { useState } from "react";
import { User } from "firebase/auth";
import { ChefHat, Globe, Check, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LANGUAGES, t } from "@/lib/translations";

interface HeaderProps {
  user: User | null;
  language: string;
  setLanguage: (lang: string) => void;
  onLoginClick: () => void;
  onLogout: () => void;
}

export const Header = ({
  user,
  language,
  setLanguage,
  onLoginClick,
  onLogout,
}: HeaderProps) => {
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  return (
    <div className="w-full max-w-2xl mt-4 mb-8 flex items-center justify-between relative z-20">
      <div className="flex items-center gap-2">
        <div className="bg-[#c1dbe8] text-white p-2 rounded-lg">
          <ChefHat size={26} />
        </div>
        <span className="heading-merienda text-xl font-bold text-stone-800 tracking-tight sm:hidden">
          KKMH AI
        </span>

        <span className="heading-merienda text-2xl font-bold text-stone-800 tracking-tight hidden sm:inline">
          KHANE MEIN KYA HAI AI
        </span>
      </div>
      <div className="flex items-center gap-3">
        {/* Language Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-stone-200 text-xs text-stone-600 hover:text-stone-800 transition-colors"
          >
            <Globe size={15} />
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
                  className={`w-full text-left px-4 py-2 text-md hover:bg-blue-50 transition-colors flex items-center justify-between ${
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

        {/* Auth Buttons */}
        {user ? (
          // LOGGED-IN UI
          <div className="flex items-center gap-2">
            {/* Desktop/Tablet: Show Welcome Text */}
            <span className="text-md font-bold text-stone-600 bg-[#e3ebef] px-3 py-1 rounded-xl hidden sm:inline-block">
              {t(language, "welcome")}, {user.displayName}
            </span>

            {/* Logout Icon (visible everywhere) */}
            <Button
              variant="ghost"
              className="p-1 h-auto text-stone-400 hover:text-[#c1dbe8] hover:bg-blue-50 bg-white/80 backdrop-blur-sm shadow-sm"
              onClick={onLogout}
              title={t(language, "logout")}
            >
              <LogOut size={16} />
            </Button>
          </div>
        ) : (
        
          <>
            {/* Mobile: ONLY icon */}
            <Button
              variant="ghost"
              className="sm:hidden p-1 h-auto text-stone-600 hover:text-[#c1dbe8] bg-white/80 backdrop-blur-sm shadow-sm"
              onClick={onLoginClick}
              title={t(language, "login")}
            >
              <UserIcon size={18} />
            </Button>

            {/* Desktop/Tablet: Full Login Button */}
            <Button
              variant="ghost"
              className="hidden sm:flex text-[16px] px-2 py-1 bg-white/90 shadow-sm border border-stone-100 text-stone-600 hover:text-[#c1dbe8] backdrop-blur-sm"
              onClick={onLoginClick}
            >
              <UserIcon size={15} className="mr-1" /> {t(language, "login")}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
