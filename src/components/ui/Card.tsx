import React from "react";

export const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-stone-100 p-6 ${className}`}
  >
    {children}
  </div>
);
