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
    Grid3x3, Plus, Building2, User, Euro, Home,
    Maximize, AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface Lot {
    id: string;
    numero: string;
    typeLot: "APPARTEMENT" | "PARKING" | "CAVE" | "COMMERCE" | "BUREAU" | "AUTRE";
    etage?: number;
    batiment?: string;
    tantiemes: number;
    tanttiemesSpeciaux?: Record<string, number>;
    surface?: number;
    proprietaire: {
        id: string;
        nom: string;
        prenom: string;
        email?: string;
    };
    copropriete: {
        id: string;
        nom: string;
    };
    soldeCourant: number;
    aJourPaiements: boolean;
}

interface LotsFilters {
    copropriete: string;
    typeLot: string;
    search: string;
}

const TYPE_LOT_OPTIONS = [
    { value: "ALL", label: "Tous les types" },
    { value: "APPARTEMENT", label: "Appartement" },
    { value: "PARKING", label: "Parking" },
    { value: "CAVE", label: "Cave" },
    { value: "COMMERCE", label: "Commerce" },
    { value: "BUREAU", label: "Bureau" },
    { value: "AUTRE", label: "Autre" },
];

const TYPE_LOT_LABELS: Record<string, string> = {
    APPARTEMENT: "Appartement",
    PARKING: "Parking",
    CAVE: "Cave",
    COMMERCE: "Commerce",
    BUREAU: "Bureau",
    AUTRE: "Autre",
};

const TYPE_LOT_ICONS: Record<string, typeof Home> = {
    APPARTEMENT: Home,
    PARKING: Grid3x3,
    CAVE: Grid3x3,
    COMMERCE: Building2,
    BUREAU: Building2,
    AUTRE: Grid3x3,
};

// Mock data
const mockLots: Lot[] = [
    {
        id: "1",
        numero: "A-101",
        typeLot: "APPARTEMENT",
        etage: 1,
        batiment: "A",
        tantiemes: 450,
        surface: 65,
        proprietaire: { id: "p1", nom: "Martin", prenom: "Jean", email: "jean.martin@email.com" },
        copropriete: { id: "c1", nom: "Résidence Les Jardins" },
        soldeCourant: 0,
        aJourPaiements: true,
    },
    {
        id: "2",
        numero: "A-102",
        typeLot: "APPARTEMENT",
        etage: 1,
        batiment: "A",
        tantiemes: 380,
        surface: 52,
        proprietaire: { id: "p2", nom: "Durand", prenom: "Marie", email: "marie.durand@email.com" },
        copropriete: { id: "c1", nom: "Résidence Les Jardins" },
        soldeCourant: -850,
        aJourPaiements: false,
    },
    {
        id: "3",
        numero: "P-15",
        typeLot: "PARKING",
        batiment: "Sous-sol",
        tantiemes: 25,
        proprietaire: { id: "p1", nom: "Martin", prenom: "Jean" },
        copropriete: { id: "c1", nom: "Résidence Les Jardins" },
        soldeCourant: 0,
        aJourPaiements: true,
    },
    {
        id: "4",
        numero: "B-201",
        typeLot: "APPARTEMENT",
        etage: 2,
        batiment: "B",
        tantiemes: 520,
        surface: 78,
        proprietaire: { id: "p3", nom: "Bernard", prenom: "Pierre" },
        copropriete: { id: "c1", nom: "Résidence Les Jardins" },
        soldeCourant: -1200,
        aJourPaiements: false,
    },
    {
        id: "5",
        numero: "C-01",
        typeLot: "CAVE",
        batiment: "Sous-sol",
        tantiemes: 10,
        proprietaire: { id: "p2", nom: "Durand", prenom: "Marie" },
        copropriete: { id: "c1", nom: "Résidence Les Jardins" },
        soldeCourant: 0,
        aJourPaiements: true,
    },
];

function LotCard({ lot, onView, onEdit }: {
    lot: Lot;
    onView: (l: Lot) => void;
    onEdit: (l: Lot) => void;
}) {
    const TypeIcon = TYPE_LOT_ICONS[lot.typeLot] || Grid3x3;
    const hasDebt = lot.soldeCourant < 0;

    return (
        <Card
            className={cn(
                "p-4 border-black/[0.08] hover:border-black/20 transition-all cursor-pointer",
                hasDebt && "border-l-4 border-l-red-500"
            )}
            onClick={() => onView(lot)}
        >
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black/5 rounded-lg flex items-center justify-center">
                        <TypeIcon className="w-5 h-5 text-black/40" />
                    </div>
                    <div>
                        <h3 className="text-[15px] font-medium text-black">
                            Lot {lot.numero}
                        </h3>
                        <Badge variant="outline" className="text-[10px] mt-1">
                            {TYPE_LOT_LABELS[lot.typeLot]}
                        </Badge>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[14px] font-bold text-black">
                        {lot.tantiemes} t
                    </p>
                    <p className="text-[10px] text-black/40">tantièmes</p>
                </div>
            </div>

            {/* Localisation */}
            {(lot.batiment || lot.etage !== undefined) && (
                <div className="flex items-center gap-2 text-[12px] text-black/40 mb-2">
                    {lot.batiment && <span>Bât. {lot.batiment}</span>}
                    {lot.etage !== undefined && <span>· {lot.etage}e étage</span>}
                </div>
            )}

            {/* Surface */}
            {lot.surface && (
                <div className="flex items-center gap-2 text-[12px] text-black/40 mb-3">
                    <Maximize className="w-3.5 h-3.5" />
                    <span>{lot.surface} m²</span>
                </div>
            )}

            {/* Propriétaire */}
            <div className="flex items-center gap-2 text-[13px] text-black/60 mb-3">
                <User className="w-4 h-4 text-black/40" />
                <span>{lot.proprietaire.prenom} {lot.proprietaire.nom}</span>
            </div>

            {/* Solde */}
            <div className={cn(
                "rounded-lg p-2 mb-3",
                hasDebt ? "bg-red-50" : "bg-black/[0.02]"
            )}>
                <div className="flex items-center justify-between">
                    <span className="text-[11px] text-black/40">Solde</span>
                    <span className={cn(
                        "text-[13px] font-medium",
                        hasDebt ? "text-red-600" : "text-emerald-600"
                    )}>
                        {lot.soldeCourant === 0 ? "À jour" : `${lot.soldeCourant.toLocaleString("fr-FR")} €`}
                    </span>
                </div>
            </div>

            {/* Copropriété */}
            <div className="flex items-center gap-2 text-[11px] text-black/40 mb-3">
                <Building2 className="w-3 h-3" />
                <span>{lot.copropriete.nom}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="text-[11px] h-7 flex-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        onView(lot);
                    }}
                >
                    Voir
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="text-[11px] h-7"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(lot);
                    }}
                >
                    Modifier
                </Button>
            </div>
        </Card>
    );
}

