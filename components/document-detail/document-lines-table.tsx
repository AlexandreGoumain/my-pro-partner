import { DocumentLine } from "@/lib/types/document.types";

export interface DocumentLinesTableProps {
    lines: DocumentLine[];
    formatAmount: (value: number) => string;
    title?: string;
}

/**
 * Reusable component for displaying document lines in a table format
 */
export function DocumentLinesTable({
    lines,
    formatAmount,
    title = "Lignes du document",
}: DocumentLinesTableProps) {
    return (
        <div>
            <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-black mb-4">
                {title}
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                    <thead className="bg-black/2 border-b border-black/8">
                        <tr>
                            <th className="text-left p-3 font-medium text-black/60">
                                Désignation
                            </th>
                            <th className="text-right p-3 font-medium text-black/60">
                                Quantité
                            </th>
                            <th className="text-right p-3 font-medium text-black/60">
                                Prix unitaire HT
                            </th>
                            <th className="text-right p-3 font-medium text-black/60">
                                TVA
                            </th>
                            <th className="text-right p-3 font-medium text-black/60">
                                Remise
                            </th>
                            <th className="text-right p-3 font-medium text-black/60">
                                Total HT
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {lines.map((ligne) => (
                            <tr
                                key={ligne.id}
                                className="border-b border-black/5 last:border-0"
                            >
                                <td className="p-3">
                                    <div className="font-medium">
                                        {ligne.designation}
                                    </div>
                                    {ligne.description && (
                                        <div className="text-black/60 text-[12px] mt-1">
                                            {ligne.description}
                                        </div>
                                    )}
                                </td>
                                <td className="p-3 text-right">{ligne.quantite}</td>
                                <td className="p-3 text-right">
                                    {formatAmount(ligne.prix_unitaire_ht)}
                                </td>
                                <td className="p-3 text-right">{ligne.tva_taux}%</td>
                                <td className="p-3 text-right">
                                    {ligne.remise_pourcent}%
                                </td>
                                <td className="p-3 text-right font-medium">
                                    {formatAmount(ligne.montant_ht)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
