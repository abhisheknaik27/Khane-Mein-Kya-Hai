/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// --- Local Imports ---
import { AppState, FormData, CustomInputs, Recipe } from "@/types";
import {
  INITIAL_FORM_DATA,
  INITIAL_CUSTOM_INPUTS,
  STEPS_CONFIG,
} from "@/lib/constants";
import { auth, db, firebaseError } from "@/lib/firebase";
import { t } from "@/lib/translations";
import { generateRecipesFromAI } from "@/services/recipeServices";

// --- View Components ---
import { LoadingView } from "@/components/views/LoadingView";
import { ResultsView } from "@/components/views/ResultsView";
import { WizardView } from "@/components/views/WizardView";
import { LoginView } from "@/components/views/LoginView";

export default function KhaneMeinKyaHai() {
  // --- State Management ---
  const [currentStep, setCurrentStep] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState("en");

  // Data State
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [customInputs, setCustomInputs] = useState<CustomInputs>(
    INITIAL_CUSTOM_INPUTS
  );

  // App Logic State
  const [appState, setAppState] = useState<AppState>("wizard");
  const [loginIntent, setLoginIntent] = useState<"generate" | "resume">(
    "resume"
  );
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loadingMsg, setLoadingMsg] = useState("Thinking...");
  const [error, setError] = useState("");

  // Login Form State
  const [isSignUp, setIsSignUp] = useState(true);
  const [loginForm, setLoginForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [authLoading, setAuthLoading] = useState(false);

  // --- Effects ---
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // Handlers

  const updateFormData = (key: string, value: string, isMulti: boolean) => {
    setFormData((prev) => {
      if (isMulti) {
        const current = (prev[key] as string[]) || [];
        if (current.includes(value)) {
          return { ...prev, [key]: current.filter((item) => item !== value) };
        } else {
          return { ...prev, [key]: [...current, value] };
        }
      } else {
        return { ...prev, [key]: value };
      }
    });
  };

  const updateCustomInput = (key: string, value: string) => {
    setCustomInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleStartOver = () => {
    setFormData(INITIAL_FORM_DATA);
    setCustomInputs(INITIAL_CUSTOM_INPUTS);
    setCurrentStep(0);
    setRecipes([]);
    setAppState("wizard");
  };

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);

      // FIX: Reset all state variables to clear inputs and go to step 1
      setFormData(INITIAL_FORM_DATA);
      setCustomInputs(INITIAL_CUSTOM_INPUTS);
      setCurrentStep(0); // This takes you back to the first page
      setRecipes([]);

      setAppState("wizard");
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS_CONFIG.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      if (user) {
        generateRecipes();
      } else {
        setLoginIntent("generate");
        setAppState("login");
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!auth) {
      setError("Firebase configuration missing. Cannot login.");
      return;
    }

    setAuthLoading(true);

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          loginForm.email,
          loginForm.password
        );
        await updateProfile(userCredential.user, {
          displayName: loginForm.name,
        });
      } else {
        await signInWithEmailAndPassword(
          auth,
          loginForm.email,
          loginForm.password
        );
      }

      if (loginIntent === "generate") {
        generateRecipes();
      } else {
        setAppState("wizard");
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      // Simple error mapping
      if (err.code === "auth/email-already-in-use") {
        setError("Email already registered.");
      } else if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else {
        setError(err.message || "Authentication failed.");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // --- Main AI Logic (Delegated to Service) ---
  const generateRecipes = async () => {
    setAppState("generating");
    setError("");
    setLoadingMsg("Checking your pantry...");

    try {
      // 1. Call the separated service
      const fetchedRecipes = await generateRecipesFromAI(
        formData,
        customInputs,
        language
      );

      // 2. Update state
      setRecipes(fetchedRecipes);
      setAppState("results");

      // 3. Analytics (Side Effect)
      if (auth && auth.currentUser && db) {
        try {
          await addDoc(
            collection(
              db,
              "users", // simplified path
              auth.currentUser.uid,
              "recipe_requests"
            ),
            {
              request: { ...formData, customInputs },
              timestamp: serverTimestamp(),
            }
          );
        } catch (e) {
          console.log("Analytics save failed", e);
        }
      }
    } catch (err: any) {
      console.error("Generation Error:", err);
      setError(err.message || "Oops! The chef dropped the plate.");
      if (appState !== "results") setAppState("login");
    }
  };

  // --- Render ---
  return (
    <div className="min-h-screen relative">
      {/* 1. Loading State */}
      {appState === "generating" && <LoadingView message={loadingMsg} />}

      {/* 2. Results State */}
      {appState === "results" && (
        <ResultsView
          recipes={recipes}
          user={user}
          error={error}
          onLogout={handleLogout}
          onStartOver={handleStartOver}
          t={(k, sk) => t(language, k, sk)}
          language={language}
          setLanguage={setLanguage}
          onLoginClick={() => {
            setLoginIntent("resume");
            setAppState("login");
          }}
        />
      )}

      {/* 3. Login State */}
      {appState === "login" && (
        <LoginView
          isSignUp={isSignUp}
          setIsSignUp={setIsSignUp}
          loginForm={loginForm}
          setLoginForm={setLoginForm}
          onSubmit={handleAuthSubmit}
          loading={authLoading}
          error={error}
          firebaseError={firebaseError}
          onBack={() => setAppState("wizard")}
        />
      )}

      {/* 4. Wizard State (Default) */}
      {appState === "wizard" && (
        <WizardView
          currentStep={currentStep}
          formData={formData}
          customInputs={customInputs}
          user={user}
          language={language}
          setLanguage={setLanguage}
          updateFormData={updateFormData}
          updateCustomInput={updateCustomInput}
          onNext={handleNext}
          onBack={handleBack}
          onLoginClick={() => {
            setLoginIntent("resume");
            setAppState("login");
          }}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
