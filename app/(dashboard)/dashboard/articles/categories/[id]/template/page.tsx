"use client";

import { CustomFieldsManager } from "@/components/custom-fields-manager";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CardSection } from "@/components/ui/card-section";
import { useCategorie } from "@/hooks/use-categories";
import { ArrowLeft } from "lucide-react";
import { GridSkeleton } from "@/components/ui/grid-skeleton";
import Link from "next/link";
import { use } from "react";

export default function CategoryTemplatePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);

    // Récupérer les infos de la catégorie avec React Query
    const { data: categorie, isLoading: loading } = useCategorie(id);

    if (loading) {
        return (
            <GridSkeleton
                itemCount={5}
                gridColumns={{ default: 1 }}
                gap={2}
                itemHeight="h-24"
            />
        );
    }

    if (!categorie) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardContent className="p-12 text-center">
                        <h2 className="text-2xl font-semibold mb-2">
                            Catégorie introuvable
                        </h2>
                        <p className="text-muted-foreground mb-4">
                            Cette catégorie n&apos;existe pas ou a été supprimée
                        </p>
                        <Button asChild>
                            <Link href="/dashboard/articles/categories">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour aux catégories
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/articles/categories">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Retour
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">
                        Template de catégorie
                    </h1>
                    <p className="text-muted-foreground">
                        Configurez les champs personnalisés pour &quot;
                        {categorie.nom}&quot;
                    </p>
                </div>
            </div>

            <CardSection title="Informations" contentClassName="space-y-2">
                <div>
                    <span className="text-sm text-muted-foreground">
                        Nom :
                    </span>{" "}
                    <span className="font-medium">{categorie.nom}</span>
                </div>
                {categorie.description && (
                    <div>
                        <span className="text-sm text-muted-foreground">
                            Description :
                        </span>{" "}
                        <span>{categorie.description}</span>
                    </div>
                )}
            </CardSection>

            <CardSection contentClassName="pt-6">
                <CustomFieldsManager
                    categorieId={id}
                    categorieNom={categorie.nom}
                />
            </CardSection>
        </div>
    );
}
