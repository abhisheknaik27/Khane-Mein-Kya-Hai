import React from "react";
import { Recipe, UserProfile } from "@/types";
import { User } from "firebase/auth";
import { BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FloatingBackground } from "@/components/layout/FloatingBackground";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ResultsView } from "./ResultsView";

interface SavedRecipesViewProps {
  recipes: Recipe[];
  user: User | null;
  userProfile: UserProfile | null;
  onLogout: () => void;
  onBack: () => void;
  language: string;
  setLanguage: (lang: string) => void;
  onLoginClick: () => void;
  onSaveRecipe: (recipe: Recipe) => void; // Used to unsave here
  savedRecipeIds: string[];
  showLanguage?: boolean;
}

export const SavedRecipesView = (props: SavedRecipesViewProps) => {
  // If there are recipes, render the standard ResultsView
  if (props.recipes && props.recipes.length > 0) {
    return (
      <div className="min-h-screen relative">
        <ResultsView
          {...props}
          error=""
          onStartOver={props.onBack}
          t={() => "Back"} // Override button text
          onViewSaved={() => {}}
        />
      </div>
    );
  }

  // If NO recipes, render the empty state
  return (
    <div className="min-h-screen flex flex-col items-center relative">
      <FloatingBackground />

      <Header
        user={props.user}
        userProfile={props.userProfile}
        language={props.language}
        setLanguage={props.setLanguage}
        onLoginClick={props.onLoginClick}
        onLogout={props.onLogout}
        onViewSaved={() => {}}
        showLanguage={props.showLanguage}
      />

      <div className="grow flex flex-col items-center justify-center w-full max-w-md px-4 relative z-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-stone-100 flex flex-col items-center">
          <div className="bg-stone-100 p-6 rounded-full mb-6">
            <BookOpen size={48} className="text-stone-400" />
          </div>

          <h2 className="heading-merienda text-2xl font-bold text-stone-800 mb-2">
            Recipes awaiting to be saved Chef
          </h2>

          <p className="text-stone-500 mb-8 leading-relaxed">
            Your cookbook is currently empty. Start cooking to fill these pages
            with delicious ideas!
          </p>

          <Button
            onClick={props.onBack}
            className="w-full sm:w-auto shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            Generate Recipes <ArrowRight size={18} />
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};
