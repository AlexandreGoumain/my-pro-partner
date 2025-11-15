import { PrimaryActionButton } from "@/components/ui/primary-action-button";
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
            <PrimaryActionButton icon={Plus} onClick={onCreateClick}>
                Ajouter un niveau
            </PrimaryActionButton>
        </div>
    );
}
