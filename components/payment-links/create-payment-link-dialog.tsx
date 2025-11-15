import type { PaymentLinkFormData } from "@/lib/types/payment-link";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { DialogHeaderSection } from "@/components/ui/dialog-header-section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

export interface CreatePaymentLinkDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (formData: PaymentLinkFormData) => Promise<boolean>;
}

export function CreatePaymentLinkDialog({
    open,
    onOpenChange,
    onSubmit,
}: CreatePaymentLinkDialogProps) {
    const [titre, setTitre] = useState("");
    const [description, setDescription] = useState("");
    const [montant, setMontant] = useState("");
    const [quantiteMax, setQuantiteMax] = useState("");
    const [dateExpiration, setDateExpiration] = useState("");
    const [creating, setCreating] = useState(false);

    const resetForm = () => {
        setTitre("");
        setDescription("");
        setMontant("");
        setQuantiteMax("");
        setDateExpiration("");
    };

    const handleSubmit = async () => {
        if (!titre || !montant) {
            toast.error("Veuillez remplir tous les champs obligatoires");
            return;
        }

        try {
            setCreating(true);

            const formData: PaymentLinkFormData = {
                titre,
                description: description || undefined,
                montant: parseFloat(montant),
                quantiteMax: quantiteMax ? parseInt(quantiteMax) : undefined,
                dateExpiration: dateExpiration || undefined,
            };

            const success = await onSubmit(formData);

            if (success) {
                resetForm();
                onOpenChange(false);
            }
        } finally {
            setCreating(false);
        }
    };

    const handleCancel = () => {
        resetForm();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeaderSection
                    title="Créer un lien de paiement"
                    description="Créez un lien partageable pour recevoir des paiements"
                    titleClassName="text-[20px] font-semibold tracking-[-0.01em]"
                    descriptionClassName="text-[14px] text-black/60"
                />

                <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label>Titre *</Label>
                        <Input
                            value={titre}
                            onChange={(e) => setTitre(e.target.value)}
                            placeholder="Ex: Formation React"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description du produit ou service"
                            className="min-h-[100px]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Montant (€) *</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={montant}
                                onChange={(e) => setMontant(e.target.value)}
                                placeholder="49.99"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Quantité max (optionnel)</Label>
                            <Input
                                type="number"
                                value={quantiteMax}
                                onChange={(e) => setQuantiteMax(e.target.value)}
                                placeholder="Ex: 50"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Date d&apos;expiration (optionnel)</Label>
                        <Input
                            type="datetime-local"
                            value={dateExpiration}
                            onChange={(e) => setDateExpiration(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            onClick={handleCancel}
                            variant="outline"
                            className="flex-1"
                            disabled={creating}
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            className="flex-1 bg-black hover:bg-black/90"
                            disabled={creating}
                        >
                            {creating ? "Création..." : "Créer le lien"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
