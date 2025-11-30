import { ElementType } from "react";

export interface Nutrition {
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  vitamins: string;
}

export interface Recipe {
  title: string;
  suitability: string;
  matchReason: string;
  ingredients: string[];
  method: string[];
  time: string;
  difficulty: string;
  variations?: string;
  nutrition: Nutrition;
}

export interface FormData {
  ingredients: string[];
  appliances: string[];
  spices: string[];
  foodType: string;
  diet: string[];
  allergies: string[];
  time: string;
  mealType: string;
  recipeCount: string;
  [key: string]: string | string[];
}

export interface CustomInputs {
  ingredients: string;
  appliances: string;
  spices: string;
  diet: string;
  allergies: string;
  [key: string]: string;
}

export interface StepConfig {
  id: string;
  titleKey: string;
  subtitleKey: string;
  type: "multi" | "single";
  options: string[];
  icon: ElementType;
}
// Add this to your existing types
export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  userType: "free" | "pro";
  requestsUsed: number;
  lastRequestDate: string; // Stored as "Mon Nov 27 2025" string for easy comparison
  purchasedCredits: number; // <--- NEW FIELD
}

// Add to your existing constants or just keep in mind
export const LIMITS = {
  free: 8,
  pro: 24,
};

export type AppState =
  | "landing"
  | "wizard"
  | "login"
  | "generating"
  | "results"
  | "saved-recipes";
