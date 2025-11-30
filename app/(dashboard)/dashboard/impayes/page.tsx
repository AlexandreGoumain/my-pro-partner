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
    AlertCircle, Home, User, Euro, Calendar, Send,
    Phone, Mail, FileText, AlertTriangle, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface Impaye {
    id: string;
    bail: {
        id: string;
        reference: string;
        bien: {
            id: string;
            titre: string;
            ville: string;
        };
        locataire: {
            id: string;
            nom: string;
            prenom: string;
            email?: string;
            telephone?: string;
        };
    };
    montantTotal: number;
    moisConcernes: string[];
    joursRetard: number;
    relances: {
        id: string;
        date: string;
        type: "EMAIL" | "SMS" | "COURRIER" | "RECOMMANDE" | "HUISSIER";
        statut: "ENVOYEE" | "RECU" | "SANS_REPONSE";
    }[];
    statut: "EN_COURS" | "EN_RELANCE" | "PROCEDURE" | "REGULARISE";
    notes?: string;
}

interface ImpayesFilters {
    statut: string;
    retard: string;
    search: string;
}

const STATUT_OPTIONS = [
    { value: "ALL", label: "Tous les statuts" },
    { value: "EN_COURS", label: "En cours" },
    { value: "EN_RELANCE", label: "En relance" },
    { value: "PROCEDURE", label: "En procédure" },
    { value: "REGULARISE", label: "Régularisé" },
];

const RETARD_OPTIONS = [
    { value: "ALL", label: "Tous les retards" },
    { value: "7", label: "< 7 jours" },
    { value: "30", label: "< 30 jours" },
    { value: "60", label: "< 60 jours" },
    { value: "90", label: "> 90 jours" },
];

const STATUT_CONFIG: Record<string, { label: string; variant: "default" | "outline" | "secondary" | "destructive" }> = {
    EN_COURS: { label: "En cours", variant: "secondary" },
    EN_RELANCE: { label: "En relance", variant: "outline" },
    PROCEDURE: { label: "Procédure", variant: "destructive" },
    REGULARISE: { label: "Régularisé", variant: "default" },
};

const RELANCE_TYPE_LABELS: Record<string, string> = {
    EMAIL: "Email",
    SMS: "SMS",
    COURRIER: "Courrier",
    RECOMMANDE: "Recommandé",
    HUISSIER: "Huissier",
};

// Mock data
const mockImpayes: Impaye[] = [
    {
        id: "1",
        bail: {
            id: "b1",
            reference: "BAIL-0002",
            bien: { id: "bi1", titre: "Studio meublé proche métro", ville: "Paris" },
            locataire: {
                id: "l1",
                nom: "Durand",
                prenom: "Pierre",
                email: "pierre.durand@email.com",
                telephone: "06 98 76 54 32",
            },
        },
        montantTotal: 1780,
        moisConcernes: ["2023-12", "2024-01"],
        joursRetard: 45,
        relances: [
            { id: "r1", date: "2024-01-10", type: "EMAIL", statut: "ENVOYEE" },
            { id: "r2", date: "2024-01-20", type: "SMS", statut: "SANS_REPONSE" },
        ],
        statut: "EN_RELANCE",
        notes: "Locataire contacté par téléphone, promet un virement cette semaine",
    },
    {
        id: "2",
        bail: {
            id: "b2",
            reference: "BAIL-0005",
            bien: { id: "bi2", titre: "Appartement 2 pièces rénové", ville: "Lyon" },
            locataire: {
                id: "l2",
                nom: "Garcia",
                prenom: "Maria",
                email: "maria.garcia@email.com",
            },
        },
        montantTotal: 850,
        moisConcernes: ["2024-01"],
        joursRetard: 15,
        relances: [
            { id: "r3", date: "2024-01-15", type: "EMAIL", statut: "ENVOYEE" },
        ],
        statut: "EN_COURS",
    },
    {
        id: "3",
        bail: {
            id: "b3",
            reference: "BAIL-0008",
            bien: { id: "bi3", titre: "Local commercial centre-ville", ville: "Marseille" },
            locataire: {
                id: "l3",
                nom: "SARL ComPlus",
                prenom: "",
                email: "contact@complus.fr",
                telephone: "04 91 00 00 00",
            },
        },
        montantTotal: 8500,
        moisConcernes: ["2023-10", "2023-11", "2023-12", "2024-01"],
        joursRetard: 120,
        relances: [
            { id: "r4", date: "2023-11-05", type: "EMAIL", statut: "SANS_REPONSE" },
            { id: "r5", date: "2023-11-20", type: "RECOMMANDE", statut: "RECU" },
            { id: "r6", date: "2023-12-15", type: "HUISSIER", statut: "ENVOYEE" },
        ],
        statut: "PROCEDURE",
        notes: "Assignation tribunal prévue le 15/02/2024",
    },
];

