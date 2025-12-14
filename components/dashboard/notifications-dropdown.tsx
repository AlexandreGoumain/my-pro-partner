"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBusinessNavigation } from "@/hooks/use-business-navigation";
import type { StatutReparation } from "@/lib/generated/prisma";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { AlertCircle, Bell, CheckCircle2, Clock, Wrench } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface RepairNotification {
    id: string;
    numero: string;
    typeAppareil: string;
    marque: string;
    statut: StatutReparation;
    priorite: string;
    dateEstimeeRetour: Date | null;
    updatedAt: Date;
    clientNom: string;
}

const STATUS_LABELS: Record<string, string> = {
    DEPOSE: "Déposé",
    DIAGNOSTIC: "Diagnostic",
    DEVIS_ENVOYE: "Devis envoyé",
    ATTENTE_PIECES: "Attente pièces",
    EN_COURS: "En cours",
    PRETE: "Prêt",
    LIVREE: "Livré",
    ANNULEE: "Annulé",
    ABANDONNEE: "Abandonné",
};

const getStatusIcon = (statut: string) => {
    switch (statut) {
        case "PRETE":
            return (
                <CheckCircle2 className="h-4 w-4 text-black" strokeWidth={2} />
            );
        case "DEPOSE":
        case "DIAGNOSTIC":
            return <Clock className="h-4 w-4 text-black/60" strokeWidth={2} />;
        case "EN_COURS":
            return <Wrench className="h-4 w-4 text-black/60" strokeWidth={2} />;
        default:
            return (
                <AlertCircle
                    className="h-4 w-4 text-black/40"
                    strokeWidth={2}
                />
            );
    }
};

const isActionRequired = (repair: RepairNotification): boolean => {
    // Nécessite une action si :
    // - Prêt mais pas encore livré
    // - Devis envoyé en attente de réponse
    // - En retard
    const statuts = ["PRETE", "DEVIS_ENVOYE"];

    if (statuts.includes(repair.statut)) {
        return true;
    }

    // Vérifier si en retard
    if (
        repair.dateEstimeeRetour &&
        new Date(repair.dateEstimeeRetour) < new Date()
    ) {
        return true;
    }

    return false;
};

