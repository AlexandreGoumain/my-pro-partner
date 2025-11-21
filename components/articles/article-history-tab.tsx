import { CardSection } from "@/components/ui/card-section";
import { EmptyState } from "@/components/ui/empty-state";
import { Clock } from "lucide-react";

export interface ArticleHistoryTabProps {
    className?: string;
}

export function ArticleHistoryTab({ className = "" }: ArticleHistoryTabProps) {
    return (
        <div className={`space-y-4 ${className}`}>
            <CardSection
                title="Timeline d'activité"
                description="Historique complet des modifications"
                className="border-black/8 shadow-sm"
                titleClassName="text-[16px]"
            >
                <EmptyState
                    icon={Clock}
                    title="L'historique des modifications sera bientôt disponible"
                    variant="minimal"
                />
            </CardSection>
        </div>
    );
}
