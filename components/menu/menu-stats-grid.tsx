"use client";

import { StatCard } from "@/components/ui/stat-card";
import type { MenuStats } from "@/hooks/use-menu";
import { Check, ChefHat, Euro, X } from "lucide-react";

interface MenuStatsGridProps {
    stats: MenuStats;
}

export function MenuStatsGrid({ stats }: MenuStatsGridProps) {
    return (
        <div className="grid gap-4 md:grid-cols-4">
            <StatCard label="Total plats" value={stats.total} icon={ChefHat} />
            <StatCard
                label="Disponibles"
                value={stats.disponibles}
                icon={Check}
            />
            <StatCard
                label="Indisponibles"
                value={stats.indisponibles}
                icon={X}
            />
            <StatCard
                label="Prix moyen"
                value={`${stats.prixMoyen.toFixed(2)} €`}
                icon={Euro}
            />
        </div>
    );
}
