"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full space-y-4">
      {/* Progress bar */}
      <Progress value={progressPercentage} className="h-2" />

      {/* Desktop stepper */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold text-sm transition-all duration-300",
                  currentStep > step.number
                    ? "bg-primary border-primary text-primary-foreground"
                    : currentStep === step.number
                    ? "bg-primary border-primary text-primary-foreground shadow-lg scale-110 ring-4 ring-primary/20"
                    : "bg-background border-muted-foreground/20 text-muted-foreground"
                )}
              >
                {currentStep > step.number ? (
                  <Check className="h-5 w-5" strokeWidth={3} />
                ) : (
                  step.number
                )}
              </div>
              <div className="mt-3 text-center max-w-[120px]">
                <p
                  className={cn(
                    "text-sm font-medium transition-colors",
                    currentStep >= step.number
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </p>
                <p
                  className={cn(
                    "text-xs mt-0.5 transition-colors",
                    currentStep >= step.number
                      ? "text-muted-foreground"
                      : "text-muted-foreground/50"
                  )}
                >
                  {step.description}
                </p>
              </div>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4 mb-14">
                <div
                  className={cn(
                    "h-0.5 w-full transition-all duration-500",
                    currentStep > step.number
                      ? "bg-primary"
                      : "bg-muted-foreground/20"
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile stepper */}
      <div className="md:hidden text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          {steps.map((step) => (
            <div
              key={step.number}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                currentStep >= step.number
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted-foreground/20"
              )}
            />
          ))}
        </div>
        <div>
          <p className="text-sm font-medium">
            Étape {currentStep} sur {steps.length}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {steps.find((s) => s.number === currentStep)?.title}
          </p>
        </div>
      </div>
    </div>
  );
}
