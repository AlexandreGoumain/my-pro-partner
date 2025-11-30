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
import { Users, Plus, MapPin, Home, Euro, Maximize, Heart, Mail, Phone, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface RechercheAcquereur {
    id: string;
    typeBien: string[];
    budgetMin?: number;
    budgetMax?: number;
    surfaceMin?: number;
    surfaceMax?: number;
    nbPiecesMin?: number;
    villesRecherchees: string[];
    criteres?: Record<string, boolean>;
    actif: boolean;
    client: {
        id: string;
        nom: string;
        prenom: string;
        email?: string;
        telephone?: string;
    };
    matchCount?: number;
}

interface BienMatch {
    id: string;
    reference: string;
    titre: string;
    typeBien: string;
    ville: string;
    prix: number;
    surface: number;
    nbPieces?: number;
    score: number;
    photos?: string[];
}

interface MatchingFilters {
    ville: string;
    budgetMax: string;
    search: string;
}

const TYPE_BIEN_LABELS: Record<string, string> = {
    APPARTEMENT: "Appartement",
    MAISON: "Maison",
    TERRAIN: "Terrain",
    LOCAL_COMMERCIAL: "Local commercial",
    IMMEUBLE: "Immeuble",
    PARKING: "Parking",
};

// Mock data
const mockRecherches: RechercheAcquereur[] = [
    {
        id: "1",
        typeBien: ["APPARTEMENT"],
        budgetMin: 300000,
        budgetMax: 450000,
        surfaceMin: 60,
        surfaceMax: 90,
        nbPiecesMin: 3,
        villesRecherchees: ["Paris", "Boulogne-Billancourt"],
        criteres: { balcon: true, ascenseur: true },
        actif: true,
        client: {
            id: "c1",
            nom: "Martin",
            prenom: "Sophie",
            email: "sophie.martin@email.com",
            telephone: "06 12 34 56 78",
        },
        matchCount: 3,
    },
    {
        id: "2",
        typeBien: ["MAISON"],
        budgetMin: 500000,
        budgetMax: 700000,
        surfaceMin: 120,
        nbPiecesMin: 4,
        villesRecherchees: ["Lyon", "Villeurbanne", "Caluire"],
        criteres: { jardin: true, garage: true },
        actif: true,
        client: {
            id: "c2",
            nom: "Durand",
            prenom: "Pierre",
            email: "pierre.durand@email.com",
            telephone: "06 98 76 54 32",
        },
        matchCount: 5,
    },
    {
        id: "3",
        typeBien: ["APPARTEMENT", "MAISON"],
        budgetMax: 250000,
        surfaceMin: 40,
        villesRecherchees: ["Marseille"],
        actif: true,
        client: {
            id: "c3",
            nom: "Bernard",
            prenom: "Marie",
            email: "marie.bernard@email.com",
        },
        matchCount: 2,
    },
];

const mockBiens: BienMatch[] = [
    {
        id: "b1",
        reference: "BIEN-0001",
        titre: "Appartement 3 pièces avec balcon",
        typeBien: "APPARTEMENT",
        ville: "Paris",
        prix: 420000,
        surface: 72,
        nbPieces: 3,
        score: 95,
    },
    {
        id: "b2",
        reference: "BIEN-0002",
        titre: "Appartement 3 pièces rénové",
        typeBien: "APPARTEMENT",
        ville: "Boulogne-Billancourt",
        prix: 380000,
        surface: 65,
        nbPieces: 3,
        score: 88,
    },
    {
        id: "b3",
        reference: "BIEN-0003",
        titre: "Appartement 4 pièces lumineux",
        typeBien: "APPARTEMENT",
        ville: "Paris",
        prix: 445000,
        surface: 85,
        nbPieces: 4,
        score: 72,
    },
];

function RechercheCard({ recherche, onView, onMatch }: {
    recherche: RechercheAcquereur;
    onView: (r: RechercheAcquereur) => void;
    onMatch: (r: RechercheAcquereur) => void;
}) {
    const budgetText = recherche.budgetMin && recherche.budgetMax
        ? `${(recherche.budgetMin / 1000).toFixed(0)}k - ${(recherche.budgetMax / 1000).toFixed(0)}k €`
        : recherche.budgetMax
            ? `Max ${(recherche.budgetMax / 1000).toFixed(0)}k €`
            : recherche.budgetMin
                ? `Min ${(recherche.budgetMin / 1000).toFixed(0)}k €`
                : "Non défini";

    const surfaceText = recherche.surfaceMin && recherche.surfaceMax
        ? `${recherche.surfaceMin} - ${recherche.surfaceMax} m²`
        : recherche.surfaceMin
            ? `Min ${recherche.surfaceMin} m²`
            : recherche.surfaceMax
                ? `Max ${recherche.surfaceMax} m²`
                : null;

    return (
        <Card
            className="p-5 border-black/[0.08] hover:border-black/20 transition-all cursor-pointer"
            onClick={() => onView(recherche)}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-[15px] font-medium text-black">
                        {recherche.client.prenom} {recherche.client.nom}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        {recherche.client.email && (
                            <a
                                href={`mailto:${recherche.client.email}`}
                                className="text-[12px] text-black/40 hover:text-black flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Mail className="w-3 h-3" />
                                {recherche.client.email}
                            </a>
                        )}
                    </div>
                </div>
                {recherche.matchCount !== undefined && recherche.matchCount > 0 && (
                    <Badge variant="default" className="bg-black text-white text-[11px]">
                        {recherche.matchCount} match{recherche.matchCount > 1 ? "s" : ""}
                    </Badge>
                )}
            </div>

            {/* Critères */}
            <div className="space-y-3 mb-4">
                {/* Types de bien */}
                <div className="flex flex-wrap gap-1.5">
                    {recherche.typeBien.map((type) => (
                        <Badge key={type} variant="outline" className="text-[11px]">
                            <Home className="w-3 h-3 mr-1" />
                            {TYPE_BIEN_LABELS[type] || type}
                        </Badge>
                    ))}
                </div>

                {/* Budget */}
                <div className="flex items-center gap-2 text-[13px]">
                    <Euro className="w-4 h-4 text-black/40" />
                    <span className="text-black/60">{budgetText}</span>
                </div>

                {/* Surface */}
                {surfaceText && (
                    <div className="flex items-center gap-2 text-[13px]">
                        <Maximize className="w-4 h-4 text-black/40" />
                        <span className="text-black/60">{surfaceText}</span>
                        {recherche.nbPiecesMin && (
                            <span className="text-black/40">· Min {recherche.nbPiecesMin} pièces</span>
                        )}
                    </div>
                )}

                {/* Villes */}
                <div className="flex items-center gap-2 text-[13px]">
                    <MapPin className="w-4 h-4 text-black/40" />
                    <span className="text-black/60">
                        {recherche.villesRecherchees.slice(0, 3).join(", ")}
                        {recherche.villesRecherchees.length > 3 && (
                            <span className="text-black/40"> +{recherche.villesRecherchees.length - 3}</span>
                        )}
                    </span>
                </div>

                {/* Critères spécifiques */}
                {recherche.criteres && Object.keys(recherche.criteres).length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {Object.entries(recherche.criteres)
                            .filter(([_, v]) => v)
                            .map(([key]) => (
                                <span key={key} className="text-[11px] text-black/40 bg-black/5 px-2 py-0.5 rounded">
                                    {key}
                                </span>
                            ))}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <Button
                    variant="default"
                    size="sm"
                    className="bg-black hover:bg-black/90 text-white text-[12px] h-8 flex-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        onMatch(recherche);
                    }}
                >
                    <Heart className="w-3 h-3 mr-1.5" />
                    Trouver des biens
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="text-[12px] h-8"
                    onClick={(e) => {
                        e.stopPropagation();
                        onView(recherche);
                    }}
                >
                    Voir
                </Button>
            </div>
        </Card>
    );
}

