/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  User,
  updateProfile,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
  deleteUser,
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

// Local Imports
import { AppState, FormData, CustomInputs, Recipe, UserProfile } from "@/types";
import {
  INITIAL_FORM_DATA,
  INITIAL_CUSTOM_INPUTS,
  STEPS_CONFIG,
} from "@/lib/constants";
import { app, db, firebaseError } from "@/lib/firebase";
import { t } from "@/lib/translations";
import { generateRecipesFromAI } from "@/services/recipeServices";

// View Components
import { LoadingView } from "@/components/views/LoadingView";
import { ResultsView } from "@/components/views/ResultsView";
import { WizardView } from "@/components/views/WizardView";
import { LoginView } from "@/components/views/LoginView";
import { SavedRecipesView } from "@/components/views/SaveViewedRecipes";
import { LimitModal } from "@/components/ui/LimitModal";

const REQUEST_LIMITS = { free: 8, pro: 24 };

export default function GenieBitesApp() {
  const router = useRouter();
  const auth = getAuth(app);

  // --- State ---
  const [currentStep, setCurrentStep] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [language, setLanguage] = useState("en");
  const [showLimitModal, setShowLimitModal] = useState(false);

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

  // Internal Login State
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginForm, setLoginForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [authLoading, setAuthLoading] = useState(false);

  // --- Auth & Profile ---
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
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        fetchUserProfile(u.uid, u.displayName || "", u.email || "");
        fetchSavedRecipes(u.uid);
        if (appState === "login" && loginIntent === "resume")
          setAppState("wizard");
      } else {
        setUserProfile(null);
        setSavedRecipes([]);
        setSavedRecipeIds([]);
      }
    });
    return () => unsubscribe();
  }, [auth, appState, loginIntent]);

  // --- Handlers ---
  const updateFormData = (key: string, value: string, isMulti: boolean) => {
    setFormData((prev) => {
      if (isMulti) {
        const current = (prev[key] as string[]) || [];
        return current.includes(value)
          ? { ...prev, [key]: current.filter((item) => item !== value) }
          : { ...prev, [key]: [...current, value] };
      }
      return { ...prev, [key]: value };
    });
  };

  const updateCustomInput = (key: string, value: string) => {
    setCustomInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleStartOver = () => {
    setFormData(JSON.parse(JSON.stringify(INITIAL_FORM_DATA)));
    setCustomInputs(JSON.parse(JSON.stringify(INITIAL_CUSTOM_INPUTS)));
    setCurrentStep(0);
    setRecipes([]);
    setAppState("wizard");
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
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
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const handleInternalAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAuthLoading(true);
    try {
      if (isSignUp) {
        const u = await createUserWithEmailAndPassword(
          auth,
          loginForm.email,
          loginForm.password
        );
        await updateProfile(u.user, { displayName: loginForm.name });
      } else {
        await signInWithEmailAndPassword(
          auth,
          loginForm.email,
          loginForm.password
        );
      }
      setLoginForm({ name: "", email: "", password: "" });
      if (loginIntent === "generate") generateRecipes();
      else setAppState("wizard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleInternalGoogle = async () => {
    setError("");
    setAuthLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const { isNewUser } = getAdditionalUserInfo(result) || {};
      if (!isSignUp && isNewUser) {
        await deleteUser(result.user);
        setIsSignUp(true);
        setError("Account missing. Please sign up.");
        return;
      }
      if (loginIntent === "generate") generateRecipes();
      else setAppState("wizard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSaveRecipe = async (recipe: Recipe) => {
    if (!user || !db) return;
    const uid = user.uid;
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
        const snap = await getDocs(q);
        snap.forEach((d) => deleteDoc(d.ref));
      } else {
        await addDoc(collection(db, "users", uid, "saved_recipes"), {
          ...recipe,
          savedAt: serverTimestamp(),
        });
      }
    } catch (e) {
      console.error("Save error", e);
    }
  };

  const handleViewSaved = () => {
    setAppState("saved-recipes");
  };

  // --- Core AI Logic ---
  const generateRecipes = async () => {
    setError("");

    // 1. Explicitly check DB existence at the start to satisfy TypeScript
    if (!db) {
      setError("Database service unavailable.");
      return;
    }

    // 2. Explicitly check User
    if (!user) {
      setAppState("login");
      return;
    }

    // 3. Explicitly check Profile
    if (!userProfile) {
      // Try fetching one last time, or just ask user to wait
      await fetchUserProfile(user.uid);
      setError("Loading profile... please click Find Recipes again.");
      return;
    }

    const requestedCount = parseInt(formData.recipeCount) || 2;
    const creditCost = Math.ceil(requestedCount / 2);
    const limit =
      userProfile.userType === "pro" ? REQUEST_LIMITS.pro : REQUEST_LIMITS.free;
    const currentUsed = userProfile.requestsUsed || 0;

    if (currentUsed + creditCost > limit) {
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

      const newCount = currentUsed + creditCost;

      // Update DB - db is guaranteed defined here due to check #1
      await updateDoc(doc(db, "users", user.uid), { requestsUsed: newCount });

      setUserProfile({ ...userProfile, requestsUsed: newCount });
      setRecipes(fetchedRecipes);
      setAppState("results");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Chef dropped the plate.");
      if (appState !== "results") setAppState("wizard");
    }
  };

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
          onLoginClick={() => setAppState("login")}
          userProfile={userProfile}
          onSaveRecipe={handleSaveRecipe}
          savedRecipeIds={savedRecipeIds}
          onViewSaved={handleViewSaved}
        />
      )}

      {appState === "saved-recipes" && (
        <SavedRecipesView
          recipes={savedRecipes}
          user={user}
          userProfile={userProfile}
          onLogout={handleLogout}
          onBack={handleStartOver}
          language={language}
          setLanguage={setLanguage}
          onLoginClick={() => setAppState("login")}
          onSaveRecipe={handleSaveRecipe}
          savedRecipeIds={savedRecipeIds}
        />
      )}

      {appState === "login" && (
        <LoginView
          isSignUp={isSignUp}
          setIsSignUp={setIsSignUp}
          loginForm={loginForm}
          setLoginForm={setLoginForm}
          onSubmit={handleInternalAuth}
          onGoogleLogin={handleInternalGoogle}
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
          userProfile={userProfile}
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
          onViewSaved={handleViewSaved}
        />
      )}

      <LimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        userType={userProfile?.userType || "free"}
        onBuyCredits={() => router.push("/buy-credits")}
      />
    </div>
  );
}
