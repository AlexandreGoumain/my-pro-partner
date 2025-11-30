"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/ui/filter-bar";
import { PageHeader } from "@/components/ui/page-header";
import { SuspensePage } from "@/components/ui/suspense-page";
import { EmptyState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Receipt, Plus, Building2, Euro, Calendar, Send,
    CheckCircle, Clock, AlertTriangle, Download
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface AppelCharges {
    id: string;
    reference: string;
    trimestre: string; // "2024-Q1"
    dateAppel: string;
    dateEcheance: string;
    copropriete: {
        id: string;
        nom: string;
    };
    montantTotal: number;
    montantAppele: number;
    montantEncaisse: number;
    nbLots: number;
    nbLotsPayes: number;
    statut: "BROUILLON" | "ENVOYE" | "EN_COURS" | "CLOTURE";
    typeAppel: "PROVISIONS" | "REGULARISATION" | "TRAVAUX" | "EXCEPTIONNEL";
}

interface ChargesFilters {
    copropriete: string;
    trimestre: string;
    statut: string;
    search: string;
}

const STATUT_OPTIONS = [
    { value: "ALL", label: "Tous les statuts" },
    { value: "BROUILLON", label: "Brouillon" },
    { value: "ENVOYE", label: "Envoyé" },
    { value: "EN_COURS", label: "En cours" },
    { value: "CLOTURE", label: "Clôturé" },
];

const STATUT_CONFIG: Record<string, { label: string; variant: "default" | "outline" | "secondary" }> = {
    BROUILLON: { label: "Brouillon", variant: "outline" },
    ENVOYE: { label: "Envoyé", variant: "secondary" },
    EN_COURS: { label: "En cours", variant: "secondary" },
    CLOTURE: { label: "Clôturé", variant: "default" },
};

const TYPE_APPEL_LABELS: Record<string, string> = {
    PROVISIONS: "Provisions",
    REGULARISATION: "Régularisation",
    TRAVAUX: "Travaux",
    EXCEPTIONNEL: "Exceptionnel",
};

// Generate trimestre options
const generateTrimestreOptions = () => {
    const options = [{ value: "ALL", label: "Tous les trimestres" }];
    const now = new Date();
    const year = now.getFullYear();

    for (let y = year; y >= year - 1; y--) {
        for (let q = 4; q >= 1; q--) {
            const value = `${y}-Q${q}`;
            const label = `T${q} ${y}`;
            options.push({ value, label });
        }
    }
    return options;
};

const TRIMESTRE_OPTIONS = generateTrimestreOptions();

// Mock data
const mockAppelsCharges: AppelCharges[] = [
    {
        id: "1",
        reference: "APP-2024-Q1-001",
        trimestre: "2024-Q1",
        dateAppel: "2024-01-05",
        dateEcheance: "2024-01-31",
        copropriete: { id: "c1", nom: "Résidence Les Jardins" },
        montantTotal: 21250,
        montantAppele: 21250,
        montantEncaisse: 18500,
        nbLots: 45,
        nbLotsPayes: 39,
        statut: "EN_COURS",
        typeAppel: "PROVISIONS",
    },
    {
        id: "2",
        reference: "APP-2024-Q1-002",
        trimestre: "2024-Q1",
        dateAppel: "2024-01-05",
        dateEcheance: "2024-01-31",
        copropriete: { id: "c2", nom: "Le Clos des Tilleuls" },
        montantTotal: 13000,
        montantAppele: 13000,
        montantEncaisse: 13000,
        nbLots: 28,
        nbLotsPayes: 28,
        statut: "CLOTURE",
        typeAppel: "PROVISIONS",
    },
    {
        id: "3",
        reference: "APP-2023-REG-001",
        trimestre: "2023-Q4",
        dateAppel: "2024-01-15",
        dateEcheance: "2024-02-15",
        copropriete: { id: "c1", nom: "Résidence Les Jardins" },
        montantTotal: 8500,
        montantAppele: 8500,
        montantEncaisse: 6200,
        nbLots: 45,
        nbLotsPayes: 32,
        statut: "EN_COURS",
        typeAppel: "REGULARISATION",
    },
    {
        id: "4",
        reference: "APP-2024-Q1-003",
        trimestre: "2024-Q1",
        dateAppel: "",
        dateEcheance: "",
        copropriete: { id: "c3", nom: "Domaine du Parc" },
        montantTotal: 61250,
        montantAppele: 0,
        montantEncaisse: 0,
        nbLots: 120,
        nbLotsPayes: 0,
        statut: "BROUILLON",
        typeAppel: "PROVISIONS",
    },
];

function AppelChargesCard({ appel, onView, onAction }: {
    appel: AppelCharges;
    onView: (a: AppelCharges) => void;
    onAction: (a: AppelCharges, action: string) => void;
}) {
    const statutConfig = STATUT_CONFIG[appel.statut];
    const tauxEncaissement = appel.montantAppele > 0
        ? ((appel.montantEncaisse / appel.montantAppele) * 100).toFixed(0)
        : "0";
    const resteAEncaisser = appel.montantAppele - appel.montantEncaisse;
    const lotsEnRetard = appel.nbLots - appel.nbLotsPayes;

    const echeanceDate = appel.dateEcheance ? new Date(appel.dateEcheance) : null;
    const isOverdue = echeanceDate && echeanceDate < new Date() && appel.statut !== "CLOTURE";

    return (
        <Card
            className={cn(
                "p-5 border-black/[0.08] hover:border-black/20 transition-all cursor-pointer",
                isOverdue && "border-l-4 border-l-amber-500"
            )}
            onClick={() => onView(appel)}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[12px] text-black/40">{appel.reference}</span>
                        <Badge variant={statutConfig.variant} className="text-[10px] h-5">
                            {statutConfig.label}
                        </Badge>
                    </div>
                    <h3 className="text-[15px] font-medium text-black">
                        {TYPE_APPEL_LABELS[appel.typeAppel]} - {appel.trimestre.replace("-Q", " T")}
                    </h3>
                </div>
            </div>

            {/* Copropriété */}
            <div className="flex items-center gap-2 text-[13px] text-black/60 mb-4">
                <Building2 className="w-4 h-4 text-black/40" />
                <span>{appel.copropriete.nom}</span>
            </div>

            {/* Montants */}
            <div className="bg-black/[0.02] rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] text-black/40">Montant appelé</span>
                    <span className="text-[16px] font-bold text-black">
                        {appel.montantAppele.toLocaleString("fr-FR")} €
                    </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] text-black/40">Encaissé</span>
                    <span className="text-[14px] font-medium text-emerald-600">
                        {appel.montantEncaisse.toLocaleString("fr-FR")} € ({tauxEncaissement}%)
                    </span>
                </div>
                {resteAEncaisser > 0 && (
                    <div className="flex items-center justify-between">
                        <span className="text-[12px] text-black/40">Reste</span>
                        <span className="text-[14px] font-medium text-amber-600">
                            {resteAEncaisser.toLocaleString("fr-FR")} €
                        </span>
                    </div>
                )}
            </div>

            {/* Lots */}
            <div className="flex items-center justify-between text-[12px] mb-3">
                <span className="text-black/40">{appel.nbLots} lots concernés</span>
                {lotsEnRetard > 0 && appel.statut !== "BROUILLON" && (
                    <span className="text-amber-600">
                        {lotsEnRetard} en retard
                    </span>
                )}
            </div>

            {/* Dates */}
            {appel.dateEcheance && (
                <div className="flex items-center gap-2 text-[12px] text-black/40 mb-4">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className={isOverdue ? "text-amber-600" : ""}>
                        Échéance: {new Date(appel.dateEcheance).toLocaleDateString("fr-FR")}
                    </span>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
                {appel.statut === "BROUILLON" && (
                    <Button
                        variant="default"
                        size="sm"
                        className="bg-black hover:bg-black/90 text-white text-[11px] h-7 flex-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction(appel, "envoyer");
                        }}
                    >
                        <Send className="w-3 h-3 mr-1" />
                        Envoyer
                    </Button>
                )}
                {appel.statut === "EN_COURS" && (
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-[11px] h-7 flex-1"
                            onClick={(e) => {
                                e.stopPropagation();
                                onAction(appel, "relancer");
                            }}
                        >
                            Relancer
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            className="bg-black hover:bg-black/90 text-white text-[11px] h-7"
                            onClick={(e) => {
                                e.stopPropagation();
                                onAction(appel, "cloturer");
                            }}
                        >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Clôturer
                        </Button>
                    </>
                )}
                {appel.statut === "CLOTURE" && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-[11px] h-7 flex-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction(appel, "telecharger");
                        }}
                    >
                        <Download className="w-3 h-3 mr-1" />
                        Télécharger
                    </Button>
                )}
                <Button
                    variant="outline"
                    size="sm"
                    className="text-[11px] h-7"
                    onClick={(e) => {
                        e.stopPropagation();
                        onView(appel);
                    }}
                >
                    Détails
                </Button>
            </div>
        </Card>
    );
}

