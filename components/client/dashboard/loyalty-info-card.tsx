import { Card } from "@/components/ui/card";
import { LoyaltyLevel } from "@/lib/types/dashboard";
import { cn } from "@/lib/utils";
import { Award } from "lucide-react";

export interface LoyaltyInfoCardProps {
    loyaltyLevel: LoyaltyLevel;
    className?: string;
}

export function LoyaltyInfoCard({
    loyaltyLevel,
    className,
}: LoyaltyInfoCardProps) {
    return (
        <Card
            className={cn(
                "border-black/8 shadow-sm bg-black/[0.02]",
                className
            )}
        >
            <div className="p-6">
                <div className="flex items-start gap-4">
                    <div
                        className="h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                            backgroundColor: `${loyaltyLevel.couleur}20`,
                        }}
                    >
                        <Award
                            className="h-6 w-6"
                            strokeWidth={2}
                            style={{
                                color: loyaltyLevel.couleur,
                            }}
                        />
                    </div>
                    <div>
                        <h3 className="text-[16px] font-semibold text-black mb-1">
                            Vous êtes niveau {loyaltyLevel.nom}
                        </h3>
                        <p className="text-[14px] text-black/60">
                            Profitez de{" "}
                            <span className="font-semibold text-black">
                                {loyaltyLevel.remise}% de remise
                            </span>{" "}
                            sur vos prochains achats !
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
