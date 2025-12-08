"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
    number: number;
    title: string;
}

interface OnboardingProgressBarProps {
    currentStep: number;
    totalSteps: number;
    steps: Step[];
    className?: string;
}

/**
 * Progress bar animée pour l'onboarding.
 * Design minimaliste style Apple avec animations fluides.
 */
export function OnboardingProgressBar({
    currentStep,
    totalSteps,
    steps,
    className,
}: OnboardingProgressBarProps) {
    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

    return (
        <div className={cn("w-full max-w-md mx-auto", className)}>
            {/* Indicateur de temps */}
            <div className="flex items-center justify-center mb-4">
                <span className="text-[12px] text-black/40">
                    ~2 min pour configurer votre espace
                </span>
            </div>

            {/* Progress bar container */}
            <div className="relative">
                {/* Background track */}
                <div className="h-1 bg-black/5 rounded-full overflow-hidden">
                    {/* Animated fill */}
                    <div
                        className="h-full bg-black rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Step indicators */}
                <div className="absolute -top-2.5 left-0 right-0 flex justify-between">
                    {steps.map((step) => (
                        <div
                            key={step.number}
                            className="flex flex-col items-center"
                            style={{
                                left:
                                    step.number === 1
                                        ? "0%"
                                        : step.number === totalSteps
                                          ? "100%"
                                          : `${((step.number - 1) / (totalSteps - 1)) * 100}%`,
                            }}
                        >
                            {/* Circle indicator */}
                            <div
                                className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
                                    currentStep > step.number
                                        ? "bg-black text-white"
                                        : currentStep === step.number
                                          ? "bg-black text-white ring-4 ring-black/10"
                                          : "bg-white border-2 border-black/10 text-black/30"
                                )}
                            >
                                {currentStep > step.number ? (
                                    <Check
                                        className="w-3.5 h-3.5"
                                        strokeWidth={3}
                                    />
                                ) : (
                                    <span className="text-[11px] font-semibold">
                                        {step.number}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Step labels */}
            <div className="flex justify-between mt-4">
                {steps.map((step) => (
                    <div
                        key={step.number}
                        className={cn(
                            "text-center transition-colors duration-300",
                            step.number === 1 ? "text-left" : "text-right",
                            currentStep >= step.number
                                ? "text-black"
                                : "text-black/30"
                        )}
                    >
                        <span className="text-[13px] font-medium">
                            {step.title}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
