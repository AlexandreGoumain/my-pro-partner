"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ChevronDown, CheckCircle2, XCircle, Send, Ban } from "lucide-react";
import { useDocumentStatus } from "@/hooks/use-document-status";

type DocumentStatut =
    | "BROUILLON"
    | "ENVOYE"
    | "ACCEPTE"
    | "REFUSE"
    | "PAYE"
    | "ANNULE";

interface DocumentStatusManagerProps {
    documentId: string;
    currentStatus: DocumentStatut;
    documentType: "DEVIS" | "FACTURE" | "AVOIR";
    onStatusChanged?: () => void;
}

const STATUS_LABELS: Record<DocumentStatut, string> = {
    BROUILLON: "Brouillon",
    ENVOYE: "Envoyé",
    ACCEPTE: "Accepté",
    REFUSE: "Refusé",
    PAYE: "Payé",
    ANNULE: "Annulé",
};

const STATUS_ICONS = {
    ENVOYE: Send,
    ACCEPTE: CheckCircle2,
    REFUSE: XCircle,
    ANNULE: Ban,
};

export function DocumentStatusManager({
    documentId,
    currentStatus,
    documentType,
    onStatusChanged,
}: DocumentStatusManagerProps) {
    const {
        isConfirmOpen,
        selectedStatus,
        isUpdating,
        allowedTransitions,
        handleStatusSelect,
        handleConfirmChange,
        handleCancelChange,
    } = useDocumentStatus({
        documentId,
        currentStatus,
        documentType,
        onStatusChanged,
    });

    // No transitions available
    if (allowedTransitions.length === 0) {
        return null;
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        className="h-11 px-4 text-[14px] font-medium border-black/10 hover:bg-black/5"
                    >
                        Changer le statut
                        <ChevronDown
                            className="ml-2 w-4 h-4"
                            strokeWidth={2}
                        />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    {allowedTransitions.map((status) => {
                        const Icon = STATUS_ICONS[status];
                        return (
                            <DropdownMenuItem
                                key={status}
                                onClick={() => handleStatusSelect(status)}
                                className="text-[14px]"
                            >
                                {Icon && (
                                    <Icon
                                        className="w-4 h-4 mr-2"
                                        strokeWidth={2}
                                    />
                                )}
                                {STATUS_LABELS[status]}
                            </DropdownMenuItem>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={isConfirmOpen} onOpenChange={handleCancelChange}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-[20px] font-semibold tracking-[-0.01em]">
                            Confirmer le changement de statut
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-[14px] text-black/60">
                            Voulez-vous vraiment changer le statut de{" "}
                            <span className="font-medium text-black">
                                {STATUS_LABELS[currentStatus]}
                            </span>{" "}
                            à{" "}
                            <span className="font-medium text-black">
                                {selectedStatus && STATUS_LABELS[selectedStatus]}
                            </span>{" "}
                            ?
                            {selectedStatus === "ANNULE" && (
                                <span className="block mt-2 text-red-600">
                                    Cette action ne peut pas être annulée.
                                </span>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            disabled={isUpdating}
                            className="text-[14px]"
                        >
                            Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmChange}
                            disabled={isUpdating}
                            className="bg-black hover:bg-black/90 text-white text-[14px]"
                        >
                            {isUpdating ? "Mise à jour..." : "Confirmer"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
