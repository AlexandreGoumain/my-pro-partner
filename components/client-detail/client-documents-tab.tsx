"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { Badge } from "@/components/ui/badge";
import { DocumentStatusBadge } from "@/components/ui/document-status-badge";
import { LoadingState } from "@/components/ui/loading-state";
import { useClientDocuments } from "@/hooks/use-documents";
import { FileText, FilePlus, Eye, Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useRouter } from "next/navigation";

interface ClientDocumentsTabProps {
    clientId: string;
    clientName: string;
}

export function ClientDocumentsTab({
    clientId,
    clientName,
}: ClientDocumentsTabProps) {
    const router = useRouter();
    const { data: documents = [], isLoading } = useClientDocuments(clientId);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
        }).format(value);
    };

    const getDocumentTypeLabel = (type: string) => {
        switch (type) {
            case "DEVIS":
                return "Devis";
            case "FACTURE":
                return "Facture";
            case "AVOIR":
                return "Avoir";
            default:
                return type;
        }
    };

    const handleViewDocument = (documentId: string, type: string) => {
        const basePath =
            type === "DEVIS"
                ? "/dashboard/documents/quotes"
                : type === "FACTURE"
                ? "/dashboard/documents/invoices"
                : "/dashboard/documents/credits";
        router.push(`${basePath}/${documentId}`);
    };

    const handleCreateDocument = () => {
        router.push(`/dashboard/documents/quotes/new?clientId=${clientId}`);
    };

    if (isLoading) {
        return <LoadingState variant="card" message="Chargement des documents..." />;
    }

    if (documents.length === 0) {
        return (
            <Card className="p-12 border-black/8 shadow-sm">
                <div className="flex flex-col items-center text-center space-y-5">
                    <div className="rounded-full h-20 w-20 bg-black/5 flex items-center justify-center">
                        <FileText
                            className="w-10 h-10 text-black/40"
                            strokeWidth={2}
                        />
                    </div>
                    <div>
                        <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-black mb-2">
                            Aucun document
                        </h3>
                        <p className="text-[14px] text-black/60 max-w-md">
                            Les devis, factures et autres documents liés à{" "}
                            {clientName} apparaîtront ici.
                        </p>
                    </div>
                    <PrimaryActionButton
                        icon={FilePlus}
                        onClick={handleCreateDocument}
                        className="mt-2"
                    >
                        Créer un document
                    </PrimaryActionButton>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-[14px] text-black/60">
                    {documents.length} document{documents.length > 1 ? "s" : ""}
                </p>
                <PrimaryActionButton
                    onClick={handleCreateDocument}
                    className="h-10 px-5 text-[13px]"
                >
                    <FilePlus className="w-4 h-4 mr-2" strokeWidth={2} />
                    Nouveau document
                </PrimaryActionButton>
            </div>

            <div className="grid gap-4">
                {documents.map((document) => (
                    <Card
                        key={document.id}
                        className="border-black/8 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="p-5">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="text-[15px] font-semibold tracking-[-0.01em] text-black">
                                            {document.numero}
                                        </h4>
                                        <Badge
                                            variant="outline"
                                            className="text-[11px] h-5 px-2 border-black/10 text-black/60"
                                        >
                                            {getDocumentTypeLabel(document.type)}
                                        </Badge>
                                        <DocumentStatusBadge
                                            status={document.statut}
                                        />
                                    </div>
                                    <div className="flex items-center gap-4 text-[13px] text-black/60">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar
                                                className="h-3.5 w-3.5"
                                                strokeWidth={2}
                                            />
                                            <span>
                                                {format(
                                                    new Date(document.dateEmission),
                                                    "dd MMM yyyy",
                                                    { locale: fr }
                                                )}
                                            </span>
                                        </div>
                                        <span className="font-semibold text-black">
                                            {formatCurrency(
                                                Number(document.total_ttc || 0)
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    onClick={() =>
                                        handleViewDocument(
                                            document.id,
                                            document.type
                                        )
                                    }
                                    variant="outline"
                                    size="sm"
                                    className="h-9 px-4 text-[13px] font-medium border-black/10 hover:bg-black/5"
                                >
                                    <Eye className="w-4 h-4 mr-2" strokeWidth={2} />
                                    Voir
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
