import type { PaymentLink } from "@/lib/types/payment-link";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";
import { PaymentLinkCard } from "./payment-link-card";
import { Link2, Plus } from "lucide-react";

export interface PaymentLinksListProps {
    links: PaymentLink[];
    isLoading: boolean;
    onCopy: (link: PaymentLink) => void;
    onViewStats: (link: PaymentLink) => void;
    onToggleActive: (link: PaymentLink) => void;
    onDelete: (link: PaymentLink) => void;
    onCreate: () => void;
    getTauxConversion: (link: PaymentLink) => string;
}

export function PaymentLinksList({
    links,
    isLoading,
    onCopy,
    onViewStats,
    onToggleActive,
    onDelete,
    onCreate,
    getTauxConversion,
}: PaymentLinksListProps) {
    if (isLoading) {
        return <LoadingState minHeight="sm" className="py-12" />;
    }

    if (links.length === 0) {
        return (
            <EmptyState
                icon={Link2}
                title="Aucun lien de paiement"
                description="Créez votre premier lien pour commencer à accepter des paiements"
                action={{
                    label: "Créer un lien",
                    onClick: onCreate,
                }}
            />
        );
    }

    const handleViewPage = (link: PaymentLink) => {
        window.open(`/payment-link/${link.slug}`, "_blank");
    };

    return (
        <div className="space-y-3">
            {links.map((link) => (
                <PaymentLinkCard
                    key={link.id}
                    link={link}
                    onCopy={onCopy}
                    onViewPage={handleViewPage}
                    onViewStats={onViewStats}
                    onToggleActive={onToggleActive}
                    onDelete={onDelete}
                    getTauxConversion={getTauxConversion}
                />
            ))}
        </div>
    );
}
