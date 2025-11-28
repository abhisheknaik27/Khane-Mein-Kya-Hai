import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  title?: string;
}

export const Button = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
  type = "button",
  title,
}: ButtonProps) => {
  const baseStyle =
    "px-6 py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 active:scale-95";

  const variants = {
    // Global Brand Gradient
    primary:
      "bg-gradient-to-r from-brand-primary to-brand-secondary text-white hover:from-brand-primary-hover hover:to-brand-secondary-hover shadow-lg shadow-brand-border disabled:opacity-50 disabled:cursor-not-allowed",
    secondary:
      "bg-stone-300 text-stone-700 hover:bg-stone-300 disabled:opacity-50",
    // Global Brand Outline
    outline:
      "border-2 border-brand-border text-brand-text hover:bg-brand-bg-light",
    ghost: "text-stone-500 hover:text-stone-800",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
