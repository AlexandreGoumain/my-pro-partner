import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { differenceInDays } from "date-fns";
import { useClient, useDeleteClient } from "@/hooks/use-clients";
import type { Client } from "@/hooks/use-clients";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

export interface ClientHealth {
    status: "active" | "inactive" | "warning";
    daysSinceUpdate: number;
    completionScore: number;
}

export interface StatusConfig {
    label: string;
    className: string;
    icon: typeof CheckCircle2;
}

const STATUS_CONFIG: Record<ClientHealth["status"], StatusConfig> = {
    active: {
        label: "Actif",
        className: "bg-green-100 text-green-700 border-green-200",
        icon: CheckCircle2,
    },
    warning: {
        label: "Peu actif",
        className: "bg-orange-100 text-orange-700 border-orange-200",
        icon: Clock,
    },
    inactive: {
        label: "Inactif",
        className: "bg-red-100 text-red-700 border-red-200",
        icon: AlertCircle,
    },
};

export interface ClientDetailPageHandlers {
    client: Client | null;
    isLoading: boolean;
    clientHealth: ClientHealth | null;
    nomComplet: string;
    initiales: string;
    currentStatus: StatusConfig | null;

    editDialogOpen: boolean;
    setEditDialogOpen: (open: boolean) => void;
    deleteDialogOpen: boolean;
    setDeleteDialogOpen: (open: boolean) => void;

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
    clientId: string
): ClientDetailPageHandlers {
    const router = useRouter();
    const { data: client = null, isLoading } = useClient(clientId);
    const deleteClient = useDeleteClient();

    const [editDialogOpen, setEditDialogOpen] = useState(false);
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
        if (client?.email) {
            window.location.href = `mailto:${client.email}`;
        }
    }, [client?.email]);

    const handleCall = useCallback(() => {
        if (client?.telephone) {
            window.location.href = `tel:${client.telephone}`;
        }
    }, [client?.telephone]);

    return {
        client,
        isLoading,
        clientHealth,
        nomComplet,
        initiales,
        currentStatus,
        editDialogOpen,
        setEditDialogOpen,
        deleteDialogOpen,
        setDeleteDialogOpen,
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
