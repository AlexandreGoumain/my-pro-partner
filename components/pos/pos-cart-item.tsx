import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CartItem } from "@/hooks/use-pos-cart";
import { Minus, Plus, Trash2 } from "lucide-react";

export interface POSCartItemProps {
    item: CartItem;
    onUpdateQuantity: (articleId: string, quantite: number) => void;
    onRemove: (articleId: string) => void;
}

export function POSCartItem({
    item,
    onUpdateQuantity,
    onRemove,
}: POSCartItemProps) {
    return (
        <Card className="p-3 border-black/8">
            <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                    <div className="text-[14px] font-semibold text-black">
                        {item.nom}
                    </div>
                    <div className="text-[12px] text-black/60">
                        {item.reference}
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(item.articleId)}
                    className="h-8 w-8 p-0"
                >
                    <Trash2 className="h-4 w-4 text-black/40" />
                </Button>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            onUpdateQuantity(item.articleId, item.quantite - 1)
                        }
                        className="h-8 w-8 p-0"
                    >
                        <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-[14px] font-semibold w-8 text-center">
                        {item.quantite}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            onUpdateQuantity(item.articleId, item.quantite + 1)
                        }
                        className="h-8 w-8 p-0"
                    >
                        <Plus className="h-3 w-3" />
                    </Button>
                </div>

                <div className="text-[15px] font-semibold text-black">
                    {(item.prix_ht * item.quantite).toFixed(2)}€
                </div>
            </div>
        </Card>
    );
}
