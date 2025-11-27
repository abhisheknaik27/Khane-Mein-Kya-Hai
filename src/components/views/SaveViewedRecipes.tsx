import React from "react";
import { Recipe, UserProfile } from "@/types";
import { User } from "firebase/auth";

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
  return (
    <div className="min-h-screen relative">
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
