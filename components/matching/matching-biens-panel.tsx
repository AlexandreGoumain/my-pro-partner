import { Card } from "@/components/ui/card";
import { BienMatchCard } from "./bien-match-card";
import { Users } from "lucide-react";
import type { RechercheAcquereur, BienMatch } from "@/lib/types/matching.types";

export interface MatchingBiensPanelProps {
    selectedRecherche: RechercheAcquereur | null;
    biens: BienMatch[];
    onSelectBien: (bien: BienMatch) => void;
    className?: string;
}

export function MatchingBiensPanel({
    selectedRecherche,
    biens,
    onSelectBien,
    className,
}: MatchingBiensPanelProps) {
    return (
        <div className={className}>
            <Card className="p-4 border-black/[0.08]">
                <h3 className="text-[15px] font-medium text-black mb-4">
                    {selectedRecherche
                        ? `Biens pour ${selectedRecherche.client.prenom} ${selectedRecherche.client.nom}`
                        : "Sélectionnez une recherche"
                    }
                </h3>

                {selectedRecherche ? (
                    <div className="space-y-3">
                        {biens.map((bien) => (
                            <BienMatchCard
                                key={bien.id}
                                bien={bien}
                                onSelect={onSelectBien}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Users className="w-12 h-12 text-black/10 mx-auto mb-3" />
                        <p className="text-[14px] text-black/40">
                            Cliquez sur "Trouver des biens" pour voir les matchs
                        </p>
                    </div>
                )}
            </Card>
        </div>
    );
}
