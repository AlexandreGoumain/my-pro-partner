interface DocumentTotalsProps {
    totalHt: number;
    totalTva: number;
    totalTtc: number;
    acompteMontant?: number;
    resteAPayer?: number;
}

/**
 * Reusable component for displaying document totals
 */
export function DocumentTotals({
    totalHt,
    totalTva,
    totalTtc,
    acompteMontant = 0,
    resteAPayer = 0,
}: DocumentTotalsProps) {
    return (
        <div className="p-6 bg-black/5 space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-[14px] text-black/60">Total HT</span>
                <span className="text-[14px] text-black">
                    {Number(totalHt).toFixed(2)}€
                </span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-[14px] text-black/60">Total TVA</span>
                <span className="text-[14px] text-black">
                    {Number(totalTva).toFixed(2)}€
                </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-black/10">
                <span className="text-[16px] font-semibold text-black">
                    Total TTC
                </span>
                <span className="text-[16px] font-semibold text-black">
                    {Number(totalTtc).toFixed(2)}€
                </span>
            </div>
            {acompteMontant > 0 && (
                <>
                    <div className="flex justify-between items-center">
                        <span className="text-[14px] text-black/60">
                            Acompte versé
                        </span>
                        <span className="text-[14px] text-black">
                            {Number(acompteMontant).toFixed(2)}€
                        </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-black/10">
                        <span className="text-[16px] font-semibold text-black">
                            Reste à payer
                        </span>
                        <span className="text-[16px] font-semibold text-black">
                            {Number(resteAPayer).toFixed(2)}€
                        </span>
                    </div>
                </>
            )}
        </div>
    );
}
