"use client";

import { CustomFieldsManager } from "@/components/custom-fields-manager";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { useCategorie } from "@/hooks/use-categories";

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
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
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

            <Card>
                <CardHeader>
                    <CardTitle>Informations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
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
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <CustomFieldsManager
                        categorieId={id}
                        categorieNom={categorie.nom}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
