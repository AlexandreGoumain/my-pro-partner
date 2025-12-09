"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
    BUSINESS_CATEGORIES,
    type BusinessCategory,
} from "@/lib/config/business-categories";
import { BUSINESS_TEMPLATES } from "@/lib/services/business-templates-data";
import type { BusinessTemplate } from "@/lib/services/business-template.service";
import { BusinessType } from "@/lib/types/business";
import { CategoryCard } from "./category-card";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BusinessTypeSelectorProps {
    selectedTemplate: BusinessTemplate | null;
    onSelectTemplate: (template: BusinessTemplate) => void;
    className?: string;
}

type Step = "category" | "business";

/**
 * Sélecteur de business type avec flow conversationnel.
 * Étape 1 : Choisir la catégorie
 * Étape 2 : Choisir le métier spécifique
 */
export function BusinessTypeSelector({
    selectedTemplate,
    onSelectTemplate,
    className,
}: BusinessTypeSelectorProps) {
    const [step, setStep] = useState<Step>("category");
    const [selectedCategory, setSelectedCategory] =
        useState<BusinessCategory | null>(null);

    const handleCategorySelect = useCallback((category: BusinessCategory) => {
        setSelectedCategory(category);
        setStep("business");
    }, []);

    const handleBack = useCallback(() => {
        setStep("category");
    }, []);

    const handleBusinessSelect = useCallback(
        (businessType: BusinessType) => {
            const template = BUSINESS_TEMPLATES[businessType];
            if (template) {
                onSelectTemplate(template);
            }
        },
        [onSelectTemplate]
    );

    // Récupérer les templates pour la catégorie sélectionnée
    const categoryTemplates = selectedCategory
        ? selectedCategory.businessTypes
              .map((type) => BUSINESS_TEMPLATES[type])
              .filter(Boolean)
        : [];

    return (
        <div className={cn("space-y-6", className)}>
            {/* Étape 1 : Sélection de la catégorie */}
            {step === "category" && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="text-center mb-8">
                        <h3 className="text-[20px] font-semibold text-black tracking-[-0.01em]">
                            Quel est votre secteur d&apos;activité ?
                        </h3>
                        <p className="mt-2 text-[15px] text-black/50">
                            Nous personnaliserons votre espace selon votre
                            métier
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
                        {BUSINESS_CATEGORIES.map((category) => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                onClick={() => handleCategorySelect(category)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Étape 2 : Sélection du métier */}
            {step === "business" && selectedCategory && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="text-center mb-8">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleBack}
                            className="mb-4 text-black/50 hover:text-black hover:bg-transparent"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Retour aux catégories
                        </Button>

                        <h3 className="text-[20px] font-semibold text-black tracking-[-0.01em]">
                            Plus précisément, vous êtes...
                        </h3>
                        <p className="mt-2 text-[15px] text-black/50">
                            {selectedCategory.label}
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 max-w-2xl mx-auto">
                        {categoryTemplates.map((template) => {
                            const isSelected =
                                selectedTemplate?.type === template.type;

                            return (
                                <button
                                    key={template.type}
                                    type="button"
                                    onClick={() =>
                                        handleBusinessSelect(
                                            template.type as BusinessType
                                        )
                                    }
                                    className={cn(
                                        "group relative flex items-center gap-4 rounded-xl border p-5 text-left transition-all duration-200",
                                        isSelected
                                            ? "border-black bg-black text-white shadow-lg"
                                            : "border-black/10 bg-white hover:border-black/20 hover:shadow-md"
                                    )}
                                >
                                    {/* Radio circle */}
                                    <div
                                        className={cn(
                                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
                                            isSelected
                                                ? "border-white bg-white"
                                                : "border-black/20 bg-transparent group-hover:border-black/40"
                                        )}
                                    >
                                        {isSelected && (
                                            <Check
                                                className="h-4 w-4 text-black"
                                                strokeWidth={3}
                                            />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <h4
                                            className={cn(
                                                "text-[16px] font-medium transition-colors",
                                                isSelected
                                                    ? "text-white"
                                                    : "text-black"
                                            )}
                                        >
                                            {template.label}
                                        </h4>
                                        <p
                                            className={cn(
                                                "text-[13px] mt-0.5 transition-colors truncate",
                                                isSelected
                                                    ? "text-white/70"
                                                    : "text-black/50"
                                            )}
                                        >
                                            {template.description}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Indication de sélection */}
                    {selectedTemplate && (
                        <div className="text-center mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-2">
                                <Check
                                    className="h-4 w-4 text-black"
                                    strokeWidth={2}
                                />
                                <span className="text-[14px] text-black">
                                    <span className="font-medium">
                                        {selectedTemplate.label}
                                    </span>{" "}
                                    sélectionné
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
