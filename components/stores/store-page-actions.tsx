import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { Plus } from "lucide-react";

export interface StorePageActionsProps {
    onCreateStore: () => void;
}

export function StorePageActions({ onCreateStore }: StorePageActionsProps) {
    return (
        <PrimaryActionButton icon={Plus} onClick={onCreateStore}>
            Ajouter un magasin
        </PrimaryActionButton>
    );
}
