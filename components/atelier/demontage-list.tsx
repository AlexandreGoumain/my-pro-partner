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
      <div className="text-center py-12 border border-black/[0.08] rounded-lg bg-white">
        <p className="text-[13px] text-black/60">
          Aucun démontage effectué pour le moment
        </p>
      </div>
    );
  }

  return (
    <div className="border border-black/[0.08] rounded-lg overflow-hidden bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-black/[0.02] hover:bg-black/[0.02]">
            <TableHead className="text-[13px] font-medium text-black/70">
              Date
            </TableHead>
            <TableHead className="text-[13px] font-medium text-black/70">
              Article source
            </TableHead>
            <TableHead className="text-[13px] font-medium text-black/70">
              Motif
            </TableHead>
            <TableHead className="text-[13px] font-medium text-black/70 text-right">
              Pièces récupérées
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {demontages.map((demontage: any) => (
            <TableRow key={demontage.id} className="hover:bg-black/[0.02] transition-colors">
              <TableCell className="text-[13px] text-black/70">
                {format(new Date(demontage.dateDemontage), "d MMM yyyy", {
                  locale: fr,
                })}
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-[13px] font-medium text-black">
                    {demontage.articleSource?.nom}
                  </p>
                  <p className="text-[12px] text-black/60 font-mono">
                    {demontage.articleSource?.reference}
                  </p>
                </div>
              </TableCell>
              <TableCell className="text-[13px] text-black/70">
                {demontage.motif || "-"}
              </TableCell>
              <TableCell className="text-right">
                <Badge variant="outline" className="bg-black/5 text-black/70 border-black/10 text-[12px] h-6 px-3 font-medium">
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
