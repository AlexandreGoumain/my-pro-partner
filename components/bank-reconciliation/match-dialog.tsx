import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type {
    BankTransaction,
    InvoiceForMatching,
} from "@/lib/types/bank-reconciliation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface MatchDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    transaction: BankTransaction | null;
    onSuccess: () => void;
}

export function MatchDialog({
    open,
    onOpenChange,
    transaction,
    onSuccess,
}: MatchDialogProps) {
    const [invoices, setInvoices] = useState<InvoiceForMatching[]>([]);
    const [selectedInvoice, setSelectedInvoice] = useState("");
    const [isMatching, setIsMatching] = useState(false);

    useEffect(() => {
        if (open) {
            loadInvoices();
        }
    }, [open]);

    const loadInvoices = async () => {
        try {
            const res = await fetch(
                "/api/documents?type=FACTURE&statut=ENVOYE&limit=100"
            );
            const data = await res.json();
            setInvoices(data.documents || []);
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors du chargement des factures");
        }
    };

    const handleMatch = async () => {
        if (!transaction || !selectedInvoice) {
            toast.error("Veuillez sélectionner une facture");
            return;
        }

        try {
            setIsMatching(true);

            const res = await fetch("/api/bank/match", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    transactionId: transaction.id,
                    documentId: selectedInvoice,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error);
            }

            toast.success("Transaction rapprochée");
            onOpenChange(false);
            setSelectedInvoice("");
            onSuccess();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Erreur lors du rapprochement");
        } finally {
            setIsMatching(false);
        }
    };

    if (!transaction) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Rapprocher la transaction</DialogTitle>
                    <DialogDescription>
                        Sélectionnez la facture correspondante
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
                        <Select
                            value={selectedInvoice}
                            onValueChange={setSelectedInvoice}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une facture" />
                            </SelectTrigger>
                            <SelectContent>
                                {invoices.length === 0 ? (
                                    <div className="p-2 text-center text-[13px] text-black/40">
                                        Aucune facture en attente
                                    </div>
                                ) : (
                                    invoices.map((invoice) => (
                                        <SelectItem
                                            key={invoice.id}
                                            value={invoice.id}
                                        >
                                            {invoice.numero} -{" "}
                                            {invoice.client.nom} -{" "}
                                            {Number(invoice.total_ttc).toFixed(
                                                2
                                            )}
                                            €
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            onClick={() => onOpenChange(false)}
                            variant="outline"
                            className="flex-1"
                            disabled={isMatching}
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleMatch}
                            className="flex-1 bg-black hover:bg-black/90"
                            disabled={isMatching}
                        >
                            {isMatching ? "Rapprochement..." : "Rapprocher"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
