import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, TrendingUp } from "lucide-react";
import type { NiveauFidelite } from "@/hooks/use-loyalty-levels";

interface ClientLoyaltyProgressProps {
    currentLevel: NiveauFidelite | null;
    nextLevel: {
        nextLevel: NiveauFidelite;
        pointsNeeded: number;
        currentPoints: number;
        progress: number;
    } | null;
    points: number;
}

export function ClientLoyaltyProgress({
    currentLevel,
    nextLevel,
    points,
}: ClientLoyaltyProgressProps) {
    if (!nextLevel) {
        return (
            <Card className="border-black/8 shadow-sm">
                <div className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                            <Award
                                className="h-5 w-5 text-black/60"
                                strokeWidth={2}
                            />
                        </div>
                        <div>
                            <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black">
                                Niveau maximum atteint !
                            </h3>
                            <p className="text-[13px] text-black/40">
                                Félicitations pour votre fidélité
                            </p>
                        </div>
                    </div>
                    <div className="rounded-lg bg-black/5 p-4 text-center">
                        <p className="text-[14px] text-black/60">
                            Vous avez atteint le niveau le plus élevé avec{" "}
                            <span className="font-semibold text-black">
                                {points} points
                            </span>
                        </p>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="border-black/8 shadow-sm">
            <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                        <TrendingUp
                            className="h-5 w-5 text-black/60"
                            strokeWidth={2}
                        />
                    </div>
                    <div>
                        <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black">
                            Progression vers le prochain niveau
                        </h3>
                        <p className="text-[13px] text-black/40">
                            {nextLevel.pointsNeeded} points restants
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between text-[13px]">
                        <span className="text-black/60">
                            {currentLevel?.nom || "Débutant"}
                        </span>
                        <span className="font-medium text-black">
                            {nextLevel.nextLevel.nom}
                        </span>
                    </div>

                    <Progress value={nextLevel.progress} className="h-2" />

                    <div className="flex items-center justify-between text-[13px]">
                        <span className="text-black/40">
                            {nextLevel.currentPoints} points
                        </span>
                        <span className="text-black/40">
                            {nextLevel.nextLevel.seuilPoints} points
                        </span>
                    </div>
                </div>

                <div className="mt-4 rounded-lg bg-black/5 p-3">
                    <p className="text-[13px] text-black/60 text-center">
                        <span className="font-semibold text-black">
                            {Math.round(nextLevel.progress)}%
                        </span>{" "}
                        complété
                    </p>
                </div>
            </div>
        </Card>
    );
}
