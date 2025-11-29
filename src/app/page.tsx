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
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

// --- Local Imports ---
import { AppState, FormData, CustomInputs, Recipe, UserProfile } from "@/types";
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
import { SavedRecipesView } from "@/components/views/SaveViewedRecipes";
import { LimitModal } from "@/components/ui/LimitModal";

// --- Constants ---
const REQUEST_LIMITS = { free: 8, pro: 24 };

export default function KhaneMeinKyaHai() {
  // --- State ---
  const [currentStep, setCurrentStep] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [language, setLanguage] = useState("en");
  const [showLimitModal, setShowLimitModal] = useState(false); // Modal State

  // Data State
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [savedRecipeIds, setSavedRecipeIds] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [customInputs, setCustomInputs] = useState<CustomInputs>(
    INITIAL_CUSTOM_INPUTS
  );

  // App State
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

  // --- Auth & Profile Logic ---

  const fetchUserProfile = async (
    uid: string,
    displayName?: string,
    email?: string
  ) => {
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

        // Daily Refill Logic: If dates don't match, reset count to 0
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
      } else {
        const newProfile: UserProfile = {
          uid,
          displayName: displayName || "Chef",
          email: email || "",
          userType: "free",
          requestsUsed: 0,
          lastRequestDate: today,
          purchasedCredits: 0,
        };
        await setDoc(userDocRef, newProfile);
        setUserProfile(newProfile);
      }
    } catch (e) {
      console.error("Error fetching profile:", e);
    }
  };

  const fetchSavedRecipes = async (uid: string) => {
    if (!db) return;
    try {
      const q = query(collection(db, "users", uid, "saved_recipes"));
      const querySnapshot = await getDocs(q);

      const loadedRecipes: Recipe[] = [];
      const loadedIds: string[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as Recipe;
        loadedRecipes.push(data);
        loadedIds.push(data.title);
      });

      setSavedRecipes(loadedRecipes);
      setSavedRecipeIds(loadedIds);
    } catch (e) {
      console.error("Error loading saved recipes:", e);
    }
  };

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        fetchUserProfile(u.uid, u.displayName || "", u.email || "");
        fetchSavedRecipes(u.uid);
      } else {
        setUserProfile(null);
        setSavedRecipes([]);
        setSavedRecipeIds([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // --- Handlers ---

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
    // Deep Reset: We create a fresh object to ensure no references persist
    setFormData(JSON.parse(JSON.stringify(INITIAL_FORM_DATA)));
    setCustomInputs(JSON.parse(JSON.stringify(INITIAL_CUSTOM_INPUTS)));
    setCurrentStep(0);
    setRecipes([]);
    setAppState("wizard");
  };

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      // Reset everything on logout too
      setFormData(JSON.parse(JSON.stringify(INITIAL_FORM_DATA)));
      setCustomInputs(JSON.parse(JSON.stringify(INITIAL_CUSTOM_INPUTS)));
      setCurrentStep(0);
      setRecipes([]);
      setUserProfile(null);
      setSavedRecipes([]);
      setSavedRecipeIds([]);
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
      setError("Firebase configuration missing.");
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
      setLoginForm({ name: "", email: "", password: "" });
      if (loginIntent === "generate") {
        generateRecipes();
      } else {
        setAppState("wizard");
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      if (err.code === "auth/email-already-in-use")
        setError("Email already registered.");
      else if (err.code === "auth/invalid-credential")
        setError("Invalid email or password.");
      else setError(err.message || "Authentication failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    if (!auth) return;
    setAuthLoading(true);

    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);

      // Clear Form Fields on Success
      setLoginForm({ name: "", email: "", password: "" });

      if (loginIntent === "generate") {
        generateRecipes();
      } else {
        setAppState("wizard");
      }
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      setError(err.message || "Google Sign-In failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSaveRecipe = async (recipe: Recipe) => {
    if (!auth?.currentUser || !db) {
      setError("Please login to save recipes.");
      return;
    }

    const uid = auth.currentUser.uid;
    const isAlreadySaved = savedRecipeIds.includes(recipe.title);

    if (isAlreadySaved) {
      setSavedRecipes((prev) => prev.filter((r) => r.title !== recipe.title));
      setSavedRecipeIds((prev) => prev.filter((id) => id !== recipe.title));
    } else {
      setSavedRecipes((prev) => [...prev, recipe]);
      setSavedRecipeIds((prev) => [...prev, recipe.title]);
    }

    try {
      if (isAlreadySaved) {
        const q = query(
          collection(db, "users", uid, "saved_recipes"),
          where("title", "==", recipe.title)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
      } else {
        await addDoc(collection(db, "users", uid, "saved_recipes"), {
          ...recipe,
          savedAt: serverTimestamp(),
        });
      }
    } catch (e) {
      console.error("Error toggling save:", e);
      setError("Failed to save. Check connection.");
    }
  };

  const handleViewSaved = async () => {
    if (savedRecipes.length > 0) {
      setAppState("saved-recipes");
      return;
    }
    if (!auth?.currentUser || !db) return;
    setLoadingMsg("Opening your cookbook...");
    setAppState("generating");

    try {
      await fetchSavedRecipes(auth.currentUser.uid);
      setAppState("saved-recipes");
    } catch (e) {
      console.error("Error fetching saved:", e);
      setAppState("wizard");
    }
  };

  // --- Main AI Logic with Rate Limiting ---
  const generateRecipes = async () => {
    setError("");

    if (!user || !db || !userProfile) {
      if (user) await fetchUserProfile(user.uid);
      else {
        setAppState("login");
        return;
      }
    }

    if (!userProfile) {
      setError("Loading profile... please click next again.");
      return;
    }

    const requestedCount = parseInt(formData.recipeCount) || 2;
    const creditCost = Math.ceil(requestedCount / 2);

    const limit =
      userProfile.userType === "pro" ? REQUEST_LIMITS.pro : REQUEST_LIMITS.free;
    const currentUsed = userProfile.requestsUsed || 0;

    // Check Limits
    if (currentUsed + creditCost > limit) {
      // Trigger Modal instead of Error Text
      setShowLimitModal(true);
      return;
    }

    setAppState("generating");
    setLoadingMsg(`Thinking of ${requestedCount} delicious recipes...`);

    try {
      const fetchedRecipes = await generateRecipesFromAI(
        formData,
        customInputs,
        language
      );

      if (auth && auth.currentUser && db) {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const newCount = currentUsed + creditCost;

        await updateDoc(userDocRef, {
          requestsUsed: newCount,
        });

        setUserProfile({ ...userProfile, requestsUsed: newCount });

        await addDoc(
          collection(db, "users", auth.currentUser.uid, "recipe_requests"),
          {
            request: { ...formData, customInputs, creditCost },
            timestamp: serverTimestamp(),
          }
        );
      }

      setRecipes(fetchedRecipes);
      setAppState("results");
    } catch (err: any) {
      console.error("Generation Error:", err);
      setError(err.message || "Oops! The chef dropped the plate.");
      if (appState !== "results") setAppState("wizard");
    }
  };

  // --- Render ---
  return (
    <div className="min-h-screen relative">
      {appState === "generating" && <LoadingView message={loadingMsg} />}

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
          userProfile={userProfile}
          onSaveRecipe={handleSaveRecipe}
          savedRecipeIds={savedRecipeIds}
          onViewSaved={handleViewSaved}
          showLanguage={false} // Hide language in results
        />
      )}

      {appState === "saved-recipes" && (
        <SavedRecipesView
          recipes={savedRecipes}
          user={user}
          userProfile={userProfile}
          onLogout={handleLogout}
          onBack={handleStartOver} // <--- UPDATED: This now clears inputs and resets steps
          language={language}
          setLanguage={setLanguage}
          onLoginClick={() => {}}
          onSaveRecipe={handleSaveRecipe}
          savedRecipeIds={savedRecipeIds}
          showLanguage={false} // Hide language in saved view
        />
      )}

      {appState === "login" && (
        <LoginView
          isSignUp={isSignUp}
          setIsSignUp={setIsSignUp}
          loginForm={loginForm}
          setLoginForm={setLoginForm}
          onSubmit={handleAuthSubmit}
          onGoogleLogin={handleGoogleLogin}
          loading={authLoading}
          error={error}
          firebaseError={firebaseError}
          onBack={() => setAppState("wizard")}
        />
      )}

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
          userProfile={userProfile}
          onViewSaved={handleViewSaved}
        />
      )}

      {/* Limit Reached Modal */}
      <LimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        userType={userProfile?.userType || "free"}
      />
    </div>
  );
}