function ChargesPageContent() {
    const router = useRouter();
    const [filters, setFilters] = useState<ChargesFilters>({
        copropriete: "ALL",
        trimestre: "ALL",
        statut: "ALL",
        search: "",
    });

    const appelsCharges = mockAppelsCharges;
    const isLoading = false;

    const handleFilterChange = useCallback(
        (key: keyof ChargesFilters, value: string) => {
            setFilters((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    const handleView = useCallback((appel: AppelCharges) => {
        router.push(`/dashboard/charges/${appel.id}`);
    }, [router]);

    const handleAction = useCallback((_appel: AppelCharges, _action: string) => {
        // Action handled via mutation
    }, []);

    const handleCreate = useCallback(() => {
        router.push("/dashboard/charges/nouveau");
    }, [router]);

    // Generate copropriete options
    const coproOptions = [
        { value: "ALL", label: "Toutes les copropriétés" },
        ...Array.from(new Set(appelsCharges.map((a) => a.copropriete.id))).map((id) => {
            const copro = appelsCharges.find((a) => a.copropriete.id === id)?.copropriete;
            return { value: id, label: copro?.nom || id };
        }),
    ];

    // Filter
    const filteredAppels = appelsCharges.filter((a) => {
        if (filters.copropriete !== "ALL" && a.copropriete.id !== filters.copropriete) return false;
        if (filters.trimestre !== "ALL" && a.trimestre !== filters.trimestre) return false;
        if (filters.statut !== "ALL" && a.statut !== filters.statut) return false;
        if (filters.search) {
            const search = filters.search.toLowerCase();
            return (
                a.reference.toLowerCase().includes(search) ||
                a.copropriete.nom.toLowerCase().includes(search)
            );
        }
        return true;
    });

    // Stats
    const totalAppele = appelsCharges
        .filter((a) => a.statut !== "BROUILLON")
        .reduce((acc, a) => acc + a.montantAppele, 0);
    const totalEncaisse = appelsCharges
        .reduce((acc, a) => acc + a.montantEncaisse, 0);
    const tauxGlobal = totalAppele > 0
        ? ((totalEncaisse / totalAppele) * 100).toFixed(0)
        : "0";
    const enCoursCount = appelsCharges.filter((a) => a.statut === "EN_COURS").length;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Appels de charges"
                description="Gérez les appels de charges de vos copropriétés"
                actions={
                    <Button
                        onClick={handleCreate}
                        className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                    >
                        <Plus className="mr-2 h-4 w-4" strokeWidth={2} />
                        Nouvel appel
                    </Button>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Total appelé</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {(totalAppele / 1000).toFixed(0)}k €
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Total encaissé</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-emerald-600">
                        {(totalEncaisse / 1000).toFixed(0)}k €
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Taux encaissement</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {tauxGlobal}%
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Appels en cours</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {enCoursCount}
                    </p>
                </Card>
            </div>

            <FilterBar
                variant="card"
                filters={[
                    {
                        type: "search",
                        value: filters.search || "",
                        onChange: (value) => handleFilterChange("search", value),
                        placeholder: "Rechercher par référence, copropriété...",
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
                        value: filters.trimestre || "ALL",
                        onChange: (value) => handleFilterChange("trimestre", value),
                        options: TRIMESTRE_OPTIONS,
                        label: "Trimestre",
                    },
                    {
                        type: "select",
                        value: filters.statut || "ALL",
                        onChange: (value) => handleFilterChange("statut", value),
                        options: STATUT_OPTIONS,
                        label: "Statut",
                    },
                ]}
            />

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="h-[300px] bg-black/5 rounded-lg animate-pulse"
                        />
                    ))}
                </div>
            ) : filteredAppels.length === 0 ? (
                <EmptyState
                    icon={Receipt}
                    title="Aucun appel de charges"
                    description={
                        filters.search ||
                        filters.copropriete !== "ALL" ||
                        filters.trimestre !== "ALL" ||
                        filters.statut !== "ALL"
                            ? "Aucun appel ne correspond à vos critères"
                            : "Créez votre premier appel de charges"
                    }
                    action={
                        filters.search ||
                        filters.copropriete !== "ALL" ||
                        filters.trimestre !== "ALL" ||
                        filters.statut !== "ALL"
                            ? undefined
                            : {
                                label: "Créer un appel",
                                onClick: handleCreate,
                            }
                    }
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredAppels.map((appel) => (
                        <AppelChargesCard
                            key={appel.id}
                            appel={appel}
                            onView={handleView}
                            onAction={handleAction}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function ChargesPage() {
    return (
        <SuspensePage
            skeletonProps={{
                layout: "grid",
                headerActionsCount: 1,
                statsCount: 4,
            }}
        >
            <ChargesPageContent />
        </SuspensePage>
    );
}
