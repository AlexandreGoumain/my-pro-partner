import { generateNumeroDocument, type DocumentType } from "@/lib/types/settings";

export interface FormatPreviewProps {
    format: string;
    code: string;
    prochainNumero?: number;
    className?: string;
}

export function FormatPreview({
    format,
    code,
    prochainNumero = 1,
    className = "",
}: FormatPreviewProps) {
    // Générer des exemples pour chaque type de document
    const examples = [
        { type: "DEVIS" as DocumentType, label: "Devis" },
        { type: "FACTURE" as DocumentType, label: "Facture" },
        { type: "AVOIR" as DocumentType, label: "Avoir" },
    ];

    return (
        <div className={`space-y-2 ${className}`}>
            <div className="text-[12px] font-medium text-black/60">
                Aperçu (prochain numéro: {prochainNumero})
            </div>
            <div className="flex flex-wrap gap-2">
                {examples.map((example) => {
                    const numero = generateNumeroDocument(
                        format,
                        prochainNumero,
                        code,
                        example.type
                    );
                    return (
                        <div
                            key={example.type}
                            className="inline-flex items-center gap-2 rounded-md bg-black/5 px-3 py-1.5"
                        >
                            <span className="text-[11px] font-medium text-black/40 uppercase">
                                {example.label}
                            </span>
                            <span className="text-[13px] font-mono font-semibold text-black">
                                {numero}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
