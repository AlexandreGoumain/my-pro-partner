import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import {
    Campaign,
    useCampaigns,
    useCancelCampaign,
    useSendCampaign,
} from "@/hooks/use-campaigns";

export interface CampaignsPageHandlers {
    campaigns: Campaign[];
    filteredCampaigns: Campaign[];
    isLoading: boolean;

    schedulerOpen: boolean;
    setSchedulerOpen: (open: boolean) => void;
    editingCampaign: Campaign | null;
    statusFilter: string | null;
    setStatusFilter: (status: string | null) => void;

    stats: {
        total: number;
        draft: number;
        scheduled: number;
        sent: number;
    };

    handleCreate: () => void;
    handleEdit: (campaign: Campaign) => void;
    handleCancel: (id: string, nom: string) => Promise<void>;
    handleSend: (id: string, nom: string) => Promise<void>;
}

export function useCampaignsPage(): CampaignsPageHandlers {
    const [schedulerOpen, setSchedulerOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    const { data, isLoading } = useCampaigns();
    const cancelCampaign = useCancelCampaign();
    const sendCampaign = useSendCampaign();

    const campaigns = data?.data || [];

    const filteredCampaigns = useMemo(
        () =>
            statusFilter
                ? campaigns.filter((c) => c.statut === statusFilter)
                : campaigns,
        [statusFilter, campaigns]
    );

    const stats = useMemo(
        () => ({
            total: campaigns.length,
            draft: campaigns.filter((c) => c.statut === "DRAFT").length,
            scheduled: campaigns.filter((c) => c.statut === "SCHEDULED").length,
            sent: campaigns.filter((c) => c.statut === "SENT").length,
        }),
        [campaigns]
    );

    const handleCreate = useCallback(() => {
        setEditingCampaign(null);
        setSchedulerOpen(true);
    }, []);

    const handleEdit = useCallback((campaign: Campaign) => {
        setEditingCampaign(campaign);
        setSchedulerOpen(true);
    }, []);

    const handleCancel = useCallback(
        async (id: string, nom: string) => {
            if (!confirm(`Annuler la campagne "${nom}" ?`)) return;

            try {
                await cancelCampaign.mutateAsync(id);
                toast.success("Campagne annulée");
            } catch (error: any) {
                toast.error(error.message || "Erreur lors de l'annulation");
            }
        },
        [cancelCampaign]
    );

    const handleSend = useCallback(
        async (id: string, nom: string) => {
            if (!confirm(`Envoyer la campagne "${nom}" maintenant ?`)) return;

            try {
                await sendCampaign.mutateAsync(id);
                toast.success("Campagne envoyée");
            } catch (error: unknown) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Erreur lors de l'envoi";
                toast.error(errorMessage);
            }
        },
        [sendCampaign]
    );

    return {
        campaigns,
        filteredCampaigns,
        isLoading,
        schedulerOpen,
        setSchedulerOpen,
        editingCampaign,
        statusFilter,
        setStatusFilter,
        stats,
        handleCreate,
        handleEdit,
        handleCancel,
        handleSend,
    };
}
