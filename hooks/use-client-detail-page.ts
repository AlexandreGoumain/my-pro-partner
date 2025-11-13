import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { differenceInDays } from "date-fns";
import { useClient, useDeleteClient } from "@/hooks/use-clients";
import type { Client } from "@/hooks/use-clients";
import type { Document } from "@/hooks/use-documents";
import {
    ClientHealth,
    StatusConfig,
    STATUS_CONFIG,
} from "@/lib/types/client";

export interface ClientDetailPageHandlers {
    client: Client | null;
    isLoading: boolean;
    clientHealth: ClientHealth | null;
    nomComplet: string;
    initiales: string;
    currentStatus: StatusConfig | null;
    totalCA: number;
    lastDocument: Document | null;

    editDialogOpen: boolean;
    setEditDialogOpen: (open: boolean) => void;
    deleteDialogOpen: boolean;
    setDeleteDialogOpen: (open: boolean) => void;
    emailDialogOpen: boolean;
    setEmailDialogOpen: (open: boolean) => void;

    handleEdit: () => void;
    handleEditSuccess: () => void;
    handleDelete: () => void;
    confirmDelete: () => void;
    handleSendEmail: () => void;
    handleCall: () => void;
    handleBack: () => void;

    isDeleting: boolean;
}

export function useClientDetailPage(
    clientId: string,
    documents: Document[] = []
): ClientDetailPageHandlers {
    const router = useRouter();
    const { data: client = null, isLoading } = useClient(clientId);
    const deleteClient = useDeleteClient();

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [emailDialogOpen, setEmailDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Calcul du statut et score santé
    const clientHealth = useMemo(() => {
        if (!client) return null;

        const now = new Date();
        const daysSinceUpdate = differenceInDays(
            now,
            new Date(client.updatedAt)
        );

        // Score de complétude (0-100)
        let completionScore = 0;
        if (client.email) completionScore += 25;
        if (client.telephone) completionScore += 25;
        if (client.adresse) completionScore += 25;
        if (client.ville && client.codePostal) completionScore += 25;

        // Statut basé sur l'activité
        let status: ClientHealth["status"];
        if (daysSinceUpdate <= 30) {
            status = "active";
        } else if (daysSinceUpdate <= 90) {
            status = "warning";
        } else {
            status = "inactive";
        }

        return {
            status,
            daysSinceUpdate,
            completionScore,
        };
    }, [client]);

    const nomComplet = useMemo(() => {
        if (!client) return "";
        return client.prenom
            ? `${client.nom} ${client.prenom}`
            : client.nom;
    }, [client]);

    const initiales = useMemo(() => {
        if (!client) return "";
        return client.prenom
            ? `${client.nom.charAt(0)}${client.prenom.charAt(0)}`
            : client.nom.substring(0, 2);
    }, [client]);

    const currentStatus = useMemo(() => {
        return clientHealth ? STATUS_CONFIG[clientHealth.status] : null;
    }, [clientHealth]);

    // Calculate total revenue
    const totalCA = useMemo(() => {
        return documents.reduce(
            (sum, doc) => sum + Number(doc.total_ttc || 0),
            0
        );
    }, [documents]);

    // Get last invoice
    const lastDocument = useMemo(() => {
        const invoices = documents.filter((doc) => doc.type === "FACTURE");
        if (invoices.length === 0) return null;

        return invoices.sort(
            (a, b) =>
                new Date(b.dateEmission).getTime() -
                new Date(a.dateEmission).getTime()
        )[0];
    }, [documents]);

    const handleBack = useCallback(() => {
        router.push("/dashboard/clients");
    }, [router]);

    const handleEdit = useCallback(() => {
        setEditDialogOpen(true);
    }, []);

    const handleEditSuccess = useCallback(() => {
        toast.success("Client modifié", {
            description: "Le client a été modifié avec succès",
        });
    }, []);

    const handleDelete = useCallback(() => {
        setDeleteDialogOpen(true);
    }, []);

    const confirmDelete = useCallback(() => {
        if (!client) return;

        deleteClient.mutate(client.id, {
            onSuccess: () => {
                toast.success("Client supprimé", {
                    description: "Le client a été supprimé avec succès",
                });
                router.push("/dashboard/clients");
            },
            onError: (error) => {
                toast.error("Erreur", {
                    description:
                        error instanceof Error
                            ? error.message
                            : "Impossible de supprimer le client",
                });
            },
        });
    }, [client, deleteClient, router]);

    const handleSendEmail = useCallback(() => {
        setEmailDialogOpen(true);
    }, []);

    const handleCall = useCallback(() => {
        if (client?.telephone) {
            window.location.href = `tel:${client.telephone}`;
        }
    }, [client]);

    return {
        client,
        isLoading,
        clientHealth,
        nomComplet,
        initiales,
        currentStatus,
        totalCA,
        lastDocument,
        editDialogOpen,
        setEditDialogOpen,
        deleteDialogOpen,
        setDeleteDialogOpen,
        emailDialogOpen,
        setEmailDialogOpen,
        handleEdit,
        handleEditSuccess,
        handleDelete,
        confirmDelete,
        handleSendEmail,
        handleCall,
        handleBack,
        isDeleting: deleteClient.isPending,
    };
}
