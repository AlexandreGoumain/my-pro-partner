import { UseMutationResult } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

/**
 * Options pour useFormDialog
 */
export interface UseFormDialogOptions<
    TData,
    TFormValues,
    TCreateInput,
    TUpdateInput,
> {
    /** Données existantes (mode édition) */
    initialData?: TData | null;

    /** Dialog ouvert */
    open: boolean;

    /** Callback à appeler lors de la fermeture */
    onOpenChange: (open: boolean) => void;

    /** Valeurs par défaut du formulaire */
    defaultValues: TFormValues;

    /** Mutation pour créer */
    createMutation?: UseMutationResult<TData, Error, TCreateInput>;

    /** Mutation pour mettre à jour */
    updateMutation?: UseMutationResult<
        TData,
        Error,
        { id: string; data: TUpdateInput }
    >;

    /** Transformer les données en valeurs de formulaire */
    dataToFormValues?: (data: TData) => TFormValues;

    /** Transformer les valeurs de formulaire en données de création */
    formValuesToCreateInput?: (values: TFormValues) => TCreateInput;

    /** Transformer les valeurs de formulaire en données de mise à jour */
    formValuesToUpdateInput?: (values: TFormValues) => TUpdateInput;

    /** Extraire l'ID des données */
    getId?: (data: TData) => string;

    /** Validation avant soumission */
    validate?: (values: TFormValues) => string | null;

    /** Callback après succès */
    onSuccess?: () => void;

    /** Message de succès pour création */
    createSuccessMessage?: string;

    /** Message de succès pour mise à jour */
    updateSuccessMessage?: string;
}

/**
 * Retour de useFormDialog
 */
export interface UseFormDialogReturn<TFormValues> {
    /** Valeurs actuelles du formulaire */
    values: TFormValues;

    /** Définir toutes les valeurs */
    setValues: React.Dispatch<React.SetStateAction<TFormValues>>;

    /** Définir une valeur individuelle */
    setValue: <K extends keyof TFormValues>(
        key: K,
        value: TFormValues[K]
    ) => void;

    /** Réinitialiser le formulaire */
    reset: () => void;

    /** Soumettre le formulaire */
    handleSubmit: () => Promise<void>;

    /** En cours de soumission */
    isSubmitting: boolean;

    /** Mode édition (vs création) */
    isEditMode: boolean;

    /** Formulaire modifié par rapport aux valeurs initiales */
    isDirty: boolean;
}

/**
 * Hook générique pour gérer les dialogs de formulaire CRUD
 *
 * Combine la gestion de l'état du formulaire, la population depuis les données existantes,
 * la soumission via mutations, et la gestion des messages de succès/erreur.
 *
 * @example
 * ```tsx
 * function ArticleDialog({ open, onOpenChange, article }) {
 *   const {
 *     values,
 *     setValue,
 *     handleSubmit,
 *     isSubmitting,
 *     isEditMode,
 *   } = useFormDialog({
 *     open,
 *     onOpenChange,
 *     initialData: article,
 *     defaultValues: { nom: "", prix: 0 },
 *     createMutation: useCreateArticle(),
 *     updateMutation: useUpdateArticle(),
 *     dataToFormValues: (a) => ({ nom: a.nom, prix: a.prix }),
 *     getId: (a) => a.id,
 *   });
 *
 *   return (
 *     <Dialog open={open} onOpenChange={onOpenChange}>
 *       <Input
 *         value={values.nom}
 *         onChange={(e) => setValue("nom", e.target.value)}
 *       />
 *       <Button onClick={handleSubmit} disabled={isSubmitting}>
 *         {isEditMode ? "Modifier" : "Créer"}
 *       </Button>
 *     </Dialog>
 *   );
 * }
 * ```
 */
export function useFormDialog<
    TData,
    TFormValues extends Record<string, unknown>,
    TCreateInput = TFormValues,
    TUpdateInput = TFormValues,
