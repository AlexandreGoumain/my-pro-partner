"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Award, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface LoyaltyLevelInfo {
    nom: string;
    couleur: string;
    seuilPoints: number;
}

export interface LoyaltyProgressWidgetProps {
    currentLevel: LoyaltyLevelInfo | null;
    nextLevel: LoyaltyLevelInfo | null;
    currentPoints: number;
    className?: string;
}

/**
 * Loyalty progress widget showing progress to next level
 */
export function LoyaltyProgressWidget({
    currentLevel,
    nextLevel,
    currentPoints,
    className,
}: LoyaltyProgressWidgetProps) {
    const router = useRouter();

    // Calculate progress
    const currentThreshold = currentLevel?.seuilPoints || 0;
    const nextThreshold = nextLevel?.seuilPoints || currentThreshold;
    const pointsInLevel = currentPoints - currentThreshold;
    const pointsNeeded = nextThreshold - currentThreshold;
    const progress =
        pointsNeeded > 0
            ? Math.min(100, Math.max(0, (pointsInLevel / pointsNeeded) * 100))
            : 100;
    const pointsRemaining = Math.max(0, nextThreshold - currentPoints);

    // If no loyalty program or already at max level
    if (!currentLevel) {
        return (
            <div
                className={cn(
                    "border border-black/8 rounded-lg p-5",
                    className
                )}
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                        <Award
                            className="h-5 w-5 text-black/60"
                            strokeWidth={2}
                        />
                    </div>
                    <div>
                        <h2 className="text-[15px] font-medium text-black">
                            Programme de fidélité
                        </h2>
                        <p className="text-[13px] text-black/40">
                            Commencez à cumuler des points
                        </p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/client/fidelite")}
                    className="w-full border-black/10 hover:bg-black/5"
                >
                    Découvrir le programme
                    <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>
        );
    }

    return (
        <div className={cn("border border-black/8 rounded-lg p-5", className)}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[15px] font-medium text-black">
                    Progression fidélité
                </h2>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/client/fidelite")}
                    className="text-[13px] text-black/50 hover:text-black"
                >
                    Voir avantages
                    <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>

            {/* Progress bar */}
            <div className="space-y-3">
                {/* Level names */}
                <div className="flex items-center justify-between text-[12px]">
                    <span
                        className="font-medium"
                        style={{ color: currentLevel.couleur || "#000" }}
                    >
                        {currentLevel.nom}
                    </span>
                    {nextLevel && (
                        <span
                            className="font-medium"
                            style={{ color: nextLevel.couleur || "#000" }}
                        >
                            {nextLevel.nom}
                        </span>
                    )}
                </div>

                {/* Progress bar track */}
                <div className="relative h-2 bg-black/5 rounded-full overflow-hidden">
                    <div
                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
                        style={{
                            width: `${progress}%`,
                            backgroundColor: currentLevel.couleur || "#000",
                        }}
                    />
                </div>

                {/* Points remaining */}
                <div className="flex items-center justify-between text-[12px] text-black/40">
                    <span>
                        {new Intl.NumberFormat("fr-FR").format(currentPoints)}{" "}
                        pts
                    </span>
                    {nextLevel && pointsRemaining > 0 ? (
                        <span>
                            {new Intl.NumberFormat("fr-FR").format(
                                pointsRemaining
                            )}{" "}
                            pts restants
                        </span>
                    ) : (
                        <span className="text-black/60 font-medium">
                            Niveau maximum atteint
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
