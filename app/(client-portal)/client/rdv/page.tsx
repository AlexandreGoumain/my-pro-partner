"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useClientRdv, useCancelRdv } from "@/hooks/use-client-rdv";
import { RdvCard } from "@/components/client/rdv/rdv-card";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type StatusFilter = "all" | "upcoming" | "past" | "cancelled";

export default function ClientRdvPage() {
    const router = useRouter();
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("upcoming");
    const [cancelDialogId, setCancelDialogId] = useState<string | null>(null);

    // Fetch RDV based on filter
    const { data: rdvList, isLoading, error } = useClientRdv({
        upcoming: statusFilter === "upcoming",
        status: statusFilter === "cancelled" ? "ANNULE" : undefined,
    });

    const cancelMutation = useCancelRdv();

    const handleCancel = async () => {
        if (!cancelDialogId) return;

        try {
            await cancelMutation.mutateAsync(cancelDialogId);
            toast.success("Rendez-vous annulé avec succès");
            setCancelDialogId(null);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Erreur lors de l'annulation"
            );
        }
    };

    // Filter past RDV client-side if needed
    const filteredRdv = rdvList?.filter((rdv) => {
        if (statusFilter === "past") {
            const rdvDate = new Date(rdv.date);
            return rdvDate < new Date() && rdv.statut !== "ANNULE";
        }
        return true;
    });

    return (
        <div className="max-w-3xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-black">
                        Mes rendez-vous
                    </h1>
                    <p className="text-[14px] text-black/50 mt-1">
                        Gérez et réservez vos rendez-vous
                    </p>
                </div>
                <Button
                    onClick={() => router.push("/client/rdv/nouveau")}
                    className="bg-black hover:bg-black/90 text-white h-10 px-5 text-[14px] font-medium rounded-md shadow-sm"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Prendre RDV
                </Button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2 text-[13px] text-black/50">
                    <Filter className="w-4 h-4" />
                    <span>Filtrer :</span>
                </div>
                <Select
                    value={statusFilter}
                    onValueChange={(value) => setStatusFilter(value as StatusFilter)}
                >
                    <SelectTrigger className="w-[180px] h-9 text-[13px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="upcoming">À venir</SelectItem>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="past">Passés</SelectItem>
                        <SelectItem value="cancelled">Annulés</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-24 bg-black/5 animate-pulse rounded-lg"
                        />
                    ))}
                </div>
            ) : error ? (
                <div className="text-center py-12">
                    <p className="text-[14px] text-black/50">
                        Erreur lors du chargement des rendez-vous
                    </p>
                </div>
            ) : filteredRdv && filteredRdv.length > 0 ? (
                <div className="space-y-3">
                    {filteredRdv.map((rdv) => (
                        <RdvCard
                            key={rdv.id}
                            rdv={rdv}
                            onView={(id) => router.push(`/client/rdv/${id}`)}
                            onCancel={(id) => setCancelDialogId(id)}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={Calendar}
                    title={
                        statusFilter === "upcoming"
                            ? "Aucun rendez-vous à venir"
                            : statusFilter === "cancelled"
                            ? "Aucun rendez-vous annulé"
                            : "Aucun rendez-vous"
                    }
                    description={
                        statusFilter === "upcoming"
                            ? "Réservez votre prochain rendez-vous en quelques clics"
                            : "Vous n'avez pas encore de rendez-vous"
                    }
                    action={
                        statusFilter === "upcoming"
                            ? {
                                label: "Prendre RDV",
                                onClick: () => router.push("/client/rdv/nouveau"),
                                icon: Plus,
                            }
                            : undefined
                    }
                />
            )}

            {/* Cancel Confirmation Dialog */}
            <AlertDialog
                open={!!cancelDialogId}
                onOpenChange={(open) => !open && setCancelDialogId(null)}
            >
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
    );
}
