import { EmptyState } from "@/components/ui/empty-state";
import { RotateCcw } from "lucide-react";

export function RachatsEmptyState() {
    return (
        <EmptyState
            icon={RotateCcw}
            title="Aucun rachat enregistré"
            description="Commencez par enregistrer votre premier rachat d'article d'occasion"
            variant="minimal"
            iconSize="lg"
        />
    );
}
