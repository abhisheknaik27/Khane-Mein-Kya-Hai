/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Recipe } from "@/types";
import { X, Clock, Flame, Utensils, Activity } from "lucide-react";

interface RecipeModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RecipeModal = ({ recipe, isOpen, onClose }: RecipeModalProps) => {
  if (!isOpen || !recipe) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
        <div className="px-6 py-8 border-b border-stone-100 flex justify-between items-start bg-stone-50">
          <div>
            <h2 className="text-2xl font-bold text-stone-800 leading-tight pr-8">
              {recipe.title}
            </h2>
            <div className="flex gap-2 mt-2">
              <span className="bg-brand-bg-subtle text-brand-text-dark text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <Clock size={12} /> {recipe.time}
              </span>
              <span className="bg-brand-bg-subtle text-brand-text-dark text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <Flame size={12} /> {recipe.difficulty}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-200 transition-colors shadow-sm"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 custom-scrollbar">
          <div className="bg-stone-50 p-3 rounded-xl mb-6 text-sm text-stone-700 border border-stone-100">
            <span className="font-semibold text-brand-text">Why :</span>{" "}
            {recipe.matchReason}
          </div>

          <div className="mb-6">
            <h3 className="font-bold text-lg text-stone-800 mb-3 flex items-center gap-2">
              <Utensils size={18} className="text-brand-text-accent" />{" "}
              Ingredients
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
              {(recipe.ingredients || []).map((ing: any, i) => (
                <li
                  key={i}
                  className="text-md text-stone-600 bg-white border border-stone-100 p-2 rounded-lg flex items-start gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 shrink-0" />
                  {typeof ing === "object" ? (
                    <span>
                      <span className="font-medium text-stone-800">
                        {ing.item}
                      </span>
                      {ing.quantity && (
                        <span className="text-stone-500">
                          {" "}
                          ({ing.quantity})
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

          <div className="mb-8 mr-8 text-justify">
            <h3 className="font-bold text-lg text-stone-800 mb-3 flex items-center gap-2">
              <Flame size={18} className="text-status-red-text" /> Instructions
            </h3>
            <ol className="space-y-4">
              {(recipe.method || []).map((step, i) => (
                <li
                  key={i}
                  className="flex gap-4 text-stone-700 align-center items-center"
                >
                  <span className="shrink-0 w-6 h-6 rounded-full border-1 border-stone-600  text-black flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <p className="mt-0.5 text-md">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {recipe.nutrition && (
            <div className="bg-brand-bg-light p-4 rounded-xl border border-brand-border">
              <h4 className="font-semibold text-stone-800 mb-3 flex items-center gap-2">
                <Activity size={16} className="text-brand-text" /> Nutrition
                (Per Serving)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <div className="text-xs text-stone-500">Calories</div>
                  <div className="font-bold text-stone-800">
                    {recipe.nutrition.calories}
                  </div>
                </div>
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <div className="text-xs text-stone-500">Protein</div>
                  <div className="font-bold text-stone-800">
                    {recipe.nutrition.protein}
                  </div>
                </div>
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <div className="text-xs text-stone-500">Carbs</div>
                  <div className="font-bold text-stone-800">
                    {recipe.nutrition.carbs}
                  </div>
                </div>
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <div className="text-xs text-stone-500">Fats</div>
                  <div className="font-bold text-stone-800">
                    {recipe.nutrition.fats}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
