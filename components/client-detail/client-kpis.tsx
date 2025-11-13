"use client";

import { StatCard } from "@/components/ui/stat-card";
import type { Document } from "@/hooks/use-documents";
import type { ClientHealth } from "@/lib/types/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Activity, Calendar, Euro, FileText } from "lucide-react";

export interface ClientKPIsProps {
    clientHealth: ClientHealth | null;
    documentsCount: number;
    totalCA: number;
    lastDocument: Document | null;
}

export function ClientKPIs({
    clientHealth,
    documentsCount,
    totalCA,
    lastDocument,
}: ClientKPIsProps) {
    return (
        <div className="grid gap-5 md:grid-cols-4">
            <StatCard
                icon={Activity}
                label="Complétude"
                value={`${clientHealth?.completionScore || 0}%`}
                size="sm"
            />
            <StatCard
                icon={FileText}
                label="Documents"
                value={documentsCount}
                size="sm"
            />
            <StatCard
                icon={Euro}
                label="CA Total"
                value={new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                }).format(totalCA)}
                size="sm"
            />
            <StatCard
                icon={Calendar}
                label="Dernière commande"
                value={
                    lastDocument
                        ? format(
                              new Date(lastDocument.dateEmission),
                              "dd MMM yyyy",
                              { locale: fr }
                          )
                        : "Aucune"
                }
                size="sm"
            />
        </div>
    );
}
