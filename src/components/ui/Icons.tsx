import React from "react";
import {
  ChefHat,
  Pizza,
  IceCream,
  Carrot,
  Leaf,
  Salad,
  Cake,
  Utensils,
} from "lucide-react";

export const CustomIcon = ({
  name,
  className,
}: {
  name: string;
  className?: string;
}) => {
  // ... Paste your icons mapping object here ...
  // For brevity, using your switch logic or map:
  const icons: Record<string, React.ReactNode> = {
    pizza: <Pizza className={className} />,
    icecream: <IceCream className={className} />,
    carrot: <Carrot className={className} />,
    spinach: <Leaf className={className} />,
    vegetables: <Salad className={className} />,
    cake: <Cake className={className} />,
    bread: <Utensils className={className} />, // Simplified for example, paste your SVGs here
    // ... paste the rest of your SVG icons from the original file ...
  };

  return <>{icons[name] || <ChefHat className={className} />}</>;
};
