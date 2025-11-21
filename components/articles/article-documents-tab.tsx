import { CardSection } from "@/components/ui/card-section";
import { EmptyState } from "@/components/ui/empty-state";
import { DocumentListItem } from "@/components/articles/document-list-item";
import { FileText } from "lucide-react";

export interface ArticleDocument {
    id: string;
    type: string;
    numero: string;
    client: string;
    montant: number;
    quantite: number;
}

export interface ArticleDocumentsTabProps {
    documents: ArticleDocument[];
    onDocumentClick?: (documentId: string) => void;
    className?: string;
}

export function ArticleDocumentsTab({
    documents,
    onDocumentClick,
    className = "",
}: ArticleDocumentsTabProps) {
    return (
        <div className={`space-y-4 ${className}`}>
            <CardSection
                title="Documents liés"
                description="Devis et factures utilisant cet article"
                className="border-black/8 shadow-sm"
                titleClassName="text-[16px]"
            >
                {documents.length === 0 ? (
                    <EmptyState
                        icon={FileText}
                        title="Aucun document lié à cet article"
                        variant="minimal"
                    />
                ) : (
                    <div className="space-y-2">
                        {documents.map((doc) => (
                            <DocumentListItem
                                key={doc.id}
                                type={doc.type}
                                numero={doc.numero}
                                client={doc.client}
                                montant={doc.montant}
                                quantite={doc.quantite}
                                onClick={
                                    onDocumentClick
                                        ? () => onDocumentClick(doc.id)
                                        : undefined
                                }
                            />
                        ))}
                    </div>
                )}
            </CardSection>
        </div>
    );
}
