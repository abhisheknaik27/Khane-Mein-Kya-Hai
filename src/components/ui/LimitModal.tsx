"use client";
import React from "react";
import { X, Zap, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface LimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType: "free" | "pro";
}

export const LimitModal = ({ isOpen, onClose, userType }: LimitModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Zap size={32} className="text-red-500 fill-red-500" />
        </div>

        {/* Text */}
        <h2 className="text-2xl font-bold text-stone-800 mb-2">
          Daily Limit Reached
        </h2>
        <p className="text-stone-600 mb-6">
          You hit the daily limit. Buy credits now or try again tomorrow.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            className="w-full bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
            onClick={() => alert("Payment Gateway Integration would go here!")}
          >
            Buy Credits Now
          </Button>

          {userType === "free" && (
            <p className="text-xs text-stone-400 mt-1">
              Tip: Upgrade to PRO for 3x more daily recipes!
            </p>
          )}

          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full text-stone-500"
          >
            I will wait until tomorrow{" "}
            <CalendarClock size={14} className="ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};
