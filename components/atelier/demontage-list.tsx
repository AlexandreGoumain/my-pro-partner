"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function DemontageList() {
  const { data, isLoading } = useQuery({
    queryKey: ["demontages"],
    queryFn: async () => {
      const response = await fetch("/api/demontage");
      if (!response.ok) throw new Error("Failed to fetch demontages");
      return response.json();
    },
  });

  const demontages = data?.items || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (demontages.length === 0) {
    return (
      <div className="text-center py-12 border border-black/10 rounded-lg">
        <p className="text-[14px] text-black/60">
          Aucun démontage effectué pour le moment
        </p>
      </div>
    );
  }

  return (
    <div className="border border-black/10 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-black/2 hover:bg-black/2">
            <TableHead className="text-[13px] font-semibold text-black/60">
              Date
            </TableHead>
            <TableHead className="text-[13px] font-semibold text-black/60">
              Article source
            </TableHead>
            <TableHead className="text-[13px] font-semibold text-black/60">
              Motif
            </TableHead>
            <TableHead className="text-[13px] font-semibold text-black/60 text-right">
              Pièces récupérées
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {demontages.map((demontage: any) => (
            <TableRow key={demontage.id} className="hover:bg-black/2">
              <TableCell className="text-[13px] text-black/60">
                {format(new Date(demontage.dateDemontage), "d MMM yyyy", {
                  locale: fr,
                })}
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-[14px] font-medium text-black">
                    {demontage.articleSource?.nom}
                  </p>
                  <p className="text-[12px] text-black/40 font-mono">
                    {demontage.articleSource?.reference}
                  </p>
                </div>
              </TableCell>
              <TableCell className="text-[13px] text-black/60">
                {demontage.motif || "-"}
              </TableCell>
              <TableCell className="text-right">
                <Badge variant="outline" className="bg-black/5 border-black/10">
                  {demontage.articleSource?.piecesDetachees?.length || 0} pièces
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
