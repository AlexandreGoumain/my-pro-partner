"use client";

import { StatConfig, StatisticsGrid } from "@/components/ui/statistics-grid";
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
    const stats: StatConfig[] = [
        {
            id: "completion",
            icon: Activity,
            label: "Complétude",
            value: `${clientHealth?.completionScore || 0}%`,
            size: "sm",
        },
        {
            id: "documents",
            icon: FileText,
            label: "Documents",
            value: documentsCount,
            size: "sm",
        },
        {
            id: "revenue",
            icon: Euro,
            label: "CA Total",
            value: new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
            }).format(totalCA),
            size: "sm",
        },
        {
            id: "lastOrder",
            icon: Calendar,
            label: "Dernière commande",
            value: lastDocument
                ? format(new Date(lastDocument.dateEmission), "dd MMM yyyy", {
                      locale: fr,
                  })
                : "Aucune",
            size: "sm",
        },
    ];

    return <StatisticsGrid stats={stats} columns={{ md: 4 }} gap={5} />;
}
