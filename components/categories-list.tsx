"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Folder, FolderOpen, MoreHorizontal, Edit, Trash2, Package } from "lucide-react";
import type { Categorie } from "@/hooks/use-categories";
import { useDeleteCategorie } from "@/hooks/use-categories";
import { toast } from "sonner";

interface CategoriesListProps {
  categories: Categorie[];
  onEdit: (categorie: Categorie) => void;
  isLoading?: boolean;
}

export function CategoriesList({
  categories,
  onEdit,
  isLoading = false,
}: CategoriesListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deleteCategorie = useDeleteCategorie();

  // Organiser les catégories par hiérarchie
  const rootCategories = categories.filter((cat) => !cat.parentId);

  const handleDelete = () => {
    if (!deleteId) return;

    deleteCategorie.mutate(deleteId, {
      onSuccess: () => {
        toast.success("Catégorie supprimée avec succès");
        setDeleteId(null);
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Erreur lors de la suppression"
        );
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Folder className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Aucune catégorie</p>
          <p className="text-sm text-muted-foreground">
            Créez votre première catégorie pour organiser vos articles
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rootCategories.map((categorie) => (
          <CategoryCard
            key={categorie.id}
            categorie={categorie}
            onEdit={onEdit}
            onDelete={setDeleteId}
          />
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette catégorie ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La catégorie sera définitivement
              supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function CategoryCard({
  categorie,
  onEdit,
  onDelete,
}: {
  categorie: Categorie;
  onEdit: (categorie: Categorie) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = categorie.enfants.length > 0;
  const articleCount = categorie.articles.length;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setExpanded(!expanded)}
              disabled={!hasChildren}
            >
              {hasChildren ? (
                expanded ? (
                  <FolderOpen className="h-5 w-5 text-primary" />
                ) : (
                  <Folder className="h-5 w-5 text-primary" />
                )
              ) : (
                <Folder className="h-5 w-5 text-muted-foreground" />
              )}
            </Button>
            <div className="flex-1">
              <h3 className="font-semibold leading-none">{categorie.nom}</h3>
              {categorie.description && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {categorie.description}
                </p>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Ouvrir le menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(categorie)}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(categorie.id)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          {articleCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              <Package className="h-3 w-3 mr-1" />
              {articleCount} article{articleCount > 1 ? "s" : ""}
            </Badge>
          )}
          {hasChildren && (
            <Badge variant="outline" className="text-xs">
              {categorie.enfants.length} sous-catégorie
              {categorie.enfants.length > 1 ? "s" : ""}
            </Badge>
          )}
        </div>

        {/* Sous-catégories */}
        {expanded && hasChildren && (
          <div className="pl-4 border-l-2 border-muted space-y-2 mt-3">
            {categorie.enfants.map((enfant) => (
              <div
                key={enfant.id}
                className="flex items-center justify-between p-2 rounded-md bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{enfant.nom}</span>
                </div>
                {enfant.articles.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {enfant.articles.length}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
