import { cn } from "@/lib/utils";

export interface StockItem {
    id: string;
    designation: string;
    reference: string | null;
    categorie: string | null;
    quantite: number;
    seuilAlerte: number;
    prixUnitaire: number;
    diametre: string | null;
    materiau: string | null;
    camionnette: {
        nom: string;
    };
}

export interface StockItemCardProps {
    item: StockItem;
    onClick?: () => void;
    className?: string;
}

export function StockItemCard({ item, onClick, className }: StockItemCardProps) {
    const isLowStock = item.quantite <= item.seuilAlerte;

    return (
        <div
            onClick={onClick}
            className={cn(
                "p-5 rounded-xl bg-white border border-black/8 shadow-sm hover:border-black/20 hover:shadow-md transition-all duration-200",
                onClick && "cursor-pointer",
                className
            )}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-[15px] font-semibold text-black">
                            {item.designation}
                        </h3>
                        {item.categorie && (
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-black/5 text-black/60">
                                {item.categorie}
                            </span>
                        )}
                        {isLowStock && (
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-red-100 text-red-800 border border-red-200">
                                Stock bas
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-4 text-[13px] text-black/50">
                        {item.reference && <span>Réf: {item.reference}</span>}
                        {item.diametre && <span>⌀ {item.diametre}</span>}
                        {item.materiau && <span>{item.materiau}</span>}
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[24px] font-bold text-black">
                            {item.quantite}
                        </span>
                        <span className="text-[13px] text-black/40">unités</span>
                    </div>
                    <p className="text-[13px] text-black/60">
                        {Number(item.prixUnitaire).toFixed(2)}€/u
                    </p>
                </div>
            </div>
        </div>
    );
}
