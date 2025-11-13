export interface POSCartSummaryProps {
    totalHT: number;
    totalTVA: number;
    totalTTC: number;
}

export function POSCartSummary({
    totalHT,
    totalTVA,
    totalTTC,
}: POSCartSummaryProps) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-[14px]">
                <span className="text-black/60">Total HT</span>
                <span className="text-black font-medium">
                    {totalHT.toFixed(2)}€
                </span>
            </div>
            <div className="flex justify-between text-[14px]">
                <span className="text-black/60">TVA</span>
                <span className="text-black font-medium">
                    {totalTVA.toFixed(2)}€
                </span>
            </div>
            <div className="flex justify-between text-[18px] font-semibold pt-2 border-t border-black/8">
                <span className="text-black">Total TTC</span>
                <span className="text-black">{totalTTC.toFixed(2)}€</span>
            </div>
        </div>
    );
}
