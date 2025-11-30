"use client";

import { useCapabilities } from "@/hooks/use-capabilities";
import { Loader2 } from "lucide-react";
import { AgentImmobilierWidgets } from "./agent-immobilier-widgets";
import { GestionLocativeWidgets } from "./gestion-locative-widgets";
import { SyndicWidgets } from "./syndic-widgets";

export interface ImmobilierDashboardSectionProps {
    period?: number;
}

export function ImmobilierDashboardSection({
    period = 30,
}: ImmobilierDashboardSectionProps) {
    const { businessType, isLoading } = useCapabilities();

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-black/20" />
                </div>
            </div>
        );
    }

    if (businessType === "AGENT_IMMOBILIER") {
        return <AgentImmobilierWidgets period={period} />;
    }

    if (businessType === "GESTION_LOCATIVE") {
        return <GestionLocativeWidgets period={period} />;
    }

    if (businessType === "SYNDIC_COPROPRIETE") {
        return <SyndicWidgets period={period} />;
    }

    return null;
}