function LotsPageContent() {
    const router = useRouter();
    const [filters, setFilters] = useState<LotsFilters>({
        copropriete: "ALL",
        typeLot: "ALL",
        search: "",
    });

    const lots = mockLots;
    const isLoading = false;

    const handleFilterChange = useCallback(
        (key: keyof LotsFilters, value: string) => {
            setFilters((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    const handleView = useCallback((lot: Lot) => {
        router.push(`/dashboard/lots/${lot.id}`);
    }, [router]);

    const handleEdit = useCallback((lot: Lot) => {
        router.push(`/dashboard/lots/${lot.id}/edit`);
    }, [router]);

    const handleCreate = useCallback(() => {
        router.push("/dashboard/lots/nouveau");
    }, [router]);

    // Generate copropriete options
    const coproOptions = [
        { value: "ALL", label: "Toutes les copropriétés" },
        ...Array.from(new Set(lots.map((l) => l.copropriete.id))).map((id) => {
            const copro = lots.find((l) => l.copropriete.id === id)?.copropriete;
            return { value: id, label: copro?.nom || id };
        }),
    ];

    // Filter
    const filteredLots = lots.filter((l) => {
        if (filters.copropriete !== "ALL" && l.copropriete.id !== filters.copropriete) return false;
        if (filters.typeLot !== "ALL" && l.typeLot !== filters.typeLot) return false;
        if (filters.search) {
            const search = filters.search.toLowerCase();
            return (
                l.numero.toLowerCase().includes(search) ||
                l.proprietaire.nom.toLowerCase().includes(search) ||
                l.proprietaire.prenom.toLowerCase().includes(search)
            );
        }
        return true;
    });

    // Stats
    const totalLots = lots.length;
    const totalTantiemes = lots.reduce((acc, l) => acc + l.tantiemes, 0);
    const lotsImpayes = lots.filter((l) => !l.aJourPaiements).length;
    const montantImpayes = Math.abs(
        lots.filter((l) => l.soldeCourant < 0).reduce((acc, l) => acc + l.soldeCourant, 0)
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="Lots & Tantièmes"
                description="Gérez les lots de vos copropriétés et leurs propriétaires"
                actions={
                    <Button
                        onClick={handleCreate}
                        className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                    >
                        <Plus className="mr-2 h-4 w-4" strokeWidth={2} />
                        Nouveau lot
                    </Button>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Total lots</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {totalLots}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Tantièmes totaux</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {totalTantiemes.toLocaleString("fr-FR")}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Lots en impayé</p>
                    <p className={cn(
                        "text-[28px] font-bold tracking-[-0.02em]",
                        lotsImpayes > 0 ? "text-red-600" : "text-black"
                    )}>
                        {lotsImpayes}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Montant impayés</p>
                    <p className={cn(
                        "text-[28px] font-bold tracking-[-0.02em]",
                        montantImpayes > 0 ? "text-red-600" : "text-black"
                    )}>
                        {montantImpayes.toLocaleString("fr-FR")} €
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
                        placeholder: "Rechercher par numéro, propriétaire...",
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
                        value: filters.typeLot || "ALL",
                        onChange: (value) => handleFilterChange("typeLot", value),
                        options: TYPE_LOT_OPTIONS,
                        label: "Type",
                    },
                ]}
            />

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="h-[220px] bg-black/5 rounded-lg animate-pulse"
                        />
                    ))}
                </div>
            ) : filteredLots.length === 0 ? (
                <EmptyState
                    icon={Grid3x3}
                    title="Aucun lot"
                    description={
                        filters.search ||
                        filters.copropriete !== "ALL" ||
                        filters.typeLot !== "ALL"
                            ? "Aucun lot ne correspond à vos critères"
                            : "Créez votre premier lot"
                    }
                    action={
                        filters.search ||
                        filters.copropriete !== "ALL" ||
                        filters.typeLot !== "ALL"
                            ? undefined
                            : {
                                label: "Créer un lot",
                                onClick: handleCreate,
                            }
                    }
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filteredLots.map((lot) => (
                        <LotCard
                            key={lot.id}
                            lot={lot}
                            onView={handleView}
                            onEdit={handleEdit}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function LotsPage() {
    return (
        <SuspensePage
            skeletonProps={{
                layout: "grid",
                headerActionsCount: 1,
                statsCount: 4,
            }}
        >
            <LotsPageContent />
        </SuspensePage>
    );
}
