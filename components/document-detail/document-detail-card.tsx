import { Card } from "@/components/ui/card";
import { DocumentStatusBadge } from "@/components/ui/document-status-badge";
import { DocumentTypeBadge } from "@/components/ui/document-type-badge";
import { DocumentClientSection } from "./document-client-section";
import { DocumentInfoSection } from "./document-info-section";
import { Document } from "@/lib/types/document.types";

export interface DocumentDetailCardProps {
    document: Document;
    clientName: string;
    showValidite?: boolean;
}

/**
 * Reusable component for displaying document header and basic information
 */
export function DocumentDetailCard({
    document,
    clientName,
    showValidite = false,
}: DocumentDetailCardProps) {
    return (
        <Card className="p-6 border-black/8 shadow-sm">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <DocumentTypeBadge type={document.type} />
                        <DocumentStatusBadge status={document.statut} />
                    </div>
                    <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-black">
                        {document.numero}
                    </h2>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
                <DocumentClientSection
                    client={document.client}
                    clientName={clientName}
                />
                <DocumentInfoSection
                    dateEmission={document.dateEmission}
                    dateEcheance={document.dateEcheance}
                    validiteJours={document.validite_jours}
                    showValidite={showValidite}
                />
            </div>

            {document.conditions_paiement && (
                <div className="mb-6">
                    <h3 className="text-[14px] font-semibold text-black mb-2">
                        Conditions de paiement
                    </h3>
                    <p className="text-[14px] text-black/60">
                        {document.conditions_paiement}
                    </p>
                </div>
            )}

            {document.notes && (
                <div>
                    <h3 className="text-[14px] font-semibold text-black mb-2">
                        Notes
                    </h3>
                    <p className="text-[14px] text-black/60">{document.notes}</p>
                </div>
            )}
        </Card>
    );
}