function BienMatchCard({ bien, onSelect }: { bien: BienMatch; onSelect: (b: BienMatch) => void }) {
    return (
        <Card
            className="p-4 border-black/[0.08] hover:border-black/20 transition-all cursor-pointer"
            onClick={() => onSelect(bien)}
        >
            <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-black/5 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <Home className="w-8 h-8 text-black/20" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[12px] text-black/40">{bien.reference}</span>
                        <div className={cn(
                            "text-[12px] font-medium px-2 py-0.5 rounded",
                            bien.score >= 90 ? "bg-emerald-100 text-emerald-700" :
                            bien.score >= 70 ? "bg-amber-100 text-amber-700" :
                            "bg-black/5 text-black/60"
                        )}>
                            {bien.score}% match
                        </div>
                    </div>
                    <h4 className="text-[14px] font-medium text-black line-clamp-1 mb-1">
                        {bien.titre}
                    </h4>
                    <div className="flex items-center gap-3 text-[12px] text-black/40">
                        <span>{bien.ville}</span>
                        <span>{bien.surface} m²</span>
                        {bien.nbPieces && <span>{bien.nbPieces} pièces</span>}
                    </div>
                    <p className="text-[14px] font-medium text-black mt-2">
                        {bien.prix.toLocaleString("fr-FR")} €
                    </p>
                </div>
            </div>
        </Card>
    );
}

