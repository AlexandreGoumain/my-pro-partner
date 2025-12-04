"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClientRdvDetail, useCancelRdv } from "@/hooks/use-client-rdv";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PageProps {
    params: Promise<{ id: string }>;
}

const STATUS_CONFIG = {
    EN_ATTENTE: {
        label: "En attente de confirmation",
        description: "Votre demande a été envoyée et est en attente de validation.",
        className: "bg-black/5 text-black/60",
    },
    CONFIRME: {
        label: "Confirmé",
        description: "Votre rendez-vous est confirmé.",
        className: "bg-black/10 text-black",
    },
    EN_COURS: {
        label: "En cours",
        description: "Votre rendez-vous est en cours.",
        className: "bg-black text-white",
    },
    TERMINE: {
        label: "Terminé",
        description: "Ce rendez-vous est terminé.",
        className: "bg-black/5 text-black/40",
    },
    ANNULE: {
        label: "Annulé",
        description: "Ce rendez-vous a été annulé.",
        className: "bg-black/5 text-black/30",
    },
    NO_SHOW: {
        label: "Absence",
        description: "Vous ne vous êtes pas présenté à ce rendez-vous.",
        className: "bg-black/5 text-black/30",
    },
};

export default function RdvDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();
    const { data: rdv, isLoading, error } = useClientRdvDetail(id);
    const cancelMutation = useCancelRdv();

    const handleCancel = async () => {
        try {
            await cancelMutation.mutateAsync(id);
            toast.success("Rendez-vous annulé avec succès");
            router.push("/client/rdv");
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Erreur lors de l'annulation"
            );
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-2xl">
                <div className="h-8 w-48 bg-black/5 animate-pulse rounded mb-8" />
                <div className="space-y-4">
                    <div className="h-32 bg-black/5 animate-pulse rounded-lg" />
                    <div className="h-48 bg-black/5 animate-pulse rounded-lg" />
                </div>
            </div>
        );
    }

    if (error || !rdv) {
        return (
            <div className="max-w-2xl">
                <Button
                    variant="ghost"
                    onClick={() => router.push("/client/rdv")}
                    className="mb-8"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour
                </Button>
                <div className="text-center py-12">
                    <p className="text-[14px] text-black/50">
                        Rendez-vous non trouvé
                    </p>
                </div>
            </div>
        );
    }

    const statusConfig = STATUS_CONFIG[rdv.statut];
    const rdvDate = new Date(rdv.date);
    const canCancel = !["ANNULE", "NO_SHOW", "TERMINE", "EN_COURS"].includes(rdv.statut);
    const isPast = rdvDate < new Date();

    return (
        <div className="max-w-2xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push("/client/rdv")}
                    className="h-9 w-9"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-[20px] font-semibold tracking-[-0.02em] text-black">
                        {rdv.prestation?.nom || "Rendez-vous"}
                    </h1>
                </div>
                <span
                    className={cn(
                        "text-[12px] font-medium px-3 py-1.5 rounded-md",
                        statusConfig.className
                    )}
                >
                    {statusConfig.label}
                </span>
            </div>

            {/* Status message */}
            <div className="bg-black/[0.02] rounded-lg p-4 mb-6">
                <p className="text-[14px] text-black/60">{statusConfig.description}</p>
            </div>

            {/* Details */}
            <div className="border border-black/8 rounded-lg p-5 mb-6">
                <h2 className="text-[14px] font-medium text-black mb-4">
                    Détails du rendez-vous
                </h2>

                <div className="space-y-4">
                    {/* Date */}
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-4 h-4 text-black/60" />
                        </div>
                        <div>
                            <div className="text-[13px] text-black/50">Date</div>
                            <div className="text-[14px] text-black capitalize">
                                {format(rdvDate, "EEEE d MMMM yyyy", { locale: fr })}
                            </div>
                        </div>
                    </div>

                    {/* Time */}
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0">
                            <Clock className="w-4 h-4 text-black/60" />
                        </div>
                        <div>
                            <div className="text-[13px] text-black/50">Horaire</div>
                            <div className="text-[14px] text-black">
                                {rdv.heure} ({rdv.duree} min)
                            </div>
                        </div>
                    </div>

                    {/* Employee */}
                    {rdv.employe && (
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-black/60" />
                            </div>
                            <div>
                                <div className="text-[13px] text-black/50">Avec</div>
                                <div className="text-[14px] text-black">
                                    {rdv.employe.prenom} {rdv.employe.nom}
                                </div>
                                {rdv.employe.bio && (
                                    <div className="text-[13px] text-black/40 mt-1">
                                        {rdv.employe.bio}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Prestation details */}
            {rdv.prestation && (
                <div className="border border-black/8 rounded-lg p-5 mb-6">
                    <h2 className="text-[14px] font-medium text-black mb-4">
                        Prestation
                    </h2>
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="text-[15px] font-medium text-black">
                                {rdv.prestation.nom}
                            </div>
                            {rdv.prestation.description && (
                                <div className="text-[13px] text-black/50 mt-1">
                                    {rdv.prestation.description}
                                </div>
                            )}
                            {rdv.prestation.categorie && (
                                <div className="text-[12px] text-black/40 mt-2">
                                    {rdv.prestation.categorie}
                                </div>
                            )}
                        </div>
                        <div className="text-[16px] font-semibold text-black">
                            {Number(rdv.prestation.prix).toFixed(2)}€
                        </div>
                    </div>
                </div>
            )}

            {/* Notes */}
            {rdv.notes && (
                <div className="border border-black/8 rounded-lg p-5 mb-6">
                    <h2 className="text-[14px] font-medium text-black mb-2">Notes</h2>
                    <p className="text-[14px] text-black/60">{rdv.notes}</p>
                </div>
            )}

            {/* Actions */}
            {canCancel && !isPast && (
                <div className="flex justify-end">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Annuler ce rendez-vous
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Annuler ce rendez-vous ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Cette action est irréversible. Vous pourrez prendre un
                                    nouveau rendez-vous par la suite.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Non, garder</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleCancel}
                                    className="bg-red-600 hover:bg-red-700"
                                    disabled={cancelMutation.isPending}
                                >
                                    {cancelMutation.isPending ? "Annulation..." : "Oui, annuler"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            )}
        </div>
    );
}
