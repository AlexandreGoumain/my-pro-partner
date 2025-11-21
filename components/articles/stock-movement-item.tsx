import {
    MouvementStockIcon,
    getMouvementLabel,
} from "@/components/articles/mouvement-stock-icon";

export interface StockMovementItemProps {
    type: string;
    quantite: number;
    stockApres: number;
    motif?: string;
    className?: string;
}

export function StockMovementItem({
    type,
    quantite,
    stockApres,
    motif,
    className = "",
}: StockMovementItemProps) {
    return (
        <div
            className={`flex items-center justify-between p-3 border border-black/8 rounded-lg hover:bg-black/5 transition-all duration-200 ${className}`}
        >
            <div className="flex items-center gap-3">
                <MouvementStockIcon type={type} />
                <div>
                    <p className="font-medium text-[14px] text-black">
                        {getMouvementLabel(type)}
                    </p>
                    <p className="text-[13px] text-black/60">
                        {motif || "Aucun motif"}
                    </p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-semibold text-[14px] text-black">
                    {quantite > 0 ? "+" : ""}
                    {quantite}
                </p>
                <p className="text-[13px] text-black/60">Stock: {stockApres}</p>
            </div>
        </div>
    );
}
