import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export interface LoyaltyLevelHeaderProps {
    onCreateClick: () => void;
}

export function LoyaltyLevelHeader({ onCreateClick }: LoyaltyLevelHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-[24px] font-bold tracking-[-0.02em]">
                    Niveaux de fidélité
                </h2>
                <p className="text-[14px] text-black/60">
                    Configurez les niveaux de votre programme de fidélité
                </p>
            </div>
            <Button
                onClick={onCreateClick}
                className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm cursor-pointer"
            >
                <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                Ajouter un niveau
            </Button>
        </div>
    );
}
