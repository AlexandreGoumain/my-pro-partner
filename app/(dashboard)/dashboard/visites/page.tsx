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
import { Calendar, Plus, Clock, User, Home, Phone, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVisites, type VisiteWithRelations, type VisitesFilters as ApiVisitesFilters } from "@/hooks/immobilier/use-visites";

interface PageFilters {
    statut: string;
    dateDebut?: string;
    dateFin?: string;
    search: string;
}

const STATUT_OPTIONS = [
    { value: "ALL", label: "Tous les statuts" },
    { value: "PLANIFIEE", label: "Planifiée" },
    { value: "CONFIRMEE", label: "Confirmée" },
    { value: "EFFECTUEE", label: "Effectuée" },
    { value: "ANNULEE", label: "Annulée" },
    { value: "REPORT", label: "Reportée" },
];

const STATUT_CONFIG: Record<string, { label: string; variant: "default" | "outline" | "secondary"; icon: typeof CheckCircle2 }> = {
    PLANIFIEE: { label: "Planifiée", variant: "outline", icon: Clock },
    CONFIRMEE: { label: "Confirmée", variant: "default", icon: CheckCircle2 },
    EFFECTUEE: { label: "Effectuée", variant: "secondary", icon: CheckCircle2 },
    ANNULEE: { label: "Annulée", variant: "outline", icon: XCircle },
    REPORT: { label: "Reportée", variant: "outline", icon: AlertCircle },
};

const INTERET_CONFIG: Record<number, { label: string; className: string }> = {
    5: { label: "Très intéressé", className: "text-emerald-600" },
    4: { label: "Intéressé", className: "text-green-600" },
    3: { label: "Mitigé", className: "text-amber-600" },
    2: { label: "Peu intéressé", className: "text-black/50" },
    1: { label: "Pas intéressé", className: "text-black/40" },
};

function VisiteCard({ visite, onView, onEdit }: { visite: VisiteWithRelations; onView: (v: VisiteWithRelations) => void; onEdit: (v: VisiteWithRelations) => void }) {
    const statutConfig = STATUT_CONFIG[visite.statut];
    const StatutIcon = statutConfig.icon;
    const interetConfig = visite.interesseNote ? INTERET_CONFIG[visite.interesseNote] : null;

    const dateVisite = new Date(visite.dateVisite);
    const isToday = dateVisite.toDateString() === new Date().toDateString();
    const isTomorrow = dateVisite.toDateString() === new Date(Date.now() + 86400000).toDateString();
    const isPast = dateVisite < new Date() && visite.statut !== "EFFECTUEE";

    const formatDate = (date: Date) => {
        if (isToday) return "Aujourd'hui";
        if (isTomorrow) return "Demain";
        return date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
    };

    return (
        <Card
            className={cn(
                "p-4 border-black/[0.08] hover:border-black/20 transition-all cursor-pointer",
                isToday && visite.statut === "CONFIRMEE" && "border-l-4 border-l-black"
            )}
            onClick={() => onView(visite)}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    {/* Date et heure */}
                    <div className="flex items-center gap-2 mb-3">
                        <div className={cn(
                            "text-[14px] font-medium",
                            isToday ? "text-black" : isPast ? "text-black/40" : "text-black/60"
                        )}>
                            {formatDate(dateVisite)}
                        </div>
                        <div className="text-[13px] text-black/40">
                            {dateVisite.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                            {visite.duree && ` (${visite.duree} min)`}
                        </div>
                        <Badge variant={statutConfig.variant} className="text-[11px] h-5">
                            <StatutIcon className="w-3 h-3 mr-1" />
                            {statutConfig.label}
                        </Badge>
                    </div>

                    {/* Bien */}
                    {visite.bien && (
                        <div className="flex items-start gap-2 mb-2">
                            <Home className="w-4 h-4 text-black/40 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-[14px] font-medium text-black line-clamp-1">
                                    {visite.bien.titre}
                                </p>
                                <div className="flex items-center gap-2 text-[12px] text-black/40">
                                    <span>{visite.bien.reference}</span>
                                    <span>·</span>
                                    <span>{visite.bien.ville}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Visiteur */}
                    {visite.visiteur && (
                        <div className="flex items-center gap-2 mb-2">
                            <User className="w-4 h-4 text-black/40 flex-shrink-0" />
                            <span className="text-[13px] text-black/60">
                                {visite.visiteur.prenom} {visite.visiteur.nom}
                            </span>
                            {visite.visiteur.telephone && (
                                <a
                                    href={`tel:${visite.visiteur.telephone}`}
                                    className="flex items-center gap-1 text-[12px] text-black/40 hover:text-black"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Phone className="w-3 h-3" />
                                    {visite.visiteur.telephone}
                                </a>
                            )}
                        </div>
                    )}

                    {/* Intérêt acquéreur (si visite effectuée) */}
                    {interetConfig && (
                        <div className={cn("text-[12px] font-medium", interetConfig.className)}>
                            {interetConfig.label}
                        </div>
                    )}

                    {/* Compte rendu (si visite effectuée) */}
                    {visite.compteRendu && (
                        <p className="text-[12px] text-black/40 mt-2 line-clamp-2">
                            {visite.compteRendu}
                        </p>
                    )}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    className="text-[12px] h-8"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(visite);
                    }}
                >
                    Modifier
                </Button>
            </div>
        </Card>
    );
}

