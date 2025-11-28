import {
    Campaign,
    useCreateCampaign,
    useScheduleCampaign,
    useUpdateCampaign,
} from "@/hooks/use-campaigns";
import { useSegments } from "@/hooks/use-segments";
import { format } from "date-fns";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

interface Segment {
    id: string;
    nom: string;
    nombreClients?: number;
}

interface CampaignFormState {
    nom: string;
    description: string;
    type: "EMAIL" | "SMS" | "NOTIFICATION";
    segmentId: string;
    subject: string;
    body: string;
    scheduledDate: Date | undefined;
    scheduledTime: string;
}

const getDefaultFormState = (campaign?: Campaign | null): CampaignFormState => {
    if (campaign) {
        return {
            nom: campaign.nom,
            description: campaign.description || "",
            type: campaign.type,
            segmentId: campaign.segmentId || "",
            subject: campaign.subject || "",
            body: campaign.body || "",
            scheduledDate: campaign.scheduledAt
                ? new Date(campaign.scheduledAt)
                : undefined,
            scheduledTime: campaign.scheduledAt
                ? format(new Date(campaign.scheduledAt), "HH:mm")
                : "09:00",
        };
    }

    return {
        nom: "",
        description: "",
        type: "EMAIL",
        segmentId: "",
        subject: "",
        body: "",
        scheduledDate: undefined,
        scheduledTime: "09:00",
    };
};

interface UseCampaignSchedulerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    campaign?: Campaign | null;
}

export function useCampaignSchedulerDialog({
    open: _open,
    onOpenChange,
    campaign,
}: UseCampaignSchedulerDialogProps) {
    const [form, setForm] = useState<CampaignFormState>(() =>
        getDefaultFormState(campaign)
    );
    const [formKey, setFormKey] = useState(0);

    const { data: segmentsData } = useSegments({ actif: true });
    const segments = useMemo(
        () => (segmentsData?.data || []) as Segment[],
        [segmentsData?.data]
    );

    const createCampaign = useCreateCampaign();
    const updateCampaign = useUpdateCampaign();
    const scheduleCampaign = useScheduleCampaign();

    // Handle dialog open/close - reset form when opening
    const handleOpenChange = useCallback(
        (newOpen: boolean) => {
            if (newOpen) {
                setForm(getDefaultFormState(campaign));
                setFormKey((k) => k + 1);
            }
            onOpenChange(newOpen);
        },
        [onOpenChange, campaign]
    );

    // Update single field
    const updateField = useCallback(
        <K extends keyof CampaignFormState>(
            field: K,
            value: CampaignFormState[K]
        ) => {
            setForm((prev) => ({ ...prev, [field]: value }));
        },
        []
    );

    // Derived state
    const selectedSegment = useMemo(
        () => segments.find((s) => s.id === form.segmentId),
        [segments, form.segmentId]
    );

    const isPending =
        createCampaign.isPending ||
        updateCampaign.isPending ||
        scheduleCampaign.isPending;

    // Save as draft
    const handleSaveDraft = useCallback(async () => {
        if (!form.nom) {
            toast.error("Veuillez saisir un nom");
            return;
        }

        try {
            const data = {
                nom: form.nom,
                description: form.description,
                type: form.type,
                segmentId: form.segmentId || undefined,
                subject: form.type === "EMAIL" ? form.subject : undefined,
                body: form.body,
            };

            if (campaign) {
                await updateCampaign.mutateAsync({ id: campaign.id, data });
                toast.success("Campagne mise à jour");
            } else {
                await createCampaign.mutateAsync(data);
                toast.success("Campagne sauvegardée en brouillon");
            }

            onOpenChange(false);
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Erreur lors de la sauvegarde";
            toast.error(errorMessage);
        }
    }, [form, campaign, updateCampaign, createCampaign, onOpenChange]);

    // Schedule campaign
    const handleSchedule = useCallback(async () => {
        if (!form.nom || !form.subject || !form.body) {
            toast.error("Veuillez remplir tous les champs requis");
            return;
        }

        if (!form.scheduledDate) {
            toast.error("Veuillez sélectionner une date");
            return;
        }

        try {
            const [hours, minutes] = form.scheduledTime.split(":");
            const scheduledAt = new Date(form.scheduledDate);
            scheduledAt.setHours(parseInt(hours), parseInt(minutes), 0, 0);

            const data = {
                nom: form.nom,
                description: form.description,
                type: form.type,
                segmentId: form.segmentId || undefined,
                subject: form.type === "EMAIL" ? form.subject : undefined,
                body: form.body,
                scheduledAt: new Date(scheduledAt.toISOString()),
            };

            if (campaign) {
                await updateCampaign.mutateAsync({ id: campaign.id, data });
                await scheduleCampaign.mutateAsync({
                    id: campaign.id,
                    scheduledAt: new Date(scheduledAt.toISOString()),
                });
                toast.success("Campagne planifiée");
            } else {
                await createCampaign.mutateAsync(data);
                toast.success("Campagne créée et planifiée");
            }

            onOpenChange(false);
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Erreur lors de la planification";
            toast.error(errorMessage);
        }
    }, [
        form,
        campaign,
        updateCampaign,
        scheduleCampaign,
        createCampaign,
        onOpenChange,
    ]);

    return {
        // Form state
        form,
        formKey,
        updateField,

        // Data
        segments,
        selectedSegment,

        // Status
        isPending,
        isEditing: !!campaign,

        // Actions
        handleOpenChange,
        handleSaveDraft,
        handleSchedule,
    };
}
