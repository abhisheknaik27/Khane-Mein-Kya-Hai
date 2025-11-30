/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
  deleteUser,
  onAuthStateChanged,
} from "firebase/auth";
import { app, firebaseError as fbConfigError } from "@/lib/firebase";
import { LoginView } from "@/components/views/LoginView";

export default function LoginPage() {
  const router = useRouter();
  const auth = getAuth(app);

  const [isSignUp, setIsSignUp] = useState(false); // Default to Login
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginForm, setLoginForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // If already logged in, go to app
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) router.push("/genie-bites");
    });
    return () => unsubscribe();
  }, [auth, router]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        const cred = await createUserWithEmailAndPassword(
          auth,
          loginForm.email,
          loginForm.password
        );
        await updateProfile(cred.user, { displayName: loginForm.name });
      } else {
        await signInWithEmailAndPassword(
          auth,
          loginForm.email,
          loginForm.password
        );
      }
      // Success is handled by the useEffect redirect
    } catch (err: any) {
      console.error("Auth Error:", err);
      if (err.code === "auth/email-already-in-use")
        setError("Email already registered.");
      else if (err.code === "auth/invalid-credential")
        setError("Invalid email or password.");
      else setError(err.message || "Authentication failed.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const { isNewUser } = getAdditionalUserInfo(result) || {};

      if (!isSignUp && isNewUser) {
        await deleteUser(result.user);
        setIsSignUp(true);
        setError("Account does not exist. Please sign up.");
        setLoading(false);
        return;
      }
      // Success handled by useEffect
    } catch (err: any) {
      setError(err.message || "Google Sign-In failed.");
      setLoading(false);
    }
  };

  return (
    <LoginView
      isSignUp={isSignUp}
      setIsSignUp={setIsSignUp}
      loginForm={loginForm}
      setLoginForm={setLoginForm}
      onSubmit={handleAuthSubmit}
      onGoogleLogin={handleGoogleLogin}
      loading={loading}
      error={error}
      firebaseError={fbConfigError}
      onBack={() => router.push("/")}
    />
  );
}
