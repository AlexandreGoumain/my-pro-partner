import { Button } from "@/components/ui/button";
import { CardSection } from "@/components/ui/card-section";
import { EmptyState } from "@/components/ui/empty-state";
import { StockMovementItem } from "@/components/articles/stock-movement-item";
import { Package } from "lucide-react";

export interface MouvementStock {
    id: string;
    type: string;
    quantite: number;
    stock_apres: number;
    motif?: string;
}

export interface ArticleStockTabProps {
    mouvements: MouvementStock[];
    onNewMouvement?: () => void;
    className?: string;
}

export function ArticleStockTab({
    mouvements,
    onNewMouvement,
    className = "",
}: ArticleStockTabProps) {
    return (
        <div className={`space-y-4 ${className}`}>
            <CardSection
                title="Mouvements de stock"
                description="Historique complet des entrées et sorties"
                className="border-black/8 shadow-sm"
                titleClassName="text-[16px]"
                action={
                    onNewMouvement && (
                        <Button
                            className="bg-black hover:bg-black/90 text-white"
                            onClick={onNewMouvement}
                        >
                            <Package className="h-4 w-4 mr-2" />
                            Nouveau mouvement
                        </Button>
                    )
                }
            >
                {mouvements.length === 0 ? (
                    <EmptyState
                        icon={Package}
                        title="Aucun mouvement de stock enregistré"
                        variant="minimal"
                    />
                ) : (
                    <div className="space-y-2">
                        {mouvements.map((mouvement) => (
                            <StockMovementItem
                                key={mouvement.id}
                                type={mouvement.type}
                                quantite={mouvement.quantite}
                                stockApres={mouvement.stock_apres}
                                motif={mouvement.motif}
                            />
                        ))}
                    </div>
                )}
            </CardSection>
        </div>
    );
}
