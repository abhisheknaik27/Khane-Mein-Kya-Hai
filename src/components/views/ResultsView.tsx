/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Recipe, UserProfile } from "@/types";
import {
  AlertCircle,
  Utensils,
  RotateCcw,
  Clock,
  ChevronRight,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FloatingBackground } from "@/components/layout/FloatingBackground";
import { User } from "firebase/auth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RecipeModal } from "@/components/ui/RecipeModal";

interface ResultsViewProps {
  recipes: Recipe[];
  user: User | null;
  userProfile: UserProfile | null;
  error: string;
  onLogout: () => void;
  onStartOver: () => void;
  t: (key: string, subKey?: string) => string;
  language: string;
  setLanguage: (lang: string) => void;
  onLoginClick: () => void;
  onSaveRecipe: (recipe: Recipe) => void;
  savedRecipeIds: string[];
  onViewSaved: () => void;
  showLanguage?: boolean;
}

export const ResultsView = ({
  recipes,
  user,
  userProfile,
  error,
  onLogout,
  onStartOver,
  t,
  language,
  setLanguage,
  onLoginClick,
  onSaveRecipe,
  savedRecipeIds,
  onViewSaved,
  showLanguage = false,
}: ResultsViewProps) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  return (
    <div className="min-h-screen p-4 md:p-8 relative flex flex-col items-center ">
      <FloatingBackground />

      <Header
        user={user}
        userProfile={userProfile}
        language={language}
        setLanguage={setLanguage}
        onLoginClick={onLoginClick}
        onLogout={onLogout}
        onViewSaved={onViewSaved}
        showLanguage={showLanguage}
        onLogoClick={onStartOver}
      />

      <div className="max-w-4xl w-full mx-auto space-y-6 relative z-10 grow pt-4 px-2">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/40 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-sm">
          <div className="text-center md:text-left">
            <h2 className="text-stone-800 font-bold text-lg flex items-center gap-2">
              <span className="bg-brand-bg-subtle text-brand-text p-1 rounded-lg">
                <Utensils size={18} />
              </span>
              Your Personalized Menu
            </h2>
          </div>
          <Button
            variant="outline"
            onClick={onStartOver}
            className="bg-white/80 backdrop-blur-sm border-brand-border text-brand-text-dark hover:bg-brand-bg-light"
          >
            <RotateCcw size={16} className="mr-2" />
            {t("startOver")}
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-status-red-bg text-status-red-text rounded-xl mb-6 flex items-center gap-2 shadow-sm">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(recipes || []).map((recipe, idx) => {
            const isSaved = savedRecipeIds.includes(recipe.title);

            return (
              <div
                key={idx}
                className="group bg-white/90 backdrop-blur-sm rounded-2xl p-5 border-2 border-transparent hover:border-brand-border shadow-sm hover:shadow-md transition-all relative cursor-pointer"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSaveRecipe(recipe);
                  }}
                  className={`absolute top-4 right-4 p-2 rounded-full transition-all z-20 ${
                    isSaved
                      ? "bg-status-red-bg text-status-red-text"
                      : "bg-stone-100 text-stone-400 hover:bg-status-red-bg hover:text-status-red-text"
                  }`}
                  title={isSaved ? "Saved" : "Save to Wishlist"}
                >
                  <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
                </button>

                <div className="pr-10">
                  <span className="inline-block bg-[#f1f7fb] text-stone-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide mb-2">
                    {recipe.difficulty}
                  </span>
                  <h3 className="text-lg font-bold text-stone-800 leading-snug mb-1 group-hover:text-brand-text transition-colors">
                    {recipe.title}
                  </h3>
                  <p className="text-xs text-stone-500 italic mb-4 line-clamp-1">
                    {recipe.suitability}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-stone-500 text-xs font-medium bg-stone-50 px-2 py-1 rounded-lg">
                      <Clock size={14} /> {recipe.time}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />

      <RecipeModal
        recipe={selectedRecipe}
        isOpen={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />
    </div>
  );
};
