import type { PaymentLink } from "@/lib/types/payment-link";
import { usePaymentLinks } from "./use-payment-links";
import { useState } from "react";

export interface PaymentLinksPageState {
    // Data
    paymentLinks: PaymentLink[];
    isLoading: boolean;

    // Dialogs
    createDialogOpen: boolean;
    statsDialogOpen: boolean;
    selectedLink: PaymentLink | null;

    // Stats
    totalLinks: number;
    totalViews: number;
    totalPayments: number;
    totalRevenue: string;

    // Handlers
    handleCreateClick: () => void;
    handleCreateClose: () => void;
    handleViewStats: (link: PaymentLink) => void;
    handleStatsClose: () => void;

    // Payment link actions
    createPaymentLink: (formData: any) => Promise<boolean>;
    toggleActive: (link: PaymentLink) => Promise<void>;
    deletePaymentLink: (link: PaymentLink) => Promise<void>;
    copyLink: (link: PaymentLink) => void;
    getTauxConversion: (link: PaymentLink) => string;
}

export function usePaymentLinksPage(): PaymentLinksPageState {
    const {
        paymentLinks,
        isLoading,
        createPaymentLink,
        toggleActive,
        deletePaymentLink,
        copyLink,
        getTauxConversion,
    } = usePaymentLinks();

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [statsDialogOpen, setStatsDialogOpen] = useState(false);
    const [selectedLink, setSelectedLink] = useState<PaymentLink | null>(null);

    // Computed stats
    const totalLinks = paymentLinks.length;
    const totalViews = paymentLinks.reduce((sum, link) => sum + link.nombreVues, 0);
    const totalPayments = paymentLinks.reduce((sum, link) => sum + link.nombrePaiements, 0);
    const totalRevenue = paymentLinks
        .reduce((sum, link) => sum + Number(link.montantCollecte), 0)
        .toFixed(0);

    // Handlers
    const handleCreateClick = () => {
        setCreateDialogOpen(true);
    };

    const handleCreateClose = () => {
        setCreateDialogOpen(false);
    };

    const handleViewStats = (link: PaymentLink) => {
        setSelectedLink(link);
        setStatsDialogOpen(true);
    };

    const handleStatsClose = () => {
        setStatsDialogOpen(false);
        setSelectedLink(null);
    };

    return {
        // Data
        paymentLinks,
        isLoading,

        // Dialogs
        createDialogOpen,
        statsDialogOpen,
        selectedLink,

        // Stats
        totalLinks,
        totalViews,
        totalPayments,
        totalRevenue,

        // Handlers
        handleCreateClick,
        handleCreateClose,
        handleViewStats,
        handleStatsClose,

        // Payment link actions
        createPaymentLink,
        toggleActive,
        deletePaymentLink,
        copyLink,
        getTauxConversion,
    };
}
