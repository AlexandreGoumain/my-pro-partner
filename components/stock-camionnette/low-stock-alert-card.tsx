import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface LowStockItem {
    id: string;
    designation: string;
    quantite: number;
    seuilAlerte: number;
    camionnette: {
        nom: string;
    };
}

export interface LowStockAlertCardProps {
    item: LowStockItem;
    onReapprovisionner?: () => void;
    className?: string;
}

export function LowStockAlertCard({
    item,
    onReapprovisionner,
    className,
}: LowStockAlertCardProps) {
    return (
        <div
            className={cn(
                "p-5 rounded-xl bg-white border border-red-200 shadow-sm hover:shadow-md transition-all duration-200",
                className
            )}
        >
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-5 h-5 text-red-600" strokeWidth={2} />
                    </div>
                    <div>
                        <h3 className="text-[15px] font-semibold text-black mb-1">
                            {item.designation}
                        </h3>
                        <p className="text-[13px] text-black/60 mb-2">
                            {item.camionnette.nom}
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-[13px] text-black/50">
                                Stock:{" "}
                                <span className="font-semibold text-red-600">
                                    {item.quantite}
                                </span>
                            </span>
                            <span className="text-[13px] text-black/30">•</span>
                            <span className="text-[13px] text-black/50">
                                Seuil: {item.seuilAlerte}
                            </span>
                        </div>
                    </div>
                </div>
                {onReapprovisionner && (
                    <Button
                        size="sm"
                        onClick={onReapprovisionner}
                        className="bg-black hover:bg-black/90 text-white"
                    >
                        Réapprovisionner
                    </Button>
                )}
            </div>
        </div>
    );
}
