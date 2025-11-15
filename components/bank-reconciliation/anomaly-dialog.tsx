import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { BankTransaction } from "@/lib/types/bank-reconciliation";
import { useState } from "react";
import { toast } from "sonner";

export interface AnomalyDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    transaction: BankTransaction | null;
    onSuccess: () => void;
}

export function AnomalyDialog({
    open,
    onOpenChange,
    transaction,
    onSuccess,
}: AnomalyDialogProps) {
    const [notes, setNotes] = useState("");
    const [isMarking, setIsMarking] = useState(false);

    const handleMarkAnomaly = async () => {
        if (!transaction || !notes.trim()) {
            toast.error("Veuillez décrire l'anomalie");
            return;
        }

        try {
            setIsMarking(true);

            const res = await fetch(`/api/bank/${transaction.id}/anomaly`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notes }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error);
            }

            toast.success("Transaction marquée comme anomalie");
            onOpenChange(false);
            setNotes("");
            onSuccess();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Erreur");
        } finally {
            setIsMarking(false);
        }
    };

    if (!transaction) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Marquer comme anomalie</DialogTitle>
                    <DialogDescription>
                        Décrivez l&apos;anomalie détectée
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-4">
                    <Card className="p-3 bg-black/2 border-black/8">
                        <div className="text-[13px] text-black/60 mb-1">
                            Transaction
                        </div>
                        <div className="text-[14px] font-medium text-black">
                            {transaction.libelle}
                        </div>
                        <div className="text-[16px] font-semibold text-black mt-1">
                            {Number(transaction.montant).toFixed(2)}€
                        </div>
                    </Card>

                    <div className="space-y-2">
                        <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Décrivez l'anomalie..."
                            className="min-h-[100px]"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            onClick={() => onOpenChange(false)}
                            variant="outline"
                            className="flex-1"
                            disabled={isMarking}
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleMarkAnomaly}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                            disabled={isMarking}
                        >
                            {isMarking ? "Enregistrement..." : "Marquer"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
