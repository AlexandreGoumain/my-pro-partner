import {
    useCancelReservation,
    useConfirmReservation,
    useReservations,
    useReservationsStats,
} from "@/hooks/use-reservations";
import { Reservation } from "@/lib/types/reservation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

// Simple stats interface for the component
export interface SimpleReservationStats {
    total: number;
    confirmees: number;
    enAttente: number;
    couverts: number;
}

export interface ReservationsPageHandlers {
    reservations: Reservation[];
    isLoading: boolean;
    stats: SimpleReservationStats;

    newReservationOpen: boolean;
    setNewReservationOpen: (open: boolean) => void;
    editingReservation: Reservation | null;
    setEditingReservation: (reservation: Reservation | null) => void;

    handleCreate: () => void;
    handleEdit: (reservation: Reservation) => void;
    handleConfirm: (id: string, client: string) => Promise<void>;
    handleCancel: (id: string, client: string) => Promise<void>;
}

export function useReservationsPage(): ReservationsPageHandlers {
    const [newReservationOpen, setNewReservationOpen] = useState(false);
    const [editingReservation, setEditingReservation] =
        useState<Reservation | null>(null);

    // Get today's date for filtering
    const today = new Date().toISOString().split("T")[0];

    const { data, isLoading } = useReservations({ date: today });
    const { data: statsData } = useReservationsStats();
    const confirmReservation = useConfirmReservation();
    const cancelReservation = useCancelReservation();

    const reservations = data?.data || [];

    // Map API stats to simple format expected by component
    // We use today's stats for a more relevant view
    const stats = useMemo((): SimpleReservationStats => {
        if (statsData) {
            return {
                total: statsData.aujourdhui.total,
                confirmees: statsData.aujourdhui.confirmees,
                enAttente: statsData.aujourdhui.enAttente,
                couverts: statsData.aujourdhui.couverts,
            };
        }

        // Fallback to computing from reservations if API stats not ready
        return {
            total: reservations.length,
            confirmees: reservations.filter((r) => r.statut === "CONFIRMEE")
                .length,
            enAttente: reservations.filter((r) => r.statut === "EN_ATTENTE")
                .length,
            couverts: reservations.reduce((sum, r) => sum + r.personnes, 0),
        };
    }, [statsData, reservations]);

    const handleCreate = useCallback(() => {
        setEditingReservation(null);
        setNewReservationOpen(true);
    }, []);

    const handleEdit = useCallback((reservation: Reservation) => {
        setEditingReservation(reservation);
        setNewReservationOpen(true);
    }, []);

    const handleConfirm = useCallback(
        async (id: string, client: string) => {
            if (!confirm(`Confirmer la réservation de ${client} ?`)) return;

            try {
                await confirmReservation.mutateAsync(id);
                toast.success("Réservation confirmée");
            } catch (error: unknown) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Erreur lors de la confirmation";
                toast.error(errorMessage);
            }
        },
        [confirmReservation]
    );

    const handleCancel = useCallback(
        async (id: string, client: string) => {
            if (!confirm(`Annuler la réservation de ${client} ?`)) return;

            try {
                await cancelReservation.mutateAsync(id);
                toast.success("Réservation annulée");
            } catch (error: unknown) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Erreur lors de l'annulation";
                toast.error(errorMessage);
            }
        },
        [cancelReservation]
    );

    return {
        reservations,
        isLoading,
        stats,
        newReservationOpen,
        setNewReservationOpen,
        editingReservation,
        setEditingReservation,
        handleCreate,
        handleEdit,
        handleConfirm,
        handleCancel,
    };
}
