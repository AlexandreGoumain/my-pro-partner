"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { RouteGuard } from "@/components/ui/route-guard";
import { SearchBar } from "@/components/ui/search-bar";
import { StatCard } from "@/components/ui/stat-card";
import { useClientsPaginated, type Client } from "@/hooks/use-clients";
import { useCheckIn, useFitnessStats, usePresences } from "@/hooks/use-fitness";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    CreditCard,
    TrendingUp,
    UserCheck,
    Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function CheckInPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [_selectedClientId, setSelectedClientId] = useState<string | null>(
        null
    );

    const { data: stats } = useFitnessStats();
    const { data: presences } = usePresences({
        dateDebut: new Date().toISOString().split("T")[0],
        limit: 20,
    });
    const { data: clientsData } = useClientsPaginated(
        searchQuery.length >= 2 ? { search: searchQuery, limit: 5 } : undefined
    );

    const checkInMutation = useCheckIn();

    const handleCheckIn = async (clientId: string) => {
        try {
            const result = await checkInMutation.mutateAsync({ clientId });
            toast.success(result.message || "Check-in effectué !");
            setSearchQuery("");
            setSelectedClientId(null);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Erreur lors du check-in"
            );
        }
    };

    const handleCardScan = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchQuery) {
            // Essayer d'abord par numéro de carte
            try {
                const result = await checkInMutation.mutateAsync({
                    numeroCarte: searchQuery,
                });
                toast.success(result.message || "Check-in effectué !");
                setSearchQuery("");
            } catch {
                // Si pas de carte, essayer par code
                try {
                    const result = await checkInMutation.mutateAsync({
                        codeAcces: searchQuery,
                    });
                    toast.success(result.message || "Check-in effectué !");
                    setSearchQuery("");
                } catch (error) {
                    toast.error(
                        error instanceof Error
                            ? error.message
                            : "Carte ou code non reconnu"
                    );
                }
            }
        }
    };

    return (
        <RouteGuard capability="presences_fitness">
            <div className="flex-1 space-y-6 p-6">
                <PageHeader
                    title="Check-in"
                    description="Enregistrez les entrées des membres"
                />

                {/* Stats rapides */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard
                        icon={Users}
                        label="Présents aujourd'hui"
                        value={stats?.presencesJour || 0}
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Cette semaine"
                        value={stats?.presencesSemaine || 0}
                    />
                    <StatCard
                        icon={CreditCard}
                        label="Membres actifs"
                        value={stats?.membresActifs || 0}
                    />
                    <StatCard
                        icon={Clock}
                        label="Moyenne / jour"
                        value={stats?.moyennePresencesJour || 0}
                    />
                </div>

                {/* Zone de check-in */}
                <Card className="border-black/8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-[16px]">
                            <UserCheck className="w-5 h-5" strokeWidth={2} />
                            Check-in membre
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <SearchBar
                            value={searchQuery}
                            onChange={setSearchQuery}
                            placeholder="Scanner carte, entrer code ou rechercher membre..."
                            onKeyDown={handleCardScan}
                            autoFocus
                            className="max-w-none"
                            inputClassName="h-12 text-[16px]"
                        />

                        {/* Résultats de recherche */}
                        {searchQuery.length >= 2 &&
                            clientsData?.data &&
                            clientsData.data.length > 0 && (
                                <div className="border border-black/10 rounded-lg divide-y divide-black/5">
                                    {clientsData.data.map((client: Client) => (
                                        <div
                                            key={client.id}
                                            className="p-4 flex items-center justify-between hover:bg-black/2 cursor-pointer transition-colors"
                                            onClick={() =>
                                                setSelectedClientId(client.id)
                                            }
                                        >
                                            <div>
                                                <p className="font-medium text-[14px]">
                                                    {client.prenom} {client.nom}
                                                </p>
                                                <p className="text-[12px] text-black/40">
                                                    {client.email ||
                                                        client.telephone ||
                                                        "Pas de contact"}
                                                </p>
                                            </div>
                                            <Button
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCheckIn(client.id);
                                                }}
                                                disabled={
                                                    checkInMutation.isPending
                                                }
                                                className="bg-black hover:bg-black/90 text-white"
                                            >
                                                <UserCheck
                                                    className="w-4 h-4 mr-1"
                                                    strokeWidth={2}
                                                />
                                                Check-in
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}

                        {searchQuery.length >= 2 &&
                            clientsData?.data?.length === 0 && (
                                <EmptyState
                                    icon={AlertCircle}
                                    title="Aucun membre trouvé"
                                    variant="minimal"
                                    iconSize="sm"
                                    textSize="sm"
                                />
                            )}
                    </CardContent>
                </Card>

                {/* Dernières entrées */}
                <Card className="border-black/8">
                    <CardHeader>
                        <CardTitle className="text-[16px]">
                            Dernières entrées
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {presences?.data && presences.data.length > 0 ? (
                            <div className="space-y-2">
                                {presences.data.map((presence) => (
                                    <div
                                        key={presence.id}
                                        className="flex items-center justify-between p-3 rounded-lg bg-black/2"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center">
                                                <CheckCircle2
                                                    className="w-4 h-4 text-black/60"
                                                    strokeWidth={2}
                                                />
                                            </div>
                                            <div>
                                                <p className="font-medium text-[14px]">
                                                    {presence.client?.prenom}{" "}
                                                    {presence.client?.nom}
                                                </p>
                                                <p className="text-[12px] text-black/40">
                                                    {presence.abonnement
                                                        ?.typeAbonnement?.nom ||
                                                        "Sans abonnement"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge
                                                variant="secondary"
                                                className="bg-black/5 text-black/60 border-0"
                                            >
                                                {format(
                                                    new Date(
                                                        presence.heureEntree
                                                    ),
                                                    "HH:mm",
                                                    { locale: fr }
                                                )}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon={Users}
                                title="Aucune entrée aujourd'hui"
                                variant="minimal"
                                iconSize="sm"
                                textSize="sm"
                            />
                        )}
                    </CardContent>
                </Card>
            </div>
        </RouteGuard>
    );
}
