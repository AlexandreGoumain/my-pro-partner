"use client";

import { useEffect, useState } from "react";
import {
    Users,
    FileText,
    Settings,
    Sparkles,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
    icon: React.ReactNode;
    title: string;
    description: string;
    href: string;
}

const NEXT_STEPS: Step[] = [
    {
        icon: <Users className="h-5 w-5" strokeWidth={2} />,
        title: "Ajoutez vos premiers clients",
        description: "Importez ou créez votre base clients",
        href: "/dashboard/clients",
    },
    {
        icon: <FileText className="h-5 w-5" strokeWidth={2} />,
        title: "Créez votre premier devis",
        description: "Générez des documents professionnels",
        href: "/dashboard/devis/nouveau",
    },
    {
        icon: <Settings className="h-5 w-5" strokeWidth={2} />,
        title: "Personnalisez votre espace",
        description: "Logo, informations légales, préférences",
        href: "/dashboard/settings",
    },
    {
        icon: <Sparkles className="h-5 w-5" strokeWidth={2} />,
        title: "Découvrez l'assistant IA",
        description: "Posez vos questions à l'assistant",
        href: "/dashboard",
    },
];

interface SuccessNextStepsProps {
    className?: string;
}

/**
 * Prochaines étapes pour guider l'utilisateur
 */
export function SuccessNextSteps({ className }: SuccessNextStepsProps) {
    const [visibleSteps, setVisibleSteps] = useState<number[]>([]);

    useEffect(() => {
        // Animation séquentielle des étapes
        NEXT_STEPS.forEach((_, index) => {
            setTimeout(() => {
                setVisibleSteps((prev) => [...prev, index]);
            }, 600 + index * 150);
        });
    }, []);

    return (
        <div className={cn("space-y-4", className)}>
            <h3 className="text-[13px] font-medium text-black/40 uppercase tracking-wide">
                Prochaines étapes
            </h3>

            <div className="space-y-2">
                {NEXT_STEPS.map((step, index) => (
                    <a
                        key={index}
                        href={step.href}
                        className={cn(
                            "group flex items-center gap-4 p-4 rounded-xl",
                            "bg-white border border-black/5 hover:border-black/10",
                            "transition-all duration-300",
                            "hover:shadow-sm hover:-translate-y-0.5",
                            visibleSteps.includes(index)
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 -translate-x-4"
                        )}
                        style={{
                            transitionDelay: `${index * 50}ms`,
                        }}
                    >
                        <div className="h-11 w-11 rounded-xl bg-black/[0.03] flex items-center justify-center text-black/60 group-hover:bg-black group-hover:text-white transition-all duration-200">
                            {step.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[15px] font-medium text-black group-hover:text-black">
                                {step.title}
                            </p>
                            <p className="text-[13px] text-black/50">
                                {step.description}
                            </p>
                        </div>
                        <ChevronRight
                            className="h-5 w-5 text-black/20 group-hover:text-black/40 transition-colors"
                            strokeWidth={2}
                        />
                    </a>
                ))}
            </div>
        </div>
    );
}
