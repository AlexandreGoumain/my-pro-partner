import type { PaymentLink } from "@/lib/types/payment-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Copy,
    ExternalLink,
    BarChart3,
    ToggleLeft,
    ToggleRight,
    Trash2,
} from "lucide-react";

export interface PaymentLinkCardProps {
    link: PaymentLink;
    onCopy: (link: PaymentLink) => void;
    onViewPage: (link: PaymentLink) => void;
    onViewStats: (link: PaymentLink) => void;
    onToggleActive: (link: PaymentLink) => void;
    onDelete: (link: PaymentLink) => void;
    getTauxConversion: (link: PaymentLink) => string;
}

export function PaymentLinkCard({
    link,
    onCopy,
    onViewPage,
    onViewStats,
    onToggleActive,
    onDelete,
    getTauxConversion,
}: PaymentLinkCardProps) {
    return (
        <Card className="p-4 border-black/8 hover:border-black/12 transition-colors">
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-[16px] font-semibold text-black truncate">
                            {link.titre}
                        </h3>
                        <Badge
                            variant={link.actif ? "default" : "secondary"}
                            className="shrink-0"
                        >
                            {link.actif ? "Actif" : "Inactif"}
                        </Badge>
                    </div>

                    {link.description && (
                        <p className="text-[13px] text-black/60 mb-3 line-clamp-2">
                            {link.description}
                        </p>
                    )}

                    <div className="flex items-center gap-6">
                        <div>
                            <div className="text-[12px] text-black/40">
                                Montant
                            </div>
                            <div className="text-[15px] font-semibold text-black">
                                {Number(link.montant).toFixed(2)}€
                            </div>
                        </div>
                        <div>
                            <div className="text-[12px] text-black/40">Vues</div>
                            <div className="text-[15px] font-semibold text-black">
                                {link.nombreVues}
                            </div>
                        </div>
                        <div>
                            <div className="text-[12px] text-black/40">
                                Paiements
                            </div>
                            <div className="text-[15px] font-semibold text-green-600">
                                {link.nombrePaiements}
                            </div>
                        </div>
                        <div>
                            <div className="text-[12px] text-black/40">
                                Conversion
                            </div>
                            <div className="text-[15px] font-semibold text-black">
                                {getTauxConversion(link)}%
                            </div>
                        </div>
                        <div>
                            <div className="text-[12px] text-black/40">CA</div>
                            <div className="text-[15px] font-semibold text-black">
                                {Number(link.montantCollecte).toFixed(0)}€
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 shrink-0">
                    <Button
                        onClick={() => onCopy(link)}
                        variant="outline"
                        size="sm"
                        className="border-black/10 hover:bg-black/5"
                        title="Copier le lien"
                    >
                        <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                        onClick={() => onViewPage(link)}
                        variant="outline"
                        size="sm"
                        className="border-black/10 hover:bg-black/5"
                        title="Voir la page"
                    >
                        <ExternalLink className="h-3 w-3" />
                    </Button>
                    <Button
                        onClick={() => onViewStats(link)}
                        variant="outline"
                        size="sm"
                        className="border-black/10 hover:bg-black/5"
                        title="Statistiques"
                    >
                        <BarChart3 className="h-3 w-3" />
                    </Button>
                    <Button
                        onClick={() => onToggleActive(link)}
                        variant="outline"
                        size="sm"
                        className="border-black/10 hover:bg-black/5"
                        title={link.actif ? "Désactiver" : "Activer"}
                    >
                        {link.actif ? (
                            <ToggleRight className="h-3 w-3" />
                        ) : (
                            <ToggleLeft className="h-3 w-3" />
                        )}
                    </Button>
                    <Button
                        onClick={() => onDelete(link)}
                        variant="outline"
                        size="sm"
                        className="border-black/10 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                        title="Supprimer"
                    >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}
