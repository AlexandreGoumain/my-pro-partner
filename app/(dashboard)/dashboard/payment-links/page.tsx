"use client";

import {
    CreatePaymentLinkDialog,
    PaymentLinkStats,
    PaymentLinkStatsDialog,
    PaymentLinksList,
} from "@/components/payment-links";
import { PageHeader } from "@/components/ui/page-header";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { usePaymentLinksPage } from "@/hooks/use-payment-links-page";
import { Plus } from "lucide-react";

export default function PaymentLinksPage() {
    const {
        paymentLinks,
        isLoading,
        createDialogOpen,
        statsDialogOpen,
        selectedLink,
        totalLinks,
        totalViews,
        totalPayments,
        totalRevenue,
        handleCreateClick,
        handleCreateClose,
        handleViewStats,
        handleStatsClose,
        createPaymentLink,
        toggleActive,
        deletePaymentLink,
        copyLink,
        getTauxConversion,
    } = usePaymentLinksPage();

    return (
        <div className="space-y-6">
            <PageHeader
                title="Liens de Paiement"
                description="Créez et partagez des liens de paiement avec vos clients"
                actions={
                    <PrimaryActionButton
                        icon={Plus}
                        onClick={handleCreateClick}
                    >
                        Nouveau lien
                    </PrimaryActionButton>
                }
            />

            <PaymentLinkStats
                totalLinks={totalLinks}
                totalViews={totalViews}
                totalPayments={totalPayments}
                totalRevenue={totalRevenue}
            />

            <PaymentLinksList
                links={paymentLinks}
                isLoading={isLoading}
                onCopy={copyLink}
                onViewStats={handleViewStats}
                onToggleActive={toggleActive}
                onDelete={deletePaymentLink}
                onCreate={handleCreateClick}
                getTauxConversion={getTauxConversion}
            />

            <CreatePaymentLinkDialog
                open={createDialogOpen}
                onOpenChange={handleCreateClose}
                onSubmit={createPaymentLink}
            />

            <PaymentLinkStatsDialog
                open={statsDialogOpen}
                onOpenChange={handleStatsClose}
                link={selectedLink}
                onCopyLink={copyLink}
                getTauxConversion={getTauxConversion}
            />
        </div>
    );
}
