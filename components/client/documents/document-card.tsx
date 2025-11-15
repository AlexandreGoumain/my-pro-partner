import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ClientDocument } from "@/lib/types/document";
import {
    DOCUMENT_STATUS_COLORS,
    DOCUMENT_STATUS_LABELS,
    DOCUMENT_TYPE_LABELS,
} from "@/lib/types/document";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Download } from "lucide-react";

export interface DocumentCardProps {
    document: ClientDocument;
    onDownload: (documentId: string) => void;
    className?: string;
}

export function DocumentCard({
    document,
    onDownload,
    className,
}: DocumentCardProps) {
    return (
        <Card
            className={cn(
                "border-black/8 shadow-sm hover:shadow-md transition-shadow",
                className
            )}
        >
            <div className="p-5">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-[16px] font-semibold text-black">
                                {DOCUMENT_TYPE_LABELS[document.type]}{" "}
                                {document.numero}
                            </h3>
                            <Badge
                                variant="secondary"
                                className={cn(
                                    "border-0 text-[11px] h-5 px-2",
                                    DOCUMENT_STATUS_COLORS[document.statut]
                                )}
                            >
                                {DOCUMENT_STATUS_LABELS[document.statut]}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-[13px] text-black/60">
                            <span>
                                Émis le{" "}
                                {format(
                                    new Date(document.dateEmission),
                                    "dd MMM yyyy",
                                    {
                                        locale: fr,
                                    }
                                )}
                            </span>
                            {document.dateEcheance && (
                                <span>
                                    Échéance :{" "}
                                    {format(
                                        new Date(document.dateEcheance),
                                        "dd MMM yyyy",
                                        {
                                            locale: fr,
                                        }
                                    )}
                                </span>
                            )}
                        </div>
                        <div className="mt-3">
                            <p className="text-[18px] font-semibold text-black">
                                {new Intl.NumberFormat("fr-FR", {
                                    style: "currency",
                                    currency: "EUR",
                                }).format(Number(document.total_ttc))}
                            </p>
                            {document.reste_a_payer > 0 && (
                                <p className="text-[13px] text-black/60">
                                    Reste à payer :{" "}
                                    {new Intl.NumberFormat("fr-FR", {
                                        style: "currency",
                                        currency: "EUR",
                                    }).format(Number(document.reste_a_payer))}
                                </p>
                            )}
                        </div>
                    </div>
                    <Button
                        onClick={() => onDownload(document.id)}
                        variant="outline"
                        className="h-10 px-4 text-[14px] font-medium border-black/10 hover:bg-black/5"
                    >
                        <Download
                            className="h-4 w-4 mr-2 text-black/60"
                            strokeWidth={2}
                        />
                        <span className="text-black/80">PDF</span>
                    </Button>
                </div>
            </div>
        </Card>
    );
}
