import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { usePOSCart } from "@/hooks/use-pos-cart";
import { POSArticle, PaymentMethod } from "@/lib/types/pos";

export interface UsePOSPageReturn {
    // Articles data
    articles: POSArticle[];
    filteredArticles: POSArticle[];
    loading: boolean;

    // Search
    search: string;
    setSearch: (search: string) => void;

    // Cart
    cart: ReturnType<typeof usePOSCart>;

    // Payment
    processing: boolean;
    terminalDialogOpen: boolean;
    setTerminalDialogOpen: (open: boolean) => void;
    handleCheckout: (paymentMethod: PaymentMethod) => Promise<void>;
    handleTerminalSuccess: (documentId: string) => void;
}

export function usePOSPage(): UsePOSPageReturn {
    const [articles, setArticles] = useState<POSArticle[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [terminalDialogOpen, setTerminalDialogOpen] = useState(false);

    const cart = usePOSCart();

    // Charger les articles
    useEffect(() => {
        loadArticles();
    }, []);

    const loadArticles = async () => {
        try {
            const res = await fetch("/api/articles?actif=true&limit=100");
            if (!res.ok) {
                throw new Error("Erreur lors du chargement des articles");
            }
            const data = await res.json();
            setArticles(data.articles || []);
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors du chargement des articles");
        } finally {
            setLoading(false);
        }
    };

    // Filtrer les articles
    const filteredArticles = useMemo(() => {
        if (search.trim() === "") {
            return articles;
        }

        const searchLower = search.toLowerCase();
        return articles.filter(
            (article) =>
                article.nom.toLowerCase().includes(searchLower) ||
                article.reference.toLowerCase().includes(searchLower)
        );
    }, [search, articles]);

    // Gérer le paiement
    const handleCheckout = async (paymentMethod: PaymentMethod) => {
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
                throw new Error(data.error || "Erreur lors de l'encaissement");
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

    // Gérer le succès du paiement par terminal
    const handleTerminalSuccess = (documentId: string) => {
        // Ouvrir le ticket
        window.open(`/api/pos/ticket/${documentId}`, "_blank");

        // Vider le panier
        cart.clearCart();
    };

    return {
        articles,
        filteredArticles,
        loading,
        search,
        setSearch,
        cart,
        processing,
        terminalDialogOpen,
        setTerminalDialogOpen,
        handleCheckout,
        handleTerminalSuccess,
    };
}
