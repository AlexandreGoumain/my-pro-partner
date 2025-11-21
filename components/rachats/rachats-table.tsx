import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { RachatTableRow } from "./rachat-table-row";

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

export interface RachatsTableProps {
    rachats: Rachat[];
    onView?: (id: string) => void;
    onDelete: (id: string) => void;
}

export function RachatsTable({ rachats, onView, onDelete }: RachatsTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow className="border-black/8 hover:bg-transparent">
                    <TableHead className="text-black/60 font-medium">Article</TableHead>
                    <TableHead className="text-black/60 font-medium">État</TableHead>
                    <TableHead className="text-black/60 font-medium">
                        Prix rachat
                    </TableHead>
                    <TableHead className="text-black/60 font-medium">
                        Prix vente
                    </TableHead>
                    <TableHead className="text-black/60 font-medium">Client</TableHead>
                    <TableHead className="text-black/60 font-medium">Date</TableHead>
                    <TableHead className="text-right text-black/60 font-medium">
                        Actions
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rachats.map((rachat) => (
                    <RachatTableRow
                        key={rachat.id}
                        rachat={rachat}
                        onView={onView}
                        onDelete={onDelete}
                    />
                ))}
            </TableBody>
        </Table>
    );
}
