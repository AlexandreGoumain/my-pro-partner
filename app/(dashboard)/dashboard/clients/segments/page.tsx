"use client";

import { BulkEmailDialog } from "@/components/bulk-email-dialog";
import { SegmentBuilderDialog } from "@/components/segment-builder-dialog";
import { SegmentComparisonDialog } from "@/components/segment-comparison-dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useClients } from "@/hooks/use-clients";
import {
    useDeleteSegment,
    useExportSegment,
    useSeedSegments,
    useSegments,
} from "@/hooks/use-segments";
import { Segment } from "@/lib/types";
import {
    Award,
    BarChart3,
    Clock,
    Download,
    Edit,
    Eye,
    Filter,
    GitCompare,
    Loader2,
    Mail,
    MapPin,
    MoreHorizontal,
    Phone,
    Plus,
    Search,
    Star,
    Trash2,
    Users,
    UserX,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

// Icon mapping
const ICON_MAP: Record<
    string,
    React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
    Users,
    Mail,
    Phone,
    MapPin,
    Clock,
    UserX,
    Star,
    Award,
    Filter,
};

export default function ClientSegmentsPage() {
    const router = useRouter();
    const { data: segmentsData, isLoading } = useSegments();
    const { data: clients = [] } = useClients();
    const seedMutation = useSeedSegments();
    const exportMutation = useExportSegment();
    const deleteMutation = useDeleteSegment();

    const [builderDialogOpen, setBuilderDialogOpen] = useState(false);
    const [emailDialogOpen, setEmailDialogOpen] = useState(false);
    const [comparisonDialogOpen, setComparisonDialogOpen] = useState(false);
    const [selectedSegmentForEmail, setSelectedSegmentForEmail] =
        useState<Segment | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [segmentToDelete, setSegmentToDelete] = useState<string | null>(null);

    const segments = segmentsData?.data || [];

    // Filter segments based on search query
    const filteredSegments = useMemo(() => {
        if (!searchQuery.trim()) return segments;
        const query = searchQuery.toLowerCase();
        return segments.filter(
            (s) =>
                s.nom.toLowerCase().includes(query) ||
                s.description?.toLowerCase().includes(query)
        );
    }, [segments, searchQuery]);

    const predefinedSegments = filteredSegments.filter(
        (s) => s.type === "PREDEFINED"
    );
    const customSegments = filteredSegments.filter((s) => s.type === "CUSTOM");

    const totalClients = clients.length;

    // Keyboard shortcut: Ctrl+N to create new segment
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "n") {
                e.preventDefault();
                setBuilderDialogOpen(true);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleViewSegment = (segment: Segment) => {
        router.push(`/dashboard/clients?segment=${segment.id}`);
    };

    const handleSeedSegments = async () => {
        try {
            const result = await seedMutation.mutateAsync();
            toast.success(
                `${result.created} segment${
                    result.created > 1 ? "s" : ""
                } créé${result.created > 1 ? "s" : ""} avec succès`
            );
        } catch (error: any) {
            toast.error(
                error.message || "Erreur lors de la création des segments"
            );
        }
    };

    const handleExportSegment = async (
        segmentId: string,
        format: "csv" | "json"
    ) => {
        try {
            await exportMutation.mutateAsync({ id: segmentId, format });
            toast.success("Export réussi");
        } catch (error: any) {
            toast.error(error.message || "Erreur lors de l'export");
        }
    };

    const handleDeleteSegment = (segmentId: string) => {
        setSegmentToDelete(segmentId);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!segmentToDelete) return;

        try {
            await deleteMutation.mutateAsync(segmentToDelete);
            toast.success("Segment supprimé avec succès");
            setDeleteDialogOpen(false);
            setSegmentToDelete(null);
        } catch (error: unknown) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erreur lors de la suppression";
            toast.error(message);
        }
    };

    // Calculate summary stats
    const stats = useMemo(() => {
        const totalSegments = segments.length;
        const activeSegments = segments.filter((s) => s.actif).length;
        const totalClientsInSegments = segments.reduce(
            (acc, s) => acc + (s.nombreClients ?? 0),
            0
        );
        const averageClientsPerSegment =
            totalSegments > 0
                ? Math.round(totalClientsInSegments / totalSegments)
                : 0;

        return {
            totalSegments,
            activeSegments,
            totalClientsInSegments,
            averageClientsPerSegment,
        };
    }, [segments]);

    const handleSendEmail = (segment: Segment) => {
        setSelectedSegmentForEmail(segment);
        setEmailDialogOpen(true);
    };

    const getSegmentIcon = (iconName: string | null) => {
        if (!iconName) return Filter;
        return ICON_MAP[iconName] || Filter;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                        Segments clients
                    </h1>
                    <p className="text-[14px] text-black/40 mt-1">
                        Organisez et analysez vos clients par segments
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="h-11 px-6 text-[14px] font-medium border-black/10 hover:bg-black/5"
                        onClick={() => setComparisonDialogOpen(true)}
                        disabled={segments.length < 2}
                    >
                        <GitCompare className="w-4 h-4 mr-2" strokeWidth={2} />
                        Comparer
                    </Button>
                    <Button
                        className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm cursor-pointer"
                        onClick={() => setBuilderDialogOpen(true)}
                        title="Raccourci: Ctrl+N"
                    >
                        <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                        Créer un segment
                    </Button>
                </div>
            </div>

            {/* Search bar */}
            <div className="relative max-w-md">
                <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40"
                    strokeWidth={2}
                />
                <Input
                    placeholder="Rechercher un segment..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11 text-[14px] border-black/10 focus-visible:ring-black/20"
                />
            </div>

            {/* Summary Stats */}
            {segments.length > 0 && (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="p-5 border-black/8 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                                <Filter
                                    className="h-5 w-5 text-black/60"
                                    strokeWidth={2}
                                />
                            </div>
                            <div>
                                <p className="text-[12px] text-black/40 uppercase tracking-wide">
                                    Total segments
                                </p>
                                <p className="text-[20px] font-semibold tracking-[-0.01em] text-black mt-0.5">
                                    {stats.totalSegments}
                                </p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-5 border-black/8 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                                <Users
                                    className="h-5 w-5 text-black/60"
                                    strokeWidth={2}
                                />
                            </div>
                            <div>
                                <p className="text-[12px] text-black/40 uppercase tracking-wide">
                                    Clients total
                                </p>
                                <p className="text-[20px] font-semibold tracking-[-0.01em] text-black mt-0.5">
                                    {totalClients}
                                </p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-5 border-black/8 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                                <Star
                                    className="h-5 w-5 text-black/60"
                                    strokeWidth={2}
                                />
                            </div>
                            <div>
                                <p className="text-[12px] text-black/40 uppercase tracking-wide">
                                    Segments actifs
                                </p>
                                <p className="text-[20px] font-semibold tracking-[-0.01em] text-black mt-0.5">
                                    {stats.activeSegments}
                                </p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-5 border-black/8 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                                <BarChart3
                                    className="h-5 w-5 text-black/60"
                                    strokeWidth={2}
                                />
                            </div>
                            <div>
                                <p className="text-[12px] text-black/40 uppercase tracking-wide">
                                    Moyenne/segment
                                </p>
                                <p className="text-[20px] font-semibold tracking-[-0.01em] text-black mt-0.5">
                                    {stats.averageClientsPerSegment}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Segments prédéfinis */}
            <div>
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-black">
                            Segments prédéfinis
                        </h3>
                        <p className="text-[14px] text-black/40 mt-1">
                            Segments créés automatiquement selon vos données
                            clients
                        </p>
                    </div>
                    {predefinedSegments.length === 0 && !isLoading && (
                        <Button
                            onClick={handleSeedSegments}
                            disabled={seedMutation.isPending}
                            variant="outline"
                            className="h-10 px-5 text-[13px] font-medium border-black/10 hover:bg-black/5"
                        >
                            {seedMutation.isPending && (
                                <Loader2
                                    className="w-4 h-4 mr-2 animate-spin"
                                    strokeWidth={2}
                                />
                            )}
                            Créer les segments prédéfinis
                        </Button>
                    )}
                </div>

                {isLoading ? (
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Card
                                key={i}
                                className="p-6 animate-pulse border-black/8 shadow-sm"
                            >
                                <div className="h-24 bg-black/5 rounded" />
                            </Card>
                        ))}
                    </div>
                ) : predefinedSegments.length === 0 ? (
                    <Card className="p-12 border-dashed border-black/10 shadow-sm">
                        <div className="flex flex-col items-center text-center space-y-5">
                            <div className="rounded-full h-20 w-20 bg-black/5 flex items-center justify-center">
                                <Filter
                                    className="w-10 h-10 text-black/40"
                                    strokeWidth={2}
                                />
                            </div>
                            <div>
                                <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-black mb-2">
                                    Aucun segment prédéfini
                                </h3>
                                <p className="text-[14px] text-black/60 max-w-md">
                                    Créez les segments prédéfinis pour commencer
                                    à organiser vos clients.
                                </p>
                            </div>
                            <Button
                                onClick={handleSeedSegments}
                                disabled={seedMutation.isPending}
                                className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm mt-2"
                            >
                                {seedMutation.isPending ? (
                                    <>
                                        <Loader2
                                            className="w-4 h-4 mr-2 animate-spin"
                                            strokeWidth={2}
                                        />
                                        Création...
                                    </>
                                ) : (
                                    <>
                                        <Plus
                                            className="w-4 h-4 mr-2"
                                            strokeWidth={2}
                                        />
                                        Créer les segments prédéfinis
                                    </>
                                )}
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {predefinedSegments.map((segment) => {
                            const Icon = getSegmentIcon(segment.icone);
                            const percentage =
                                totalClients > 0
                                    ? ((segment.nombreClients ?? 0) /
                                          totalClients) *
                                      100
                                    : 0;

                            return (
                                <Card
                                    key={segment.id}
                                    className="group border-black/8 shadow-sm hover:border-black/20 transition-all duration-200 overflow-hidden"
                                >
                                    <div
                                        className="p-5 cursor-pointer"
                                        onClick={() =>
                                            handleViewSegment(segment)
                                        }
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-black/5 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                                    <Icon
                                                        className="h-5 w-5 text-black/60"
                                                        strokeWidth={2}
                                                    />
                                                </div>
                                                <div>
                                                    <h4 className="text-[15px] font-medium tracking-[-0.01em] text-black mb-1.5">
                                                        {segment.nom}
                                                    </h4>
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-black/5 text-black/60 border-0 text-[11px] h-5 px-2"
                                                    >
                                                        {segment.nombreClients ??
                                                            0}{" "}
                                                        client
                                                        {(segment.nombreClients ??
                                                            0) > 1
                                                            ? "s"
                                                            : ""}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger
                                                    asChild
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/5"
                                                    >
                                                        <MoreHorizontal
                                                            className="h-4 w-4 text-black/60"
                                                            strokeWidth={2}
                                                        />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    align="end"
                                                    className="w-48 border-black/10"
                                                >
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleExportSegment(
                                                                segment.id,
                                                                "csv"
                                                            );
                                                        }}
                                                        className="text-[13px]"
                                                    >
                                                        <Download
                                                            className="mr-2 h-4 w-4 text-black/60"
                                                            strokeWidth={2}
                                                        />
                                                        <span className="text-black/80">
                                                            Exporter (CSV)
                                                        </span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleSendEmail(
                                                                segment
                                                            );
                                                        }}
                                                        className="text-[13px]"
                                                    >
                                                        <Mail
                                                            className="mr-2 h-4 w-4 text-black/60"
                                                            strokeWidth={2}
                                                        />
                                                        <span className="text-black/80">
                                                            Envoyer un email
                                                        </span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <p className="text-[13px] text-black/60 mb-4">
                                            {segment.description}
                                        </p>

                                        {/* Progress bar */}
                                        <div>
                                            <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-black transition-all duration-500"
                                                    style={{
                                                        width: `${percentage}%`,
                                                    }}
                                                />
                                            </div>
                                            <p className="text-[12px] text-black/40 mt-2">
                                                {percentage.toFixed(1)}% de
                                                votre base
                                            </p>
                                        </div>
                                    </div>

                                    {/* Quick actions - visible on hover */}
                                    <div className="border-t border-black/8 p-3 bg-black/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="flex-1 h-9 text-[13px] font-medium hover:bg-black/5"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleViewSegment(segment);
                                                }}
                                            >
                                                <Eye
                                                    className="h-4 w-4 mr-2"
                                                    strokeWidth={2}
                                                />
                                                Voir
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="flex-1 h-9 text-[13px] font-medium hover:bg-black/5"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(
                                                        `/dashboard/clients/segments/${segment.id}/analytics`
                                                    );
                                                }}
                                            >
                                                <BarChart3
                                                    className="h-4 w-4 mr-2"
                                                    strokeWidth={2}
                                                />
                                                Analytics
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Segments personnalisés */}
            <div>
                <div className="mb-5">
                    <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-black">
                        Segments personnalisés
                    </h3>
                    <p className="text-[14px] text-black/40 mt-1">
                        Créez vos propres segments avec des critères
                        personnalisés
                    </p>
                </div>

                {customSegments.length === 0 ? (
                    <Card className="p-12 border-dashed border-black/10 shadow-sm">
                        <div className="flex flex-col items-center text-center space-y-5">
                            <div className="rounded-full h-20 w-20 bg-black/5 flex items-center justify-center">
                                <Filter
                                    className="w-10 h-10 text-black/40"
                                    strokeWidth={2}
                                />
                            </div>
                            <div>
                                <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-black mb-2">
                                    Aucun segment personnalisé
                                </h3>
                                <p className="text-[14px] text-black/60 max-w-md">
                                    Créez des segments personnalisés en
                                    combinant plusieurs critères pour mieux
                                    cibler vos actions marketing.
                                </p>
                            </div>
                            <Button
                                onClick={() => setBuilderDialogOpen(true)}
                                className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm mt-2"
                            >
                                <Plus
                                    className="w-4 h-4 mr-2"
                                    strokeWidth={2}
                                />
                                Créer un segment
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {customSegments.map((segment) => {
                            const Icon = getSegmentIcon(segment.icone);
                            const percentage =
                                totalClients > 0
                                    ? ((segment.nombreClients ?? 0) /
                                          totalClients) *
                                      100
                                    : 0;

                            return (
                                <Card
                                    key={segment.id}
                                    className="group border-black/8 shadow-sm hover:border-black/20 transition-all duration-200 overflow-hidden"
                                >
                                    <div
                                        className="p-5 cursor-pointer"
                                        onClick={() =>
                                            handleViewSegment(segment)
                                        }
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-black/5 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                                    <Icon
                                                        className="h-5 w-5 text-black/60"
                                                        strokeWidth={2}
                                                    />
                                                </div>
                                                <div>
                                                    <h4 className="text-[15px] font-medium tracking-[-0.01em] text-black mb-1.5">
                                                        {segment.nom}
                                                    </h4>
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-black/5 text-black/60 border-0 text-[11px] h-5 px-2"
                                                    >
                                                        {segment.nombreClients ??
                                                            0}{" "}
                                                        client
                                                        {(segment.nombreClients ??
                                                            0) > 1
                                                            ? "s"
                                                            : ""}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger
                                                    asChild
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/5"
                                                    >
                                                        <MoreHorizontal
                                                            className="h-4 w-4 text-black/60"
                                                            strokeWidth={2}
                                                        />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    align="end"
                                                    className="w-48 border-black/10"
                                                >
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toast.info(
                                                                "Fonctionnalité à venir"
                                                            );
                                                        }}
                                                        className="text-[13px]"
                                                    >
                                                        <Edit
                                                            className="mr-2 h-4 w-4 text-black/60"
                                                            strokeWidth={2}
                                                        />
                                                        <span className="text-black/80">
                                                            Modifier
                                                        </span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-black/8" />
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleExportSegment(
                                                                segment.id,
                                                                "csv"
                                                            );
                                                        }}
                                                        className="text-[13px]"
                                                    >
                                                        <Download
                                                            className="mr-2 h-4 w-4 text-black/60"
                                                            strokeWidth={2}
                                                        />
                                                        <span className="text-black/80">
                                                            Exporter (CSV)
                                                        </span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleSendEmail(
                                                                segment
                                                            );
                                                        }}
                                                        className="text-[13px]"
                                                    >
                                                        <Mail
                                                            className="mr-2 h-4 w-4 text-black/60"
                                                            strokeWidth={2}
                                                        />
                                                        <span className="text-black/80">
                                                            Envoyer un email
                                                        </span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-black/8" />
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteSegment(
                                                                segment.id
                                                            );
                                                        }}
                                                        className="text-[13px] text-red-600"
                                                    >
                                                        <Trash2
                                                            className="mr-2 h-4 w-4"
                                                            strokeWidth={2}
                                                        />
                                                        <span>Supprimer</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <p className="text-[13px] text-black/60 mb-4">
                                            {segment.description}
                                        </p>

                                        {/* Progress bar */}
                                        <div>
                                            <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-black transition-all duration-500"
                                                    style={{
                                                        width: `${percentage}%`,
                                                    }}
                                                />
                                            </div>
                                            <p className="text-[12px] text-black/40 mt-2">
                                                {percentage.toFixed(1)}% de
                                                votre base
                                            </p>
                                        </div>
                                    </div>

                                    {/* Quick actions - visible on hover */}
                                    <div className="border-t border-black/8 p-3 bg-black/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="flex-1 h-9 text-[13px] font-medium hover:bg-black/5"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleViewSegment(segment);
                                                }}
                                            >
                                                <Eye
                                                    className="h-4 w-4 mr-2"
                                                    strokeWidth={2}
                                                />
                                                Voir
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="flex-1 h-9 text-[13px] font-medium hover:bg-black/5"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(
                                                        `/dashboard/clients/segments/${segment.id}/analytics`
                                                    );
                                                }}
                                            >
                                                <BarChart3
                                                    className="h-4 w-4 mr-2"
                                                    strokeWidth={2}
                                                />
                                                Analytics
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Dialogs */}
            <SegmentBuilderDialog
                open={builderDialogOpen}
                onOpenChange={setBuilderDialogOpen}
                onSuccess={() => {
                    toast.success("Segment créé avec succès");
                }}
            />

            <BulkEmailDialog
                open={emailDialogOpen}
                onOpenChange={setEmailDialogOpen}
                segment={selectedSegmentForEmail}
                clientCount={selectedSegmentForEmail?.nombreClients ?? 0}
            />

            <SegmentComparisonDialog
                open={comparisonDialogOpen}
                onOpenChange={setComparisonDialogOpen}
            />

            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent className="border-black/10">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-[17px] font-semibold tracking-[-0.01em]">
                            Supprimer ce segment ?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-[14px] text-black/60">
                            Cette action est irréversible. Le segment sera
                            définitivement supprimé de votre base de données.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="h-11 px-6 text-[14px] font-medium border-black/10 hover:bg-black/5">
                            Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            disabled={deleteMutation.isPending}
                            className="h-11 px-6 text-[14px] font-medium bg-red-600 hover:bg-red-700 text-white"
                        >
                            {deleteMutation.isPending ? (
                                <>
                                    <Loader2
                                        className="w-4 h-4 mr-2 animate-spin"
                                        strokeWidth={2}
                                    />
                                    Suppression...
                                </>
                            ) : (
                                "Supprimer"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
