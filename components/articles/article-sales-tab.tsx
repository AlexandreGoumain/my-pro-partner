import { CardSection } from "@/components/ui/card-section";
import { EmptyState } from "@/components/ui/empty-state";
import { BarChart3 } from "lucide-react";

export interface ArticleSalesTabProps {
    className?: string;
}

export function ArticleSalesTab({ className = "" }: ArticleSalesTabProps) {
    return (
        <div className={`space-y-4 ${className}`}>
            <CardSection
                title="Analyse des ventes"
                description="Performance et statistiques de vente"
                className="border-black/8 shadow-sm"
                titleClassName="text-[16px]"
            >
                <EmptyState
                    icon={BarChart3}
                    title="Les statistiques de vente seront bientôt disponibles"
                    variant="minimal"
                />
            </CardSection>
        </div>
    );
}
