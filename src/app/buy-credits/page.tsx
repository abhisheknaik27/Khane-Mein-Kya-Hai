/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
// Removed Razorpay Script
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import { app } from "@/lib/firebase";
import { ArrowLeft, Zap, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FloatingBackground } from "@/components/layout/FloatingBackground";

// Removed global Window interface for Razorpay

// Updated PLANS with dynamic recipe counts (1 Credit = 2 Recipes)
const PLANS = [
  {
    id: 1,
    credits: 10,
    price: 99,
    label: "Starter",
    color: "bg-blue-50 border-blue-200",
    recipeCount: 20, // 10 * 2
  },
  {
    id: 2,
    credits: 25,
    price: 199,
    label: "Value",
    color: "bg-orange-50 border-orange-200",
    popular: true,
    recipeCount: 50, // 25 * 2
  },
  {
    id: 3,
    credits: 40,
    price: 299,
    label: "Chef's Special",
    color: "bg-green-50 border-green-200",
    recipeCount: 80, // 40 * 2
  },
];

export default function BuyCreditsPage() {
  const router = useRouter();
  const auth = getAuth(app);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async (plan: (typeof PLANS)[0]) => {
    const user = auth.currentUser;
    if (!user) {
      setError("Please log in to purchase credits.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Initiate Payment with PhonePe (via your backend)
      // PhonePe requires server-side checksum generation.
      const res = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: plan.price,
          planId: plan.id,
          userId: user.uid,
          credits: plan.credits,
          // PhonePe often requires a mobile number or unique merchant user id
          merchantUserId: user.uid,
          mobileNumber: user.phoneNumber || "9999999999", // Fallback or prompt user if needed
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to initiate payment");

      // 2. Redirect to PhonePe Payment Page
      // Unlike Razorpay's modal, PhonePe uses a full page redirect.
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Invalid payment URL received");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong initializing payment.");
      setLoading(false); // Only stop loading if we didn't redirect
    }
  };

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center relative">
      <FloatingBackground />
      {/* Removed Razorpay Script Tag */}

      <div className="w-full max-w-4xl relative z-10">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="mb-8 hover:bg-white/50"
        >
          <ArrowLeft size={20} /> Back to Kitchen
        </Button>

        <div className="text-center mb-12">
          <h1 className="heading-merienda text-4xl font-bold text-stone-800 mb-4">
            Top Up Your Pantry
          </h1>
          <p className="text-stone-600">
            Get extra credits to generate more delicious recipes instantly.
            <br />
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-100 text-red-700 rounded-xl flex items-center justify-center gap-2">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-2 transition-transform hover:-translate-y-1 ${
                plan.color
              } ${plan.popular ? "scale-105 z-20 ring-4 ring-orange-100" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  MOST POPULAR
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-stone-500 uppercase tracking-wider">
                  {plan.label}
                </h3>
                <div className="flex items-center justify-center gap-1 my-4 text-stone-800">
                  <span className="text-2xl font-bold">₹</span>
                  <span className="text-5xl font-extrabold">{plan.price}</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-stone-100">
                  <Zap size={18} className="text-orange-500 fill-orange-500" />
                  <span className="font-bold text-lg text-stone-400">
                    {plan.credits} Credits
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 text-sm text-stone-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-500" /> No
                  Expiry Date
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-500" /> Use
                  anytime
                </li>
                {/* Dynamically render the recipe count for each card */}
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-500" />
                  Generate up to{" "}
                  <span className="font-bold">{plan.recipeCount}</span> Recipes
                </li>
              </ul>

              <Button
                // onClick={() => handlePayment(plan)}
                disabled={loading}
                className="w-full bg-stone-800 hover:bg-stone-900 text-white"
              >
                {loading ? "Redirecting..." : "Buy Now"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
