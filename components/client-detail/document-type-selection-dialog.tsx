"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { FileText, FileX, Receipt } from "lucide-react";
import { useRouter } from "next/navigation";

export interface DocumentTypeSelectionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    clientId: string;
    clientName: string;
}

export function DocumentTypeSelectionDialog({
    open,
    onOpenChange,
    clientId,
    clientName,
}: DocumentTypeSelectionDialogProps) {
    const router = useRouter();

    const handleSelectType = (type: "devis" | "facture" | "avoir") => {
        onOpenChange(false);
        router.push(`/dashboard/documents/${type}s/new?clientId=${clientId}`);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="text-[20px] font-semibold tracking-[-0.02em] text-black">
                        Créer un document
                    </DialogTitle>
                    <DialogDescription className="text-[14px] text-black/60">
                        Sélectionnez le type de document à créer pour{" "}
                        <span className="font-medium text-black">
                            {clientName}
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 pt-4">
                    {/* Bouton Devis */}
                    <button
                        onClick={() => handleSelectType("devis")}
                        className="group relative w-full overflow-hidden bg-white border border-black/[0.08] rounded-lg p-4 hover:shadow-sm transition-all duration-300 text-left"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="relative flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-black/[0.03] group-hover:bg-black/[0.05] transition-colors duration-300">
                                <FileText
                                    className="h-5 w-5 text-black/60"
                                    strokeWidth={2}
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                                    <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-black">
                                        Devis
                                    </h3>
                                </div>
                                <p className="text-[13px] text-black/60">
                                    Créer un devis pour proposer vos produits ou
                                    services
                                </p>
                            </div>
                        </div>
                    </button>

                    {/* Bouton Facture */}
                    <button
                        onClick={() => handleSelectType("facture")}
                        className="group relative w-full overflow-hidden bg-white border border-black/[0.08] rounded-lg p-4 hover:shadow-sm transition-all duration-300 text-left"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="relative flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-black/[0.03] group-hover:bg-black/[0.05] transition-colors duration-300">
                                <Receipt
                                    className="h-5 w-5 text-black/60"
                                    strokeWidth={2}
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                                    <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-black">
                                        Facture
                                    </h3>
                                </div>
                                <p className="text-[13px] text-black/60">
                                    Créer une facture pour facturer vos
                                    prestations
                                </p>
                            </div>
                        </div>
                    </button>

                    {/* Bouton Avoir */}
                    <button
                        onClick={() => handleSelectType("avoir")}
                        className="group relative w-full overflow-hidden bg-white border border-black/[0.08] rounded-lg p-4 hover:shadow-sm transition-all duration-300 text-left"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="relative flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-black/[0.03] group-hover:bg-black/[0.05] transition-colors duration-300">
                                <FileX
                                    className="h-5 w-5 text-black/60"
                                    strokeWidth={2}
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                                    <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-black">
                                        Avoir
                                    </h3>
                                </div>
                                <p className="text-[13px] text-black/60">
                                    Créer un avoir pour rembourser ou corriger
                                    une facture
                                </p>
                            </div>
                        </div>
                    </button>
                </div>

                <div className="pt-4">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="w-full border-black/10 hover:bg-black/5"
                    >
                        Annuler
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
