import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Star, AlertCircle, Gift } from "lucide-react";
import type { NiveauFidelite } from "@/hooks/use-loyalty-levels";

interface ClientLoyaltyOverviewProps {
    points: number;
    niveau: NiveauFidelite | null;
    pointsExpiringSoon?: number;
}

export function ClientLoyaltyOverview({
    points,
    niveau,
    pointsExpiringSoon = 0,
}: ClientLoyaltyOverviewProps) {
    return (
        <div className="grid gap-5 md:grid-cols-3">
            {/* Current Level Card */}
            <Card className="border-black/8 shadow-sm">
                <div className="p-5">
                    <div className="flex items-center gap-3">
                        <div
                            className="h-10 w-10 rounded-lg flex items-center justify-center"
                            style={{
                                backgroundColor: niveau
                                    ? `${niveau.couleur}15`
                                    : "#00000008",
                            }}
                        >
                            <Award
                                className="h-5 w-5"
                                strokeWidth={2}
                                style={{
                                    color: niveau ? niveau.couleur : "#00000060",
                                }}
                            />
                        </div>
                        <div className="flex-1">
                            <p className="text-[13px] text-black/40">
                                Niveau actuel
                            </p>
                            <div className="flex items-center gap-2">
                                <p className="text-[18px] font-semibold tracking-[-0.01em] text-black">
                                    {niveau?.nom || "Aucun"}
                                </p>
                                {niveau && niveau.remise > 0 && (
                                    <Badge
                                        variant="secondary"
                                        className="bg-black/5 text-black/60 border-0 text-[11px] h-5 px-1.5"
                                    >
                                        -{niveau.remise}%
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Points Balance Card */}
            <Card className="border-black/8 shadow-sm">
                <div className="p-5">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                            <Star
                                className="h-5 w-5 text-black/60"
                                strokeWidth={2}
                            />
                        </div>
                        <div>
                            <p className="text-[13px] text-black/40">
                                Solde de points
                            </p>
                            <p className="text-[20px] font-semibold tracking-[-0.01em] text-black">
                                {points}
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Points Expiring Soon Card */}
            <Card className="border-black/8 shadow-sm">
                <div className="p-5">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
                            {pointsExpiringSoon > 0 ? (
                                <AlertCircle
                                    className="h-5 w-5 text-black/60"
                                    strokeWidth={2}
                                />
                            ) : (
                                <Gift
                                    className="h-5 w-5 text-black/60"
                                    strokeWidth={2}
                                />
                            )}
                        </div>
                        <div>
                            <p className="text-[13px] text-black/40">
                                Expirent bientôt
                            </p>
                            <p
                                className={`text-[20px] font-semibold tracking-[-0.01em] ${
                                    pointsExpiringSoon > 0
                                        ? "text-black"
                                        : "text-black/60"
                                }`}
                            >
                                {pointsExpiringSoon}
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
