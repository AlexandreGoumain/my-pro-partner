"use client";

import { Button } from "@/components/ui/button";
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
import { useState } from "react";
import { toast } from "sonner";

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

type PaymentMethod = "ESPECES" | "CHEQUE" | "VIREMENT" | "CARTE" | "PRELEVEMENT";

const paymentMethods: { value: PaymentMethod; label: string }[] = [
    { value: "ESPECES", label: "Espèces" },
    { value: "CHEQUE", label: "Chèque" },
    { value: "VIREMENT", label: "Virement" },
    { value: "CARTE", label: "Carte bancaire" },
    { value: "PRELEVEMENT", label: "Prélèvement" },
];

export function AddPaymentDialog({
    isOpen,
    onClose,
    invoice,
    onSuccess,
}: AddPaymentDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        montant: invoice.reste_a_payer,
        moyen_paiement: "VIREMENT" as PaymentMethod,
        date_paiement: new Date().toISOString().split("T")[0],
        reference: "",
        notes: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.montant <= 0) {
            toast.error("Le montant doit être supérieur à 0");
            return;
        }

        if (formData.montant > invoice.reste_a_payer) {
            toast.error("Le montant ne peut pas dépasser le reste à payer");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`/api/documents/${invoice.id}/payments`, {
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
            console.error("Error adding payment:", error);
            toast.error(error.message || "Impossible d'enregistrer le paiement");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-[20px] font-semibold tracking-[-0.01em]">
                        Enregistrer un paiement
                    </DialogTitle>
                    <DialogDescription className="text-[14px] text-black/60">
                        Facture {invoice.numero} - Reste à payer:{" "}
                        {new Intl.NumberFormat("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                        }).format(invoice.reste_a_payer)}
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
                                setFormData((prev) => ({
                                    ...prev,
                                    montant: parseFloat(e.target.value) || 0,
                                }))
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
                                setFormData((prev) => ({ ...prev, moyen_paiement: value }))
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
                        <Input
                            id="date"
                            type="date"
                            value={formData.date_paiement}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, date_paiement: e.target.value }))
                            }
                            className="h-11 border-black/10"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reference" className="text-[14px] font-medium">
                            Référence
                        </Label>
                        <Input
                            id="reference"
                            value={formData.reference}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, reference: e.target.value }))
                            }
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
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, notes: e.target.value }))
                            }
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
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm"
                        >
                            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
