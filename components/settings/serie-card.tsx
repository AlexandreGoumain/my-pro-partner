import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SerieDocument } from "@/lib/types/settings";
import { Edit, FileText, MoreVertical, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface SerieCardProps {
    serie: SerieDocument & { _count?: { documents: number } };
    onEdit: (serie: SerieDocument) => void;
    onDelete: (serie: SerieDocument) => void;
    onToggleActive: (serie: SerieDocument) => void;
}

export function SerieCard({ serie, onEdit, onDelete, onToggleActive }: SerieCardProps) {
    const documentCount = serie._count?.documents ?? 0;

    return (
        <Card className="p-4 border-black/8 shadow-sm hover:border-black/15 transition-all duration-200">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                    {/* Icône avec couleur */}
                    <div
                        className="flex h-10 w-10 items-center justify-center rounded-md"
                        style={{
                            backgroundColor: serie.couleur
                                ? `${serie.couleur}15`
                                : "#00000008",
                        }}
                    >
                        <FileText
                            className="h-5 w-5"
                            style={{
                                color: serie.couleur || "#000000",
                                opacity: 0.6,
                            }}
                            strokeWidth={2}
                        />
                    </div>

                    {/* Infos */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-[15px] font-semibold tracking-[-0.01em] text-black">
                                {serie.nom}
                            </h4>
                            {(serie.est_defaut_devis || serie.est_defaut_factures || serie.est_defaut_avoirs) && (
                                <Badge
                                    variant="outline"
                                    className="text-[11px] h-5 px-1.5 bg-black text-white border-black"
                                >
                                    Par défaut
                                    {serie.est_defaut_devis && serie.est_defaut_factures && serie.est_defaut_avoirs
                                        ? ""
                                        : ` (${[
                                              serie.est_defaut_devis && "Devis",
                                              serie.est_defaut_factures && "Factures",
                                              serie.est_defaut_avoirs && "Avoirs",
                                          ]
                                              .filter(Boolean)
                                              .join(", ")})`}
                                </Badge>
                            )}
                            {!serie.active && (
                                <Badge
                                    variant="outline"
                                    className="text-[11px] h-5 px-1.5 bg-black/5 text-black/40 border-black/10"
                                >
                                    Désactivée
                                </Badge>
                            )}
                        </div>

                        {/* Code */}
                        <div className="mt-1">
                            <code className="text-[13px] font-mono font-semibold text-black/60">
                                {serie.code}
                            </code>
                        </div>

                        {/* Description */}
                        {serie.description && (
                            <p className="text-[13px] text-black/40 mt-1.5 line-clamp-1">
                                {serie.description}
                            </p>
                        )}

                        {/* Métadonnées */}
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <div className="flex items-center gap-1.5">
                                <span className="text-[12px] text-black/40">Format:</span>
                                <code className="text-[11px] font-mono text-black/60 bg-black/5 px-1.5 py-0.5 rounded">
                                    {serie.format_numero}
                                </code>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[12px] text-black/40">
                                    {documentCount} document{documentCount > 1 ? "s" : ""}
                                </span>
                            </div>
                        </div>

                        {/* Types supportés */}
                        <div className="flex items-center gap-1.5 mt-2">
                            {serie.pour_devis && (
                                <Badge
                                    variant="outline"
                                    className="text-[10px] h-5 px-1.5 border-black/10"
                                >
                                    Devis
                                </Badge>
                            )}
                            {serie.pour_factures && (
                                <Badge
                                    variant="outline"
                                    className="text-[10px] h-5 px-1.5 border-black/10"
                                >
                                    Factures
                                </Badge>
                            )}
                            {serie.pour_avoirs && (
                                <Badge
                                    variant="outline"
                                    className="text-[10px] h-5 px-1.5 border-black/10"
                                >
                                    Avoirs
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-black/5"
                        >
                            <MoreVertical className="h-4 w-4 text-black/40" strokeWidth={2} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => onEdit(serie)}>
                            <Edit className="h-4 w-4 mr-2" strokeWidth={2} />
                            Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onToggleActive(serie)}>
                            <FileText className="h-4 w-4 mr-2" strokeWidth={2} />
                            {serie.active ? "Désactiver" : "Activer"}
                        </DropdownMenuItem>
                        {documentCount === 0 && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => onDelete(serie)}
                                    className="text-red-600"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" strokeWidth={2} />
                                    Supprimer
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </Card>
    );
}
