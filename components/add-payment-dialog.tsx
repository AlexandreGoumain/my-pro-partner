"use client";

import { Button } from "@/components/ui/button";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { PAYMENT_METHOD_LABELS, type PaymentMethod } from "@/lib/types/payment.types";
import { formatCurrency } from "@/lib/utils/payment-utils";
import { usePaymentDialog } from "@/hooks/use-payment-dialog";

interface AddPaymentDialogProps {
    isOpen: boolean;
    onClose: () => void;
    invoice: {
        id: string;
        numero: string;
        reste_a_payer: number;
    };
    onSuccess: () => void;
}

const paymentMethods: { value: PaymentMethod; label: string }[] = Object.entries(
    PAYMENT_METHOD_LABELS
).map(([value, label]) => ({
    value: value as PaymentMethod,
    label,
}));

export function AddPaymentDialog({
    isOpen,
    onClose,
    invoice,
    onSuccess,
}: AddPaymentDialogProps) {
    const { formData, isSubmitting, handleSubmit, updateFormData } = usePaymentDialog({
        invoiceId: invoice.id,
        resteAPayer: invoice.reste_a_payer,
        onSuccess: () => {
            onSuccess();
            onClose();
        },
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-[20px] font-semibold tracking-[-0.01em]">
                        Enregistrer un paiement
                    </DialogTitle>
                    <DialogDescription className="text-[14px] text-black/60">
                        Facture {invoice.numero} - Reste à payer:{" "}
                        {formatCurrency(invoice.reste_a_payer)}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="montant" className="text-[14px] font-medium">
                            Montant *
                        </Label>
                        <Input
                            id="montant"
                            type="number"
                            step="0.01"
                            value={formData.montant}
                            onChange={(e) =>
                                updateFormData("montant", parseFloat(e.target.value) || 0)
                            }
                            className="h-11 border-black/10"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="moyen" className="text-[14px] font-medium">
                            Moyen de paiement *
                        </Label>
                        <Select
                            value={formData.moyen_paiement}
                            onValueChange={(value: PaymentMethod) =>
                                updateFormData("moyen_paiement", value)
                            }
                        >
                            <SelectTrigger id="moyen" className="h-11 border-black/10">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {paymentMethods.map((method) => (
                                    <SelectItem key={method.value} value={method.value}>
                                        {method.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date" className="text-[14px] font-medium">
                            Date du paiement *
                        </Label>
                        <DatePicker
                            date={formData.date_paiement ? new Date(formData.date_paiement) : undefined}
                            onSelect={(date) =>
                                updateFormData(
                                    "date_paiement",
                                    date ? date.toISOString().split("T")[0] : new Date().toISOString().split("T")[0]
                                )
                            }
                            placeholder="Sélectionner la date du paiement"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reference" className="text-[14px] font-medium">
                            Référence
                        </Label>
                        <Input
                            id="reference"
                            value={formData.reference}
                            onChange={(e) => updateFormData("reference", e.target.value)}
                            placeholder="Ex: Numéro de chèque, référence virement..."
                            className="h-11 border-black/10"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes" className="text-[14px] font-medium">
                            Notes
                        </Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => updateFormData("notes", e.target.value)}
                            placeholder="Notes additionnelles..."
                            className="min-h-[80px] border-black/10"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            onClick={onClose}
                            variant="outline"
                            className="h-11 px-6 text-[14px] font-medium border-black/10 hover:bg-black/5"
                        >
                            Annuler
                        </Button>
                        <PrimaryActionButton type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                        </PrimaryActionButton>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
