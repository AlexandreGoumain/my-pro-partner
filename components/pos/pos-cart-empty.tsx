import { ShoppingCart } from "lucide-react";

export function POSCartEmpty() {
    return (
        <div className="text-center py-12">
            <ShoppingCart className="h-12 w-12 text-black/20 mx-auto mb-3" />
            <p className="text-[14px] text-black/60">Panier vide</p>
            <p className="text-[13px] text-black/40 mt-1">
                Cliquez sur un article pour l'ajouter
            </p>
        </div>
    );
}
