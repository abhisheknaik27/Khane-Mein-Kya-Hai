import React, { useState, useEffect } from "react";
import { ChefHat, Cake, Croissant, Pizza, Utensils } from "lucide-react";
import { FloatingBackground } from "@/components/layout/FloatingBackground";

export const LoadingView = ({ message }: { message: string }) => {
  const [currentIconIndex, setCurrentIconIndex] = useState(0);

  const icons = [ChefHat, Cake, Pizza, Croissant, Utensils];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIconIndex((prev) => (prev + 1) % icons.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [icons.length]);

  const CurrentIcon = icons[currentIconIndex];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      <FloatingBackground />

      <style>
        {`
          @keyframes icon-slide-up {
            0% { opacity: 0; transform: translateY(10px) scale(0.8); }
            15% { opacity: 1; transform: translateY(0) scale(1); }
            85% { opacity: 1; transform: translateY(0) scale(1); }
            100% { opacity: 0; transform: translateY(-10px) scale(0.8); }
          }
          .animate-icon-cycle {
            animation: icon-slide-up 1.5s ease-in-out forwards;
          }
        `}
      </style>

      <div className="bg-white/90 backdrop-blur-md p-8 rounded-full shadow-xl mb-6 relative z-10 w-32 h-32 flex items-center justify-center ring-4 ring-white/50">
        <div key={currentIconIndex} className="animate-icon-cycle">
          <CurrentIcon size={64} className="text-brand-text-light" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-stone-800 mb-2 relative z-10 animate-in fade-in duration-700">
        {message}
      </h2>
      <p className="text-stone-500 relative z-10 animate-pulse">
        Creating the perfect menu for you...
      </p>
    </div>
  );
};
