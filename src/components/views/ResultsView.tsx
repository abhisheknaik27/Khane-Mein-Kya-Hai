/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Recipe } from "@/types";
import {
  AlertCircle,
  Utensils,
  Flame,
  Activity,
  Lock,
  RotateCcw, // Added icon for Start Over
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FloatingBackground } from "@/components/layout/FloatingBackground";
import { User } from "firebase/auth";

// 1. Import the new Layout Components
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

interface ResultsViewProps {
  recipes: Recipe[];
  user: User | null;
  error: string;
  onLogout: () => void;
  onStartOver: () => void;
  t: (key: string, subKey?: string) => string;
  // 2. Add props required by the Header component
  language: string;
  setLanguage: (lang: string) => void;
  onLoginClick: () => void;
}

export const ResultsView = ({
  recipes,
  user,
  error,
  onLogout,
  onStartOver,
  t,
  // Destructure new props
  language,
  setLanguage,
  onLoginClick,
}: ResultsViewProps) => {
  return (
    <div className="min-h-screen p-4 md:p-8 relative flex flex-col items-center">
      <FloatingBackground />

      {/* 3. Add Header Component (replaces old <header>) */}
      <Header
        user={user}
        language={language}
        setLanguage={setLanguage}
        onLoginClick={onLoginClick}
        onLogout={onLogout}
      />

      <div className="max-w-4xl w-full mx-auto space-y-6 relative z-10">
        {/* 4. Sub-Header for "Start Over" and "For User" text 
           (Since Header doesn't have the Start Over button) */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/40 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-sm">
          <div className="text-center md:text-left">
            <h2 className="text-stone-800 font-bold text-lg flex items-center gap-2">
              <span className="bg-[#c1dbe8] text-white p-1 rounded-lg">
                <Utensils size={16} />
              </span>
              Your Personalized Menu
            </h2>
            <p className="text-stone-600 text-sm mt-0.5">
              Curated for{" "}
              <span className="font-bold">{user?.displayName || "You"}</span>
            </p>
          </div>

          <Button
            variant="outline"
            onClick={onStartOver}
            className="bg-white/80 backdrop-blur-sm border-blue-200 text-stone-800 hover:bg-blue-50"
          >
            <RotateCcw size={16} className="mr-2" />
            {t("startOver")}
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-6 flex items-center gap-2 shadow-sm">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {(recipes || []).map((recipe, idx) => (
            <Card
              key={idx}
              className="flex flex-col h-full border-t-4 border-t-[#c1dbe8] hover:shadow-md transition-shadow"
            >
              <div className="mb-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-stone-800">
                    {recipe.title || "Untitled Recipe"}
                  </h3>
                  <span className="bg-[#f1f7fb] text-orange-800 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                    {recipe.difficulty || "Medium"}
                  </span>
                </div>
                <p className="text-sm text-stone-500 mt-1 italic">
                  {recipe.suitability}
                </p>
              </div>

              <div className="bg-stone-50 p-3 rounded-lg mb-4 text-sm text-stone-700">
                <span className="font-semibold text-blue-600">Why:</span>{" "}
                {recipe.matchReason}
              </div>

              <div className="mb-4">
                <h4 className="text-md font-semibold text-stone-700 mb-2 flex items-center gap-2">
                  <Utensils size={16} /> Ingredients
                </h4>
                <ul className="text-md text-stone-600 space-y-1 list-disc pl-4">
                  {(recipe.ingredients || []).map((ing: any, i) => (
                    <li key={i}>
                      {typeof ing === "object" && ing !== null ? (
                        <span>
                          <strong>{ing.item}</strong>
                          {ing.quantity && (
                            <span className="text-stone-400">
                              {" "}
                              ({ing.quantity})
                            </span>
                          )}
                          {ing.notes && (
                            <span className="text-stone-400 italic">
                              {" "}
                              - {ing.notes}
                            </span>
                          )}
                        </span>
                      ) : (
                        ing
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6 grow">
                <h4 className="font-semibold text-stone-700 mb-2 flex items-center gap-2">
                  <Flame size={16} /> Method ({recipe.time})
                </h4>
                <ol className="text-md text-stone-600 space-y-2 list-decimal pl-4 mb-4">
                  {(recipe.method || []).map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <h4 className="font-semibold text-black text-sm md:text-md mb-3 flex items-center gap-2">
                    <Activity size={14} /> Nutrition (Per Serving)
                  </h4>
                  {recipe.nutrition ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm text-stone-700">
                      <div className="flex justify-between">
                        <span>Calories:</span>{" "}
                        <span className="font-medium">
                          {recipe.nutrition.calories}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Protein:</span>{" "}
                        <span className="font-medium">
                          {recipe.nutrition.protein}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Carbs:</span>{" "}
                        <span className="font-medium">
                          {recipe.nutrition.carbs}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fats:</span>{" "}
                        <span className="font-medium">
                          {recipe.nutrition.fats}
                        </span>
                      </div>

                      <div className="col-span-1 md:col-span-2 flex justify-between border-t border-blue-200 pt-2 mt-1">
                        <span>Micronutrients:</span>{" "}
                        <span className="font-medium">
                          {recipe.nutrition.vitamins}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-stone-500 italic">
                      Nutrition info unavailable
                    </div>
                  )}
                </div>
              </div>

              {recipe.variations && (
                <div className="mt-auto pt-4 border-t border-stone-100 text-xs text-stone-500">
                  <span className="font-bold text-stone-700">Tip:</span>{" "}
                  {recipe.variations}
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="bg-linear-to-r from-stone-800 to-stone-900 rounded-xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl mt-8">
          <div className="flex items-center gap-4">
            <div className="bg-[#c1dbe8] p-3 rounded-full">
              <Lock className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Khane Mein Kya Hai PRO</h3>
              <p className="text-stone-300 text-sm">
                Unlock unlimited smart meal ideas & nutrition tracking!
              </p>
            </div>
          </div>
          <Button className="bg-white text-stone-900 hover:bg-stone-100 shadow-none whitespace-nowrap">
            Upgrade Now
          </Button>
        </div>

        <div className="h-8"></div>
      </div>

      {/* 5. Add Footer Component */}
      <Footer />
    </div>
  );
};