function VisitesPageContent() {
    const router = useRouter();
    const [filters, setFilters] = useState<PageFilters>({
        statut: "ALL",
        search: "",
    });

    const apiFilters: ApiVisitesFilters = {
        statut: filters.statut !== "ALL" ? filters.statut as any : undefined,
    };

    const { data: visites = [], isLoading } = useVisites(apiFilters);

    const handleFilterChange = useCallback(
        (key: keyof PageFilters, value: string) => {
            setFilters((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    const handleView = useCallback((visite: VisiteWithRelations) => {
        router.push(`/dashboard/visites/${visite.id}`);
    }, [router]);

    const handleEdit = useCallback((visite: VisiteWithRelations) => {
        router.push(`/dashboard/visites/${visite.id}/edit`);
    }, [router]);

    const handleCreate = useCallback(() => {
        router.push("/dashboard/visites/nouveau");
    }, [router]);

    // Stats
    const todayCount = visites.filter((v) => {
        const date = new Date(v.dateVisite);
        return date.toDateString() === new Date().toDateString() &&
               (v.statut === "PLANIFIEE" || v.statut === "CONFIRMEE");
    }).length;

    const weekCount = visites.filter((v) => {
        const date = new Date(v.dateVisite);
        const now = new Date();
        const weekEnd = new Date(now.getTime() + 7 * 86400000);
        return date >= now && date <= weekEnd &&
               (v.statut === "PLANIFIEE" || v.statut === "CONFIRMEE");
    }).length;

    const effectueesCount = visites.filter((v) => v.statut === "EFFECTUEE").length;

    // Filter visites by search (client-side)
    const filteredVisites = visites.filter((v) => {
        if (filters.search) {
            const search = filters.search.toLowerCase();
            return (
                v.bien?.titre.toLowerCase().includes(search) ||
                v.bien?.reference.toLowerCase().includes(search) ||
                v.visiteur?.nom.toLowerCase().includes(search) ||
                v.visiteur?.prenom?.toLowerCase().includes(search)
            );
        }
        return true;
    });

    // Group by date
    const groupedVisites = filteredVisites.reduce((acc, visite) => {
        const date = new Date(visite.dateVisite).toDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(visite);
        return acc;
    }, {} as Record<string, VisiteWithRelations[]>);

    const sortedDates = Object.keys(groupedVisites).sort((a, b) =>
        new Date(a).getTime() - new Date(b).getTime()
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="Planning des visites"
                description="Gérez vos visites de biens avec vos acquéreurs"
                actions={
                    <Button
                        onClick={handleCreate}
                        className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                    >
                        <Plus className="mr-2 h-4 w-4" strokeWidth={2} />
                        Planifier une visite
                    </Button>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Aujourd'hui</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {todayCount}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Cette semaine</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {weekCount}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Effectuées (total)</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {effectueesCount}
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
                        placeholder: "Rechercher par bien, acquéreur...",
                        className: "flex-1",
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
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="h-[120px] bg-black/5 rounded-lg animate-pulse"
                        />
                    ))}
                </div>
            ) : filteredVisites.length === 0 ? (
                <EmptyState
                    icon={Calendar}
                    title="Aucune visite"
                    description={
                        filters.search || filters.statut !== "ALL"
                            ? "Aucune visite ne correspond à vos critères"
                            : "Planifiez votre première visite de bien"
                    }
                    action={
                        filters.search || filters.statut !== "ALL"
                            ? undefined
                            : {
                                label: "Planifier une visite",
                                onClick: handleCreate,
                            }
                    }
                />
            ) : (
                <div className="space-y-6">
                    {sortedDates.map((dateStr) => {
                        const date = new Date(dateStr);
                        const isToday = date.toDateString() === new Date().toDateString();
                        const isTomorrow = date.toDateString() === new Date(Date.now() + 86400000).toDateString();

                        let dateLabel = date.toLocaleDateString("fr-FR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long"
                        });
                        if (isToday) dateLabel = "Aujourd'hui - " + dateLabel;
                        if (isTomorrow) dateLabel = "Demain - " + dateLabel;

                        return (
                            <div key={dateStr}>
                                <h3 className={cn(
                                    "text-[14px] font-medium mb-3 capitalize",
                                    isToday ? "text-black" : "text-black/60"
                                )}>
                                    {dateLabel}
                                </h3>
                                <div className="space-y-3">
                                    {groupedVisites[dateStr]
                                        .sort((a, b) => new Date(a.dateVisite).getTime() - new Date(b.dateVisite).getTime())
                                        .map((visite) => (
                                            <VisiteCard
                                                key={visite.id}
                                                visite={visite}
                                                onView={handleView}
                                                onEdit={handleEdit}
                                            />
                                        ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default function VisitesPage() {
    return (
        <SuspensePage
            skeletonProps={{
                layout: "list",
                headerActionsCount: 1,
                statsCount: 3,
            }}
        >
            <VisitesPageContent />
        </SuspensePage>
    );
}
