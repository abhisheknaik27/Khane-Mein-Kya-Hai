"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChefHat, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FloatingBackground } from "@/components/layout/FloatingBackground";

interface ErrorViewProps {
  title?: string;
  message?: string;
  isError?: boolean;
  reset?: () => void;
}

export const ErrorView = ({
  title = "Wrong Kitchen!",
  message = "Hey Chef, looks like you landed on the wrong page.",
  isError = false,
  reset,
}: ErrorViewProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#f7efe7]">
      <FloatingBackground />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="relative mb-8">
          <div className="bg-brand-bg-subtle p-8 rounded-full shadow-xl relative">
            <ChefHat size={80} className="text-brand-text-light" />
            <div className="absolute -bottom-2 -right-2 bg-red-400 text-white p-2 rounded-full border-4 border-[#f7efe7]">
              <AlertCircle size={24} />
            </div>
          </div>
        </div>

        <h1 className="heading-merienda text-4xl font-bold text-stone-800 mb-3">
          {title}
        </h1>

        <p className="text-stone-500 text-lg mb-8 leading-relaxed">
          {message}
          {isError && (
            <span className="block text-sm mt-2 text-red-400">
              (Our stove just overheated)
            </span>
          )}
        </p>

        <div className="flex flex-col gap-3 w-full sm:w-auto">
          <Link href="/">
            <Button className="w-full sm:w-auto shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
              <ArrowLeft size={20} /> Take me back to prepare food
            </Button>
          </Link>

          {isError && reset && (
            <Button
              variant="outline"
              onClick={reset}
              className="bg-white/50 border-stone-300"
            >
              Try to cook again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
