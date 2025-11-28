/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, User, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { app, db } from "@/lib/firebase";
import { ArrowLeft, Zap, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FloatingBackground } from "@/components/layout/FloatingBackground";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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
    color: "bg-green-50 border-green-200",
    recipeCount: 80,
  },
];

export default function BuyCreditsPage() {
  const router = useRouter();
  const auth = getAuth(app);

  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [language, setLanguage] = useState("en");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUserProfile = async (uid: string) => {
    if (!db) return;
    try {
      const userDocRef = doc(db, "users", uid);
      const userSnap = await getDoc(userDocRef);
      const today = new Date().toDateString();

      if (userSnap.exists()) {
        const data = userSnap.data() as UserProfile;

        const safeData = {
          ...data,
          purchasedCredits: data.purchasedCredits || 0,
        };

        if (safeData.lastRequestDate !== today) {
          await updateDoc(userDocRef, {
            requestsUsed: 0,
            lastRequestDate: today,
          });
          setUserProfile({
            ...safeData,
            requestsUsed: 0,
            lastRequestDate: today,
          });
        } else {
          setUserProfile(safeData);
        }
      }
    } catch (e) {
      console.error("Error fetching profile:", e);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        fetchUserProfile(u.uid);
      } else {
        setUserProfile(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const handlePayment = async (plan: (typeof PLANS)[0]) => {
    if (!user) {
      setError("Please log in to purchase credits.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: plan.price,
          planId: plan.id,
          userId: user.uid,
          credits: plan.credits,
          merchantUserId: user.uid,
          mobileNumber: user.phoneNumber || "9999999999",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to initiate payment");

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Invalid payment URL received");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong initializing payment.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center relative p-4">
      <FloatingBackground />

      <Header
        user={user}
        userProfile={userProfile}
        language={language}
        setLanguage={setLanguage}
        onLoginClick={() => router.push("/")}
        onLogout={handleLogout}
        onViewSaved={() => router.push("/")}
        showLanguage={false}
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
              className={`relative bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-2 transition-transform hover:-translate-y-1 ${
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
                  <Zap
                    size={18}
                    className="text-brand-text-accent fill-brand-text-accent"
                  />
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
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-500" />
                  Generate up to{" "}
                  <span className="font-bold">{plan.recipeCount}</span> Recipes
                </li>
              </ul>

              <Button
                onClick={() => handlePayment(plan)}
                disabled={loading}
                className="w-full bg-stone-800 hover:bg-stone-900 text-white"
              >
                {loading ? "Redirecting..." : "Buy Now"}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="mx-auto bg-white/50 border-stone-300 hover:bg-white text-stone-600"
          >
            <ArrowLeft size={20} /> Take me back to kitchen
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
