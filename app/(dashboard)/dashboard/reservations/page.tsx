"use client";

import { ReservationList, ReservationStats } from "@/components/reservations";
import { ReservationDialog } from "@/components/reservations/reservation-dialog";
import { ConditionalSkeleton } from "@/components/ui/conditional-skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { RouteGuard } from "@/components/ui/route-guard";
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
        newReservationOpen,
        setNewReservationOpen,
        editingReservation,
        setEditingReservation,
    } = useReservationsPage();

    const handleDialogSuccess = () => {
        setNewReservationOpen(false);
        setEditingReservation(null);
    };

    return (
        <RouteGuard capability="agenda">
            <ConditionalSkeleton
                isLoading={isLoading}
                skeletonProps={{
                    layout: "stats-grid",
                    statsCount: 4,
                    itemCount: 6,
                }}
            >
                <div className="space-y-6">
                    <PageHeader
                        title="Réservations"
                        description="Gérez vos réservations de tables"
                        actions={
                            <PrimaryActionButton
                                icon={Plus}
                                onClick={handleCreate}
                            >
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

                    {/* Reservation Dialog */}
                    <ReservationDialog
                        open={newReservationOpen}
                        onOpenChange={(open) => {
                            setNewReservationOpen(open);
                            if (!open) setEditingReservation(null);
                        }}
                        onSuccess={handleDialogSuccess}
                        reservation={editingReservation}
                    />
                </div>
            </ConditionalSkeleton>
        </RouteGuard>
    );
}
