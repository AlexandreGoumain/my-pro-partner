import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { ETAT_LABELS } from "@/lib/constants/rachats";
import { RachatActions } from "./rachat-actions";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";

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
        id: string;
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
        <TableRow className="border-black/[0.08] hover:bg-black/[0.02] transition-colors">
            <TableCell>
                <div>
                    <div className="text-[13px] font-semibold text-black">{rachat.article.nom}</div>
                    <div className="text-[12px] text-black/60 font-mono">
                        {rachat.article.reference}
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <Badge
                    variant="outline"
                    className="bg-black/5 text-black/70 border-black/10 text-[12px] h-6 px-3 font-medium"
                >
                    {ETAT_LABELS[rachat.etat]}
                </Badge>
            </TableCell>
            <TableCell className="text-[13px] font-semibold text-black">
                {Number(rachat.prixRachat).toFixed(2)} €
            </TableCell>
            <TableCell className="text-[13px] font-semibold text-black">
                {Number(rachat.article.prix_ht).toFixed(2)} €
            </TableCell>
            <TableCell className="text-[13px] text-black/70">
                {rachat.client ? (
                    <Link
                        href={`/dashboard/clients/${rachat.client.id}`}
                        className="hover:text-black hover:underline transition-colors duration-200"
                    >
                        {rachat.client.nom}
                    </Link>
                ) : (
                    "-"
                )}
            </TableCell>
            <TableCell className="text-[13px] text-black/70">
                {format(new Date(rachat.dateRachat), "dd MMM yyyy", {
                    locale: fr,
                })}
            </TableCell>
            <TableCell className="text-right">
                <RachatActions
                    rachatId={rachat.id}
                    onView={onView}
                    onDelete={onDelete}
                />
            </TableCell>
        </TableRow>
    );
}
