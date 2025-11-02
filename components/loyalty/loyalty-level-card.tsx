import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import type { NiveauFidelite } from "@/hooks/use-loyalty-levels";

export interface LoyaltyLevelCardProps {
    level: NiveauFidelite;
    onEdit: (level: NiveauFidelite) => void;
    onDelete: (level: NiveauFidelite) => void;
}

export function LoyaltyLevelCard({
    level,
    onEdit,
    onDelete,
}: LoyaltyLevelCardProps) {
    return (
        <Card className="group overflow-hidden hover:shadow-md transition-all duration-200 border-black/8">
            <div
                className="h-2"
                style={{ backgroundColor: level.couleur }}
            />
            <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-[18px] font-semibold tracking-[-0.01em] mb-1">
                            {level.nom}
                        </h3>
                        {level.description && (
                            <p className="text-[14px] text-black/60 line-clamp-2">
                                {level.description}
                            </p>
                        )}
                    </div>
                    <Badge
                        variant="outline"
                        className={
                            level.actif
                                ? "bg-black/5 text-black border-black/10"
                                : "bg-black/2 text-black/40 border-black/5"
                        }
                    >
                        {level.actif ? "Actif" : "Inactif"}
                    </Badge>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[13px] text-black/60">
                            Seuil de points
                        </span>
                        <span className="text-[14px] font-medium">
                            {level.seuilPoints} pts
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[13px] text-black/60">
                            Remise
                        </span>
                        <span className="text-[14px] font-medium">
                            {Number(level.remise)}%
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[13px] text-black/60">
                            Ordre
                        </span>
                        <span className="text-[14px] font-medium">
                            {level.ordre}
                        </span>
                    </div>
                </div>

                <div className="pt-4 border-t border-black/5 flex gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(level)}
                        className="flex-1 border-black/10 hover:bg-black/5 h-9 text-[13px]"
                    >
                        <Edit
                            className="h-3.5 w-3.5 mr-1.5"
                            strokeWidth={2}
                        />
                        Modifier
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDelete(level)}
                        className="border-black/10 hover:bg-black/5 h-9 px-3"
                    >
                        <Trash2
                            className="h-3.5 w-3.5"
                            strokeWidth={2}
                        />
                    </Button>
                </div>
            </div>
        </Card>
    );
}
