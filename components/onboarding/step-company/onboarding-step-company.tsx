"use client";

import { BusinessTypeSelector } from "./business-type-selector";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { OnboardingInput } from "@/hooks/use-onboarding-page";
import { cn } from "@/lib/utils";
import type { BusinessTemplate } from "@/lib/services/business-template.service";
import type { UseFormReturn } from "react-hook-form";

export interface OnboardingStepCompanyProps {
    form: UseFormReturn<OnboardingInput>;
    templates?: Record<string, BusinessTemplate[]>; // Deprecated, kept for compatibility
    isLoading?: boolean; // Deprecated
    selectedTemplate: BusinessTemplate | null;
    onSelectTemplate: (template: BusinessTemplate) => void;
    className?: string;
}

/**
 * Étape 1 de l'onboarding : Entreprise + Type d'activité
 * Flow conversationnel en deux temps :
 * 1. Choisir la catégorie
 * 2. Choisir le métier spécifique
 */
export function OnboardingStepCompany({
    form,
    selectedTemplate,
    onSelectTemplate,
    className,
}: OnboardingStepCompanyProps) {
    const handleSelectTemplate = (template: BusinessTemplate) => {
        onSelectTemplate(template);
        form.setValue("businessType", template.type);
    };

    return (
        <div className={cn("space-y-12", className)}>
            {/* Header */}
            <div className="text-center max-w-lg mx-auto">
                <h2 className="text-[36px] font-semibold tracking-[-0.025em] text-black">
                    Bienvenue
                </h2>
                <p className="mt-3 text-[17px] text-black/50 leading-relaxed">
                    Configurons votre espace de travail en quelques secondes
                </p>
            </div>

            {/* Nom de l'entreprise */}
            <div className="max-w-md mx-auto">
                <FormField
                    control={form.control}
                    name="nomEntreprise"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[14px] font-medium text-black/70">
                                Nom de votre entreprise
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Mon entreprise"
                                    className="h-13 text-[16px] border-black/10 bg-black/[0.02] focus:bg-white focus:border-black/20 focus:ring-0 rounded-xl transition-all"
                                    autoFocus
                                />
                            </FormControl>
                            <FormMessage className="text-[13px]" />
                        </FormItem>
                    )}
                />
            </div>

            {/* Séparateur élégant */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-black/5" />
                </div>
            </div>

            {/* Sélection du type d'activité - Flow conversationnel */}
            <BusinessTypeSelector
                selectedTemplate={selectedTemplate}
                onSelectTemplate={handleSelectTemplate}
            />
        </div>
    );
}
