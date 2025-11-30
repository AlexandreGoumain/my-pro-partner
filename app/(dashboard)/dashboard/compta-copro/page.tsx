"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/ui/filter-bar";
import { PageHeader } from "@/components/ui/page-header";
import { SuspensePage } from "@/components/ui/suspense-page";
import { EmptyState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";
import {
    Calculator, Plus, Building2,
    Download, FileText, ArrowUpRight, ArrowDownLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    useComptabilite,
    type EcritureWithRelations,
    type ComptaFilters as ApiComptaFilters
} from "@/hooks/syndic/use-comptabilite";

interface PageFilters {
    copropriete: string;
    type: "DEBIT" | "CREDIT" | "ALL";
    search: string;
}

const TYPE_OPTIONS = [
    { value: "ALL", label: "Toutes les opérations" },
    { value: "CREDIT", label: "Recettes (Crédit)" },
    { value: "DEBIT", label: "Dépenses (Débit)" },
];

interface CoproSynthese {
    coproprieteId: string;
    coproprieteNom: string;
    totalCredits: number;
    totalDebits: number;
    solde: number;
}

function CompteCard({ compte, onViewGrandLivre }: { compte: CoproSynthese; onViewGrandLivre?: (id: string) => void }) {
    const isPositif = compte.solde >= 0;

    return (
        <Card className="p-5 border-black/[0.08]">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-black/5 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-black/40" />
                </div>
                <div>
                    <h3 className="text-[15px] font-medium text-black">{compte.coproprieteNom}</h3>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-black/[0.02] rounded-lg p-3">
                    <p className="text-[11px] text-black/40 mb-1">Total crédits</p>
                    <p className="text-[18px] font-bold text-black/60">
                        +{compte.totalCredits.toLocaleString("fr-FR")} €
                    </p>
                </div>
                <div className={cn(
                    "rounded-lg p-3",
                    isPositif ? "bg-black/[0.02]" : "bg-red-50"
                )}>
                    <p className="text-[11px] text-black/40 mb-1">Solde</p>
                    <p className={cn(
                        "text-[18px] font-bold",
                        isPositif ? "text-black/60" : "text-red-600"
                    )}>
                        {isPositif ? "+" : ""}{compte.solde.toLocaleString("fr-FR")} €
                    </p>
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-[12px]">
                    <span className="text-black/40">Total crédits</span>
                    <span className="text-black/60 font-medium">
                        +{compte.totalCredits.toLocaleString("fr-FR")} €
                    </span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                    <span className="text-black/40">Total débits</span>
                    <span className="text-black/60 font-medium">
                        -{compte.totalDebits.toLocaleString("fr-FR")} €
                    </span>
                </div>
            </div>

            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="text-[11px] h-7 flex-1"
                    onClick={() => onViewGrandLivre?.(compte.coproprieteId)}
                >
                    <FileText className="w-3 h-3 mr-1" />
                    Grand livre
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="text-[11px] h-7"
                >
                    <Download className="w-3 h-3 mr-1" />
                    Export
                </Button>
            </div>
        </Card>
    );
}

function EcritureRow({ ecriture }: { ecriture: EcritureWithRelations }) {
    const isCredit = ecriture.typeEcriture === "CREDIT";
    const montant = Number(ecriture.montant);

    return (
        <div className="flex items-center gap-4 py-3 border-b border-black/[0.05] last:border-0">
            <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                isCredit ? "bg-black/5" : "bg-black/5"
            )}>
                {isCredit ? (
                    <ArrowDownLeft className="w-4 h-4 text-black/40" />
                ) : (
                    <ArrowUpRight className="w-4 h-4 text-black/40" />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-black line-clamp-1">
                    {ecriture.libelle}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-black/40">
                    <span>{new Date(ecriture.dateEcriture).toLocaleDateString("fr-FR")}</span>
                    {ecriture.compte && (
                        <>
                            <span>·</span>
                            <span>{ecriture.compte}</span>
                        </>
                    )}
                    {ecriture.categorieCharge && (
                        <>
                            <span>·</span>
                            <span>{ecriture.categorieCharge}</span>
                        </>
                    )}
                    {ecriture.lot && (
                        <>
                            <span>·</span>
                            <span>Lot {ecriture.lot.numero}</span>
                        </>
                    )}
                </div>
            </div>

            <div className={cn(
                "text-[14px] font-medium flex-shrink-0",
                isCredit ? "text-black/60" : "text-black/60"
            )}>
                {isCredit ? "+" : "-"}{montant.toLocaleString("fr-FR")} €
            </div>
        </div>
    );
}

function ComptaCoproPageContent() {
    const router = useRouter();
    const [filters, setFilters] = useState<PageFilters>({
        copropriete: "ALL",
        type: "ALL",
        search: "",
    });

    const apiFilters: ApiComptaFilters = {
        coproprieteId: filters.copropriete !== "ALL" ? filters.copropriete : undefined,
        typeEcriture: filters.type !== "ALL" ? filters.type : undefined,
    };

    const { data: ecritures = [], isLoading } = useComptabilite(apiFilters);

    const handleFilterChange = useCallback(
        (key: keyof PageFilters, value: string) => {
            setFilters((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    const handleCreate = useCallback(() => {
        router.push("/dashboard/compta-copro/nouveau");
    }, [router]);

    const handleExport = useCallback(() => {
        // TODO: Implement export functionality
    }, []);

    const handleViewGrandLivre = useCallback((coproprieteId: string) => {
        router.push(`/dashboard/compta-copro/grand-livre/${coproprieteId}`);
    }, [router]);

    // Compute syntheses per copropriete
    const synthesesByCopro = useMemo(() => {
        const bycopro: Record<string, CoproSynthese> = {};

        ecritures.forEach(e => {
            const coproId = e.coproprieteId;
            const coproNom = e.copropriete?.nom || "Inconnue";
            const montant = Number(e.montant);

            if (!bycopro[coproId]) {
                bycopro[coproId] = {
                    coproprieteId: coproId,
                    coproprieteNom: coproNom,
                    totalCredits: 0,
                    totalDebits: 0,
                    solde: 0,
                };
            }

            if (e.typeEcriture === "CREDIT") {
                bycopro[coproId].totalCredits += montant;
            } else {
                bycopro[coproId].totalDebits += montant;
            }
            bycopro[coproId].solde = bycopro[coproId].totalCredits - bycopro[coproId].totalDebits;
        });

        return Object.values(bycopro);
    }, [ecritures]);

    // Generate copropriete options from data
    const coproOptions = useMemo(() => [
        { value: "ALL", label: "Toutes les copropriétés" },
        ...synthesesByCopro.map((s) => ({
            value: s.coproprieteId,
            label: s.coproprieteNom,
        })),
    ], [synthesesByCopro]);

    // Filter ecritures by search (client-side)
    const filteredEcritures = filters.search
        ? ecritures.filter((e) => {
            const search = filters.search.toLowerCase();
            return (
                e.libelle.toLowerCase().includes(search) ||
                (e.compte && e.compte.toLowerCase().includes(search)) ||
                (e.categorieCharge && e.categorieCharge.toLowerCase().includes(search)) ||
                (e.lot?.numero && e.lot.numero.toLowerCase().includes(search))
            );
        })
        : ecritures;

    // Stats globaux
    const totalCredits = ecritures
        .filter(e => e.typeEcriture === "CREDIT")
        .reduce((acc, e) => acc + Number(e.montant), 0);
    const totalDebits = ecritures
        .filter(e => e.typeEcriture === "DEBIT")
        .reduce((acc, e) => acc + Number(e.montant), 0);
    const soldeGlobal = totalCredits - totalDebits;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Comptabilité"
                description="Gérez la comptabilité de vos copropriétés"
                actions={
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="border-black/10 hover:bg-black/5 h-11 px-6 text-[14px] font-medium"
                        >
                            <Download className="mr-2 h-4 w-4" strokeWidth={2} />
                            Exporter
                        </Button>
                        <Button
                            onClick={handleCreate}
                            className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                        >
                            <Plus className="mr-2 h-4 w-4" strokeWidth={2} />
                            Nouvelle écriture
                        </Button>
                    </div>
                }
            />

            {/* Stats globaux */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Écritures</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {ecritures.length}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Total crédits</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        +{totalCredits > 1000 ? `${(totalCredits / 1000).toFixed(0)}k` : totalCredits} €
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Total débits</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        -{totalDebits > 1000 ? `${(totalDebits / 1000).toFixed(0)}k` : totalDebits} €
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Solde global</p>
                    <p className={cn(
                        "text-[28px] font-bold tracking-[-0.02em]",
                        soldeGlobal >= 0 ? "text-black" : "text-red-600"
                    )}>
                        {soldeGlobal >= 0 ? "+" : ""}{Math.abs(soldeGlobal) > 1000 ? `${(soldeGlobal / 1000).toFixed(0)}k` : soldeGlobal} €
                    </p>
                </Card>
            </div>

            {/* Comptes par copropriété */}
            {synthesesByCopro.length > 0 && (
                <div>
                    <h2 className="text-[15px] font-medium text-black mb-4">Par copropriété</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {synthesesByCopro.map((synthese) => (
                            <CompteCard
                                key={synthese.coproprieteId}
                                compte={synthese}
                                onViewGrandLivre={handleViewGrandLivre}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Journal des écritures */}
            <div>
                <h2 className="text-[15px] font-medium text-black mb-4">Journal des écritures</h2>

                <FilterBar
                    variant="card"
                    filters={[
                        {
                            type: "search",
                            value: filters.search || "",
                            onChange: (value) => handleFilterChange("search", value),
                            placeholder: "Rechercher par libellé, compte...",
                            className: "flex-1",
                        },
                        {
                            type: "select",
                            value: filters.copropriete || "ALL",
                            onChange: (value) => handleFilterChange("copropriete", value),
                            options: coproOptions,
                            label: "Copropriété",
                        },
                        {
                            type: "select",
                            value: filters.type || "ALL",
                            onChange: (value) => handleFilterChange("type", value),
                            options: TYPE_OPTIONS,
                            label: "Type",
                        },
                    ]}
                />

                {isLoading ? (
                    <Card className="p-4 mt-4">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="h-16 bg-black/5 rounded-lg animate-pulse mb-2 last:mb-0"
                            />
                        ))}
                    </Card>
                ) : filteredEcritures.length === 0 ? (
                    <EmptyState
                        icon={Calculator}
                        title="Aucune écriture"
                        description={
                            filters.search ||
                            filters.copropriete !== "ALL" ||
                            filters.type !== "ALL"
                                ? "Aucune écriture ne correspond à vos critères"
                                : "Créez votre première écriture comptable"
                        }
                        action={
                            filters.search ||
                            filters.copropriete !== "ALL" ||
                            filters.type !== "ALL"
                                ? undefined
                                : {
                                    label: "Nouvelle écriture",
                                    onClick: handleCreate,
                                }
                        }
                    />
                ) : (
                    <Card className="p-4 mt-4">
                        {filteredEcritures.map((ecriture) => (
                            <EcritureRow key={ecriture.id} ecriture={ecriture} />
                        ))}
                    </Card>
                )}
            </div>
        </div>
    );
}

export default function ComptaCoproPage() {
    return (
        <SuspensePage
            skeletonProps={{
                layout: "dashboard",
                headerActionsCount: 2,
                statsCount: 4,
            }}
        >
            <ComptaCoproPageContent />
        </SuspensePage>
    );
}
