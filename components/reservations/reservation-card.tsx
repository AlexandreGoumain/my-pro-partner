import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Phone, Users } from "lucide-react";
import { Reservation, ReservationStatut } from "@/lib/types/reservation";
import { cn } from "@/lib/utils";

export interface ReservationCardProps {
    reservation: Reservation;
    onConfirm?: (id: string, client: string) => void;
    onEdit?: (reservation: Reservation) => void;
}

function getStatusConfig(statut: ReservationStatut) {
    switch (statut) {
        case ReservationStatut.CONFIRMEE:
            return {
                label: "Confirmée",
                className: "bg-black/10 text-black/80 border-black/10",
            };
        case ReservationStatut.EN_ATTENTE:
            return {
                label: "En attente",
                className: "bg-black/5 text-black/60 border-black/8",
            };
        case ReservationStatut.ANNULEE:
            return {
                label: "Annulée",
                className: "bg-black/5 text-black/40 border-black/5",
            };
        default:
            return {
                label: statut,
                className: "bg-black/5 text-black/60 border-black/8",
            };
    }
}

export function ReservationCard({
    reservation,
    onConfirm,
    onEdit,
}: ReservationCardProps) {
    const statusConfig = getStatusConfig(reservation.statut);

    return (
        <div className="flex items-center justify-between p-4 border border-black/8 rounded-lg hover:bg-black/2 transition-all duration-200">
            <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                    <p className="text-[15px] font-semibold tracking-[-0.01em] text-black">
                        {reservation.client}
                    </p>
                    <Badge
                        variant="outline"
                        className={cn(
                            "text-[11px] px-2 py-0.5",
                            statusConfig.className
                        )}
                    >
                        {statusConfig.label}
                    </Badge>
                </div>

                <div className="flex items-center gap-6 text-[13px] text-black/60">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" strokeWidth={2} />
                        <span>
                            {new Date(reservation.date).toLocaleDateString(
                                "fr-FR",
                                {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                }
                            )}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" strokeWidth={2} />
                        <span>{reservation.heure}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4" strokeWidth={2} />
                        <span>
                            {reservation.personnes} personne
                            {reservation.personnes > 1 ? "s" : ""}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <Phone className="h-4 w-4" strokeWidth={2} />
                        <span>{reservation.telephone}</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-2">
                {reservation.statut === ReservationStatut.EN_ATTENTE &&
                    onConfirm && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                onConfirm(
                                    String(reservation.id),
                                    reservation.client
                                )
                            }
                            className="h-9 px-4 text-[13px] border-black/10 hover:bg-black/5"
                        >
                            Confirmer
                        </Button>
                    )}
                {onEdit && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(reservation)}
                        className="h-9 px-4 text-[13px] hover:bg-black/5"
                    >
                        Modifier
                    </Button>
                )}
            </div>
        </div>
    );
}
