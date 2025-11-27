import React, { useState } from "react";
import {
  ChefHat,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FloatingBackground } from "@/components/layout/FloatingBackground";

interface LoginFormState {
  name: string;
  email: string;
  password: string;
}

interface LoginViewProps {
  isSignUp: boolean;
  setIsSignUp: (isSignUp: boolean) => void;
  loginForm: LoginFormState;
  setLoginForm: (form: LoginFormState) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string;
  firebaseError?: string;
  onBack: () => void;
}

export const LoginView = ({
  isSignUp,
  setIsSignUp,
  loginForm,
  setLoginForm,
  onSubmit,
  loading,
  error,
  firebaseError,
  onBack,
}: LoginViewProps) => {
  // Local UI state for password visibility
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <FloatingBackground />

      <Card className="w-full max-w-md p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
        <div className="text-center mb-6">
          <div className="bg-blue-100 w-18 h-18 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChefHat size={34} className="text-black" />
          </div>
          <h2 className="text-2xl font-bold text-stone-800">
            {isSignUp ? "Create your Kitchen Profile" : "Welcome Back Chef!"}
          </h2>
          <p className="text-stone-500 mt-2 text-sm">
            {isSignUp
              ? "Sign up to unlock your personalized recipes."
              : "Login to see what's cooking."}
          </p>
        </div>

        {firebaseError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 flex gap-3 text-sm">
            <AlertCircle size={20} className="shrink-0" />
            <div>
              <p className="font-bold">Configuration Missing</p>
              <p className="mt-1">
                It looks like you haven&apos;t set up your{" "}
                <code>.env.local</code> file yet. Login will not work until you
                add your Firebase keys.
              </p>
            </div>
          </div>
        )}

        {/* Toggle Switch */}
        <div className="flex p-1 bg-stone-100 rounded-xl mb-6">
          <button
            onClick={() => {
              setIsSignUp(true);
            }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              isSignUp
                ? "bg-white text-blue-500  shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            }`}
            type="button"
          >
            Sign Up
          </button>
          <button
            onClick={() => {
              setIsSignUp(false);
            }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              !isSignUp
                ? "bg-white text-blue-500 shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            }`}
            type="button"
          >
            Login
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Name
              </label>
              <input
                required
                type="text"
                className="w-full px-4 py-3 rounded-xl text-black border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#c1dbe8] transition-all"
                placeholder="Enter your name"
                value={loginForm.name}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, name: e.target.value })
                }
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Email
            </label>
            <input
              required
              type="email"
              className="w-full px-4 py-3 text-black rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#c1dbe8] transition-all"
              placeholder="Enter your email"
              value={loginForm.email}
              onChange={(e) =>
                setLoginForm({ ...loginForm, email: e.target.value })
              }
            />
          </div>

          {/* <div className="relative">
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Password
            </label>
            <input
              required
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-3 text-black rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#c1dbe8] transition-all pr-10"
              placeholder="Enter password"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-stone-400 hover:text-stone-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div> */}
          <div>
            {/* Label stays outside the relative wrapper */}
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Password
            </label>

            {/* Wrapper for Input and Icon */}
            <div className="relative">
              <input
                required
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 text-black rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#c1dbe8] transition-all pr-10"
                placeholder="Enter password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                minLength={6}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                // Updated classes for perfect centering:
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full mt-2"
            disabled={loading || !!firebaseError}
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                {isSignUp
                  ? "Create Account & See Recipes"
                  : "Login & See Recipes"}{" "}
                <ChevronRight size={18} />
              </>
            )}
          </Button>

          <p className="text-xs text-center text-stone-400 mt-4">
            By continuing, you agree to our Terms. No spam, promised.
          </p>
        </form>

        <div className="mt-6 pt-6 border-t border-stone-100 text-center">
          <button
            onClick={onBack}
            className="text-sm text-stone-500 hover:text-stone-800"
            type="button"
          >
            Go Back to Edit Ingredients
          </button>
        </div>
      </Card>
    </div>
  );
};
