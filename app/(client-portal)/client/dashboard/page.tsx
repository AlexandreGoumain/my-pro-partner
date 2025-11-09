"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Award, FileText, Star, TrendingUp, UserCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FirstTimeGuide } from "@/components/client/first-time-guide";

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
    const [showProfileBanner, setShowProfileBanner] = useState(false);

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

                // Check if profile is incomplete (no phone or address)
                const hasIncompleteProfile = !data.client.telephone || !data.client.adresse;
                const hasSeenBanner = localStorage.getItem("clientProfileBannerDismissed");
                setShowProfileBanner(hasIncompleteProfile && !hasSeenBanner);
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
        <>
            {/* First-time user guide */}
            <FirstTimeGuide userName={stats?.client.prenom || stats?.client.nom} />

            <div className="space-y-6">
                {/* Profile completion banner */}
                {showProfileBanner && (
                    <Card className="border-black/10 shadow-sm bg-black/[0.02] animate-in slide-in-from-top-2 duration-300">
                        <div className="p-5">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center flex-shrink-0">
                                    <UserCircle className="h-5 w-5 text-black/60" strokeWidth={2} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-[15px] font-semibold text-black mb-1">
                                        Complétez votre profil
                                    </h3>
                                    <p className="text-[14px] text-black/60 mb-3">
                                        Ajoutez vos informations de contact pour faciliter vos échanges.
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <Link href="/client/profil">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-9 px-4 text-[13px] font-medium border-black/10 hover:bg-black/5"
                                            >
                                                Compléter mon profil
                                                <ArrowRight className="ml-2 h-3.5 w-3.5" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                localStorage.setItem("clientProfileBannerDismissed", "true");
                                                setShowProfileBanner(false);
                                            }}
                                            className="h-9 px-4 text-[13px] text-black/50 hover:text-black/80"
                                        >
                                            Plus tard
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

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
        </>
    );
}
