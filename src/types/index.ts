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

export type AppState = "wizard" | "login" | "generating" | "results";
