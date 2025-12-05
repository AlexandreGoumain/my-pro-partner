"use client";

import { Briefcase, Calendar, Check, User, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Step {
    id: number;
    title: string;
    icon: LucideIcon;
    fields: string[];
}

export const WIZARD_STEPS: Step[] = [
    {
        id: 1,
        title: "Personnel",
        icon: User,
        fields: [
            "prenom",
            "nom",
            "email",
            "telephone",
            "dateNaissance",
            "adresse",
            "ville",
            "codePostal",
            "pays",
        ],
    },
    {
        id: 2,
        title: "Professionnel",
        icon: Briefcase,
        fields: [
            "poste",
            "departement",
            "statut",
            "typeContrat",
            "dateEmbauche",
            "dateFin",
        ],
    },
    {
        id: 3,
        title: "Rémunération",
        icon: Wallet,
        fields: ["salaireBrut", "devise", "heuresHebdo", "joursTravail"],
    },
    {
        id: 4,
        title: "Congés & Notes",
        icon: Calendar,
        fields: ["congesRestants", "congesPris", "notes", "competences"],
    },
];

interface WizardHeaderProps {
    currentStep: number;
    isEditMode: boolean;
    onStepClick: (stepId: number) => void;
}

export function WizardHeader({
    currentStep,
    isEditMode,
    onStepClick,
}: WizardHeaderProps) {
    return (
        <div className="pb-4 border-b border-black/8">
            <h2 className="text-[18px] font-semibold text-black mb-1">
                {isEditMode ? "Modifier l'employé" : "Nouvel employé"}
            </h2>
            <p className="text-[13px] text-black/50">
                Étape {currentStep} sur {WIZARD_STEPS.length}
            </p>

            {/* Progress Steps */}
            <div className="flex items-center gap-2 mt-4">
                {WIZARD_STEPS.map((step, index) => {
                    const StepIcon = step.icon;
                    const isCompleted = currentStep > step.id;
                    const isCurrent = currentStep === step.id;

                    return (
                        <div key={step.id} className="flex items-center flex-1">
                            <button
                                type="button"
                                onClick={() => {
                                    if (isCompleted) onStepClick(step.id);
                                }}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 w-full ${
                                    isCurrent
                                        ? "bg-black text-white"
                                        : isCompleted
                                          ? "bg-black/5 text-black cursor-pointer hover:bg-black/10"
                                          : "bg-black/[0.02] text-black/40"
                                }`}
                            >
                                <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                        isCurrent
                                            ? "bg-white/20"
                                            : isCompleted
                                              ? "bg-black/10"
                                              : "bg-black/5"
                                    }`}
                                >
                                    {isCompleted ? (
                                        <Check
                                            className="w-3.5 h-3.5"
                                            strokeWidth={2.5}
                                        />
                                    ) : (
                                        <StepIcon
                                            className="w-3.5 h-3.5"
                                            strokeWidth={2}
                                        />
                                    )}
                                </div>
                                <span className="text-[12px] font-medium hidden sm:block">
                                    {step.title}
                                </span>
                            </button>
                            {index < WIZARD_STEPS.length - 1 && (
                                <div
                                    className={`w-4 h-[2px] mx-1 ${
                                        isCompleted
                                            ? "bg-black/20"
                                            : "bg-black/10"
                                    }`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