function MatchingPageContent() {
    const router = useRouter();
    const [filters, setFilters] = useState<MatchingFilters>({
        ville: "",
        budgetMax: "",
        search: "",
    });
    const [selectedRecherche, setSelectedRecherche] = useState<RechercheAcquereur | null>(null);

    const recherches = mockRecherches;
    const biensMatches = mockBiens;
    const isLoading = false;

    const handleFilterChange = useCallback(
        (key: keyof MatchingFilters, value: string) => {
            setFilters((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    const handleView = useCallback((recherche: RechercheAcquereur) => {
        router.push(`/dashboard/matching/${recherche.id}`);
    }, [router]);

    const handleMatch = useCallback((recherche: RechercheAcquereur) => {
        setSelectedRecherche(recherche);
    }, []);

    const handleSelectBien = useCallback((_bien: BienMatch) => {
        // Match action handled via mutation
    }, []);

    const handleCreate = useCallback(() => {
        router.push("/dashboard/matching/nouveau");
    }, [router]);

    // Stats
    const totalRecherches = recherches.filter((r) => r.actif).length;
    const totalMatches = recherches.reduce((acc, r) => acc + (r.matchCount || 0), 0);

    // Filter
    const filteredRecherches = recherches.filter((r) => {
        if (!r.actif) return false;
        if (filters.ville && !r.villesRecherchees.some(v =>
            v.toLowerCase().includes(filters.ville.toLowerCase())
        )) return false;
        if (filters.budgetMax && r.budgetMin && r.budgetMin > parseInt(filters.budgetMax)) return false;
        if (filters.search) {
            const search = filters.search.toLowerCase();
            return (
                r.client.nom.toLowerCase().includes(search) ||
                r.client.prenom.toLowerCase().includes(search) ||
                r.villesRecherchees.some(v => v.toLowerCase().includes(search))
            );
        }
        return true;
    });

    return (
        <div className="space-y-6">
            <PageHeader
                title="Matching acquéreurs"
                description="Trouvez les biens correspondant aux recherches de vos clients"
                actions={
                    <Button
                        onClick={handleCreate}
                        className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                    >
                        <Plus className="mr-2 h-4 w-4" strokeWidth={2} />
                        Nouvelle recherche
                    </Button>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Recherches actives</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {totalRecherches}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Biens matchés</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {totalMatches}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Taux de matching</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {totalRecherches > 0 ? ((totalMatches / totalRecherches) * 100 / 10).toFixed(0) : 0}%
                    </p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recherches */}
                <div>
                    <FilterBar
                        variant="card"
                        filters={[
                            {
                                type: "search",
                                value: filters.search || "",
                                onChange: (value) => handleFilterChange("search", value),
                                placeholder: "Rechercher par client, ville...",
                                className: "flex-1",
                            },
                        ]}
                    />

                    {isLoading ? (
                        <div className="space-y-4 mt-4">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-[200px] bg-black/5 rounded-lg animate-pulse"
                                />
                            ))}
                        </div>
                    ) : filteredRecherches.length === 0 ? (
                        <EmptyState
                            icon={Users}
                            title="Aucune recherche"
                            description="Créez une recherche acquéreur pour trouver des biens correspondants"
                            action={{
                                label: "Créer une recherche",
                                onClick: handleCreate,
                            }}
                        />
                    ) : (
                        <div className="space-y-4 mt-4">
                            {filteredRecherches.map((recherche) => (
                                <RechercheCard
                                    key={recherche.id}
                                    recherche={recherche}
                                    onView={handleView}
                                    onMatch={handleMatch}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Biens matchés */}
                <div>
                    <Card className="p-4 border-black/[0.08]">
                        <h3 className="text-[15px] font-medium text-black mb-4">
                            {selectedRecherche
                                ? `Biens pour ${selectedRecherche.client.prenom} ${selectedRecherche.client.nom}`
                                : "Sélectionnez une recherche"
                            }
                        </h3>

                        {selectedRecherche ? (
                            <div className="space-y-3">
                                {biensMatches.map((bien) => (
                                    <BienMatchCard
                                        key={bien.id}
                                        bien={bien}
                                        onSelect={handleSelectBien}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Users className="w-12 h-12 text-black/10 mx-auto mb-3" />
                                <p className="text-[14px] text-black/40">
                                    Cliquez sur "Trouver des biens" pour voir les matchs
                                </p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default function MatchingPage() {
    return (
        <SuspensePage
            skeletonProps={{
                layout: "grid",
                headerActionsCount: 1,
                statsCount: 3,
            }}
        >
            <MatchingPageContent />
        </SuspensePage>
    );
}
