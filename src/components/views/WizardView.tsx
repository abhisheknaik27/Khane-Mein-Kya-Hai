import React from "react";
import { STEPS_CONFIG } from "@/lib/constants";
import { FormData, CustomInputs } from "@/types";
import { t, getOptionLabel } from "@/lib/translations";
import { User } from "firebase/auth";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CheckboxTile, RadioTile } from "@/components/ui/Tiles";
import { FloatingBackground } from "@/components/layout/FloatingBackground";

// Import the new components
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

interface WizardViewProps {
  currentStep: number;
  formData: FormData;
  customInputs: CustomInputs;
  user: User | null;
  language: string;
  setLanguage: (lang: string) => void;
  updateFormData: (key: string, value: string, isMulti: boolean) => void;
  updateCustomInput: (key: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  onLoginClick: () => void;
  onLogout: () => void;
}

export const WizardView = ({
  currentStep,
  formData,
  customInputs,
  user,
  language,
  setLanguage,
  updateFormData,
  updateCustomInput,
  onNext,
  onBack,
  onLoginClick,
  onLogout,
}: WizardViewProps) => {
  const step = STEPS_CONFIG[currentStep];
  const StepIcon = step.icon;
  const isLastStep = currentStep === STEPS_CONFIG.length - 1;

  const currentVal = formData[step.id];
  const hasCustomInput =
    customInputs[step.id] && customInputs[step.id].trim().length > 0;
  const isValid = Array.isArray(currentVal)
    ? currentVal.length > 0 || hasCustomInput
    : !!currentVal || hasCustomInput;

  return (
    <div className="min-h-screen flex flex-col items-center p-4 relative">
      <FloatingBackground />

      {/* Extracted Header */}
      <Header
        user={user}
        language={language}
        setLanguage={setLanguage}
        onLoginClick={onLoginClick}
        onLogout={onLogout}
      />

      {/* Main Card */}
      <Card className="w-full max-w-2xl grow md:grow-0 flex flex-col shadow-xl min-h-[60vh] md:min-h-auto animate-in zoom-in-95 duration-300 relative z-10">
        <div className="w-full bg-stone-100 h-1.5 rounded-t-2xl overflow-hidden mb-6">
          <div
            className="bg-[#c1dbe8] h-full transition-all duration-500 ease-out"
            style={{
              width: `${((currentStep + 1) / STEPS_CONFIG.length) * 100}%`,
            }}
          />
        </div>
        <div className="grow px-2 md:px-4 flex flex-col">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 rounded-lg text-[#c1dbe8]">
                  <StepIcon size={24} />
                </div>
                <h2 className="text-2xl font-bold text-stone-800 ">
                  {t(language, step.titleKey, "title")}
                </h2>
              </div>
              <p className="text-stone-500 pl-13 mt-[-10]">
                {t(language, step.subtitleKey, "subtitle")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar mb-4">
            {step.options.map((optionId) =>
              step.type === "multi" ? (
                <CheckboxTile
                  key={optionId}
                  label={getOptionLabel(language, optionId, step.id)}
                  checked={(formData[step.id] as string[]).includes(optionId)}
                  onChange={() => updateFormData(step.id, optionId, true)}
                />
              ) : (
                <RadioTile
                  key={optionId}
                  label={getOptionLabel(language, optionId, step.id)}
                  selected={formData[step.id] === optionId}
                  onSelect={() => updateFormData(step.id, optionId, false)}
                />
              )
            )}
          </div>

          {step.type === "multi" && (
            <div className="mt-2 bg-stone-50 p-4 rounded-xl border border-stone-200">
              <label className="text-xs font-semibold uppercase text-stone-500 mb-2 flex block items-center gap-1">
                <Plus size={12} /> {t(language, "addOther")}
              </label>
              <input
                type="text"
                value={customInputs[step.id] || ""}
                onChange={(e) => updateCustomInput(step.id, e.target.value)}
                placeholder="Add your inputs (seperate by , comma)"
                className="w-full p-3 rounded-lg border text-black border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#c1dbe8] text-sm"
              />
            </div>
          )}
        </div>
        <div className="mt-6 pt-6 border-t border-stone-100 flex justify-between items-center px-2 md:px-4">
          <Button
            variant="ghost"
            onClick={onBack}
            disabled={currentStep === 0}
            className={currentStep === 0 ? "invisible" : ""}
          >
            <ChevronLeft size={20} /> Back
          </Button>
          <Button
            onClick={onNext}
            disabled={!isValid}
            className={!isValid ? "opacity-50" : ""}
          >
            {isLastStep ? "Find Recipes" : "Next"} <ChevronRight size={20} />
          </Button>
        </div>
      </Card>

      {/* Extracted Footer */}
      <Footer />
    </div>
  );
};
