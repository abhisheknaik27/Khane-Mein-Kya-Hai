import React from "react";
import { ChefHat } from "lucide-react";

export const ChefLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8 w-full h-full min-h-[150px]">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 border-4 border-stone-100 border-t-brand-primary rounded-full animate-spin"></div>

        <div className="animate-pulse duration-1000">
          <ChefHat size={24} className="text-stone-400" />
        </div>
      </div>
    </div>
  );
};
