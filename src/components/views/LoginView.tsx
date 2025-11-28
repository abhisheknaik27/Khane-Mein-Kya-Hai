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
  onGoogleLogin: () => void;
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
  onGoogleLogin,
  loading,
  error,
  firebaseError,
  onBack,
}: LoginViewProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <FloatingBackground />

      <Card className="w-full max-w-md p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
        <div className="text-center mb-6">
          <div className="bg-brand-bg-subtle w-18 h-18 rounded-full flex items-center justify-center mx-auto mb-4">
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
          <div className="mb-6 p-4 bg-status-red-bg border border-red-100 rounded-xl text-status-red-text flex gap-3 text-sm">
            <AlertCircle size={20} className="shrink-0" />
            <div>
              <p className="font-bold">Configuration Missing</p>
              <p className="mt-1">
                It looks like you haven&apos;t set up your{" "}
                <code>.env.local</code> file yet.
              </p>
            </div>
          </div>
        )}

        <div className="flex p-1 bg-stone-100 rounded-xl mb-6">
          <button
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              isSignUp
                ? "bg-white text-brand-text shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            }`}
            type="button"
          >
            Sign Up
          </button>
          <button
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              !isSignUp
                ? "bg-white text-brand-text shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            }`}
            type="button"
          >
            Login
          </button>
        </div>

        <button
          type="button"
          onClick={onGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-stone-200 text-stone-700 font-medium py-3 rounded-xl hover:bg-stone-50 active:scale-95 transition-all mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-[1px] bg-stone-200 flex-1"></div>
          <span className="text-stone-400 text-xs uppercase font-bold">Or</span>
          <div className="h-[1px] bg-stone-200 flex-1"></div>
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
                className="w-full px-4 py-3 rounded-xl text-black border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-border transition-all"
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
              className="w-full px-4 py-3 text-black rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-border transition-all"
              placeholder="Enter your email"
              value={loginForm.email}
              onChange={(e) =>
                setLoginForm({ ...loginForm, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                required
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 text-black rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-border transition-all pr-10"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-status-red-bg text-status-red-text text-sm rounded-lg flex items-center gap-2">
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
