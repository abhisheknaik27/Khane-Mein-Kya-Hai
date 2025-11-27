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

  if (!template) {
    throw new Error("Prompt template missing in .env.local");
  }

  // Fix JSON quotes
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
    .replace("__RECIPE_COUNT__", formData.recipeCount);
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
  const apiUrl = process.env.NEXT_PUBLIC_GEMINI_API_URL;

  if (!apiKey) {
    throw new Error("API Key is missing. Check .env.local");
  }

  const count = parseInt(formData.recipeCount) || 2; // Parse count

  // UPDATED: Strict check for API URL. No fallback allowed.
  if (!apiUrl) {
    throw new Error("API URL is missing");
  }

  const response = await fetch(`${apiUrl}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    }),
  });

  if (!response.ok) {
    throw new Error("Chef is busy (API Error). Please try again.");
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
    throw new Error("Invalid recipe format received");
  }

  return parsedRecipes.slice(0, count);
};
