import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {
    Archive,
    Briefcase,
    DollarSign,
    FileText,
    Package,
} from "lucide-react";
import { StepProps } from "../types";

export function SummaryStep({ form, articleType, categories }: StepProps) {
    const prixHT = form.watch("prix_ht");
    const tvaTaux = form.watch("tva_taux");
    const prixTTC = prixHT * (1 + tvaTaux / 100);

    // Fonction pour construire le chemin complet de la catégorie (avec parents)
    const getCategoryPath = (categoryId: string): string => {
        const category = categories.find((c) => c.id === categoryId);
        if (!category) return "-";

        const path: string[] = [category.nom];
        let currentCategory = category;

        // Remonter la hiérarchie jusqu'à la racine
        while (currentCategory.parentId) {
            const parent = categories.find((c) => c.id === currentCategory.parentId);
            if (!parent) break;
            path.unshift(parent.nom);
            currentCategory = parent;
        }

        return path.join(" → ");
    };

    const categorieName = getCategoryPath(form.watch("categorieId"));

    return (
        <div className="space-y-3 py-4">
            <div className="space-y-1 text-center">
                <h3 className="text-[24px] font-semibold text-black tracking-[-0.02em]">
                    Résumé et confirmation
                </h3>
                <p className="text-[14px] text-black/60 max-w-lg mx-auto">
                    Vérifiez les informations avant de créer votre{" "}
                    {articleType === "SERVICE" ? "service" : "produit"}
                </p>
            </div>

            <div className="space-y-3">
                <Card className="bg-black/2 border-black/10 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                                {articleType === "SERVICE" ? (
                                    <Briefcase
                                        className="h-6 w-6 text-white"
                                        strokeWidth={2}
                                    />
                                ) : (
                                    <Package
                                        className="h-6 w-6 text-white"
                                        strokeWidth={2}
                                    />
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="text-[13px] text-black/50 font-medium">
                                    Type d&apos;article
                                </p>
                                <p className="font-semibold text-[20px] text-black mt-0.5 tracking-[-0.01em]">
                                    {articleType === "SERVICE" ? "Service" : "Produit"}
                                </p>
                            </div>
                            <Badge
                                variant="outline"
                                className="bg-black/5 text-black border-black/10 font-medium px-3 py-1"
                            >
                                {articleType}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-black/2 border-black/10 shadow-sm">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-black/8">
                            <FileText
                                className="h-4 w-4 text-black/40"
                                strokeWidth={2}
                            />
                            <h4 className="font-semibold text-[15px] text-black">
                                Informations générales
                            </h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 space-y-1">
                                <span className="text-[13px] text-black/50 font-medium">
                                    Nom
                                </span>
                                <p className="font-semibold text-[15px] text-black">
                                    {form.watch("nom")}
                                </p>
                            </div>
                            <div className="col-span-2 space-y-1">
                                <span className="text-[13px] text-black/50 font-medium">
                                    Catégorie
                                </span>
                                <p className="font-semibold text-[15px] text-black">
                                    {categorieName}
                                </p>
                            </div>
                            {form.watch("description") && (
                                <div className="col-span-2 space-y-1">
                                    <span className="text-[13px] text-black/50 font-medium">
                                        Description
                                    </span>
                                    <p className="text-[14px] text-black/70 leading-relaxed bg-black/5 p-3 rounded-lg">
                                        {form.watch("description")}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-black/2 border-black/10 shadow-sm">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-black/8">
                            <DollarSign
                                className="h-4 w-4 text-black/40"
                                strokeWidth={2}
                            />
                            <h4 className="font-semibold text-[15px] text-black">
                                Tarification
                            </h4>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-[14px] text-black/60 font-medium">
                                    Prix HT
                                </span>
                                <span className="font-semibold text-[17px] text-black">
                                    {prixHT.toFixed(2)} €
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[14px] text-black/60 font-medium">
                                    TVA ({tvaTaux}%)
                                </span>
                                <span className="font-semibold text-[17px] text-black">
                                    {(prixHT * (tvaTaux / 100)).toFixed(2)} €
                                </span>
                            </div>
                            <Separator className="bg-black/8" />
                            <div className="flex justify-between items-center pt-2">
                                <span className="font-semibold text-[15px] text-black">
                                    Prix TTC
                                </span>
                                <span className="text-[28px] font-semibold text-black tracking-[-0.02em]">
                                    {prixTTC.toFixed(2)} €
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {articleType === "PRODUIT" && (
                    <Card className="bg-black/2 border-black/10 shadow-sm">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-2 pb-3 border-b border-black/8">
                                <Archive
                                    className="h-4 w-4 text-black/40"
                                    strokeWidth={2}
                                />
                                <h4 className="font-semibold text-[15px] text-black">
                                    Stock
                                </h4>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <span className="text-[13px] text-black/50 font-medium">
                                        Stock initial
                                    </span>
                                    <p className="font-semibold text-[15px] text-black">
                                        {form.watch("stock_actuel")} unités
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[13px] text-black/50 font-medium">
                                        Seuil d&apos;alerte
                                    </span>
                                    <p className="font-semibold text-[15px] text-black">
                                        {form.watch("stock_min")} unités
                                    </p>
                                </div>
                                <div className="col-span-2 space-y-1 pt-2 border-t border-black/8">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-black" />
                                        <p className="text-[13px] text-black/60">
                                            Gestion automatique activée - Le stock sera déduit lors des ventes
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <FormField control={form.control} name="root" render={() => <FormItem><FormMessage /></FormItem>} />
        </div>
    );
}