export function NotificationsDropdown() {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { isFeatureActive } = useBusinessNavigation();

    // Vérifier si la feature repairs est active pour ce business
    const canAccessRepairs = isFeatureActive("repairs");

    // Récupérer les réparations qui nécessitent une attention
    const { data: notifications, isLoading } = useQuery({
        queryKey: ["repair-notifications"],
        queryFn: async () => {
            const response = await fetch("/api/reparations?limit=50");
            if (!response.ok) throw new Error("Failed to fetch repairs");
            const data = await response.json();

            // Filtrer les réparations qui ne sont pas terminées
            return data.items
                .filter(
                    (r: RepairNotification) =>
                        !["LIVREE", "ANNULEE", "ABANDONNEE"].includes(r.statut)
                )
                .sort(
                    (a: RepairNotification, b: RepairNotification) =>
                        new Date(b.updatedAt).getTime() -
                        new Date(a.updatedAt).getTime()
                )
                .slice(0, 10); // Max 10 notifications
        },
        refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
        enabled: canAccessRepairs, // Ne charger que si la feature est accessible
    });

    const actionRequiredCount =
        notifications?.filter(isActionRequired).length || 0;
    const hasNotifications = actionRequiredCount > 0;

    const handleNotificationClick = (repairId: string) => {
        setOpen(false);
        router.push(`/dashboard/reparations/${repairId}`);
    };

    const handleViewAll = () => {
        setOpen(false);
        router.push("/dashboard/reparations");
    };

    // Ne pas afficher le dropdown si la feature n'est pas accessible
    if (!canAccessRepairs) {
        return null;
    }

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="relative h-9 w-9 border-black/10 hover:bg-black/5 hover:border-black/15 transition-all duration-200"
                    aria-label="Notifications"
                >
                    <Bell className="w-4 h-4 text-black/60" strokeWidth={2} />
                    {hasNotifications && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-black text-white text-[10px] font-semibold flex items-center justify-center shadow-sm">
                            {actionRequiredCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-[380px] p-0"
                sideOffset={8}
            >
                {/* Header */}
                <div className="px-4 py-3 border-b border-black/10">
                    <DropdownMenuLabel className="text-[14px] font-semibold tracking-[-0.01em] p-0">
                        Notifications
                    </DropdownMenuLabel>
                    {hasNotifications && (
                        <p className="text-[12px] text-black/40 mt-0.5">
                            {actionRequiredCount}{" "}
                            {actionRequiredCount === 1
                                ? "action requise"
                                : "actions requises"}
                        </p>
                    )}
                </div>

                {/* Notifications List */}
                <div className="max-h-[400px] overflow-y-auto">
                    {isLoading ? (
                        <div className="px-4 py-8 text-center">
                            <div className="text-[13px] text-black/40">
                                Chargement...
                            </div>
                        </div>
                    ) : notifications && notifications.length > 0 ? (
                        <div className="py-1">
                            {notifications.map((repair: RepairNotification) => {
                                const requiresAction = isActionRequired(repair);

                                return (
                                    <DropdownMenuItem
                                        key={repair.id}
                                        onClick={() =>
                                            handleNotificationClick(repair.id)
                                        }
                                        className="px-4 py-3 cursor-pointer focus:bg-black/5 transition-colors duration-200"
                                    >
                                        <div className="flex gap-3 w-full">
                                            {/* Icon */}
                                            <div className="flex-shrink-0 mt-0.5">
                                                {getStatusIcon(repair.statut)}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[13px] font-medium text-black">
                                                                {repair.numero}
                                                            </span>
                                                            {requiresAction && (
                                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-black text-white text-[10px] font-semibold">
                                                                    ACTION
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-[12px] text-black/60 mt-0.5">
                                                            {repair.marque}{" "}
                                                            {
                                                                repair.typeAppareil
                                                            }{" "}
                                                            - {repair.clientNom}
                                                        </div>
                                                    </div>
                                                    <span className="text-[11px] text-black/40 whitespace-nowrap">
                                                        {format(
                                                            new Date(
                                                                repair.updatedAt
                                                            ),
                                                            "HH:mm",
                                                            { locale: fr }
                                                        )}
                                                    </span>
                                                </div>

                                                {/* Status */}
                                                <div className="mt-1.5">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-black/5 text-[11px] font-medium text-black/70">
                                                        {STATUS_LABELS[
                                                            repair.statut
                                                        ] || repair.statut}
                                                    </span>
                                                </div>

                                                {/* Delayed indicator */}
                                                {repair.dateEstimeeRetour &&
                                                    new Date(
                                                        repair.dateEstimeeRetour
                                                    ) < new Date() && (
                                                        <div className="mt-1.5 text-[11px] text-black/60">
                                                            ⚠️ En retard depuis{" "}
                                                            {format(
                                                                new Date(
                                                                    repair.dateEstimeeRetour
                                                                ),
                                                                "dd MMM",
                                                                { locale: fr }
                                                            )}
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </DropdownMenuItem>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="px-4 py-8 text-center">
                            <Bell
                                className="h-8 w-8 text-black/20 mx-auto mb-2"
                                strokeWidth={2}
                            />
                            <div className="text-[13px] text-black/40">
                                Aucune notification
                            </div>
                            <div className="text-[12px] text-black/30 mt-1">
                                Toutes les réparations sont à jour
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {notifications && notifications.length > 0 && (
                    <>
                        <DropdownMenuSeparator className="my-0" />
                        <div className="p-2">
                            <Button
                                variant="ghost"
                                className="w-full h-9 text-[13px] font-medium hover:bg-black/5"
                                onClick={handleViewAll}
                            >
                                Voir toutes les réparations
                            </Button>
                        </div>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
