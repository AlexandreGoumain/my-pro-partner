"use client";

import { ReservationList, ReservationStats } from "@/components/reservations";
import { PageHeader } from "@/components/ui/page-header";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { LoadingState } from "@/components/ui/loading-state";
import { useReservationsPage } from "@/hooks/use-reservations-page";
import { Plus } from "lucide-react";

export default function ReservationsPage() {
    const {
        reservations,
        isLoading,
        stats,
        handleCreate,
        handleEdit,
        handleConfirm,
    } = useReservationsPage();

    if (isLoading) {
        return <LoadingState minHeight="md" />;
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Réservations"
                description="Gérez vos réservations de tables"
                actions={
                    <PrimaryActionButton icon={Plus} onClick={handleCreate}>
                        Nouvelle réservation
                    </PrimaryActionButton>
                }
            />

            <ReservationStats stats={stats} />

            <ReservationList
                reservations={reservations}
                onConfirm={handleConfirm}
                onEdit={handleEdit}
                onCreate={handleCreate}
            />
        </div>
    );
}
