/**
 * État vide pour la liste du personnel
 * Affiche un message quand aucun employé n'est trouvé
 */

import { EmptyState } from "@/components/ui/empty-state";
import { Users } from "lucide-react";

export interface PersonnelEmptyStateProps {
    onAddClick: () => void;
}

export function PersonnelEmptyState({ onAddClick }: PersonnelEmptyStateProps) {
    return (
        <EmptyState
            icon={Users}
            title="Aucun employé"
            description="Commencez par ajouter votre premier employé"
            action={{
                label: "Ajouter un employé",
                onClick: onAddClick,
            }}
            iconSize="md"
        />
    );
}
