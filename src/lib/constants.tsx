import {
  Refrigerator,
  Zap,
  Flame,
  Leaf,
  Star,
  AlertCircle,
  Clock,
  Utensils,
} from "lucide-react";
import { StepConfig, FormData, CustomInputs } from "@/types";

export const INGREDIENTS_LIST = [
  "Potato (Aloo)",
  "Onion (Pyaaz)",
  "Tomato",
  "Paneer",
  "Chicken",
  "Eggs",
  "Rice",
  "Atta (Wheat Flour)",
  "Dal (Lentils)",
  "Besan",
  "Spinach (Palak)",
  "Cauliflower (Gobi)",
  "Carrot",
  "Peas (Matar)",
  "Milk",
  "Curd (Dahi)",
  "Bread",
  "Maggi/Pasta",
];

export const APPLIANCES_LIST = [
  "Gas Stove",
  "Induction",
  "Microwave",
  "OTG",
  "Air Fryer",
  "Pressure Cooker",
  "Blender/Mixer",
  "No-Flame/Basic",
];

export const SPICES_LIST = [
  "Haldi (Turmeric)",
  "Red Chilli Powder",
  "Garam Masala",
  "Jeera (Cumin)",
  "Dhania Powder",
  "Mustard Seeds (Rai)",
  "Hing",
  "Ginger/Garlic",
  "Curry Leaves",
  "Black Pepper",
  "Salt",
];

export const OILS_LIST = [
  "Refined Oil",
  "Mustard Oil",
  "Ghee",
  "Butter",
  "Olive Oil",
];
export const FOOD_TYPE_LIST = ["Vegetarian", "Non-Vegetarian", "Eggitarian"];
export const DIET_LIST = [
  "Healthy",
  "Diet Friendly",
  "Protein Rich",
  "Comfort Food",
  "Kids Friendly",
  "Quick & Easy",
];
export const ALLERGIES_LIST = [
  "Dairy",
  "Gluten",
  "Nuts",
  "Soy",
  "Eggs",
  "Seafood",
  "No allergies",
];
export const TIME_LIST = [
  "Under 10 mins",
  "10–20 mins",
  "20–40 mins",
  "40+ mins",
];
export const MEAL_LIST = ["Breakfast", "Lunch", "Dinner", "Snacks"];

export const DEFAULT_OPTIONS = {
  ingredients: INGREDIENTS_LIST,
  appliances: APPLIANCES_LIST,
  spices: [...SPICES_LIST, ...OILS_LIST],
  foodType: FOOD_TYPE_LIST,
  diet: DIET_LIST,
  allergies: ALLERGIES_LIST,
  time: TIME_LIST,
  mealType: MEAL_LIST,
};

export const INITIAL_FORM_DATA: FormData = {
  ingredients: [],
  appliances: [],
  spices: [],
  foodType: "",
  diet: [],
  allergies: [],
  time: "",
  mealType: "",
  recipeCount: "2",
};

export const INITIAL_CUSTOM_INPUTS: CustomInputs = {
  ingredients: "",
  appliances: "",
  spices: "",
  diet: "",
  allergies: "",
};

export const STEPS_CONFIG: StepConfig[] = [
  {
    id: "ingredients",
    titleKey: "ingredients",
    subtitleKey: "ingredients",
    type: "multi",
    options: INGREDIENTS_LIST,
    icon: Refrigerator,
  },
  {
    id: "appliances",
    titleKey: "appliances",
    subtitleKey: "appliances",
    type: "multi",
    options: APPLIANCES_LIST,
    icon: Zap,
  },
  {
    id: "spices",
    titleKey: "spices",
    subtitleKey: "spices",
    type: "multi",
    options: [...SPICES_LIST, ...OILS_LIST],
    icon: Flame,
  },
  {
    id: "foodType",
    titleKey: "foodType",
    subtitleKey: "foodType",
    type: "single",
    options: FOOD_TYPE_LIST,
    icon: Leaf,
  },
  {
    id: "diet",
    titleKey: "diet",
    subtitleKey: "diet",
    type: "multi",
    options: DIET_LIST,
    icon: Star,
  },
  {
    id: "allergies",
    titleKey: "allergies",
    subtitleKey: "allergies",
    type: "multi",
    options: ALLERGIES_LIST,
    icon: AlertCircle,
  },
  {
    id: "time",
    titleKey: "time",
    subtitleKey: "time",
    type: "single",
    options: TIME_LIST,
    icon: Clock,
  },
  {
    id: "mealType",
    titleKey: "mealType",
    subtitleKey: "mealType",
    type: "single",
    options: MEAL_LIST,
    icon: Utensils,
  },
];