>(
    options: UseFormDialogOptions<
        TData,
        TFormValues,
        TCreateInput,
        TUpdateInput
    >
): UseFormDialogReturn<TFormValues> {
    const {
        initialData,
        open,
        onOpenChange,
        defaultValues,
        createMutation,
        updateMutation,
        dataToFormValues,
        formValuesToCreateInput = (v) => v as unknown as TCreateInput,
        formValuesToUpdateInput = (v) => v as unknown as TUpdateInput,
        getId = (data: TData) => (data as { id: string }).id,
        validate,
        onSuccess,
        createSuccessMessage = "Créé avec succès",
        updateSuccessMessage = "Mis à jour avec succès",
    } = options;

    const [values, setValues] = useState<TFormValues>(defaultValues);
    const [initialValues, setInitialValues] =
        useState<TFormValues>(defaultValues);

    // Déterminer le mode
    const isEditMode = useMemo(() => !!initialData, [initialData]);

    // Populer le formulaire avec les données existantes
    useEffect(() => {
        // Utiliser setTimeout pour éviter les problèmes de synchronisation avec Dialog
        setTimeout(() => {
            if (initialData && dataToFormValues) {
                const formValues = dataToFormValues(initialData);
                setValues(formValues);
                setInitialValues(formValues);
            } else {
                setValues(defaultValues);
                setInitialValues(defaultValues);
            }
        }, 0);
    }, [initialData, open, dataToFormValues, defaultValues]);

    // Définir une valeur individuelle
    const setValue = useCallback(
        <K extends keyof TFormValues>(key: K, value: TFormValues[K]) => {
            setValues((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    // Réinitialiser le formulaire
    const reset = useCallback(() => {
        setValues(defaultValues);
        setInitialValues(defaultValues);
    }, [defaultValues]);

    // Vérifier si le formulaire est modifié
    const isDirty = useMemo(() => {
        return JSON.stringify(values) !== JSON.stringify(initialValues);
    }, [values, initialValues]);

    // En cours de soumission
    const isSubmitting = useMemo(() => {
        return (
            (createMutation?.isPending || updateMutation?.isPending) ?? false
        );
    }, [createMutation?.isPending, updateMutation?.isPending]);

    // Soumettre le formulaire
    const handleSubmit = useCallback(async () => {
        // Validation
        if (validate) {
            const error = validate(values);
            if (error) {
                toast.error(error);
                return;
            }
        }

        try {
            if (isEditMode && initialData && updateMutation) {
                const id = getId(initialData);
                const updateInput = formValuesToUpdateInput(values);
                await updateMutation.mutateAsync({ id, data: updateInput });
                toast.success(updateSuccessMessage);
            } else if (createMutation) {
                const createInput = formValuesToCreateInput(values);
                await createMutation.mutateAsync(createInput);
                toast.success(createSuccessMessage);
            }

            onSuccess?.();
            onOpenChange(false);
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Une erreur est survenue";
            toast.error(errorMessage);
        }
    }, [
        values,
        validate,
        isEditMode,
        initialData,
        updateMutation,
        createMutation,
        getId,
        formValuesToCreateInput,
        formValuesToUpdateInput,
        createSuccessMessage,
        updateSuccessMessage,
        onSuccess,
        onOpenChange,
    ]);

    return {
        values,
        setValues,
        setValue,
        reset,
        handleSubmit,
        isSubmitting,
        isEditMode,
        isDirty,
    };
}

/**
 * Version simplifiée pour les cas où TCreateInput et TUpdateInput sont identiques à TFormValues
 */
export function useSimpleFormDialog<
    TData,
    TFormValues extends Record<string, unknown>,
>(
    options: Omit<
        UseFormDialogOptions<TData, TFormValues, TFormValues, TFormValues>,
        "formValuesToCreateInput" | "formValuesToUpdateInput"
    >
): UseFormDialogReturn<TFormValues> {
    return useFormDialog({
        ...options,
        formValuesToCreateInput: (v) => v,
        formValuesToUpdateInput: (v) => v,
    });
}
