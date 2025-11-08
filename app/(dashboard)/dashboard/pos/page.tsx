"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePOSCart } from "@/hooks/use-pos-cart";
import { Search, ShoppingCart, User, Trash2, Plus, Minus, CreditCard, Banknote, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { TerminalPayment } from "@/components/pos/terminal-payment";

/**
 * Interface POS (Point of Sale) - Caisse
 */
export default function POSPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [terminalDialogOpen, setTerminalDialogOpen] = useState(false);

  const cart = usePOSCart();

  // Charger les articles
  useEffect(() => {
    loadArticles();
  }, []);

  // Filtrer les articles lors de la recherche
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter(
        (article) =>
          article.nom.toLowerCase().includes(search.toLowerCase()) ||
          article.reference.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredArticles(filtered);
    }
  }, [search, articles]);

  const loadArticles = async () => {
    try {
      const res = await fetch("/api/articles?actif=true&limit=100");
      const data = await res.json();
      setArticles(data.articles || []);
      setFilteredArticles(data.articles || []);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du chargement des articles");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (paymentMethod: "CARTE" | "ESPECES" | "CHEQUE") => {
    if (cart.items.length === 0) {
      toast.error("Le panier est vide");
      return;
    }

    try {
      setProcessing(true);

      const res = await fetch("/api/pos/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.items,
          clientId: cart.clientId,
          remiseGlobale: cart.remiseGlobale,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      toast.success("Vente enregistrée avec succès !");

      // Imprimer le ticket (optionnel)
      if (data.ticketUrl) {
        window.open(data.ticketUrl, "_blank");
      }

      // Vider le panier
      cart.clearCart();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erreur lors de l'encaissement");
    } finally {
      setProcessing(false);
    }
  };

  const handleTerminalSuccess = (documentId: string) => {
    // Ouvrir le ticket
    window.open(`/api/pos/ticket/${documentId}`, "_blank");

    // Vider le panier
    cart.clearCart();
  };

  return (
    <div className="h-screen flex flex-col bg-black/2">
      {/* Header */}
      <div className="bg-white border-b border-black/8 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[24px] font-semibold tracking-[-0.01em] text-black">
            Caisse (POS)
          </h1>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-black/10 hover:bg-black/5"
              onClick={() => cart.clearCart()}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Vider
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Articles grid */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search */}
          <div className="p-4 bg-white border-b border-black/8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un article..."
                className="pl-10 h-11 border-black/10"
              />
            </div>
          </div>

          {/* Articles grid */}
          <div className="flex-1 overflow-auto p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filteredArticles.map((article) => (
                <Card
                  key={article.id}
                  className="p-4 border-black/8 hover:border-black/20 cursor-pointer transition-all"
                  onClick={() => cart.addItem(article)}
                >
                  <div className="text-[15px] font-semibold text-black mb-1 truncate">
                    {article.nom}
                  </div>
                  <div className="text-[13px] text-black/60 mb-2 truncate">
                    {article.reference}
                  </div>
                  <div className="text-[18px] font-semibold text-black">
                    {Number(article.prix_ht).toFixed(2)}€
                  </div>
                  <div className="text-[12px] text-black/40">
                    HT • TVA {article.tva_taux}%
                  </div>
                </Card>
              ))}
            </div>

            {filteredArticles.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-black/60">Aucun article trouvé</p>
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
                Panier ({cart.totals.nombre_articles})
              </h2>
            </div>

            {/* Client selector */}
            <Button
              variant="outline"
              className="w-full border-black/10 hover:bg-black/5 justify-start"
            >
              <User className="h-4 w-4 mr-2" />
              {cart.clientId ? "Client sélectionné" : "Sélectionner un client"}
            </Button>
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-auto p-4">
            {cart.items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 text-black/20 mx-auto mb-3" />
                <p className="text-[14px] text-black/60">Panier vide</p>
                <p className="text-[13px] text-black/40 mt-1">
                  Cliquez sur un article pour l'ajouter
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <Card key={item.articleId} className="p-3 border-black/8">
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
                        onClick={() => cart.removeItem(item.articleId)}
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
                            cart.updateQuantity(item.articleId, item.quantite - 1)
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
                            cart.updateQuantity(item.articleId, item.quantite + 1)
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
                ))}
              </div>
            )}
          </div>

          {/* Cart totals */}
          {cart.items.length > 0 && (
            <div className="border-t border-black/8 p-4 space-y-4">
              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-[14px]">
                  <span className="text-black/60">Total HT</span>
                  <span className="text-black font-medium">
                    {cart.totals.total_ht.toFixed(2)}€
                  </span>
                </div>
                <div className="flex justify-between text-[14px]">
                  <span className="text-black/60">TVA</span>
                  <span className="text-black font-medium">
                    {cart.totals.total_tva.toFixed(2)}€
                  </span>
                </div>
                <div className="flex justify-between text-[18px] font-semibold pt-2 border-t border-black/8">
                  <span className="text-black">Total TTC</span>
                  <span className="text-black">
                    {cart.totals.total_ttc.toFixed(2)}€
                  </span>
                </div>
              </div>

              {/* Payment buttons */}
              <div className="space-y-2">
                <Button
                  onClick={() => setTerminalDialogOpen(true)}
                  disabled={processing}
                  className="w-full h-12 bg-black hover:bg-black/90 text-white"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payer par Terminal
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => handleCheckout("ESPECES")}
                    disabled={processing}
                    variant="outline"
                    className="h-11 border-black/10 hover:bg-black/5"
                  >
                    <Banknote className="h-4 w-4 mr-2" />
                    Espèces
                  </Button>
                  <Button
                    onClick={() => handleCheckout("CHEQUE")}
                    disabled={processing}
                    variant="outline"
                    className="h-11 border-black/10 hover:bg-black/5"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Chèque
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Terminal Payment Dialog */}
      <TerminalPayment
        open={terminalDialogOpen}
        onOpenChange={setTerminalDialogOpen}
        amount={cart.totals.total_ttc}
        onSuccess={handleTerminalSuccess}
        cartItems={cart.items}
        clientId={cart.clientId}
        remiseGlobale={cart.remiseGlobale}
      />
    </div>
  );
}
