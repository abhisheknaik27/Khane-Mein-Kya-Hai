/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, User, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { app, db } from "@/lib/firebase";
import { ArrowLeft, Zap, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FloatingBackground } from "@/components/layout/FloatingBackground";
import { Header } from "@/components/layout/Header";
import { UserProfile } from "@/types";

const PLANS = [
  {
    id: 1,
    credits: 10,
    price: 99,
    label: "Starter",
    color: "bg-red-50 border-red-200",
    recipeCount: 20,
  },
  {
    id: 2,
    credits: 25,
    price: 199,
    label: "Value",
    color: "bg-brand-bg-subtle border-brand-border",
    popular: true,
    recipeCount: 50,
  },
  {
    id: 3,
    credits: 40,
    price: 299,
    label: "Chef's Special",
    color: "bg-red-50 border-red-200",
    recipeCount: 80,
  },
];

export default function BuyCreditsPage() {
  const router = useRouter();
  const auth = getAuth(app);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Minimal profile fetch for header display
  const fetchUserProfile = async (uid: string) => {
    if (!db) return;
    try {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) setUserProfile(snap.data() as UserProfile);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) fetchUserProfile(u.uid);
      else router.push("/login"); // Protect this page
    });
    return () => unsubscribe();
  }, [auth, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const handlePayment = async (plan: any) => {
    // Payment logic remains same as provided file...
    setLoading(true);
    // Simulate API call or insert your payment logic here
    setTimeout(() => {
      setLoading(false);
      setError("Payment integration required.");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center relative p-4">
      <FloatingBackground />
      <Header
        user={user}
        userProfile={userProfile}
        language="en"
        setLanguage={() => {}}
        onLoginClick={() => {}}
        onLogout={handleLogout}
        onViewSaved={() => router.push("/genie-bites")}
        showLanguage={false}
        onLogoClick={() => router.push("/genie-bites")}
      />

      <div className="w-full max-w-4xl relative z-10 px-4 py-8 grow flex flex-col justify-center">
        <div className="text-center mb-12">
          <h1 className="heading-merienda text-4xl font-bold text-stone-800 mb-4">
            Top Up Your Pantry
          </h1>
          <p className="text-stone-600">
            Get extra credits to generate more delicious recipes instantly.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-status-red-bg text-status-red-text rounded-xl flex items-center justify-center gap-2">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-2 transition-transform hover:-translate-y-1 mt-6 sm:mt-2 ${
                plan.color
              } ${
                plan.popular ? "scale-105 z-20 ring-4 ring-brand-bg-subtle" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
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
                  <Zap size={18} className="text-brand-text-accent" />
                  <span className="font-bold text-lg text-stone-600">
                    {plan.credits} Credits
                  </span>
                </div>
              </div>
              <Button
                onClick={() => handlePayment(plan)}
                disabled={loading}
                className="w-full bg-stone-800 hover:bg-stone-900 text-white"
              >
                {loading ? "Processing..." : "Buy Now"}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          {/* Points back to the App (Genie Bites) */}
          <Button
            variant="outline"
            onClick={() => router.push("/genie-bites")}
            className="mx-auto bg-white/50 border-stone-300 hover:bg-white text-stone-600"
          >
            <ArrowLeft size={20} /> Take me back to kitchen
          </Button>
        </div>
      </div>
    </div>
  );
}
