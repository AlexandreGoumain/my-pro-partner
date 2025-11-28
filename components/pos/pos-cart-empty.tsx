import { EmptyState } from "@/components/ui/empty-state";
import { ShoppingCart } from "lucide-react";

export function POSCartEmpty() {
    return (
        <EmptyState
            icon={ShoppingCart}
            title="Panier vide"
            description="Cliquez sur un article pour l'ajouter"
            variant="minimal"
            iconSize="lg"
            textSize="sm"
        />
    );
}
