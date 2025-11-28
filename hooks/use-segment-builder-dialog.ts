import { useClients } from "@/hooks/use-clients";
import { useCreateSegment, useUpdateSegment } from "@/hooks/use-segments";
import {
    CreateSegmentForm,
    Segment,
    SegmentCriterion,
} from "@/lib/types";
import { applySegmentCriteria } from "@/lib/utils/segment-filters";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

interface SegmentFormState {
    nom: string;
    description: string;
    conditions: SegmentCriterion[];
    logic: "AND" | "OR";
}

const getDefaultFormState = (segment?: Segment | null): SegmentFormState => {
    if (segment) {
        const criteriaData = segment.criteres as {
            conditions?: SegmentCriterion[];
            logic?: "AND" | "OR";
        } | null;

        return {
            nom: segment.nom,
            description: segment.description || "",
            conditions: criteriaData?.conditions || [
                { field: "email", operator: "exists" },
            ],
            logic: criteriaData?.logic || "AND",
        };
    }

    return {
        nom: "",
        description: "",
        conditions: [{ field: "email", operator: "exists" }],
        logic: "AND",
    };
};

interface UseSegmentBuilderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
    segment?: Segment | null;
}

export function useSegmentBuilderDialog({
    open: _open,
    onOpenChange,
    onSuccess,
    segment,
}: UseSegmentBuilderDialogProps) {
    const [form, setForm] = useState<SegmentFormState>(() =>
        getDefaultFormState(segment)
    );
    const [formKey, setFormKey] = useState(0);

    const createMutation = useCreateSegment();
    const updateMutation = useUpdateSegment();
    const { data: clients = [] } = useClients();

    const isEditMode = !!segment;

    // Handle dialog open/close - reset form when opening or closing
    const handleOpenChange = useCallback(
        (newOpen: boolean) => {
            if (newOpen) {
                setForm(getDefaultFormState(segment));
                setFormKey((k) => k + 1);
            } else {
                // Reset on close too
                setForm(getDefaultFormState(null));
                setFormKey((k) => k + 1);
            }
            onOpenChange(newOpen);
        },
        [onOpenChange, segment]
    );

    // Update single field
    const updateField = useCallback(
        <K extends keyof SegmentFormState>(
            field: K,
            value: SegmentFormState[K]
        ) => {
            setForm((prev) => ({ ...prev, [field]: value }));
        },
        []
    );

    // Conditions management
    const addCondition = useCallback(() => {
        setForm((prev) => ({
            ...prev,
            conditions: [
                ...prev.conditions,
                { field: "email", operator: "exists" },
            ],
        }));
    }, []);

    const removeCondition = useCallback((index: number) => {
        setForm((prev) => ({
            ...prev,
            conditions: prev.conditions.filter((_, i) => i !== index),
        }));
    }, []);

    const updateCondition = useCallback(
        (index: number, updates: Partial<SegmentCriterion>) => {
            setForm((prev) => ({
                ...prev,
                conditions: prev.conditions.map((cond, i) =>
                    i === index ? { ...cond, ...updates } : cond
                ),
            }));
        },
        []
    );

    // Preview matching clients using useMemo
    const matchingClients = useMemo(() => {
        try {
            return applySegmentCriteria(clients, {
                conditions: form.conditions,
                logic: form.logic,
            });
        } catch {
            return [];
        }
    }, [clients, form.conditions, form.logic]);

    const isPending = createMutation.isPending || updateMutation.isPending;

    // Submit
    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();

            if (!form.nom.trim()) {
                toast.error("Le nom du segment est requis");
                return;
            }

            if (form.conditions.length === 0) {
                toast.error("Ajoutez au moins un critère");
                return;
            }

            const data: CreateSegmentForm = {
                nom: form.nom,
                description: form.description || undefined,
                icone: segment?.icone || "Filter",
                couleur: segment?.couleur || "#f3f4f6",
                criteres: {
                    conditions: form.conditions,
                    logic: form.logic,
                },
            };

            try {
                if (isEditMode && segment) {
                    await updateMutation.mutateAsync({
                        id: segment.id,
                        data,
                    });
                    toast.success("Segment modifié avec succès");
                } else {
                    await createMutation.mutateAsync(data);
                    toast.success("Segment créé avec succès");
                }
                onSuccess?.();
                handleOpenChange(false);
            } catch (error: unknown) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : `Erreur lors de ${isEditMode ? "la modification" : "la création"} du segment`;
                toast.error(errorMessage);
            }
        },
        [
            form,
            segment,
            isEditMode,
            updateMutation,
            createMutation,
            onSuccess,
            handleOpenChange,
        ]
    );

    // Close handler
    const handleClose = useCallback(() => {
        handleOpenChange(false);
    }, [handleOpenChange]);

    return {
        // Form state
        form,
        formKey,
        updateField,

        // Conditions
        addCondition,
        removeCondition,
        updateCondition,

        // Data
        clients,
        matchingClients,

        // Status
        isPending,
        isEditMode,

        // Actions
        handleOpenChange,
        handleSubmit,
        handleClose,
    };
}
