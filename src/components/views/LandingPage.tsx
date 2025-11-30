import React from "react";
import {
  ChefHat,
  Globe,
  Refrigerator,
  Plus,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FloatingBackground } from "@/components/layout/FloatingBackground";
import { Header } from "@/components/layout/Header";
import { User } from "firebase/auth";
import { UserProfile } from "@/types";

interface LandingPageProps {
  user: User | null;
  userProfile: UserProfile | null;
  language: string;
  setLanguage: (lang: string) => void;
  onLoginClick: () => void;
  onLogout: () => void;
  onGetStarted: () => void;
  onViewSaved: () => void;
}

export const LandingPage = ({
  user,
  userProfile,
  language,
  setLanguage,
  onLoginClick,
  onLogout,
  onGetStarted,
  onViewSaved,
}: LandingPageProps) => {
  return (
    <div className="min-h-screen p-4 flex flex-col relative overflow-x-hidden">
      <FloatingBackground />

      <Header
        user={user}
        userProfile={userProfile}
        language={language}
        setLanguage={setLanguage}
        onLoginClick={onLoginClick}
        onLogout={onLogout}
        onViewSaved={onViewSaved}
        showLanguage={false}
      />

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-4 pt-4 min-h-screen flex flex-col items-center justify-center text-center pb-32">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-brand-border px-3 py-1 rounded-full text-brand-text-dark text-sm font-semibold mb-6 shadow-sm">
            <Sparkles size={14} className="fill-brand-text" />
            <span>The #1 AI Cooking Assistant</span>
          </div>

          <h1 className="heading-merienda text-3xl md:text-6xl font-bold text-stone-800 mb-2 leading-tight">
            Your Kitchen <br />
            <span className="bg-gradient-to-r from-brand-primary to-brand-secondary text-transparent bg-clip-text">
              Needs a Genie.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Staring at a fridge full of random ingredients?{" "}
            <strong>Genie Bites</strong> turns what you have into delicious
            meals instantly. No waste, no hassle, just magic.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onGetStarted}
              className="text-lg px-8 py-4 shadow-xl shadow-brand-primary/20 hover:shadow-2xl hover:shadow-brand-primary/30 hover:-translate-y-1"
            >
              Start Cooking Now <ArrowRight size={20} />
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const el = document.getElementById("features");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-lg px-8 py-4 bg-white/50 border-stone-300"
            >
              How it Works
            </Button>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section
        id="features"
        className="relative z-10 w-full bg-white/80 backdrop-blur-md border-y border-stone-100 min-h-screen flex flex-col items-center justify-center py-20"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="heading-merienda text-3xl md:text-4xl font-bold text-stone-800 mb-4">
              Why Genie Bites?
            </h2>
            <p className="text-stone-500 max-w-xl mx-auto">
              We don&apos;t just find recipes; we create them based on exactly
              what you have in your pantry.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Globe className="text-white" size={24} />}
              title="Speak Your Language"
              description="Full support for regional Indian languages. Get recipes in Hindi, Marathi, Telugu, Tamil, Gujarati and more."
              color="bg-blue-500"
            />
            <FeatureCard
              icon={<Refrigerator className="text-white" size={24} />}
              title="Pantry First Cooking"
              description="Select ingredients you actually have. We'll find the perfect match so you never have to run to the store."
              color="bg-brand-primary"
            />
            <FeatureCard
              icon={<Plus className="text-white" size={24} />}
              title="Add Anything"
              description="Have a unique ingredient not on the list? Just type it in. Our AI Genie knows how to cook with everything."
              color="bg-green-500"
            />
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="heading-merienda text-3xl md:text-4xl font-bold text-stone-800 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-stone-500">
              Start for free. Upgrade when you get hungry for more.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">
            {/* Free Plan */}
            <div className="bg-white/90 backdrop-blur rounded-3xl p-8 border border-stone-200 shadow-lg relative">
              <h3 className="text-2xl font-bold text-stone-800 mb-2">
                Free Chef
              </h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-stone-800">
                  ₹0
                </span>
                <span className="text-stone-500">/forever</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-stone-600">
                  <CheckCircle2 size={20} className="text-brand-primary" />
                  <span className="font-semibold">8 Credits Daily</span>{" "}
                  (Refills every 24h)
                </li>
                <li className="flex items-center gap-3 text-stone-600">
                  <CheckCircle2 size={20} className="text-brand-primary" />
                  <span>2 Recipes = 1 Credit cost</span>
                </li>
                <li className="flex items-center gap-3 text-stone-600">
                  <CheckCircle2 size={20} className="text-brand-primary" />
                  <span>Standard Support</span>
                </li>
              </ul>
              <Button
                onClick={onGetStarted}
                variant="outline"
                className="w-full border-brand-primary text-brand-primary hover:bg-brand-bg-light"
              >
                Start Cooking Free
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white rounded-3xl p-8 shadow-2xl relative transform md:scale-105">
              <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl uppercase">
                Best Value
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro Gourmet</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold">₹199</span>
                <span className="text-white/80">/refill</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <div className="bg-white/20 p-1 rounded-full">
                    <Zap size={14} />
                  </div>
                  <span className="font-semibold">Up to 40 Credits</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-white/20 p-1 rounded-full">
                    <Zap size={14} />
                  </div>
                  <span>Generate up to 80 Recipes</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-white/20 p-1 rounded-full">
                    <Zap size={14} />
                  </div>
                  <span>No Daily Limits</span>
                </li>
              </ul>
              <Button
                onClick={() => {
                  onGetStarted();
                }}
                className="w-full bg-white text-brand-text-dark hover:bg-stone-100 shadow-sm border-none"
              >
                Get Started
              </Button>
              <p className="text-center text-xs mt-3 text-white/70">
                *Credits do not expire.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO FOOTER NOTE */}
      <section className="relative z-10 w-full py-10 px-4 text-center">
        <p className="text-stone-400 text-sm max-w-2xl mx-auto">
          Genie Bites is your personal AI Recipe Generator. Whether you need
          Indian vegetarian recipes, healthy dinner ideas, or instant snacks
          using common ingredients like potatoes and onions, we help you reduce
          food waste and cook delicious meals in minutes.
        </p>
      </section>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-xl transition-all duration-300 group">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color} shadow-lg group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold text-stone-800 mb-3">{title}</h3>
      <p className="text-stone-500 leading-relaxed">{description}</p>
    </div>
  );
};
