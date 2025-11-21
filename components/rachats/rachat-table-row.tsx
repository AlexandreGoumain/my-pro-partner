import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { ETAT_COLORS, ETAT_LABELS } from "@/lib/constants/rachats";
import { Eye, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Rachat {
    id: string;
    etat: string;
    prixRachat: number;
    dateRachat: Date | string;
    article: {
        nom: string;
        reference: string;
        prix_ht: number;
    };
    client?: {
        nom: string;
    } | null;
}

export interface RachatTableRowProps {
    rachat: Rachat;
    onView?: (id: string) => void;
    onDelete: (id: string) => void;
}

export function RachatTableRow({ rachat, onView, onDelete }: RachatTableRowProps) {
    return (
        <TableRow className="border-black/8 hover:bg-black/2">
            <TableCell>
                <div>
                    <div className="font-semibold text-black">{rachat.article.nom}</div>
                    <div className="text-[13px] text-black/50 font-mono">
                        {rachat.article.reference}
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <Badge
                    variant="outline"
                    className={`${ETAT_COLORS[rachat.etat]} font-medium`}
                >
                    {ETAT_LABELS[rachat.etat]}
                </Badge>
            </TableCell>
            <TableCell className="font-semibold text-black">
                {Number(rachat.prixRachat).toFixed(2)} €
            </TableCell>
            <TableCell className="font-semibold text-black">
                {Number(rachat.article.prix_ht).toFixed(2)} €
            </TableCell>
            <TableCell className="text-black/70">
                {rachat.client?.nom || "-"}
            </TableCell>
            <TableCell className="text-black/70">
                {format(new Date(rachat.dateRachat), "dd MMM yyyy", {
                    locale: fr,
                })}
            </TableCell>
            <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                    {onView && (
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 border-black/10 hover:bg-black/5"
                            onClick={() => onView(rachat.id)}
                        >
                            <Eye className="h-4 w-4" strokeWidth={2} />
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 border-red-200 hover:bg-red-50 text-red-600"
                        onClick={() => onDelete(rachat.id)}
                    >
                        <Trash2 className="h-4 w-4" strokeWidth={2} />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}
