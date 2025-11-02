"use client";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { FileText, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DataTable } from "./_components/data-table";
import { createColumns, Quote } from "./_components/data-table/columns";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

export default function QuotesPage() {
    const router = useRouter();
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchQuotes();
    }, []);

    const fetchQuotes = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/documents?type=DEVIS");
            if (!response.ok) throw new Error("Erreur lors du chargement des devis");

            const data = await response.json();
            setQuotes(data.documents || []);
        } catch (error) {
            console.error("Error fetching quotes:", error);
            toast.error("Impossible de charger les devis");
        } finally {
            setIsLoading(false);
        }
    };

    const handleView = (quote: Quote) => {
        router.push(`/dashboard/documents/quotes/${quote.id}`);
    };

    const handleEdit = (quote: Quote) => {
        router.push(`/dashboard/documents/quotes/${quote.id}`);
    };

    const handleDelete = async (quote: Quote) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce devis ?")) return;

        try {
            const response = await fetch(`/api/documents/${quote.id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Erreur lors de la suppression");

            toast.success("Devis supprimé avec succès");
            fetchQuotes();
        } catch (error) {
            console.error("Error deleting quote:", error);
            toast.error("Impossible de supprimer le devis");
        }
    };

    const handleConvertToInvoice = async (quote: Quote) => {
        try {
            const response = await fetch(`/api/documents/${quote.id}/convert`, {
                method: "POST",
            });

            if (!response.ok) throw new Error("Erreur lors de la conversion");

            const data = await response.json();
            toast.success("Devis converti en facture avec succès");
            router.push(`/dashboard/documents/invoices/${data.invoice.id}`);
        } catch (error) {
            console.error("Error converting quote:", error);
            toast.error("Impossible de convertir le devis");
        }
    };

    const handleCreateQuote = () => {
        router.push("/dashboard/documents/quotes/new");
    };

    const columns = createColumns({
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onConvertToInvoice: handleConvertToInvoice,
    });

    if (isLoading) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Devis"
                    description="Gérez vos devis et convertissez-les en factures"
                />
                <Card className="p-12 border-black/8 shadow-sm">
                    <div className="flex items-center justify-center">
                        <div className="text-[14px] text-black/40">Chargement...</div>
                    </div>
                </Card>
            </div>
        );
    }

    if (quotes.length === 0 && !isLoading) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Devis"
                    description="Gérez vos devis et convertissez-les en factures"
                    actions={
                        <Button
                            onClick={handleCreateQuote}
                            className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm"
                        >
                            <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                            Nouveau devis
                        </Button>
                    }
                />
                <EmptyState
                    icon={FileText}
                    title="Aucun devis"
                    description="Commencez par créer votre premier devis pour vos clients"
                    action={{
                        label: "Créer un devis",
                        onClick: handleCreateQuote,
                    }}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Devis"
                description="Gérez vos devis et convertissez-les en factures"
                actions={
                    <Button
                        onClick={handleCreateQuote}
                        className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm"
                    >
                        <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                        Nouveau devis
                    </Button>
                }
            />

            <DataTable
                columns={columns}
                data={quotes}
                emptyMessage="Aucun devis trouvé"
            />
        </div>
    );
}
