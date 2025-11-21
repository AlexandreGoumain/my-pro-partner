import { Card, CardContent } from "@/components/ui/card";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { Info, Loader2, Package, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { StepProps } from "../types";

export function OccasionDetailsStep({
    form,
    categories,
    loadingCategories,
}: StepProps) {
    const [sourceType, setSourceType] = useState<"rachat" | "nouveau">(
        "nouveau"
    );

    // Fetch rachats non encore transformés en articles
    const { data: rachats, isLoading: isLoadingRachats } = useQuery({
        queryKey: ["rachats-disponibles"],
        queryFn: async () => {
            const response = await fetch("/api/rachats?disponible=true");
            if (!response.ok) throw new Error("Failed to fetch rachats");
            const data = await response.json();
            return data.items;
        },
    });

    const handleSourceTypeChange = (type: "rachat" | "nouveau") => {
        setSourceType(type);
        if (type === "nouveau") {
            // Réinitialiser le rachat sélectionné
            form.setValue("rachatId", undefined);
        }
    };

    const handleRachatSelect = (rachatId: string) => {
        form.setValue("rachatId", rachatId);

        // Pré-remplir les informations du rachat
        const rachat = rachats?.find(
            (r: {
                id: string;
                etat?: string;
                provenance?: string;
                prixRachat?: number;
                numeroSerie?: string;
                notes?: string;
            }) => r.id === rachatId
        );
        if (rachat) {
            if (rachat.etat) form.setValue("etat", rachat.etat);
            if (rachat.provenance)
                form.setValue("provenance", rachat.provenance);
            if (rachat.prixRachat)
                form.setValue("prixRachat", rachat.prixRachat);
            if (rachat.numeroSerie)
                form.setValue("numeroSerie", rachat.numeroSerie);
            if (rachat.notes) form.setValue("notesRachat", rachat.notes);
        }
    };

    const handleRachatSelectWithName = (rachatId: string) => {
        handleRachatSelect(rachatId);

        // Pré-remplir aussi le nom, description et catégorie depuis le rachat
        const rachat = rachats?.find(
            (r: {
                id: string;
                designation: string;
                description?: string;
                categorieId?: string;
            }) => r.id === rachatId
        );
        if (rachat) {
            if (rachat.designation) form.setValue("nom", rachat.designation);
            if (rachat.description)
                form.setValue("description", rachat.description);
            if (rachat.categorieId)
                form.setValue("categorieId", rachat.categorieId);
        }
    };

    return (
        <div className="space-y-4 py-4">
            <div className="space-y-1">
                <h3 className="text-[24px] font-semibold text-black tracking-[-0.02em]">
                    Nouvel article d&apos;occasion
                </h3>
                <p className="text-[14px] text-black/60">
                    Choisissez d&apos;abord la source de ce produit
                </p>
            </div>

            <div className="space-y-1">
                <h4 className="text-[16px] font-semibold text-black">
                    Source de l&apos;occasion
                </h4>
                <p className="text-[13px] text-black/60">
                    Choisissez l&apos;origine de ce produit
                </p>
            </div>

            {/* Choix de la source */}
            <div className="grid grid-cols-2 gap-3">
                <Card
                    className={`cursor-pointer border-2 transition-all ${
                        sourceType === "rachat"
                            ? "border-black bg-black/5"
                            : "border-black/10 hover:border-black/20"
                    }`}
                    onClick={() => handleSourceTypeChange("rachat")}
                >
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <ShoppingCart
                                className={`h-5 w-5 mt-0.5 ${
                                    sourceType === "rachat"
                                        ? "text-black"
                                        : "text-black/40"
                                }`}
                                strokeWidth={2}
                            />
                            <div>
                                <h4 className="text-[14px] font-semibold text-black">
                                    Rachat existant
                                </h4>
                                <p className="text-[12px] text-black/60 mt-0.5">
                                    Produit déjà racheté à un client
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className={`cursor-pointer border-2 transition-all ${
                        sourceType === "nouveau"
                            ? "border-black bg-black/5"
                            : "border-black/10 hover:border-black/20"
                    }`}
                    onClick={() => handleSourceTypeChange("nouveau")}
                >
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <Package
                                className={`h-5 w-5 mt-0.5 ${
                                    sourceType === "nouveau"
                                        ? "text-black"
                                        : "text-black/40"
                                }`}
                                strokeWidth={2}
                            />
                            <div>
                                <h4 className="text-[14px] font-semibold text-black">
                                    Nouveau produit
                                </h4>
                                <p className="text-[12px] text-black/60 mt-0.5">
                                    Produit en stock à mettre en vente
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Si rachat sélectionné - Dropdown */}
            {sourceType === "rachat" && (
                <FormField
                    control={form.control}
                    name="rachatId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[14px]">
                                Sélectionner un rachat{" "}
                                <span className="text-red-500">*</span>
                            </FormLabel>
                            <Select
                                onValueChange={handleRachatSelectWithName}
                                value={field.value}
                                disabled={isLoadingRachats}
                            >
                                <FormControl>
                                    <SelectTrigger className="h-11">
                                        <SelectValue placeholder="Choisir un rachat disponible" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {isLoadingRachats ? (
                                        <div className="flex items-center justify-center py-4">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        </div>
                                    ) : rachats && rachats.length > 0 ? (
                                        rachats.map(
                                            (rachat: {
                                                id: string;
                                                designation: string;
                                                prixRachat: number;
                                            }) => (
                                                <SelectItem
                                                    key={rachat.id}
                                                    value={rachat.id}
                                                >
                                                    {rachat.designation} -{" "}
                                                    {rachat.prixRachat}€
                                                </SelectItem>
                                            )
                                        )
                                    ) : (
                                        <div className="text-[13px] text-black/60 text-center py-4">
                                            Aucun rachat disponible
                                        </div>
                                    )}
                                </SelectContent>
                            </Select>
                            <FormDescription className="text-[12px]">
                                Les informations du rachat seront utilisées
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}

            {/* Récapitulatif du rachat sélectionné */}
            {sourceType === "rachat" &&
                form.watch("rachatId") &&
                (() => {
                    const rachatId = form.watch("rachatId");
                    const selectedRachat = rachats?.find(
                        (r: {
                            id: string;
                            designation: string;
                            description?: string;
                            categorieId?: string;
                        }) => r.id === rachatId
                    );
                    if (!selectedRachat) return null;

                    const categoryName = categories.find(
                        (c) => c.id === selectedRachat.categorieId
                    )?.nom;

                    return (
                        <Card className="bg-black/2 border-black/10">
                            <CardContent className="p-4 space-y-2">
                                <div>
                                    <p className="text-[12px] text-black/60">
                                        Nom de l&apos;article
                                    </p>
                                    <p className="text-[14px] font-semibold text-black">
                                        {selectedRachat.designation}
                                    </p>
                                </div>
                                {categoryName && (
                                    <div>
                                        <p className="text-[12px] text-black/60">
                                            Catégorie
                                        </p>
                                        <p className="text-[14px] text-black">
                                            {categoryName}
                                        </p>
                                    </div>
                                )}
                                {selectedRachat.description && (
                                    <div>
                                        <p className="text-[12px] text-black/60">
                                            Description
                                        </p>
                                        <p className="text-[13px] text-black">
                                            {selectedRachat.description}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })()}

            {/* Nom, catégorie et description uniquement pour nouveau produit */}
            {sourceType === "nouveau" && (
                <>
                    <div className="space-y-1 pt-2">
                        <h4 className="text-[16px] font-semibold text-black">
                            Informations de l&apos;article
                        </h4>
                        <p className="text-[13px] text-black/60">
                            Détails du produit à mettre en vente
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="nom"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[14px]">
                                        Nom{" "}
                                        <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: iPhone 13 Pro 256GB"
                                            className="h-11"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="categorieId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[14px]">
                                        Catégorie{" "}
                                        <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={loadingCategories}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="h-11">
                                                <SelectValue placeholder="Sélectionner une catégorie" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.nom}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Description */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[14px]">
                                    Description
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Détails supplémentaires sur le produit"
                                        className="resize-none min-h-[80px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </>
            )}

            {/* Si nouveau produit OU si rachat sélectionné (pour voir/modifier les détails) */}
            {(sourceType === "nouveau" || form.watch("rachatId")) && (
                <>
                    {sourceType === "nouveau" && (
                        <div className="space-y-1 pt-2">
                            <h4 className="text-[16px] font-semibold text-black">
                                Détails de l&apos;occasion
                            </h4>
                            <p className="text-[13px] text-black/60">
                                Informations sur l&apos;acquisition de cet
                                article
                            </p>
                        </div>
                    )}

                    {/* État */}
                    <FormField
                        control={form.control}
                        name="etat"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[14px]">
                                    État <span className="text-red-500">*</span>
                                </FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="h-11">
                                            <SelectValue placeholder="Sélectionner l'état" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="COMME_NEUF">
                                            Comme neuf
                                        </SelectItem>
                                        <SelectItem value="TRES_BON">
                                            Très bon état
                                        </SelectItem>
                                        <SelectItem value="BON">
                                            Bon état
                                        </SelectItem>
                                        <SelectItem value="CORRECT">
                                            État correct
                                        </SelectItem>
                                        <SelectItem value="POUR_PIECES">
                                            Pour pièces détachées
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription className="text-[12px]">
                                    Évaluation de l&apos;état général du produit
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        {/* Provenance */}
                        <FormField
                            control={form.control}
                            name="provenance"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[14px]">
                                        Provenance{" "}
                                        <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="h-11">
                                                <SelectValue placeholder="Sélectionner" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="RACHAT_CLIENT">
                                                Rachat client
                                            </SelectItem>
                                            <SelectItem value="MARKETPLACE_OCCASION">
                                                Marketplace (occasion)
                                            </SelectItem>
                                            <SelectItem value="REPRISE">
                                                Reprise
                                            </SelectItem>
                                            <SelectItem value="DON">
                                                Don
                                            </SelectItem>
                                            <SelectItem value="RETOUR_SAV">
                                                Retour SAV
                                            </SelectItem>
                                            <SelectItem value="AUTRE">
                                                Autre
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Prix de rachat */}
                        <FormField
                            control={form.control}
                            name="prixRachat"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[14px]">
                                        Prix de rachat HT{" "}
                                        <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                className="h-11 pr-8"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseFloat(
                                                            e.target.value
                                                        ) || 0
                                                    )
                                                }
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-black/60">
                                                €
                                            </span>
                                        </div>
                                    </FormControl>
                                    <FormDescription className="text-[12px]">
                                        Prix payé au vendeur
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Numéro de série / IMEI */}
                    <FormField
                        control={form.control}
                        name="numeroSerie"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[14px]">
                                    Numéro de série / IMEI
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ex: 354123456789012"
                                        className="h-11"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription className="text-[12px]">
                                    Pour traçabilité
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Notes */}
                    <FormField
                        control={form.control}
                        name="notesRachat"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[14px]">
                                    Notes sur l&apos;état
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Défauts constatés, accessoires inclus, etc."
                                        className="resize-none min-h-[100px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription className="text-[12px]">
                                    Détails sur l&apos;état, défauts,
                                    accessoires
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Info box */}
                    <div className="bg-black/2 border border-black/10 rounded-lg p-4 mt-4">
                        <div className="flex gap-3">
                            <Info className="h-5 w-5 text-black/40 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-[14px] font-semibold text-black">
                                    Traçabilité complète
                                </p>
                                <p className="text-[13px] text-black/60 leading-relaxed">
                                    Ces informations permettront de tracer
                                    l&apos;historique complet de l&apos;article
                                    et de calculer la marge réalisée.
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
