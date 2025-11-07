interface DocumentLine {
    id: string;
    designation: string;
    description?: string | null;
    quantite: number;
    prix_unitaire_ht: number;
    tva_taux: number;
    remise_pourcent: number;
    montant_ht: number;
    montant_tva: number;
    montant_ttc: number;
}

interface DocumentLinesTableProps {
    lines: DocumentLine[];
}

/**
 * Reusable component for displaying document lines in a table
 */
export function DocumentLinesTable({ lines }: DocumentLinesTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-black/5">
                    <tr>
                        <th className="text-left py-3 px-6 text-[13px] font-medium text-black/60">
                            Désignation
                        </th>
                        <th className="text-right py-3 px-6 text-[13px] font-medium text-black/60">
                            Qté
                        </th>
                        <th className="text-right py-3 px-6 text-[13px] font-medium text-black/60">
                            Prix HT
                        </th>
                        <th className="text-right py-3 px-6 text-[13px] font-medium text-black/60">
                            TVA
                        </th>
                        <th className="text-right py-3 px-6 text-[13px] font-medium text-black/60">
                            Total TTC
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {lines.map((ligne) => (
                        <tr key={ligne.id} className="border-b border-black/8">
                            <td className="py-4 px-6">
                                <p className="text-[14px] font-medium text-black">
                                    {ligne.designation}
                                </p>
                                {ligne.description && (
                                    <p className="text-[13px] text-black/60 mt-1">
                                        {ligne.description}
                                    </p>
                                )}
                            </td>
                            <td className="py-4 px-6 text-right text-[14px] text-black/80">
                                {Number(ligne.quantite)}
                            </td>
                            <td className="py-4 px-6 text-right text-[14px] text-black/80">
                                {Number(ligne.prix_unitaire_ht).toFixed(2)}€
                            </td>
                            <td className="py-4 px-6 text-right text-[14px] text-black/80">
                                {Number(ligne.tva_taux)}%
                            </td>
                            <td className="py-4 px-6 text-right text-[14px] font-medium text-black">
                                {Number(ligne.montant_ttc).toFixed(2)}€
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
