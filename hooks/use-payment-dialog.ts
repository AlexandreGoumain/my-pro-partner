import { useState } from "react";
import { toast } from "sonner";

interface UsePaymentDialogProps {
    invoiceId: string;
    resteAPayer: number;
    onSuccess: () => void;
}

interface PaymentFormData {
    montant: number;
    moyen_paiement: "ESPECES" | "CHEQUE" | "VIREMENT" | "CARTE" | "PRELEVEMENT";
    date_paiement: string;
    reference: string;
    notes: string;
}

interface UsePaymentDialogReturn {
    formData: PaymentFormData;
    isSubmitting: boolean;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    updateFormData: (field: keyof PaymentFormData, value: any) => void;
}

/**
 * Custom hook for managing payment dialog logic
 * Handles form state, validation, and API submission
 *
 * @param props Invoice ID, remaining amount, and success callback
 * @returns Form data, handlers, and submission state
 */
export function usePaymentDialog({
    invoiceId,
    resteAPayer,
    onSuccess,
}: UsePaymentDialogProps): UsePaymentDialogReturn {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<PaymentFormData>({
        montant: resteAPayer,
        moyen_paiement: "VIREMENT",
        date_paiement: new Date().toISOString().split("T")[0],
        reference: "",
        notes: "",
    });

    const updateFormData = (field: keyof PaymentFormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (formData.montant <= 0) {
            toast.error("Le montant doit être supérieur à 0");
            return;
        }

        if (formData.montant > resteAPayer) {
            toast.error("Le montant ne peut pas dépasser le reste à payer");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/documents/${invoiceId}/payments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Erreur lors de l'enregistrement du paiement");
            }

            toast.success("Paiement enregistré avec succès");
            onSuccess();
        } catch (error: unknown) {
            console.error("[Payment Dialog] Error adding payment:", error);
            const message = error instanceof Error ? error.message : "Impossible d'enregistrer le paiement";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        isSubmitting,
        handleSubmit,
        updateFormData,
    };
}