function ImpayeCard({ impaye, onView, onRelance }: {
    impaye: Impaye;
    onView: (i: Impaye) => void;
    onRelance: (i: Impaye, type: string) => void;
}) {
    const statutConfig = STATUT_CONFIG[impaye.statut];
    const derniereRelance = impaye.relances[impaye.relances.length - 1];

    const getSeverity = (jours: number) => {
        if (jours > 90) return { color: "text-red-700 bg-red-50 border-red-200", label: "Critique" };
        if (jours > 60) return { color: "text-red-600 bg-red-50 border-red-100", label: "Urgent" };
        if (jours > 30) return { color: "text-amber-700 bg-amber-50 border-amber-200", label: "Important" };
        return { color: "text-amber-600 bg-amber-50 border-amber-100", label: "À surveiller" };
    };

    const severity = getSeverity(impaye.joursRetard);

    return (
        <Card
            className={cn(
                "p-5 border-black/[0.08] hover:border-black/20 transition-all cursor-pointer",
                impaye.joursRetard > 60 && "border-l-4 border-l-red-500"
            )}
            onClick={() => onView(impaye)}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant={statutConfig.variant} className="text-[10px] h-5">
                            {statutConfig.label}
                        </Badge>
                        <Badge variant="outline" className={cn("text-[10px] h-5", severity.color)}>
                            {severity.label}
                        </Badge>
                    </div>
                    <h3 className="text-[15px] font-medium text-black">
                        {impaye.bail.bien.titre}
                    </h3>
                </div>
                <div className="text-right">
                    <p className="text-[20px] font-bold text-red-600">
                        {impaye.montantTotal.toLocaleString("fr-FR")} €
                    </p>
                    <p className="text-[11px] text-black/40">
                        {impaye.moisConcernes.length} mois impayé{impaye.moisConcernes.length > 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            {/* Locataire */}
            <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-[13px] text-black/60">
                    <User className="w-4 h-4 text-black/40" />
                    <span>{impaye.bail.locataire.prenom} {impaye.bail.locataire.nom}</span>
                </div>
                {impaye.bail.locataire.telephone && (
                    <div className="flex items-center gap-2 text-[12px] text-black/40">
                        <Phone className="w-3.5 h-3.5" />
                        <a
                            href={`tel:${impaye.bail.locataire.telephone}`}
                            className="hover:text-black"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {impaye.bail.locataire.telephone}
                        </a>
                    </div>
                )}
            </div>

            {/* Retard */}
            <div className="flex items-center gap-2 bg-black/[0.02] rounded-lg p-3 mb-4">
                <Clock className="w-4 h-4 text-black/40" />
                <span className="text-[13px] text-black/60">
                    {impaye.joursRetard} jours de retard
                </span>
            </div>

            {/* Dernière relance */}
            {derniereRelance && (
                <div className="flex items-center gap-2 text-[12px] text-black/40 mb-4">
                    <Send className="w-3.5 h-3.5" />
                    <span>
                        Dernière relance: {RELANCE_TYPE_LABELS[derniereRelance.type]} le{" "}
                        {new Date(derniereRelance.date).toLocaleDateString("fr-FR")}
                    </span>
                </div>
            )}

            {/* Notes */}
            {impaye.notes && (
                <p className="text-[12px] text-black/40 line-clamp-2 mb-4">
                    {impaye.notes}
                </p>
            )}

            {/* Actions */}
            <div className="flex gap-2">
                {impaye.statut !== "PROCEDURE" && impaye.statut !== "REGULARISE" && (
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-[11px] h-7"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRelance(impaye, "EMAIL");
                            }}
                        >
                            <Mail className="w-3 h-3 mr-1" />
                            Email
                        </Button>
                        {impaye.bail.locataire.telephone && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-[11px] h-7"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRelance(impaye, "SMS");
                                }}
                            >
                                <Phone className="w-3 h-3 mr-1" />
                                SMS
                            </Button>
                        )}
                        {impaye.joursRetard > 30 && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-[11px] h-7 text-amber-700 border-amber-200 hover:bg-amber-50"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRelance(impaye, "RECOMMANDE");
                                }}
                            >
                                <FileText className="w-3 h-3 mr-1" />
                                Recommandé
                            </Button>
                        )}
                    </>
                )}
                <Button
                    variant="outline"
                    size="sm"
                    className="text-[11px] h-7 ml-auto"
                    onClick={(e) => {
                        e.stopPropagation();
                        onView(impaye);
                    }}
                >
                    Voir détails
                </Button>
            </div>
        </Card>
    );
}

