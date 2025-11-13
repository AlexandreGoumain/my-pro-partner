import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { Reservation, ReservationStats } from "@/lib/types/reservation";
import {
    useReservations,
    useConfirmReservation,
    useCancelReservation,
} from "@/hooks/use-reservations";

export interface ReservationsPageHandlers {
    reservations: Reservation[];
    isLoading: boolean;
    stats: ReservationStats;

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
    const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);

    const { data, isLoading } = useReservations();
    const confirmReservation = useConfirmReservation();
    const cancelReservation = useCancelReservation();

    const reservations = data?.data || [];

    const stats = useMemo(
        (): ReservationStats => ({
            total: reservations.length,
            confirmees: reservations.filter((r) => r.statut === "CONFIRMEE").length,
            enAttente: reservations.filter((r) => r.statut === "EN_ATTENTE").length,
            couverts: reservations.reduce((sum, r) => sum + r.personnes, 0),
        }),
        [reservations]
    );

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
