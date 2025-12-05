import { Card } from "@/components/ui/card";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BienMatch } from "@/lib/types/matching.types";

export interface BienMatchCardProps {
    bien: BienMatch;
    onSelect: (bien: BienMatch) => void;
    className?: string;
}

export function BienMatchCard({ bien, onSelect, className }: BienMatchCardProps) {
    return (
        <Card
            className={cn(
                "p-4 border-black/[0.08] hover:border-black/20 transition-all cursor-pointer",
                className
            )}
            onClick={() => onSelect(bien)}
        >
            <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-black/5 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <Home className="w-8 h-8 text-black/20" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[12px] text-black/40">{bien.reference}</span>
                        <div className={cn(
                            "text-[12px] font-medium px-2 py-0.5 rounded",
                            bien.score >= 90 ? "bg-emerald-100 text-emerald-700" :
                            bien.score >= 70 ? "bg-amber-100 text-amber-700" :
                            "bg-black/5 text-black/60"
                        )}>
                            {bien.score}% match
                        </div>
                    </div>
                    <h4 className="text-[14px] font-medium text-black line-clamp-1 mb-1">
                        {bien.titre}
                    </h4>
                    <div className="flex items-center gap-3 text-[12px] text-black/40">
                        <span>{bien.ville}</span>
                        <span>{bien.surface} m²</span>
                        {bien.nbPieces && <span>{bien.nbPieces} pièces</span>}
                    </div>
                    <p className="text-[14px] font-medium text-black mt-2">
                        {bien.prix.toLocaleString("fr-FR")} €
                    </p>
                </div>
            </div>
        </Card>
    );
}
