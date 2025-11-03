import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useClientsStats } from "@/hooks/use-clients";
import {
    useDeleteSegment,
    useExportSegment,
    useSeedSegments,
    useSegments,
} from "@/hooks/use-segments";
import type { Segment } from "@/lib/types";

export interface SegmentsPageHandlers {
    segments: Segment[];
    isLoading: boolean;
    clientsStats: Record<string, number>;
    totalClients: number;

    searchQuery: string;
    setSearchQuery: (query: string) => void;

    filteredSegments: Segment[];
    predefinedSegments: Segment[];
    customSegments: Segment[];

    stats: {
        totalSegments: number;
        activeSegments: number;
        totalClientsInSegments: number;
        averageClientsPerSegment: number;
    };

    builderDialogOpen: boolean;
    setBuilderDialogOpen: (open: boolean) => void;
    emailDialogOpen: boolean;
    setEmailDialogOpen: (open: boolean) => void;
    comparisonDialogOpen: boolean;
    setComparisonDialogOpen: (open: boolean) => void;
    deleteDialogOpen: boolean;
    setDeleteDialogOpen: (open: boolean) => void;

    selectedSegmentForEmail: Segment | null;
    selectedSegmentForEdit: Segment | null;
    setSelectedSegmentForEdit: (segment: Segment | null) => void;
    segmentToDelete: string | null;

    seedMutation: { isPending: boolean; mutate: (data: unknown) => void };
    deleteMutation: { isPending: boolean; mutate: (id: string) => void };

    handleSeedSegments: () => Promise<void>;
    handleExportSegment: (segmentId: string, format: "csv" | "json") => Promise<void>;
    handleDeleteSegment: (segmentId: string) => void;
    confirmDelete: () => Promise<void>;
    handleSendEmail: (segment: Segment) => void;
    handleEditSegment: (segment: Segment) => void;
    handleViewAnalytics: (id: string) => void;
}

export function useSegmentsPage(): SegmentsPageHandlers {
    const router = useRouter();
    const { data: segmentsData, isLoading } = useSegments();
    const { data: clientsStats } = useClientsStats();
    const seedMutation = useSeedSegments();
    const exportMutation = useExportSegment();
    const deleteMutation = useDeleteSegment();

    const [builderDialogOpen, setBuilderDialogOpen] = useState(false);
    const [emailDialogOpen, setEmailDialogOpen] = useState(false);
    const [comparisonDialogOpen, setComparisonDialogOpen] = useState(false);
    const [selectedSegmentForEmail, setSelectedSegmentForEmail] = useState<Segment | null>(null);
    const [selectedSegmentForEdit, setSelectedSegmentForEdit] = useState<Segment | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [segmentToDelete, setSegmentToDelete] = useState<string | null>(null);

    const segments = segmentsData?.data || [];

    const filteredSegments = useMemo(() => {
        if (!searchQuery.trim()) return segments;
        const query = searchQuery.toLowerCase();
        return segments.filter(
            (s) =>
                s.nom.toLowerCase().includes(query) ||
                s.description?.toLowerCase().includes(query)
        );
    }, [segments, searchQuery]);

    const predefinedSegments = useMemo(
        () => filteredSegments.filter((s) => s.type === "PREDEFINED"),
        [filteredSegments]
    );

    const customSegments = useMemo(
        () => filteredSegments.filter((s) => s.type === "CUSTOM"),
        [filteredSegments]
    );

    const totalClients = clientsStats?.total || 0;

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

    const handleSeedSegments = async () => {
        try {
            const result = await seedMutation.mutateAsync();
            toast.success(
                `${result.created} segment${
                    result.created > 1 ? "s" : ""
                } créé${result.created > 1 ? "s" : ""} avec succès`
            );
        } catch (error: unknown) {
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
        } catch (error: unknown) {
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

    const handleSendEmail = (segment: Segment) => {
        setSelectedSegmentForEmail(segment);
        setEmailDialogOpen(true);
    };

    const handleEditSegment = (segment: Segment) => {
        setSelectedSegmentForEdit(segment);
        setBuilderDialogOpen(true);
    };

    const handleViewAnalytics = (id: string) => {
        router.push(`/dashboard/clients/segments/${id}/analytics`);
    };

    return {
        segments,
        isLoading,
        clientsStats,
        totalClients,
        searchQuery,
        setSearchQuery,
        filteredSegments,
        predefinedSegments,
        customSegments,
        stats,
        builderDialogOpen,
        setBuilderDialogOpen,
        emailDialogOpen,
        setEmailDialogOpen,
        comparisonDialogOpen,
        setComparisonDialogOpen,
        deleteDialogOpen,
        setDeleteDialogOpen,
        selectedSegmentForEmail,
        selectedSegmentForEdit,
        setSelectedSegmentForEdit,
        segmentToDelete,
        seedMutation,
        deleteMutation,
        handleSeedSegments,
        handleExportSegment,
        handleDeleteSegment,
        confirmDelete,
        handleSendEmail,
        handleEditSegment,
        handleViewAnalytics,
    };
}
