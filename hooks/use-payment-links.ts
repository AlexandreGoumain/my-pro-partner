import type {
    PaymentLink,
    PaymentLinkFormData,
} from "@/lib/types/payment-link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function usePaymentLinks() {
    const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadPaymentLinks();
    }, []);

    const loadPaymentLinks = async () => {
        try {
            const res = await fetch("/api/payment-link");
            const data = await res.json();
            setPaymentLinks(data.paymentLinks || []);
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors du chargement des liens");
        } finally {
            setIsLoading(false);
        }
    };

    const createPaymentLink = async (formData: PaymentLinkFormData) => {
        try {
            const res = await fetch("/api/payment-link", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error);
            }

            toast.success("Lien créé avec succès !");
            await loadPaymentLinks();
            return true;
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Erreur lors de la création");
            return false;
        }
    };

    const toggleActive = async (link: PaymentLink) => {
        try {
            const res = await fetch(
                `/api/payment-link/${link.id}/toggle-active`,
                {
                    method: "POST",
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error);
            }

            toast.success(data.actif ? "Lien activé" : "Lien désactivé");
            await loadPaymentLinks();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Erreur");
        }
    };

    const deletePaymentLink = async (link: PaymentLink) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer "${link.titre}" ?`)) {
            return;
        }

        try {
            const res = await fetch(`/api/payment-link/${link.id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error);
            }

            toast.success("Lien supprimé");
            await loadPaymentLinks();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Erreur");
        }
    };

    const copyLink = (link: PaymentLink) => {
        const url = `${window.location.origin}/payment-link/${link.slug}`;
        navigator.clipboard.writeText(url);
        toast.success("Lien copié !");
    };

    const getTauxConversion = (link: PaymentLink): string => {
        if (link.nombreVues === 0) return "0";
        return ((link.nombrePaiements / link.nombreVues) * 100).toFixed(1);
    };

    return {
        paymentLinks,
        isLoading,
        createPaymentLink,
        toggleActive,
        deletePaymentLink,
        copyLink,
        getTauxConversion,
    };
}
