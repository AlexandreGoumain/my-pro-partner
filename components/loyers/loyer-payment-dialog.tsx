import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LoyerWithRelations } from "@/hooks/gestion-locative/use-loyers";

export interface LoyerPaymentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    loyer: LoyerWithRelations | null;
    montant: string;
    onMontantChange: (montant: string) => void;
    onSubmit: () => void;
    isPending: boolean;
}

export function LoyerPaymentDialog({
    open,
    onOpenChange,
    loyer,
    montant,
    onMontantChange,
    onSubmit,
    isPending,
}: LoyerPaymentDialogProps) {
    const resteAPayer = loyer
        ? Number(loyer.totalDu) - Number(loyer.montantPaye)
        : 0;

    const moisLabel = loyer
        ? new Date(loyer.annee, loyer.mois - 1, 1).toLocaleDateString("fr-FR", {
            month: "long",
            year: "numeric",
        })
        : "";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Enregistrer un paiement</DialogTitle>
                    <DialogDescription>
                        {loyer && (
                            <>
                                Loyer de {moisLabel}
                                <br />
                                Reste à payer: {resteAPayer.toLocaleString("fr-FR")} €
                            </>
                        )}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="montant">Montant du paiement (€)</Label>
                        <Input
                            id="montant"
                            type="number"
                            step="0.01"
                            value={montant}
                            onChange={(e) => onMontantChange(e.target.value)}
                            placeholder="0.00"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={onSubmit}
                        disabled={!montant || isPending}
                        className="bg-black hover:bg-black/90"
                    >
                        {isPending ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
