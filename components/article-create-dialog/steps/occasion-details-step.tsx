import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { StepProps } from "../types";
import { ArticleInfoFields } from "./occasion/article-info-fields";
import { OccasionDetailsFields } from "./occasion/occasion-details-fields";
import { RachatSelector } from "./occasion/rachat-selector";
import { RachatSummaryCard } from "./occasion/rachat-summary-card";
import { SourceTypeSelector } from "./occasion/source-type-selector";

interface Rachat {
    id: string;
    designation: string;
    description?: string;
    categorieId?: string;
    etat?: string;
    provenance?: string;
    prixRachat?: number;
    numeroSerie?: string;
    notes?: string;
}

export function OccasionDetailsStep({
    form,
    categories,
    loadingCategories,
}: StepProps) {
    const [sourceType, setSourceType] = useState<"rachat" | "nouveau">(
        "nouveau"
    );

    const { data: rachats, isLoading: isLoadingRachats } = useQuery({
        queryKey: ["rachats-disponibles"],
        queryFn: async () => {
            const response = await fetch("/api/rachats?disponible=true");
            if (!response.ok) throw new Error("Failed to fetch rachats");
            const data = await response.json();
            return data.items as Rachat[];
        },
    });

    const handleSourceTypeChange = (type: "rachat" | "nouveau") => {
        setSourceType(type);
        if (type === "nouveau") {
            form.setValue("rachatId", undefined);
        }
    };

    const handleRachatSelect = (rachatId: string) => {
        form.setValue("rachatId", rachatId);

        const rachat = rachats?.find((r) => r.id === rachatId);
        if (rachat) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (rachat.etat) form.setValue("etat", rachat.etat as any);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (rachat.provenance)
                form.setValue("provenance", rachat.provenance as any);
            if (rachat.prixRachat)
                form.setValue("prixRachat", rachat.prixRachat);
            if (rachat.numeroSerie)
                form.setValue("numeroSerie", rachat.numeroSerie);
            if (rachat.notes) form.setValue("notesRachat", rachat.notes);
            if (rachat.designation) form.setValue("nom", rachat.designation);
            if (rachat.description)
                form.setValue("description", rachat.description);
            if (rachat.categorieId)
                form.setValue("categorieId", rachat.categorieId);
        }
    };

    const rachatId = form.watch("rachatId");
    const selectedRachat = rachats?.find((r) => r.id === rachatId);
    const categoryName = selectedRachat
        ? categories.find((c) => c.id === selectedRachat.categorieId)?.nom
        : undefined;

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

            <SourceTypeSelector
                sourceType={sourceType}
                onChange={handleSourceTypeChange}
            />

            {sourceType === "rachat" && (
                <RachatSelector
                    form={form}
                    rachats={rachats}
                    isLoading={isLoadingRachats}
                    onSelect={handleRachatSelect}
                />
            )}

            {sourceType === "rachat" && selectedRachat && (
                <RachatSummaryCard
                    rachat={selectedRachat}
                    categoryName={categoryName}
                />
            )}

            {sourceType === "nouveau" && (
                <ArticleInfoFields
                    form={form}
                    categories={categories}
                    loadingCategories={loadingCategories}
                />
            )}

            {(sourceType === "nouveau" || rachatId) && (
                <OccasionDetailsFields
                    form={form}
                    showSectionTitle={sourceType === "nouveau"}
                />
            )}
        </div>
    );
}
