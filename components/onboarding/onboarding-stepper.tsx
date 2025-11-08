"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface OnboardingStepperProps {
  currentStep: number;
  steps: {
    number: number;
    title: string;
    description: string;
  }[];
}

export function OnboardingStepper({
  currentStep,
  steps,
}: OnboardingStepperProps) {
  return (
    <div className="w-full">
      {/* Version desktop */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Étape */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full border-2 font-semibold text-[14px] transition-all duration-300",
                  currentStep > step.number
                    ? "bg-black border-black text-white"
                    : currentStep === step.number
                    ? "bg-black border-black text-white shadow-lg scale-110"
                    : "bg-white border-black/20 text-black/40"
                )}
              >
                {currentStep > step.number ? (
                  <Check className="h-5 w-5" strokeWidth={3} />
                ) : (
                  step.number
                )}
              </div>
              <div className="mt-3 text-center">
                <p
                  className={cn(
                    "text-[13px] font-medium transition-colors",
                    currentStep >= step.number
                      ? "text-black"
                      : "text-black/40"
                  )}
                >
                  {step.title}
                </p>
                <p
                  className={cn(
                    "text-[11px] mt-0.5 transition-colors",
                    currentStep >= step.number
                      ? "text-black/60"
                      : "text-black/30"
                  )}
                >
                  {step.description}
                </p>
              </div>
            </div>

            {/* Ligne de connexion */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4 mb-10">
                <div
                  className={cn(
                    "h-0.5 w-full transition-all duration-500",
                    currentStep > step.number
                      ? "bg-black"
                      : "bg-black/10"
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Version mobile */}
      <div className="md:hidden">
        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                currentStep >= step.number
                  ? "w-8 bg-black"
                  : "w-2 bg-black/20"
              )}
            />
          ))}
        </div>
        <div className="text-center">
          <p className="text-[14px] font-medium text-black">
            Étape {currentStep} sur {steps.length}
          </p>
          <p className="text-[13px] text-black/60 mt-1">
            {steps.find((s) => s.number === currentStep)?.title}
          </p>
        </div>
      </div>
    </div>
  );
}
