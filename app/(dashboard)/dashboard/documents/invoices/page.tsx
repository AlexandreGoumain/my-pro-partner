"use client";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Receipt, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DataTable } from "./_components/data-table";
import { createColumns, Invoice } from "./_components/data-table/columns";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { AddPaymentDialog } from "@/components/add-payment-dialog";

export default function InvoicesPage() {
    const router = useRouter();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/documents?type=FACTURE");
            if (!response.ok) throw new Error("Erreur lors du chargement des factures");

            const data = await response.json();
            setInvoices(data.documents || []);
        } catch (error) {
            console.error("Error fetching invoices:", error);
            toast.error("Impossible de charger les factures");
        } finally {
            setIsLoading(false);
        }
    };

    const handleView = (invoice: Invoice) => {
        router.push(`/dashboard/documents/invoices/${invoice.id}`);
    };

    const handleEdit = (invoice: Invoice) => {
        router.push(`/dashboard/documents/invoices/${invoice.id}`);
    };

    const handleDelete = async (invoice: Invoice) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cette facture ?")) return;

        try {
            const response = await fetch(`/api/documents/${invoice.id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Erreur lors de la suppression");

            toast.success("Facture supprimée avec succès");
            fetchInvoices();
        } catch (error) {
            console.error("Error deleting invoice:", error);
            toast.error("Impossible de supprimer la facture");
        }
    };

    const handleAddPayment = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setIsPaymentDialogOpen(true);
    };

    const handlePaymentSuccess = () => {
        setIsPaymentDialogOpen(false);
        setSelectedInvoice(null);
        fetchInvoices();
    };

    const handleCreateInvoice = () => {
        router.push("/dashboard/documents/invoices/new");
    };

    const columns = createColumns({
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onAddPayment: handleAddPayment,
    });

    if (isLoading) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Factures"
                    description="Gérez vos factures et suivez les paiements"
                />
                <Card className="p-12 border-black/8 shadow-sm">
                    <div className="flex items-center justify-center">
                        <div className="text-[14px] text-black/40">Chargement...</div>
                    </div>
                </Card>
            </div>
        );
    }

    if (invoices.length === 0 && !isLoading) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Factures"
                    description="Gérez vos factures et suivez les paiements"
                    actions={
                        <Button
                            onClick={handleCreateInvoice}
                            className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm"
                        >
                            <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                            Nouvelle facture
                        </Button>
                    }
                />
                <EmptyState
                    icon={Receipt}
                    title="Aucune facture"
                    description="Commencez par créer votre première facture pour vos clients"
                    action={{
                        label: "Créer une facture",
                        onClick: handleCreateInvoice,
                    }}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Factures"
                description="Gérez vos factures et suivez les paiements"
                actions={
                    <Button
                        onClick={handleCreateInvoice}
                        className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm"
                    >
                        <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                        Nouvelle facture
                    </Button>
                }
            />

            <DataTable
                columns={columns}
                data={invoices}
                emptyMessage="Aucune facture trouvée"
            />

            {selectedInvoice && (
                <AddPaymentDialog
                    isOpen={isPaymentDialogOpen}
                    onClose={() => setIsPaymentDialogOpen(false)}
                    invoice={selectedInvoice}
                    onSuccess={handlePaymentSuccess}
                />
            )}
        </div>
    );
}
