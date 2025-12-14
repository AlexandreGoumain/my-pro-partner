"use client";

import type { Capability } from "@/lib/types/capability";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Award, Calendar, FileText, Plus, Wrench } from "lucide-react";
import Link from "next/link";

interface QuickAction {
    id: string;
    label: string;
    description: string;
    icon: LucideIcon;
    href: string;
    primary?: boolean;
}

export interface QuickActionsWidgetProps {
    capabilities?: Capability[];
    className?: string;
}

function hasCapability(capabilities: Capability[], cap: Capability): boolean {
    return capabilities.includes(cap);
}

function hasAnyCapability(
    capabilities: Capability[],
    caps: Capability[]
): boolean {
    return caps.some((cap) => capabilities.includes(cap));
}

/**
 * Quick actions widget with grid layout
 */
export function QuickActionsWidget({
    capabilities = [],
    className,
}: QuickActionsWidgetProps) {
    const showRdvAction = hasCapability(capabilities, "agenda");
    const showInterventionAction = hasAnyCapability(capabilities, [
        "domicile",
        "atelier",
    ]);

    // Build actions list based on capabilities
    const actions: QuickAction[] = [];

    if (showRdvAction) {
        actions.push({
            id: "new-rdv",
            label: "Prendre RDV",
            description: "Réserver un créneau",
            icon: Plus,
            href: "/client/rdv/nouveau",
            primary: true,
        });
    }

    actions.push({
        id: "documents",
        label: "Documents",
        description: "Devis et factures",
        icon: FileText,
        href: "/client/documents",
    });

    actions.push({
        id: "fidelite",
        label: "Fidélité",
        description: "Mes points et avantages",
        icon: Award,
        href: "/client/fidelite",
    });

    if (showRdvAction) {
        actions.push({
            id: "rdv",
            label: "Mes RDV",
            description: "Voir mes rendez-vous",
            icon: Calendar,
            href: "/client/rdv",
        });
    }

    if (showInterventionAction) {
        actions.push({
            id: "interventions",
            label: "Interventions",
            description: "Suivi technique",
            icon: Wrench,
            href: "/client/interventions",
        });
    }

    // Take first 4 actions max
    const displayedActions = actions.slice(0, 4);

    return (
        <div className={cn("border border-black/8 rounded-lg p-5", className)}>
            <h2 className="text-[15px] font-medium text-black mb-4">
                Actions rapides
            </h2>

            <div className="grid grid-cols-2 gap-3">
                {displayedActions.map((action) => (
                    <Link
                        key={action.id}
                        href={action.href}
                        className={cn(
                            "group flex flex-col items-center justify-center",
                            "p-4 rounded-lg text-center",
                            "transition-all duration-200",
                            action.primary
                                ? "bg-black text-white hover:bg-black/90"
                                : "bg-black/[0.02] hover:bg-black/[0.05]"
                        )}
                    >
                        <div
                            className={cn(
                                "h-9 w-9 rounded-full flex items-center justify-center mb-2",
                                action.primary
                                    ? "bg-white/10"
                                    : "bg-black/5 group-hover:bg-black/10"
                            )}
                        >
                            <action.icon
                                className={cn(
                                    "h-4 w-4",
                                    action.primary
                                        ? "text-white"
                                        : "text-black/60"
                                )}
                                strokeWidth={2}
                            />
                        </div>
                        <span
                            className={cn(
                                "text-[13px] font-medium",
                                action.primary ? "text-white" : "text-black"
                            )}
                        >
                            {action.label}
                        </span>
                        <span
                            className={cn(
                                "text-[11px] mt-0.5",
                                action.primary
                                    ? "text-white/60"
                                    : "text-black/40"
                            )}
                        >
                            {action.description}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
