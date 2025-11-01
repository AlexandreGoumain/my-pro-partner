"use client";

import { ClientCard } from "@/components/client-card";
import { ClientCreateDialog } from "@/components/client-create-dialog";
import { ClientEditDialog } from "@/components/client-edit-dialog";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { ArticleCardSkeleton } from "@/components/skeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Client, useClients, useDeleteClient } from "@/hooks/use-clients";
import { useSegment, useSegmentClients } from "@/hooks/use-segments";
import { differenceInDays } from "date-fns";
import {
    AlertCircle,
    ArrowUpRight,
    Clock,
    Plus,
    Search,
    TrendingUp,
    Users,
    X,
    Zap,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

export default function ClientsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const segmentId = searchParams.get("segment");

    // Data fetching
    const { data: clients = [], isLoading } = useClients();
    const deleteClient = useDeleteClient();
    const { data: segment } = useSegment(segmentId || "");
    const { data: segmentClientsData } = useSegmentClients(segmentId || "");

    const [searchTerm, setSearchTerm] = useState("");
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    // Determine which clients to show
    const displayClients =
        segmentId && segmentClientsData ? segmentClientsData.data : clients;

    // Intelligence metrics
    const intelligence = useMemo(() => {
        const now = new Date();
        const thirtyDaysAgo = new Date(
            now.getTime() - 30 * 24 * 60 * 60 * 1000
        );
        const ninetyDaysAgo = new Date(
            now.getTime() - 90 * 24 * 60 * 60 * 1000
        );

        // Nouveaux clients ce mois
        const newThisMonth = clients.filter(
            (c) => new Date(c.createdAt) >= thirtyDaysAgo
        ).length;

        // Clients inactifs (>90 jours)
        const inactive = clients.filter(
            (c) => differenceInDays(now, new Date(c.updatedAt)) > 90
        );

        // Clients récents (actifs dans les 30 derniers jours)
        const active = clients.filter(
            (c) => differenceInDays(now, new Date(c.updatedAt)) <= 30
        );

        // Clients avec informations complètes (email + téléphone + adresse)
        const complete = clients.filter(
            (c) => c.email && c.telephone && c.adresse
        ).length;

        // Taux de complétion
        const completionRate =
            clients.length > 0 ? (complete / clients.length) * 100 : 0;

        return {
            total: clients.length,
            newThisMonth,
            inactive: inactive.length,
            inactiveList: inactive,
            active: active.length,
            complete,
            completionRate,
        };
    }, [clients]);

    // Filtrer les clients par recherche
    const filteredClients = useMemo(() => {
        if (!searchTerm) return displayClients;

        return displayClients.filter((client) => {
            const nomComplet = client.prenom
                ? `${client.nom} ${client.prenom}`
                : client.nom;
            return (
                nomComplet.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (client.email &&
                    client.email
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())) ||
                (client.telephone &&
                    client.telephone
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()))
            );
        });
    }, [displayClients, searchTerm]);

    const clearSegmentFilter = useCallback(() => {
        router.push("/dashboard/clients");
    }, [router]);

    const handleCreate = useCallback(() => {
        setCreateDialogOpen(true);
    }, []);

    const handleCreateSuccess = useCallback(() => {
        toast.success("Client créé", {
            description: "Le client a été créé avec succès",
        });
    }, []);

    const handleView = useCallback(
        (client: Client) => {
            router.push(`/dashboard/clients/${client.id}`);
        },
        [router]
    );

    const handleEdit = useCallback((client: Client) => {
        setSelectedClient(client);
        setEditDialogOpen(true);
    }, []);

    const handleDelete = useCallback((client: Client) => {
        setSelectedClient(client);
        setDeleteDialogOpen(true);
    }, []);

    const confirmDelete = useCallback(() => {
        if (!selectedClient) return;

        deleteClient.mutate(selectedClient.id, {
            onSuccess: () => {
                toast.success("Client supprimé", {
                    description: "Le client a été supprimé avec succès",
                });
                setDeleteDialogOpen(false);
                setSelectedClient(null);
            },
            onError: (error) => {
                toast.error("Erreur", {
                    description:
                        error instanceof Error
                            ? error.message
                            : "Impossible de supprimer le client",
                });
            },
        });
    }, [selectedClient, deleteClient]);

    const handleEditSuccess = useCallback(() => {
        toast.success("Client modifié", {
            description: "Le client a été modifié avec succès",
        });
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                        Dashboard Clients
                    </h1>
                    <p className="text-[14px] text-black/40 mt-1">
                        Vue d'ensemble et gestion de votre portefeuille clients
                    </p>
                </div>
                <Button
                    onClick={handleCreate}
                    className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm cursor-pointer"
                >
                    <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                    Nouveau client
                </Button>
            </div>

            {/* Intelligence Cards */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                {/* Total clients */}
                <Card className="border-black/8 shadow-sm">
                    <div className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                                <Users
                                    className="h-5 w-5 text-black/60"
                                    strokeWidth={2}
                                />
                            </div>
                            <Badge
                                variant="secondary"
                                className="bg-black/5 text-black/60 border-0 text-[12px] h-5 px-2"
                            >
                                Total
                            </Badge>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[32px] font-semibold tracking-[-0.02em] text-black">
                                {intelligence.total}
                            </p>
                            <p className="text-[14px] text-black/60">
                                Clients enregistrés
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Nouveaux ce mois */}
                <Card className="border-black/8 shadow-sm cursor-pointer hover:border-black/20 transition-all duration-200">
                    <div className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                                <TrendingUp
                                    className="h-5 w-5 text-black/60"
                                    strokeWidth={2}
                                />
                            </div>
                            <Badge
                                variant="secondary"
                                className="bg-black/5 text-black/60 border-0 text-[12px] h-5 px-2"
                            >
                                +{intelligence.newThisMonth}
                            </Badge>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[32px] font-semibold tracking-[-0.02em] text-black">
                                {intelligence.newThisMonth}
                            </p>
                            <p className="text-[14px] text-black/60">
                                Nouveaux ce mois
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Clients actifs */}
                <Card className="border-black/8 shadow-sm cursor-pointer hover:border-black/20 transition-all duration-200">
                    <div className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                                <Zap
                                    className="h-5 w-5 text-black/60"
                                    strokeWidth={2}
                                />
                            </div>
                            <Badge
                                variant="secondary"
                                className="bg-black/5 text-black/60 border-0 text-[12px] h-5 px-2"
                            >
                                {intelligence.total > 0
                                    ? `${(
                                          (intelligence.active /
                                              intelligence.total) *
                                          100
                                      ).toFixed(0)}%`
                                    : "0%"}
                            </Badge>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[32px] font-semibold tracking-[-0.02em] text-black">
                                {intelligence.active}
                            </p>
                            <p className="text-[14px] text-black/60">
                                Actifs (30j)
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Clients inactifs - Alerte */}
                <Card
                    className={`shadow-sm cursor-pointer transition-all duration-200 ${
                        intelligence.inactive > 0
                            ? "border-black/20 hover:border-black/30"
                            : "border-black/8 hover:border-black/20"
                    }`}
                    onClick={() =>
                        intelligence.inactive > 0 &&
                        router.push("/dashboard/clients/segments")
                    }
                >
                    <div className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div
                                className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                                    intelligence.inactive > 0
                                        ? "bg-black/10"
                                        : "bg-black/5"
                                }`}
                            >
                                {intelligence.inactive > 0 ? (
                                    <AlertCircle
                                        className="h-5 w-5 text-black/80"
                                        strokeWidth={2}
                                    />
                                ) : (
                                    <Clock
                                        className="h-5 w-5 text-black/60"
                                        strokeWidth={2}
                                    />
                                )}
                            </div>
                            {intelligence.inactive > 0 && (
                                <Badge
                                    variant="secondary"
                                    className="bg-black/10 text-black/80 border-0 text-[12px] h-5 px-2"
                                >
                                    Action requise
                                </Badge>
                            )}
                        </div>
                        <div className="space-y-1">
                            <p className="text-[32px] font-semibold tracking-[-0.02em] text-black">
                                {intelligence.inactive}
                            </p>
                            <p className="text-[14px] text-black/60">
                                Inactifs (&gt;90j)
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Quick Actions & Insights */}
            <div className="grid gap-5 md:grid-cols-2">
                {/* Qualité des données */}
                <Card className="border-black/8 shadow-sm">
                    <div className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black mb-1">
                                    Qualité des données
                                </h3>
                                <p className="text-[13px] text-black/40">
                                    Taux de complétion des fiches clients
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-[32px] font-semibold tracking-[-0.02em] text-black">
                                    {intelligence.completionRate.toFixed(0)}%
                                </p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-black transition-all duration-500"
                                    style={{
                                        width: `${intelligence.completionRate}%`,
                                    }}
                                />
                            </div>
                            <p className="text-[12px] text-black/40">
                                {intelligence.complete} clients avec
                                informations complètes (email + téléphone +
                                adresse)
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Actions rapides */}
                <Card className="border-black/8 shadow-sm">
                    <div className="p-5">
                        <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black mb-4">
                            Actions rapides
                        </h3>
                        <div className="space-y-2">
                            <Button
                                variant="outline"
                                className="w-full justify-between h-12 px-4 text-[14px] font-medium border-black/10 hover:bg-black/5 cursor-pointer"
                                onClick={() =>
                                    router.push("/dashboard/clients/segments")
                                }
                            >
                                <div className="flex items-center gap-2.5">
                                    <Users
                                        className="h-4 w-4 text-black/60"
                                        strokeWidth={2}
                                    />
                                    <span className="text-black/80">
                                        Voir les segments clients
                                    </span>
                                </div>
                                <ArrowUpRight
                                    className="h-4 w-4 text-black/40"
                                    strokeWidth={2}
                                />
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-between h-12 px-4 text-[14px] font-medium border-black/10 hover:bg-black/5 cursor-pointer"
                                onClick={() =>
                                    router.push(
                                        "/dashboard/clients/statistiques"
                                    )
                                }
                            >
                                <div className="flex items-center gap-2.5">
                                    <TrendingUp
                                        className="h-4 w-4 text-black/60"
                                        strokeWidth={2}
                                    />
                                    <span className="text-black/80">
                                        Consulter les statistiques
                                    </span>
                                </div>
                                <ArrowUpRight
                                    className="h-4 w-4 text-black/40"
                                    strokeWidth={2}
                                />
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-between h-12 px-4 text-[14px] font-medium border-black/10 hover:bg-black/5 cursor-pointer"
                                onClick={() =>
                                    router.push(
                                        "/dashboard/clients/import-export"
                                    )
                                }
                            >
                                <div className="flex items-center gap-2.5">
                                    <ArrowUpRight
                                        className="h-4 w-4 text-black/60"
                                        strokeWidth={2}
                                    />
                                    <span className="text-black/80">
                                        Import / Export
                                    </span>
                                </div>
                                <ArrowUpRight
                                    className="h-4 w-4 text-black/40"
                                    strokeWidth={2}
                                />
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Segment Filter Banner */}
            {segmentId && segment && (
                <Card className="border-black/20 shadow-sm bg-black/2">
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-lg bg-black/10 flex items-center justify-center">
                                    <Users
                                        className="h-4 w-4 text-black/60"
                                        strokeWidth={2}
                                    />
                                </div>
                                <div>
                                    <p className="text-[14px] font-medium text-black">
                                        Filtre actif : {segment.nom}
                                    </p>
                                    <p className="text-[13px] text-black/60">
                                        {displayClients.length} client
                                        {displayClients.length > 1
                                            ? "s"
                                            : ""}{" "}
                                        dans ce segment
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearSegmentFilter}
                                className="h-9 px-3 text-[13px] hover:bg-black/10"
                            >
                                <X className="h-4 w-4 mr-1.5" strokeWidth={2} />
                                Effacer le filtre
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Recherche */}
            <Card className="border-black/8 shadow-sm">
                <div className="p-4">
                    <div className="relative">
                        <Search
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40"
                            strokeWidth={2}
                        />
                        <Input
                            placeholder="Rechercher un client par nom, email ou téléphone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-11 border-black/10 focus-visible:ring-black/20 text-[14px] placeholder:text-black/40"
                        />
                    </div>
                </div>
            </Card>

            {/* Liste des clients */}
            {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <ArticleCardSkeleton key={i} />
                    ))}
                </div>
            ) : filteredClients.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredClients.map((client) => (
                        <ClientCard
                            key={client.id}
                            client={client}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            ) : (
                <Card className="p-12 border-black/8 shadow-sm">
                    <div className="flex flex-col items-center text-center space-y-5">
                        <div className="rounded-full h-20 w-20 bg-black/5 flex items-center justify-center">
                            <Users
                                className="w-10 h-10 text-black/40"
                                strokeWidth={2}
                            />
                        </div>
                        <div>
                            <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-black mb-2">
                                {searchTerm
                                    ? "Aucun client trouvé"
                                    : "Commencez votre portefeuille"}
                            </h3>
                            <p className="text-[14px] text-black/60 max-w-md">
                                {searchTerm
                                    ? "Aucun client ne correspond à votre recherche. Essayez avec d'autres termes."
                                    : "Ajoutez votre premier client pour commencer à gérer votre base clients."}
                            </p>
                        </div>
                        {!searchTerm && (
                            <Button
                                onClick={handleCreate}
                                className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm cursor-pointer mt-2"
                            >
                                <Plus
                                    className="w-4 h-4 mr-2"
                                    strokeWidth={2}
                                />
                                Ajouter mon premier client
                            </Button>
                        )}
                    </div>
                </Card>
            )}

            {/* Dialogs */}
            <ClientCreateDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onSuccess={handleCreateSuccess}
            />

            <ClientEditDialog
                client={selectedClient}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                onSuccess={handleEditSuccess}
            />

            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={confirmDelete}
                isLoading={deleteClient.isPending}
                title="Supprimer le client"
                description={`Êtes-vous sûr de vouloir supprimer le client "${
                    selectedClient?.prenom
                        ? `${selectedClient.nom} ${selectedClient.prenom}`
                        : selectedClient?.nom
                }" ? Cette action est irréversible.`}
            />
        </div>
    );
}
