"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArticleCombobox } from "./article-combobox";
import { Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

export interface LineItem {
    id?: string;
    articleId?: string;
    designation: string;
    description?: string;
    quantite: number;
    prix_unitaire_ht: number;
    tva_taux: number;
    remise_pourcent: number;
    montant_ht: number;
    montant_tva: number;
    montant_ttc: number;
}

interface LineItemsEditorProps {
    lines: LineItem[];
    onChange: (lines: LineItem[]) => void;
    articles?: Array<{
        id: string;
        nom: string;
        reference?: string;
        type: "PRODUIT" | "SERVICE";
        prix: number;
        tva: number;
    }>;
}

export function LineItemsEditor({
    lines,
    onChange,
    articles = [],
}: LineItemsEditorProps) {
    const calculateLineAmounts = (line: Partial<LineItem>): LineItem => {
        const quantite = line.quantite || 0;
        const prix_unitaire_ht = line.prix_unitaire_ht || 0;
        const remise_pourcent = line.remise_pourcent || 0;
        const tva_taux = line.tva_taux || 20;

        const montant_ht =
            prix_unitaire_ht * quantite * (1 - remise_pourcent / 100);
        const montant_tva = montant_ht * (tva_taux / 100);
        const montant_ttc = montant_ht + montant_tva;

        return {
            id: line.id,
            articleId: line.articleId,
            designation: line.designation || "",
            description: line.description,
            quantite,
            prix_unitaire_ht,
            tva_taux,
            remise_pourcent,
            montant_ht: Math.round(montant_ht * 100) / 100,
            montant_tva: Math.round(montant_tva * 100) / 100,
            montant_ttc: Math.round(montant_ttc * 100) / 100,
        };
    };

    const handleAddLine = () => {
        const newLine = calculateLineAmounts({
            designation: "",
            quantite: 1,
            prix_unitaire_ht: 0,
            tva_taux: 20,
            remise_pourcent: 0,
        });
        onChange([...lines, newLine]);
    };

    const handleRemoveLine = (index: number) => {
        onChange(lines.filter((_, i) => i !== index));
    };

    const handleLineChange = (index: number, field: keyof LineItem, value: any) => {
        const newLines = [...lines];
        const updatedLine = { ...newLines[index], [field]: value };
        newLines[index] = calculateLineAmounts(updatedLine);
        onChange(newLines);
    };

    const handleArticleSelect = (index: number, articleId: string) => {
        const article = articles.find((a) => a.id === articleId);
        if (!article) return;

        const newLines = [...lines];
        newLines[index] = calculateLineAmounts({
            ...newLines[index],
            articleId: article.id,
            designation: article.nom,
            prix_unitaire_ht: Number(article.prix),
            tva_taux: Number(article.tva),
        });
        onChange(newLines);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-black">
                    Lignes du document
                </h3>
                <Button
                    type="button"
                    onClick={handleAddLine}
                    variant="outline"
                    size="sm"
                    disabled={articles.length === 0}
                    className="h-9 px-4 text-[13px] border-black/10 hover:bg-black/5"
                >
                    <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                    Ajouter une ligne
                </Button>
            </div>

            {articles.length === 0 ? (
                <div className="border border-black/8 rounded-lg p-8 text-center">
                    <p className="text-[14px] text-black/60 mb-2">
                        Aucun produit ou service disponible
                    </p>
                    <p className="text-[13px] text-black/40">
                        Vous devez d&apos;abord créer des articles (produits ou services) avant de pouvoir ajouter des lignes au document.
                    </p>
                </div>
            ) : (
                <div className="border border-black/8 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-[13px]">
                            <thead className="bg-black/2 border-b border-black/8">
                                <tr>
                                    <th className="text-left p-3 font-medium text-black/60">Désignation</th>
                                    <th className="text-right p-3 font-medium text-black/60 w-24">Quantité</th>
                                    <th className="text-right p-3 font-medium text-black/60 w-32">Prix unitaire HT</th>
                                    <th className="text-right p-3 font-medium text-black/60 w-24">TVA (%)</th>
                                    <th className="text-right p-3 font-medium text-black/60 w-28">Remise (%)</th>
                                    <th className="text-right p-3 font-medium text-black/60 w-32">Total TTC</th>
                                    <th className="w-12 p-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {lines.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center p-8 text-black/40">
                                            Aucune ligne ajoutée. Cliquez sur &quot;Ajouter une ligne&quot; pour commencer.
                                        </td>
                                    </tr>
                                ) : (
                                    lines.map((line, index) => (
                                        <tr key={index} className="border-b border-black/5 last:border-0">
                                            <td className="p-2">
                                                <ArticleCombobox
                                                    articles={articles}
                                                    value={line.articleId || ""}
                                                    onValueChange={(value) =>
                                                        handleArticleSelect(index, value)
                                                    }
                                                    placeholder="Choisir un article..."
                                                    triggerClassName="h-9 text-[13px] border-black/10"
                                                />
                                            </td>
                                        <td className="p-2">
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={line.quantite}
                                                onChange={(e) =>
                                                    handleLineChange(
                                                        index,
                                                        "quantite",
                                                        parseFloat(e.target.value) || 0
                                                    )
                                                }
                                                className="h-9 text-[13px] text-right border-black/10"
                                            />
                                        </td>
                                        <td className="p-2">
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={line.prix_unitaire_ht}
                                                onChange={(e) =>
                                                    handleLineChange(
                                                        index,
                                                        "prix_unitaire_ht",
                                                        parseFloat(e.target.value) || 0
                                                    )
                                                }
                                                disabled={!!line.articleId}
                                                className="h-9 text-[13px] text-right border-black/10 disabled:opacity-70 disabled:cursor-not-allowed"
                                            />
                                        </td>
                                        <td className="p-2">
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={line.tva_taux}
                                                onChange={(e) =>
                                                    handleLineChange(
                                                        index,
                                                        "tva_taux",
                                                        parseFloat(e.target.value) || 0
                                                    )
                                                }
                                                disabled={!!line.articleId}
                                                className="h-9 text-[13px] text-right border-black/10 disabled:opacity-70 disabled:cursor-not-allowed"
                                            />
                                        </td>
                                        <td className="p-2">
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={line.remise_pourcent}
                                                onChange={(e) =>
                                                    handleLineChange(
                                                        index,
                                                        "remise_pourcent",
                                                        parseFloat(e.target.value) || 0
                                                    )
                                                }
                                                disabled={!!line.articleId}
                                                className="h-9 text-[13px] text-right border-black/10 disabled:opacity-70 disabled:cursor-not-allowed"
                                            />
                                        </td>
                                        <td className="p-2 text-right font-medium">
                                            {Number(line.montant_ttc || 0).toFixed(2)} €
                                        </td>
                                        <td className="p-2 text-center">
                                            <Button
                                                type="button"
                                                onClick={() => handleRemoveLine(index)}
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                                            >
                                                <Trash2 className="w-4 h-4" strokeWidth={2} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            )}
        </div>
    );
}
