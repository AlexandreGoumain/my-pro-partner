import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Calendar } from "lucide-react";
import { Reservation } from "@/lib/types/reservation";
import { ReservationCard } from "./reservation-card";

export interface ReservationListProps {
    reservations: Reservation[];
    onConfirm?: (id: string, client: string) => void;
    onEdit?: (reservation: Reservation) => void;
    onCreate?: () => void;
}

export function ReservationList({
    reservations,
    onConfirm,
    onEdit,
    onCreate,
}: ReservationListProps) {
    if (reservations.length === 0) {
        return (
            <EmptyState
                icon={Calendar}
                title="Aucune réservation"
                description="Vous n'avez pas encore de réservations. Créez-en une pour commencer."
                action={
                    onCreate
                        ? {
                              label: "Nouvelle réservation",
                              onClick: onCreate,
                          }
                        : undefined
                }
            />
        );
    }

    return (
        <Card className="border-black/8 shadow-sm">
            <CardHeader>
                <CardTitle className="text-[17px] font-semibold tracking-[-0.01em] text-black">
                    Prochaines réservations
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {reservations.map((reservation) => (
                        <ReservationCard
                            key={reservation.id}
                            reservation={reservation}
                            onConfirm={onConfirm}
                            onEdit={onEdit}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
