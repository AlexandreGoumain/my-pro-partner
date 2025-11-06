import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { TrendingUp, TrendingDown, AlertCircle, Settings } from "lucide-react";
import type { MouvementPoints } from "@/hooks/use-loyalty-points";

interface ClientLoyaltyHistoryProps {
    mouvements: MouvementPoints[];
    isLoading?: boolean;
}

const movementIcons = {
    GAIN: TrendingUp,
    DEPENSE: TrendingDown,
    EXPIRATION: AlertCircle,
    AJUSTEMENT: Settings,
};

const movementLabels = {
    GAIN: "Gain",
    DEPENSE: "Dépense",
    EXPIRATION: "Expiration",
    AJUSTEMENT: "Ajustement",
};

const movementColors = {
    GAIN: "bg-black/5 text-black/60",
    DEPENSE: "bg-black/10 text-black/70",
    EXPIRATION: "bg-black/15 text-black/80",
    AJUSTEMENT: "bg-black/8 text-black/60",
};

export function ClientLoyaltyHistory({
    mouvements,
    isLoading,
}: ClientLoyaltyHistoryProps) {
    if (isLoading) {
        return (
            <Card className="border-black/8 shadow-sm">
                <div className="p-5">
                    <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black mb-4">
                        Historique des points
                    </h3>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="animate-pulse rounded-lg bg-black/5 h-16"
                            />
                        ))}
                    </div>
                </div>
            </Card>
        );
    }

    if (!mouvements || mouvements.length === 0) {
        return (
            <Card className="border-black/8 shadow-sm">
                <div className="p-12 text-center">
                    <div className="rounded-full h-16 w-16 bg-black/5 flex items-center justify-center mx-auto mb-4">
                        <TrendingUp
                            className="w-8 h-8 text-black/40"
                            strokeWidth={2}
                        />
                    </div>
                    <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-black mb-2">
                        Aucun mouvement
                    </h3>
                    <p className="text-[14px] text-black/60">
                        L&apos;historique des points apparaîtra ici
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="border-black/8 shadow-sm">
            <div className="p-5">
                <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black mb-4">
                    Historique des points
                </h3>
                <div className="space-y-3">
                    {mouvements.map((mouvement) => {
                        const Icon = movementIcons[mouvement.type];
                        const isNegative =
                            mouvement.type === "DEPENSE" ||
                            mouvement.type === "EXPIRATION";

                        return (
                            <div
                                key={mouvement.id}
                                className="flex items-center justify-between p-3 rounded-lg border border-black/8 hover:bg-black/5 transition-colors"
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center flex-shrink-0">
                                        <Icon
                                            className="h-5 w-5 text-black/60"
                                            strokeWidth={2}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge
                                                variant="secondary"
                                                className={`border-0 text-[11px] h-5 px-2 ${movementColors[mouvement.type]}`}
                                            >
                                                {movementLabels[mouvement.type]}
                                            </Badge>
                                            <p className="text-[13px] text-black/40">
                                                {format(
                                                    new Date(mouvement.createdAt),
                                                    "dd MMM yyyy � HH:mm",
                                                    { locale: fr }
                                                )}
                                            </p>
                                        </div>
                                        {mouvement.description && (
                                            <p className="text-[14px] text-black/80 truncate">
                                                {mouvement.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0 ml-3">
                                    <p
                                        className={`text-[16px] font-semibold tracking-[-0.01em] ${
                                            isNegative
                                                ? "text-black/60"
                                                : "text-black"
                                        }`}
                                    >
                                        {isNegative ? "-" : "+"}
                                        {mouvement.points}
                                    </p>
                                    <p className="text-[12px] text-black/40">
                                        points
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Card>
    );
}
