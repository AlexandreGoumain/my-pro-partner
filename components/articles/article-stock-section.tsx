import { Button } from "@/components/ui/button";
import { CardSection } from "@/components/ui/card-section";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Package } from "lucide-react";

export interface ArticleStockSectionProps {
    stock: number;
    seuilAlerte: number;
    onAdjustStock?: () => void;
    className?: string;
}

export function ArticleStockSection({
    stock,
    seuilAlerte,
    onAdjustStock,
    className = "",
}: ArticleStockSectionProps) {
    const stockPercentage =
        seuilAlerte === 0 ? 100 : Math.min((stock / (seuilAlerte * 3)) * 100, 100);

    const getAvailabilityStatus = () => {
        if (stock > seuilAlerte) {
            return { label: "En stock", color: "text-green-600" };
        }
        if (stock > 0) {
            return { label: "Stock limité", color: "text-amber-600" };
        }
        return { label: "Rupture", color: "text-red-600" };
    };

    const availability = getAvailabilityStatus();

    return (
        <CardSection
            title="Gestion du stock"
            description="Suivi et alertes de disponibilité"
            className={`border-black/8 shadow-sm ${className}`}
            titleClassName="text-[16px]"
            contentClassName="space-y-4"
        >
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <p className="text-[14px] text-black/60 mb-2">Stock actuel</p>
                    <p className="text-[40px] font-bold tracking-[-0.02em] text-black">
                        {stock}
                    </p>
                    <p className="text-[13px] text-black/60 mt-1">
                        unités disponibles
                    </p>
                </div>
                <div>
                    <p className="text-[14px] text-black/60 mb-2">
                        Seuil d&apos;alerte
                    </p>
                    <p className="text-[40px] font-bold tracking-[-0.02em] text-black/60">
                        {seuilAlerte}
                    </p>
                    <p className="text-[13px] text-black/60 mt-1">unités minimum</p>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-[14px]">
                    <span className="text-black/60">Niveau</span>
                    <Progress value={stockPercentage} className="w-1/2 h-2" />
                </div>
            </div>

            <Separator className="bg-black/10" />

            <div className="space-y-2 text-[14px]">
                <div className="flex justify-between">
                    <span className="text-black/60">Disponibilité</span>
                    <span className={`font-semibold ${availability.color}`}>
                        {availability.label}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-black/60">Gestion stock</span>
                    <span className="font-semibold text-black">Activée</span>
                </div>
            </div>

            {onAdjustStock && (
                <Button
                    className="w-full border-black/10 hover:bg-black/5"
                    variant="outline"
                    onClick={onAdjustStock}
                >
                    <Package className="h-4 w-4 mr-2" />
                    Ajuster le stock
                </Button>
            )}
        </CardSection>
    );
}
