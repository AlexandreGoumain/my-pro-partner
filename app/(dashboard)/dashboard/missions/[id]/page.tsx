"use client";

import {
    MissionDetailHeader,
    MissionEditDialog,
    MissionInfoCard,
    MissionTimeEntries,
} from "@/components/missions";
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
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCapabilities } from "@/hooks/use-capabilities";
import {
    useDeleteMission,
    useMission,
    useUpdateMissionStatut,
} from "@/hooks/use-missions";
import type { StatutMission } from "@/lib/types/mission";
import { Briefcase, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function MissionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { hasCapability } = useCapabilities();

    const missionId = params.id as string;

    // Check capability
    const hasAccess = hasCapability("projets");

    // State
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Data
    const {
        data: mission,
        isLoading,
        error,
    } = useMission(missionId, {
        enabled: hasAccess && !!missionId,
    });

    const updateStatus = useUpdateMissionStatut();
    const deleteMission = useDeleteMission();

    // Handlers
    const handleStatusChange = async (newStatus: StatutMission) => {
        await updateStatus.mutateAsync({ id: missionId, statut: newStatus });
    };

    const handleDelete = async () => {
        await deleteMission.mutateAsync(missionId);
        router.push("/dashboard/missions");
    };

    const handleCreateInvoice = () => {
        // Redirect to invoice creation with mission context
        router.push(`/dashboard/documents/invoices/new?missionId=${missionId}`);
    };

    const handleInvoiceSelected = (entryIds: string[]) => {
        // Redirect to invoice creation with selected entries
        router.push(
            `/dashboard/documents/invoices/new?missionId=${missionId}&entryIds=${entryIds.join(",")}`
        );
    };

    // Access check
    if (!hasAccess) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="text-center">
                    <Briefcase className="h-12 w-12 text-black/20 mx-auto mb-4" />
                    <h2 className="text-[18px] font-semibold text-black/80 mb-2">
                        Accès non disponible
                    </h2>
                    <p className="text-[14px] text-black/40">
                        Cette fonctionnalité n&apos;est pas activée pour votre
                        type d&apos;entreprise.
                    </p>
                </div>
            </div>
        );
    }

    // Loading
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-black/20" />
            </div>
        );
    }

    // Error
    if (error || !mission) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="text-center">
                    <Briefcase className="h-12 w-12 text-black/20 mx-auto mb-4" />
                    <h2 className="text-[18px] font-semibold text-black/80 mb-2">
                        Mission introuvable
                    </h2>
                    <p className="text-[14px] text-black/40">
                        Cette mission n&apos;existe pas ou vous n&apos;y avez
                        pas accès.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <MissionDetailHeader
                mission={mission}
                onEdit={() => setEditDialogOpen(true)}
                onDelete={() => setDeleteDialogOpen(true)}
                onStatusChange={handleStatusChange}
                onCreateInvoice={handleCreateInvoice}
            />

            {/* Description */}
            {mission.description && (
                <Card className="p-4 border-black/8">
                    <h3 className="text-[13px] font-medium text-black/50 mb-2">
                        Description
                    </h3>
                    <p className="text-[14px] text-black/70 whitespace-pre-wrap">
                        {mission.description}
                    </p>
                </Card>
            )}

            {/* Tabs */}
            <Tabs defaultValue="temps" className="space-y-4">
                <TabsList className="bg-black/5">
                    <TabsTrigger value="temps" className="text-[13px]">
                        Temps passé
                    </TabsTrigger>
                    <TabsTrigger value="infos" className="text-[13px]">
                        Informations
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="text-[13px]">
                        Documents
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="temps">
                    <MissionTimeEntries
                        mission={mission}
                        onInvoiceSelected={handleInvoiceSelected}
                    />
                </TabsContent>

                <TabsContent value="infos">
                    <MissionInfoCard mission={mission} />
                </TabsContent>

                <TabsContent value="documents">
                    <Card className="p-6 border-black/8">
                        <div className="space-y-4">
                            {/* Linked quote */}
                            {(mission as any).devis ? (
                                <div className="flex items-center justify-between p-3 bg-black/2 rounded-lg">
                                    <div>
                                        <div className="text-[12px] text-black/40">
                                            Devis associé
                                        </div>
                                        <div className="text-[14px] font-medium text-black/80">
                                            {(mission as any).devis.numero}
                                        </div>
                                    </div>
                                    <div className="text-[14px] text-black/60">
                                        {(
                                            mission as any
                                        ).devis.total_ttc?.toLocaleString(
                                            "fr-FR",
                                            {
                                                style: "currency",
                                                currency: "EUR",
                                            }
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-[13px] text-black/40 italic">
                                    Aucun devis associé
                                </p>
                            )}

                            {/* Linked invoices */}
                            {(mission as any).factures?.length > 0 ? (
                                <div className="space-y-2">
                                    <h4 className="text-[13px] font-medium text-black/50">
                                        Factures
                                    </h4>
                                    {(mission as any).factures.map(
                                        (facture: any) => (
                                            <div
                                                key={facture.id}
                                                className="flex items-center justify-between p-3 bg-black/2 rounded-lg cursor-pointer hover:bg-black/5 transition-colors"
                                                onClick={() =>
                                                    router.push(
                                                        `/dashboard/documents/invoices/${facture.id}`
                                                    )
                                                }
                                            >
                                                <div>
                                                    <div className="text-[14px] font-medium text-black/80">
                                                        {facture.numero}
                                                    </div>
                                                    <div className="text-[12px] text-black/40">
                                                        {new Date(
                                                            facture.dateEmission
                                                        ).toLocaleDateString(
                                                            "fr-FR"
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-[14px] text-black/60">
                                                    {facture.total_ttc?.toLocaleString(
                                                        "fr-FR",
                                                        {
                                                            style: "currency",
                                                            currency: "EUR",
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <p className="text-[13px] text-black/40 italic">
                                    Aucune facture associée
                                </p>
                            )}
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Edit dialog */}
            <MissionEditDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                mission={mission}
            />

            {/* Delete confirmation */}
            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Supprimer la mission ?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. Toutes les entrées de
                            temps associées seront également supprimées.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {deleteMission.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Supprimer"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
