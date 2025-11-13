"use client";

import { ReservationList, ReservationStats } from "@/components/reservations";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
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
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="text-[14px] text-black/40">Chargement...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Réservations"
                description="Gérez vos réservations de tables"
                actions={
                    <Button
                        onClick={handleCreate}
                        className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                    >
                        <Plus className="h-4 w-4 mr-2" strokeWidth={2} />
                        Nouvelle réservation
                    </Button>
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
