import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export interface StorePageActionsProps {
    onCreateStore: () => void;
}

export function StorePageActions({ onCreateStore }: StorePageActionsProps) {
    return (
        <Button
            onClick={onCreateStore}
            className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm"
        >
            <Plus className="h-4 w-4 mr-2" strokeWidth={2} />
            Ajouter un magasin
        </Button>
    );
}
