"use client";

import { ClientCard } from "@/components/client-card";
import { ClientCreateDialog } from "@/components/client-create-dialog";
import { ClientEditDialog } from "@/components/client-edit-dialog";
import { CSVImportDialog, type CSVMapping } from "@/components/csv-import-dialog";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { ArticleCardSkeleton } from "@/components/skeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Client,
    useClientsPaginated,
    useClientsStats,
    useDeleteClient,
    useImportClients,
} from "@/hooks/use-clients";
import { useSegment, useSegmentClients } from "@/hooks/use-segments";
import {
    AlertCircle,
    ArrowUpRight,
    Clock,
    Grid,
    List,
    Plus,
    Search,
    TrendingUp,
    Upload,
    Users,
    X,
    Zap,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { createColumns } from "./_components/data-table/columns";
import { DataTable } from "./_components/data-table";
import { GridPagination } from "./_components/grid-pagination";

export default function ClientsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const segmentId = searchParams.get("segment");

    // State management
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(viewMode === "grid" ? 24 : 20);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [importDialogOpen, setImportDialogOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    // Debounce search term to avoid too many API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1); // Reset to first page when searching
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Always use server-side pagination for better performance
    const { data: paginatedData, isLoading } = useClientsPaginated({
        page,
        limit: pageSize,
        search: debouncedSearch,
    });

    const { data: stats } = useClientsStats();
    const deleteClient = useDeleteClient();
    const importClients = useImportClients();
    const { data: segment } = useSegment(segmentId || "");
    const { data: segmentClientsData } = useSegmentClients(segmentId || "");

    const clients = paginatedData?.data || [];
    const pagination = paginatedData?.pagination;

    // CSV Import mappings
    const csvMappings: CSVMapping[] = [
        {
            csvHeader: "Nom",
            targetField: "nom",
            label: "Nom",
            required: true,
        },
        {
            csvHeader: "Prénom",
            targetField: "prenom",
            label: "Prénom",
        },
        {
            csvHeader: "Email",
            targetField: "email",
            label: "Email",
            validator: (value) => {
                if (!value || value.trim() === "") return { valid: true };
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value)
                    ? { valid: true }
                    : { valid: false, error: "Email invalide" };
            },
        },
        {
            csvHeader: "Téléphone",
            targetField: "telephone",
            label: "Téléphone",
        },
        {
            csvHeader: "Adresse",
            targetField: "adresse",
            label: "Adresse",
        },
        {
            csvHeader: "Ville",
            targetField: "ville",
            label: "Ville",
        },
        {
            csvHeader: "Code Postal",
            targetField: "codePostal",
            label: "Code Postal",
        },
        {
            csvHeader: "Pays",
            targetField: "pays",
            label: "Pays",
        },
        {
            csvHeader: "Notes",
            targetField: "notes",
            label: "Notes",
        },
    ];

    // Determine which clients to show (segments override pagination)
    const displayClients =
        segmentId && segmentClientsData ? segmentClientsData.data : clients;

    // Use segment data for display when filtering by segment
    const showPagination = !segmentId && pagination;

    // Intelligence metrics - use stats from backend for efficiency
    const intelligence = useMemo(() => {
        if (stats) {
            return {
                total: stats.total,
                newThisMonth: stats.newThisMonth,
                inactive: stats.inactive,
                inactiveList: [], // Will be populated on demand if needed
                active: stats.active,
                complete: stats.complete,
                completionRate: stats.completionRate,
            };
        }

        // Fallback to empty stats while loading
        return {
            total: 0,
            newThisMonth: 0,
            inactive: 0,
            inactiveList: [],
            active: 0,
            complete: 0,
            completionRate: 0,
        };
    }, [stats]);

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

    const handleImport = useCallback(
        async (data: Record<string, unknown>[]) => {
            return await importClients.mutateAsync(data);
        },
        [importClients]
    );

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handlePageSizeChange = useCallback((newSize: number) => {
        setPageSize(newSize);
        setPage(1); // Reset to first page when changing page size
    }, []);

    const handleViewModeChange = useCallback((mode: "grid" | "list") => {
        setViewMode(mode);
        setPage(1); // Reset to first page when changing view mode
        // Adjust page size based on view mode
        setPageSize(mode === "grid" ? 24 : 20);
    }, []);

    // Create columns for DataTable
    const columns = useMemo(
        () =>
            createColumns({
                onView: handleView,
                onEdit: handleEdit,
                onDelete: handleDelete,
            }),
        [handleView, handleEdit, handleDelete]
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                        Dashboard Clients
                    </h1>
                    <p className="text-[14px] text-black/40 mt-1">
                        Vue d&apos;ensemble et gestion de votre portefeuille clients
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={() => setImportDialogOpen(true)}
                        variant="outline"
                        className="h-11 px-6 text-[14px] font-medium border-black/10 hover:bg-black/5"
                    >
                        <Upload className="w-4 h-4 mr-2" strokeWidth={2} />
                        Importer CSV
                    </Button>
                    <Button
                        onClick={handleCreate}
                        className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm cursor-pointer"
                    >
                        <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                        Nouveau client
                    </Button>
                </div>
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

            {/* Recherche et Vue */}
            <Card className="border-black/8 shadow-sm">
                <div className="p-4">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 relative">
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
                        <div className="flex gap-1 p-1 bg-black/2 rounded-lg border border-black/8">
                            <Button
                                variant={viewMode === "grid" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => handleViewModeChange("grid")}
                                className={
                                    viewMode === "grid"
                                        ? "bg-black hover:bg-black/90 text-white h-9"
                                        : "hover:bg-black/5 h-9"
                                }
                            >
                                <Grid className="w-4 h-4" strokeWidth={2} />
                            </Button>
                            <Button
                                variant={viewMode === "list" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => handleViewModeChange("list")}
                                className={
                                    viewMode === "list"
                                        ? "bg-black hover:bg-black/90 text-white h-9"
                                        : "hover:bg-black/5 h-9"
                                }
                            >
                                <List className="w-4 h-4" strokeWidth={2} />
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Vue Grille */}
            {viewMode === "grid" && (
                <>
                    {isLoading ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <ArticleCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : displayClients.length > 0 ? (
                        <>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {displayClients.map((client: Client) => (
                                    <ClientCard
                                        key={client.id}
                                        client={client}
                                        onView={handleView}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                            {showPagination && (
                                <GridPagination
                                    pagination={pagination}
                                    onPageChange={handlePageChange}
                                    onPageSizeChange={handlePageSizeChange}
                                />
                            )}
                        </>
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
                </>
            )}

            {/* Vue Liste */}
            {viewMode === "list" && (
                <DataTable
                    columns={columns}
                    data={displayClients}
                    emptyMessage="Aucun client trouvé"
                    pagination={showPagination ? pagination : undefined}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
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

            <CSVImportDialog
                open={importDialogOpen}
                onOpenChange={setImportDialogOpen}
                title="Importer des clients"
                description="Importez plusieurs clients à la fois via un fichier CSV"
                mappings={csvMappings}
                onImport={handleImport}
            />
        </div>
    );
}