function ImpayesPageContent() {
    const router = useRouter();
    const [filters, setFilters] = useState<ImpayesFilters>({
        statut: "ALL",
        retard: "ALL",
        search: "",
    });

    const impayes = mockImpayes;
    const isLoading = false;

    const handleFilterChange = useCallback(
        (key: keyof ImpayesFilters, value: string) => {
            setFilters((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    const handleView = useCallback((impaye: Impaye) => {
        router.push(`/dashboard/impayes/${impaye.id}`);
    }, [router]);

    const handleRelance = useCallback((_impaye: Impaye, _type: string) => {
        // Relance logic handled via mutation
    }, []);

    // Filter
    const filteredImpayes = impayes.filter((i) => {
        if (filters.statut !== "ALL" && i.statut !== filters.statut) return false;
        if (filters.retard !== "ALL") {
            const maxDays = parseInt(filters.retard);
            if (filters.retard === "90") {
                if (i.joursRetard <= 90) return false;
            } else {
                if (i.joursRetard > maxDays) return false;
            }
        }
        if (filters.search) {
            const search = filters.search.toLowerCase();
            return (
                i.bail.reference.toLowerCase().includes(search) ||
                i.bail.bien.titre.toLowerCase().includes(search) ||
                i.bail.locataire.nom.toLowerCase().includes(search) ||
                i.bail.locataire.prenom.toLowerCase().includes(search)
            );
        }
        return true;
    });

    // Stats
    const totalImpayes = impayes.filter((i) => i.statut !== "REGULARISE").length;
    const montantTotal = impayes
        .filter((i) => i.statut !== "REGULARISE")
        .reduce((acc, i) => acc + i.montantTotal, 0);
    const enProcedure = impayes.filter((i) => i.statut === "PROCEDURE").length;
    const critiques = impayes.filter((i) => i.joursRetard > 60 && i.statut !== "REGULARISE").length;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Gestion des impayés"
                description="Suivez et relancez les loyers impayés"
            />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Dossiers actifs</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-red-600">
                        {totalImpayes}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Montant total dû</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-red-600">
                        {montantTotal.toLocaleString("fr-FR")} €
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">En procédure</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {enProcedure}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Critiques (&gt; 60j)</p>
                    <p className={cn(
                        "text-[28px] font-bold tracking-[-0.02em]",
                        critiques > 0 ? "text-red-600" : "text-black"
                    )}>
                        {critiques}
                    </p>
                </Card>
            </div>

            {/* Alerte si impayés critiques */}
            {critiques > 0 && (
                <Card className="p-4 bg-red-50 border-red-200">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-600" strokeWidth={2} />
                        <div className="flex-1">
                            <p className="text-[14px] font-medium text-red-800">
                                {critiques} dossier{critiques > 1 ? "s" : ""} critique{critiques > 1 ? "s" : ""}
                            </p>
                            <p className="text-[12px] text-red-600">
                                Plus de 60 jours de retard - Action urgente requise
                            </p>
                        </div>
                    </div>
                </Card>
            )}

            <FilterBar
                variant="card"
                filters={[
                    {
                        type: "search",
                        value: filters.search || "",
                        onChange: (value) => handleFilterChange("search", value),
                        placeholder: "Rechercher par bien, locataire...",
                        className: "flex-1",
                    },
                    {
                        type: "select",
                        value: filters.statut || "ALL",
                        onChange: (value) => handleFilterChange("statut", value),
                        options: STATUT_OPTIONS,
                        label: "Statut",
                    },
                    {
                        type: "select",
                        value: filters.retard || "ALL",
                        onChange: (value) => handleFilterChange("retard", value),
                        options: RETARD_OPTIONS,
                        label: "Retard",
                    },
                ]}
            />

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="h-[280px] bg-black/5 rounded-lg animate-pulse"
                        />
                    ))}
                </div>
            ) : filteredImpayes.length === 0 ? (
                <EmptyState
                    icon={AlertCircle}
                    title={totalImpayes === 0 ? "Aucun impayé" : "Aucun résultat"}
                    description={
                        totalImpayes === 0
                            ? "Tous vos locataires sont à jour de leurs paiements"
                            : "Aucun impayé ne correspond à vos critères de recherche"
                    }
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredImpayes.map((impaye) => (
                        <ImpayeCard
                            key={impaye.id}
                            impaye={impaye}
                            onView={handleView}
                            onRelance={handleRelance}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function ImpayesPage() {
    return (
        <SuspensePage
            skeletonProps={{
                layout: "grid",
                statsCount: 4,
            }}
        >
            <ImpayesPageContent />
        </SuspensePage>
    );
}
