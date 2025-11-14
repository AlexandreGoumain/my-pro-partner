"use client";

import {
    POSArticleCard,
    POSCartEmpty,
    POSCartItem,
    POSCartSummary,
    POSPaymentButtons,
    TerminalPayment,
} from "@/components/pos";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { usePOSPage } from "@/hooks/use-pos-page";
import { ShoppingCart, Trash2, User } from "lucide-react";

/**
 * Interface POS (Point of Sale) - Caisse
 */
export default function POSPage() {
    const page = usePOSPage();

    return (
        <div className="h-screen flex flex-col bg-black/2">
            {/* Header */}
            <div className="bg-white border-b border-black/8 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-[24px] font-semibold tracking-[-0.01em] text-black">
                        Caisse (POS)
                    </h1>
                    <Button
                        variant="outline"
                        className="border-black/10 hover:bg-black/5"
                        onClick={() => page.cart.clearCart()}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Vider
                    </Button>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Articles grid */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Search */}
                    <div className="p-4 bg-white border-b border-black/8">
                        <SearchBar
                            value={page.search}
                            onChange={page.setSearch}
                            placeholder="Rechercher un article..."
                        />
                    </div>

                    {/* Articles grid */}
                    <div className="flex-1 overflow-auto p-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                            {page.filteredArticles.map((article) => (
                                <POSArticleCard
                                    key={article.id}
                                    article={article}
                                    onClick={page.cart.addItem}
                                />
                            ))}
                        </div>

                        {page.filteredArticles.length === 0 &&
                            !page.loading && (
                                <div className="text-center py-12">
                                    <p className="text-black/60">
                                        Aucun article trouvé
                                    </p>
                                </div>
                            )}
                    </div>
                </div>

                {/* Right: Cart */}
                <div className="w-[400px] bg-white border-l border-black/8 flex flex-col">
                    {/* Cart header */}
                    <div className="p-4 border-b border-black/8">
                        <div className="flex items-center gap-2 mb-4">
                            <ShoppingCart className="h-5 w-5 text-black" />
                            <h2 className="text-[18px] font-semibold text-black">
                                Panier ({page.cart.totals.nombre_articles})
                            </h2>
                        </div>

                        {/* Client selector */}
                        <Button
                            variant="outline"
                            className="w-full border-black/10 hover:bg-black/5 justify-start"
                        >
                            <User className="h-4 w-4 mr-2" />
                            {page.cart.clientId
                                ? "Client sélectionné"
                                : "Sélectionner un client"}
                        </Button>
                    </div>

                    {/* Cart items */}
                    <div className="flex-1 overflow-auto p-4">
                        {page.cart.items.length === 0 ? (
                            <POSCartEmpty />
                        ) : (
                            <div className="space-y-3">
                                {page.cart.items.map((item) => (
                                    <POSCartItem
                                        key={item.articleId}
                                        item={item}
                                        onUpdateQuantity={
                                            page.cart.updateQuantity
                                        }
                                        onRemove={page.cart.removeItem}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Cart totals and payment */}
                    {page.cart.items.length > 0 && (
                        <div className="border-t border-black/8 p-4 space-y-4">
                            <POSCartSummary
                                totalHT={page.cart.totals.total_ht}
                                totalTVA={page.cart.totals.total_tva}
                                totalTTC={page.cart.totals.total_ttc}
                            />

                            <POSPaymentButtons
                                onPayment={page.handleCheckout}
                                onTerminalPayment={() =>
                                    page.setTerminalDialogOpen(true)
                                }
                                processing={page.processing}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Terminal Payment Dialog */}
            <TerminalPayment
                open={page.terminalDialogOpen}
                onOpenChange={page.setTerminalDialogOpen}
                amount={page.cart.totals.total_ttc}
                onSuccess={page.handleTerminalSuccess}
                cartItems={page.cart.items}
                clientId={page.cart.clientId}
                remiseGlobale={page.cart.remiseGlobale}
            />
        </div>
    );
}
