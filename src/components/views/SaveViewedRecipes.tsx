/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Recipe, UserProfile } from "@/types";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FloatingBackground } from "@/components/layout/FloatingBackground";
import { User } from "firebase/auth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ResultsView } from "./ResultsView"; // Reuse the UI logic!

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
}

export const SavedRecipesView = (props: SavedRecipesViewProps) => {
  return (
    <div className="min-h-screen relative">
      {/* We can actually reuse ResultsView structure but just override the header part. 
           However, reusing ResultsView component directly is cleaner if we just want the list. 
       */}

      <ResultsView
        {...props}
        error=""
        onStartOver={props.onBack}
        t={() => "Back"} // Hacky override for button text
        onViewSaved={() => {}} // Already here
      />
    </div>
  );
};
