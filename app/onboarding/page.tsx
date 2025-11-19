"use client";

import { AuthError } from "@/components/auth";
import { OnboardingHeader } from "@/components/onboarding/onboarding-header";
import { OnboardingNavigation } from "@/components/onboarding/onboarding-navigation";
import { OnboardingStepBusinessType } from "@/components/onboarding/onboarding-step-business-type";
import { OnboardingStepCompany } from "@/components/onboarding/onboarding-step-company";
import { OnboardingStepDetails } from "@/components/onboarding/onboarding-step-details";
import { OnboardingStepPlan } from "@/components/onboarding/onboarding-step-plan";
import { OnboardingStepper } from "@/components/onboarding/onboarding-stepper";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useBusinessTemplateSelection } from "@/hooks/use-business-template-selection";
import { useOnboardingPage } from "@/hooks/use-onboarding-page";
import { BusinessType } from "@/lib/types/business";
import { ONBOARDING_STEPS } from "@/lib/types/onboarding";

export default function OnboardingPage() {
    const {
        form,
        isLoading,
        error,
        onSubmit,
        step,
        prevStep,
        canGoNext,
        handleNext,
        selectedPlan,
        setSelectedPlan,
    } = useOnboardingPage();

    const {
        templates,
        isLoading: isLoadingTemplates,
        selectedTemplate,
        setSelectedTemplate,
    } = useBusinessTemplateSelection();

    return (
        <div className="min-h-screen bg-white py-8 px-4 sm:py-12">
            <div className="container max-w-6xl mx-auto">
                {/* Header */}
                <OnboardingHeader className="text-center mb-8" />

                {/* Stepper */}
                <div className="mb-8">
                    <OnboardingStepper
                        currentStep={step}
                        steps={ONBOARDING_STEPS}
                    />
                </div>

                {/* Main Card */}
                <Card className="shadow-sm border-black/10">
                    <CardContent className="p-6 sm:p-8">
                        {error && (
                            <div className="mb-6">
                                <AuthError error={error} />
                            </div>
                        )}

                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-8"
                            >
                                {/* Step 1: Informations de base */}
                                {step === 1 && (
                                    <OnboardingStepCompany
                                        form={form}
                                        className="space-y-6 animate-in fade-in duration-300"
                                    />
                                )}

                                {/* Step 2: Sélection du type d'activité */}
                                {step === 2 && (
                                    <OnboardingStepBusinessType
                                        form={form}
                                        templates={templates}
                                        isLoading={isLoadingTemplates}
                                        selectedTemplate={selectedTemplate}
                                        onSelectTemplate={setSelectedTemplate}
                                        className="space-y-6 animate-in fade-in duration-300"
                                    />
                                )}

                                {/* Step 3: Sélection du plan */}
                                {step === 3 && (
                                    <OnboardingStepPlan
                                        businessType={
                                            form.watch(
                                                "businessType"
                                            ) as BusinessType | null
                                        }
                                        selectedPlan={selectedPlan}
                                        onSelectPlan={setSelectedPlan}
                                        onNext={handleNext}
                                        onBack={prevStep}
                                        canGoNext={canGoNext}
                                    />
                                )}

                                {/* Step 4: Informations complémentaires */}
                                {step === 4 && (
                                    <OnboardingStepDetails
                                        form={form}
                                        selectedTemplate={selectedTemplate}
                                        className="space-y-6 animate-in fade-in duration-300"
                                    />
                                )}

                                {/* Navigation buttons - Cachée pour step 3 (gérée dans OnboardingStepPlan) */}
                                {step !== 3 && (
                                    <>
                                        <Separator />
                                        <OnboardingNavigation
                                            step={step}
                                            isLoading={isLoading}
                                            canGoNext={canGoNext}
                                            selectedTemplate={selectedTemplate}
                                            onPrevStep={prevStep}
                                            onNextStep={() =>
                                                handleNext(selectedTemplate)
                                            }
                                            className="flex items-center justify-between"
                                        />
                                    </>
                                )}
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {/* Footer */}
                <p className="text-center text-[12px] text-black/40 mt-6">
                    Vous pourrez modifier toutes ces informations plus tard dans
                    les paramètres
                </p>
            </div>
        </div>
    );
}
