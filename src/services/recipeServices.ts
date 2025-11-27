/* eslint-disable @typescript-eslint/no-explicit-any */
import { LANGUAGES } from "@/lib/translations";
import { FormData, CustomInputs, Recipe } from "@/types";

// Helper to format the data for the prompt
const formatIngredientData = (
  formData: FormData,
  customInputs: CustomInputs,
  key: string
) => {
  const selected = Array.isArray(formData[key])
    ? formData[key].join(", ")
    : formData[key];
  const custom = customInputs[key] || "";

  if (selected && custom) return `${selected}, ${custom}`;
  return selected || custom || "None";
};

// Helper to construct the final prompt from the Env Template
const constructPrompt = (
  formData: FormData,
  customInputs: CustomInputs,
  langName: string,
  langCode: string
) => {
  let template = process.env.NEXT_PUBLIC_GEMINI_PROMPT_TEMPLATE;

  // Fallback template if env var is missing or empty (Safety Net)
  if (!template) {
    console.warn(
      "Prompt template missing in .env.local, using default fallback."
    );
    template = `Act as an expert Indian Chef.
    Ingredients: __INGREDIENTS__
    Appliances: __APPLIANCES__
    Spices: __SPICES__
    Diet: __DIET__
    Allergies: __ALLERGIES__
    Meal: __MEAL__
    Language: __LANGUAGE_NAME__
    Recipe Count: __RECIPE_COUNT__
    
    Generate __RECIPE_COUNT__ recipes in JSON format.
    Output Schema (JSON Array): [{"title": "Recipe Name", "suitability": "Tag", "matchReason": "Why", "ingredients": ["Item"], "method": ["Step"], "time": "Time", "difficulty": "Level", "variations": "Note", "nutrition": {"calories": "val", "protein": "val", "carbs": "val", "fats": "val", "vitamins": "val"}}]
    
    IMPORTANT: Ingredients must be a simple Array of Strings. Return ONLY valid JSON.`;
  }

  // Fix JSON quotes (replace single quotes with double if template uses singles)
  template = template.replace(/'/g, '"');

  // Replace Placeholders
  return template
    .replace(
      "__INGREDIENTS__",
      formatIngredientData(formData, customInputs, "ingredients")
    )
    .replace(
      "__APPLIANCES__",
      formatIngredientData(formData, customInputs, "appliances")
    )
    .replace(
      "__SPICES__",
      formatIngredientData(formData, customInputs, "spices")
    )
    .replace("__PREFERENCE__", formData.foodType as string)
    .replace("__DIET__", formatIngredientData(formData, customInputs, "diet"))
    .replace(
      "__ALLERGIES__",
      formatIngredientData(formData, customInputs, "allergies")
    )
    .replace("__TIME__", formData.time as string)
    .replace("__MEAL__", formData.mealType as string)
    .replace("__LANGUAGE_NAME__", langName)
    .replace("__LANGUAGE_CODE__", langCode)
    .replace(/__RECIPE_COUNT__/g, formData.recipeCount || "2");
};

export const generateRecipesFromAI = async (
  formData: FormData,
  customInputs: CustomInputs,
  languageCode: string
): Promise<Recipe[]> => {
  const currentLangName =
    LANGUAGES.find((l) => l.code === languageCode)?.name || "English";

  const prompt = constructPrompt(
    formData,
    customInputs,
    currentLangName,
    languageCode
  );

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  // Use a default URL if env is missing to prevent crashes
  const apiUrl =
    process.env.NEXT_PUBLIC_GEMINI_API_URL ||
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent";

  if (!apiKey) {
    throw new Error("API Key is missing. Check .env.local");
  }

  try {
    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" },
      }),
    });

    if (!response.ok) {
      // DEBUG: Read the actual error from Google
      const errorBody = await response.text();
      console.error("Gemini API Error Details:", errorBody);
      throw new Error(
        `Chef is busy (API Error: ${response.status}). Check console for details.`
      );
    }

    const data = await response.json();
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (text) {
      text = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
    }

    const parsedRecipes = JSON.parse(text);

    if (!Array.isArray(parsedRecipes)) {
      throw new Error("Invalid recipe format received from Chef");
    }

    // Ensure we respect the count requested
    const count = parseInt(formData.recipeCount) || 2;
    return parsedRecipes.slice(0, count);
  } catch (error: any) {
    console.error("Recipe Generation Error:", error);
    throw error; // Re-throw to be handled by the UI
  }
};
