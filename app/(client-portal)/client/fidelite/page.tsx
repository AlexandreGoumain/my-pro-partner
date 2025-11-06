"use client";

import { useEffect, useState } from "react";
import {
    ClientLoyaltyOverview,
    ClientLoyaltyProgress,
    ClientLoyaltyHistory,
} from "@/components/client-loyalty";
import type { NiveauFidelite } from "@/hooks/use-loyalty-levels";
import type { MouvementPoints } from "@/hooks/use-loyalty-points";

interface ClientLoyaltyData {
    client: {
        points_solde: number;
        niveauFidelite?: NiveauFidelite;
    };
    pointsExpiringSoon: number;
    nextLevel: {
        nextLevel: NiveauFidelite;
        pointsNeeded: number;
        currentPoints: number;
        progress: number;
    } | null;
    mouvements: MouvementPoints[];
}

export default function ClientFidelitePage() {
    const [data, setData] = useState<ClientLoyaltyData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchLoyaltyData();
    }, []);

    const fetchLoyaltyData = async () => {
        try {
            const token = localStorage.getItem("clientToken");
            if (!token) return;

            const res = await fetch("/api/client/loyalty", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const loyaltyData = await res.json();
                setData(loyaltyData);
            }
        } catch (error) {
            console.error("Failed to fetch loyalty data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-24 bg-black/5 rounded-lg" />
                    <div className="grid gap-5 md:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-32 bg-black/5 rounded-lg" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-12">
                <p className="text-black/60">
                    Impossible de charger vos informations de fidélité
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                    Programme de fidélité
                </h1>
                <p className="text-[14px] text-black/60 mt-1">
                    Gagnez des points et profitez d&apos;avantages exclusifs
                </p>
            </div>

            {/* Overview Cards */}
            <ClientLoyaltyOverview
                points={data.client.points_solde}
                niveau={data.client.niveauFidelite || null}
                pointsExpiringSoon={data.pointsExpiringSoon}
            />

            {/* Progress to Next Level */}
            <ClientLoyaltyProgress
                currentLevel={data.client.niveauFidelite || null}
                nextLevel={data.nextLevel}
                points={data.client.points_solde}
            />

            {/* Points History */}
            <ClientLoyaltyHistory
                mouvements={data.mouvements}
                isLoading={isLoading}
            />
        </div>
    );
}
