import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Reservation,
    ReservationStatut,
    getReservationStatutLabel,
} from "@/lib/types/reservation";
import { cn } from "@/lib/utils";
import { getReservationStatusColor } from "@/lib/utils/badge-colors";
import { Calendar, Clock, Phone, Users } from "lucide-react";

export interface ReservationCardProps {
    reservation: Reservation;
    onConfirm?: (id: string, client: string) => void;
    onEdit?: (reservation: Reservation) => void;
}

export function ReservationCard({
    reservation,
    onConfirm,
    onEdit,
}: ReservationCardProps) {
    return (
        <div className="flex items-center justify-between p-4 border border-black/8 rounded-lg hover:bg-black/2 transition-all duration-200">
            <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                    <p className="text-[15px] font-semibold tracking-[-0.01em] text-black">
                        {reservation.nomClient}
                    </p>
                    <Badge
                        variant="outline"
                        className={cn(
                            "text-[11px] px-2 py-0.5",
                            getReservationStatusColor(reservation.statut)
                        )}
                    >
                        {getReservationStatutLabel(reservation.statut)}
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
                                    reservation.nomClient
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
