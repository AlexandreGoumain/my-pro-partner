"use client";

import { useState } from "react";
import { AuthError } from "@/components/auth";
import {
    OnboardingHeader,
    OnboardingNavigation,
    OnboardingProgressBar,
    OnboardingStepCompany,
    OnboardingStepPlan,
} from "@/components/onboarding";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useOnboardingPage } from "@/hooks/use-onboarding-page";
import type { BusinessTemplate } from "@/lib/services/business-template.service";
import { BusinessType } from "@/lib/types/business";

const ONBOARDING_STEPS = [
    { number: 1, title: "Votre entreprise" },
    { number: 2, title: "Votre plan" },
];

export default function OnboardingPage() {
    const {
        form,
        isLoading,
        error,
        onSubmit,
        step,
        totalSteps,
        prevStep,
        canGoNext,
        handleNext,
        selectedPlan,
        setSelectedPlan,
    } = useOnboardingPage();

    // State local pour le template sélectionné (pas besoin d'API)
    const [selectedTemplate, setSelectedTemplate] =
        useState<BusinessTemplate | null>(null);

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-black/[0.02] py-8 px-4 sm:py-12">
            <div className="container max-w-6xl mx-auto">
                {/* Header */}
                <OnboardingHeader className="text-center mb-6" />

                {/* Progress Bar */}
                <div className="mb-8">
                    <OnboardingProgressBar
                        currentStep={step}
                        totalSteps={totalSteps}
                        steps={ONBOARDING_STEPS}
                    />
                </div>

                {/* Main Card */}
                <Card className="shadow-sm border-black/5 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6 sm:p-8 lg:p-10">
                        {error && (
                            <div className="mb-6">
                                <AuthError error={error} />
                            </div>
                        )}

                        <Form {...form}>
                            <form
                                onSubmit={(e) => e.preventDefault()}
                                className="space-y-8"
                            >
                                {/* Step 1: Entreprise + Type d'activité */}
                                {step === 1 && (
                                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                        <OnboardingStepCompany
                                            form={form}
                                            selectedTemplate={selectedTemplate}
                                            onSelectTemplate={setSelectedTemplate}
                                        />

                                        {/* Navigation Step 1 */}
                                        <div className="mt-8 pt-6 border-t border-black/5">
                                            <OnboardingNavigation
                                                step={step}
                                                isLoading={isLoading}
                                                canGoNext={canGoNext}
                                                selectedTemplate={selectedTemplate}
                                                onPrevStep={prevStep}
                                                onNextStep={() =>
                                                    handleNext(selectedTemplate)
                                                }
                                                className="flex items-center justify-end"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Sélection du plan */}
                                {step === 2 && (
                                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                        <OnboardingStepPlan
                                            businessType={
                                                form.watch(
                                                    "businessType"
                                                ) as BusinessType | null
                                            }
                                            companyName={form.watch("nomEntreprise") || ""}
                                            selectedPlan={selectedPlan}
                                            onSelectPlan={setSelectedPlan}
                                            onSubmit={async (billingPeriod) => {
                                                const isValid = await form.trigger();
                                                if (isValid) {
                                                    const data = form.getValues();
                                                    await onSubmit(data, billingPeriod);
                                                }
                                            }}
                                            onBack={prevStep}
                                            isLoading={isLoading}
                                        />
                                    </div>
                                )}
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {/* Footer */}
                <p className="text-center text-[12px] text-black/30 mt-6">
                    Vous pourrez modifier ces informations à tout moment dans
                    les paramètres
                </p>
            </div>
        </div>
    );
}
