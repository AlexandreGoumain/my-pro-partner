import { Card } from "@/components/ui/card";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { ArticleCardSkeleton } from "@/components/skeletons";
import { LoyaltyLevelCard } from "./loyalty-level-card";
import { Award, Plus } from "lucide-react";
import type { NiveauFidelite } from "@/hooks/use-loyalty-levels";

export interface LoyaltyLevelGridProps {
    levels: NiveauFidelite[];
    isLoading: boolean;
    onEdit: (level: NiveauFidelite) => void;
    onDelete: (level: NiveauFidelite) => void;
    onCreate: () => void;
}

export function LoyaltyLevelGrid({
    levels,
    isLoading,
    onEdit,
    onDelete,
    onCreate,
}: LoyaltyLevelGridProps) {
    if (isLoading) {
        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <ArticleCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (levels.length === 0) {
        return (
            <Card className="p-12 border-black/8">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="rounded-full p-6 bg-black/5">
                        <Award
                            className="w-12 h-12 text-black/40"
                            strokeWidth={2}
                        />
                    </div>
                    <div>
                        <h3 className="text-[18px] font-semibold mb-2 tracking-[-0.01em]">
                            Aucun niveau de fidélité
                        </h3>
                        <p className="text-[14px] text-black/60 max-w-md">
                            Créez votre premier niveau de fidélité pour
                            commencer à récompenser vos clients.
                        </p>
                    </div>
                    <PrimaryActionButton icon={Plus} onClick={onCreate}>
                        Créer un niveau
                    </PrimaryActionButton>
                </div>
            </Card>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {levels.map((level) => (
                <LoyaltyLevelCard
                    key={level.id}
                    level={level}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
