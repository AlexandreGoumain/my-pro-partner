"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Award, FileText, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface DashboardStats {
    client: {
        nom: string;
        prenom?: string;
        points_solde: number;
        niveauFidelite?: {
            nom: string;
            couleur: string;
            remise: number;
        };
    };
    documentsCount: number;
    totalSpent: number;
    pointsExpiringSoon: number;
}

export default function ClientDashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const token = localStorage.getItem("clientToken");
            if (!token) return;

            const res = await fetch("/api/client/dashboard/stats", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-24 bg-black/5 rounded-lg" />
                    <div className="grid gap-5 md:grid-cols-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-32 bg-black/5 rounded-lg" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const nomComplet = stats?.client
        ? `${stats.client.nom} ${stats.client.prenom || ""}`.trim()
        : "Client";

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div>
                <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                    Bienvenue, {stats?.client.prenom || stats?.client.nom || "Client"} !
                </h1>
                <p className="text-[14px] text-black/60 mt-1">
                    Voici un aperçu de votre espace client
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-5 md:grid-cols-4">
                {/* Points Card */}
                <Card className="border-black/8 shadow-sm">
                    <div className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                                <Star
                                    className="h-5 w-5 text-black/60"
                                    strokeWidth={2}
                                />
                            </div>
                            <div>
                                <p className="text-[13px] text-black/40">
                                    Mes points
                                </p>
                                <p className="text-[20px] font-semibold tracking-[-0.01em] text-black">
                                    {stats?.client.points_solde || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Level Card */}
                <Card className="border-black/8 shadow-sm">
                    <div className="p-5">
                        <div className="flex items-center gap-3">
                            <div
                                className="h-10 w-10 rounded-lg flex items-center justify-center"
                                style={{
                                    backgroundColor: stats?.client.niveauFidelite
                                        ? `${stats.client.niveauFidelite.couleur}15`
                                        : "#00000008",
                                }}
                            >
                                <Award
                                    className="h-5 w-5"
                                    strokeWidth={2}
                                    style={{
                                        color: stats?.client.niveauFidelite
                                            ? stats.client.niveauFidelite.couleur
                                            : "#00000060",
                                    }}
                                />
                            </div>
                            <div>
                                <p className="text-[13px] text-black/40">
                                    Mon niveau
                                </p>
                                <p className="text-[16px] font-semibold tracking-[-0.01em] text-black">
                                    {stats?.client.niveauFidelite?.nom || "Aucun"}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Documents Card */}
                <Card className="border-black/8 shadow-sm">
                    <div className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                                <FileText
                                    className="h-5 w-5 text-black/60"
                                    strokeWidth={2}
                                />
                            </div>
                            <div>
                                <p className="text-[13px] text-black/40">
                                    Documents
                                </p>
                                <p className="text-[20px] font-semibold tracking-[-0.01em] text-black">
                                    {stats?.documentsCount || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Points Expiring Card */}
                <Card className="border-black/8 shadow-sm">
                    <div className="p-5">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                                <TrendingUp
                                    className="h-5 w-5 text-black/60"
                                    strokeWidth={2}
                                />
                            </div>
                            <div>
                                <p className="text-[13px] text-black/40">
                                    Expirent bientôt
                                </p>
                                <p className="text-[20px] font-semibold tracking-[-0.01em] text-black">
                                    {stats?.pointsExpiringSoon || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card className="border-black/8 shadow-sm">
                <div className="p-6">
                    <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-black mb-4">
                        Actions rapides
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        <Link href="/client/fidelite">
                            <Button
                                variant="outline"
                                className="h-11 px-6 text-[14px] font-medium border-black/10 hover:bg-black/5"
                            >
                                <Award
                                    className="h-4 w-4 mr-2 text-black/60"
                                    strokeWidth={2}
                                />
                                <span className="text-black/80">
                                    Voir ma fidélité
                                </span>
                            </Button>
                        </Link>
                        <Link href="/client/documents">
                            <Button
                                variant="outline"
                                className="h-11 px-6 text-[14px] font-medium border-black/10 hover:bg-black/5"
                            >
                                <FileText
                                    className="h-4 w-4 mr-2 text-black/60"
                                    strokeWidth={2}
                                />
                                <span className="text-black/80">
                                    Mes documents
                                </span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </Card>

            {/* Info Card */}
            {stats?.client.niveauFidelite && (
                <Card className="border-black/8 shadow-sm bg-black/[0.02]">
                    <div className="p-6">
                        <div className="flex items-start gap-4">
                            <div
                                className="h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{
                                    backgroundColor: `${stats.client.niveauFidelite.couleur}20`,
                                }}
                            >
                                <Award
                                    className="h-6 w-6"
                                    strokeWidth={2}
                                    style={{
                                        color: stats.client.niveauFidelite.couleur,
                                    }}
                                />
                            </div>
                            <div>
                                <h3 className="text-[16px] font-semibold text-black mb-1">
                                    Vous êtes niveau {stats.client.niveauFidelite.nom}
                                </h3>
                                <p className="text-[14px] text-black/60">
                                    Profitez de{" "}
                                    <span className="font-semibold text-black">
                                        {stats.client.niveauFidelite.remise}% de remise
                                    </span>{" "}
                                    sur vos prochains achats !
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}
