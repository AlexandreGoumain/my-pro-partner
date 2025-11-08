import { useState, useMemo } from "react";
import { toast } from "sonner";

export interface CartItem {
  articleId: string;
  reference: string;
  nom: string;
  prix_ht: number;
  tva_taux: number;
  quantite: number;
  remise_pourcent?: number;
}

/**
 * Hook pour gérer le panier POS
 */
export function usePOSCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [clientId, setClientId] = useState<string | null>(null);
  const [remiseGlobale, setRemiseGlobale] = useState<number>(0);

  /**
   * Ajouter un article au panier
   */
  const addItem = (article: {
    id: string;
    reference: string;
    nom: string;
    prix_ht: number;
    tva_taux: number;
  }) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.articleId === article.id);

      if (existing) {
        // Incrémenter la quantité
        return prev.map((item) =>
          item.articleId === article.id
            ? { ...item, quantite: item.quantite + 1 }
            : item
        );
      } else {
        // Ajouter nouvel article
        return [
          ...prev,
          {
            articleId: article.id,
            reference: article.reference,
            nom: article.nom,
            prix_ht: article.prix_ht,
            tva_taux: article.tva_taux,
            quantite: 1,
          },
        ];
      }
    });

    toast.success(`${article.nom} ajouté au panier`);
  };

  /**
   * Retirer un article du panier
   */
  const removeItem = (articleId: string) => {
    setItems((prev) => prev.filter((item) => item.articleId !== articleId));
  };

  /**
   * Modifier la quantité
   */
  const updateQuantity = (articleId: string, quantite: number) => {
    if (quantite <= 0) {
      removeItem(articleId);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.articleId === articleId ? { ...item, quantite } : item
      )
    );
  };

  /**
   * Appliquer une remise sur un article
   */
  const applyItemDiscount = (articleId: string, remise: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.articleId === articleId ? { ...item, remise_pourcent: remise } : item
      )
    );
  };

  /**
   * Vider le panier
   */
  const clearCart = () => {
    setItems([]);
    setClientId(null);
    setRemiseGlobale(0);
  };

  /**
   * Calculs du panier
   */
  const totals = useMemo(() => {
    let total_ht = 0;
    let total_tva = 0;
    let total_remise = 0;

    items.forEach((item) => {
      const montant_ht_ligne = item.prix_ht * item.quantite;
      const remise_ligne = item.remise_pourcent
        ? (montant_ht_ligne * item.remise_pourcent) / 100
        : 0;
      const montant_ht_apres_remise = montant_ht_ligne - remise_ligne;
      const tva_ligne = (montant_ht_apres_remise * item.tva_taux) / 100;

      total_ht += montant_ht_apres_remise;
      total_tva += tva_ligne;
      total_remise += remise_ligne;
    });

    // Appliquer remise globale
    const remise_globale_montant = (total_ht * remiseGlobale) / 100;
    total_ht -= remise_globale_montant;
    total_remise += remise_globale_montant;

    // Recalculer la TVA après remise globale
    total_tva = 0;
    items.forEach((item) => {
      const montant_ht_ligne = item.prix_ht * item.quantite;
      const remise_ligne = item.remise_pourcent
        ? (montant_ht_ligne * item.remise_pourcent) / 100
        : 0;
      const montant_ht_apres_remise = montant_ht_ligne - remise_ligne;
      const montant_apres_remise_globale =
        montant_ht_apres_remise * (1 - remiseGlobale / 100);
      const tva_ligne = (montant_apres_remise_globale * item.tva_taux) / 100;
      total_tva += tva_ligne;
    });

    const total_ttc = total_ht + total_tva;

    return {
      total_ht: Number(total_ht.toFixed(2)),
      total_tva: Number(total_tva.toFixed(2)),
      total_ttc: Number(total_ttc.toFixed(2)),
      total_remise: Number(total_remise.toFixed(2)),
      nombre_articles: items.reduce((sum, item) => sum + item.quantite, 0),
    };
  }, [items, remiseGlobale]);

  return {
    items,
    clientId,
    remiseGlobale,
    totals,
    addItem,
    removeItem,
    updateQuantity,
    applyItemDiscount,
    setClientId,
    setRemiseGlobale,
    clearCart,
  };
}
