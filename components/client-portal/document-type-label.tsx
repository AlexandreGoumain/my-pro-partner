interface DocumentTypeLabelProps {
    type: string;
}

const TYPE_LABELS: Record<string, string> = {
    DEVIS: "Devis",
    FACTURE: "Facture",
    AVOIR: "Avoir",
};

/**
 * Reusable document type label component
 */
export function DocumentTypeLabel({ type }: DocumentTypeLabelProps) {
    return <span>{TYPE_LABELS[type] || type}</span>;
}

/**
 * Get document type label as string
 */
export function getDocumentTypeLabel(type: string): string {
    return TYPE_LABELS[type] || type;
}
