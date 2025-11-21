"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRachats, useDeleteRachat } from "@/hooks/use-rachats";
import { Plus, Search, RotateCcw, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const etatLabels: Record<string, string> = {
  COMME_NEUF: "Comme neuf",
  TRES_BON: "Très bon",
  BON: "Bon",
  CORRECT: "Correct",
  POUR_PIECES: "Pour pièces",
};

const etatColors: Record<string, string> = {
  COMME_NEUF: "bg-green-100 text-green-800 border-green-200",
  TRES_BON: "bg-blue-100 text-blue-800 border-blue-200",
  BON: "bg-yellow-100 text-yellow-800 border-yellow-200",
  CORRECT: "bg-orange-100 text-orange-800 border-orange-200",
  POUR_PIECES: "bg-red-100 text-red-800 border-red-200",
};

export default function RachatsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useRachats({ page, limit: 20, search });
  const deleteRachat = useDeleteRachat();

  const handleDelete = async () => {
    if (deleteId) {
      await deleteRachat.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-semibold text-black tracking-[-0.02em]">
            Rachats
          </h1>
          <p className="text-[15px] text-black/60 mt-1">
            Gérez vos rachats d'articles d'occasion
          </p>
        </div>
        <Button
          className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" strokeWidth={2} />
          Nouveau rachat
        </Button>
      </div>

      {/* Search */}
      <Card className="border-black/8 shadow-sm">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
            <Input
              placeholder="Rechercher par nom, référence ou numéro de série..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 border-black/10 focus:border-black/20"
            />
          </div>
        </CardContent>
      </Card>

      {/* Rachats List */}
      <Card className="border-black/8 shadow-sm">
        <CardHeader className="border-b border-black/8 p-6">
          <CardTitle className="text-[18px] font-semibold text-black">
            Liste des rachats
          </CardTitle>
          <CardDescription className="text-[14px] text-black/60">
            {data?.pagination.total || 0} rachat(s) enregistré(s)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin h-8 w-8 border-4 border-black/20 border-t-black rounded-full" />
            </div>
          ) : data && data.items.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-black/8 hover:bg-transparent">
                  <TableHead className="text-black/60 font-medium">Article</TableHead>
                  <TableHead className="text-black/60 font-medium">État</TableHead>
                  <TableHead className="text-black/60 font-medium">Prix rachat</TableHead>
                  <TableHead className="text-black/60 font-medium">Prix vente</TableHead>
                  <TableHead className="text-black/60 font-medium">Client</TableHead>
                  <TableHead className="text-black/60 font-medium">Date</TableHead>
                  <TableHead className="text-right text-black/60 font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((rachat) => (
                  <TableRow key={rachat.id} className="border-black/8 hover:bg-black/2">
                    <TableCell>
                      <div>
                        <div className="font-semibold text-black">{rachat.article.nom}</div>
                        <div className="text-[13px] text-black/50 font-mono">{rachat.article.reference}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${etatColors[rachat.etat]} font-medium`}
                      >
                        {etatLabels[rachat.etat]}
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
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 border-black/10 hover:bg-black/5"
                        >
                          <Eye className="h-4 w-4" strokeWidth={2} />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 border-red-200 hover:bg-red-50 text-red-600"
                          onClick={() => setDeleteId(rachat.id)}
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={2} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center">
                <RotateCcw className="h-8 w-8 text-black/40" strokeWidth={2} />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-[16px] font-semibold text-black">
                  Aucun rachat enregistré
                </h3>
                <p className="text-[14px] text-black/60 max-w-md">
                  Commencez par enregistrer votre premier rachat d'article d'occasion
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce rachat ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
