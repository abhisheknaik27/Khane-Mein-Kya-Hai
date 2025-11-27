import React from "react";
import { CustomIcon } from "@/components/ui/Icons";

export const FloatingBackground = () => {
  const icons = [
    "pizza",
    "burger",
    "noodles",
    "hotdog",
    "icecream",
    "carrot",
    "spinach",
    "vegetables",
    "pasta",
    "bread",
    "utensil",
    "whisk",
    "cake",
  ];

  const gridIcons = [
    ...icons,
    ...icons,
    ...icons,
    ...icons,
    ...icons,
    ...icons,
    ...icons,
    ...icons,
    ...icons,
    ...icons,
  ];

  return (
    <div className="h-screen fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#f7efe7]">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes float-tilt-right {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(15deg); } 
          }
          @keyframes float-tilt-left {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(-15deg); } 
          }
        `,
        }}
      />
      <div className="absolute inset-0 opacity-[0.04] grid grid-cols-4 md:grid-cols-8 gap-10 p-4 justify-items-center content-start h-full w-full overflow-y-hidden">
        {gridIcons.map((icon, index) => (
          <div
            key={index}
            style={{
              animation: `${
                index % 2 === 0 ? "float-tilt-right" : "float-tilt-left"
              } 8s ease-in-out infinite`,
              animationDelay: `${(index % 5) * 0.5}s`,
            }}
          >
            <div style={{ transform: `scale(${0.8 + (index % 3) * 0.15})` }}>
              <CustomIcon name={icon} className="w-12 h-12 text-stone-900" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
