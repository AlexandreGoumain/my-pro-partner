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
    Users, Plus, Building2, User, Mail, Phone, Calendar,
    Crown, Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    useConseilSyndical,
    type MembreConseilWithRelations,
    type ConseilFilters
} from "@/hooks/syndic/use-conseil-syndical";

interface PageFilters {
    copropriete: string;
    role: string;
    search: string;
}

const ROLE_OPTIONS = [
    { value: "ALL", label: "Tous les rôles" },
    { value: "PRESIDENT", label: "Président" },
    { value: "MEMBRE", label: "Membre" },
    { value: "SUPPLEANT", label: "Suppléant" },
];

const ROLE_CONFIG: Record<string, { label: string; icon: typeof User; color: string }> = {
    PRESIDENT: { label: "Président", icon: Crown, color: "text-black/60 bg-black/5" },
    MEMBRE: { label: "Membre", icon: Star, color: "text-black/60 bg-black/5" },
    SUPPLEANT: { label: "Suppléant", icon: User, color: "text-black/40 bg-black/[0.02]" },
};

function MembreCSCard({ membre, onView, onContact }: {
    membre: MembreConseilWithRelations;
    onView: (m: MembreConseilWithRelations) => void;
    onContact: (m: MembreConseilWithRelations, type: string) => void;
}) {
    const roleConfig = ROLE_CONFIG[membre.role] || ROLE_CONFIG.MEMBRE;
    const RoleIcon = roleConfig.icon;
    const dateDebut = new Date(membre.dateDebut);
    const anciennete = Math.floor(
        (Date.now() - dateDebut.getTime()) / (1000 * 60 * 60 * 24 * 365)
    );

    return (
        <Card
            className="p-5 border-black/[0.08] hover:border-black/20 transition-all cursor-pointer"
            onClick={() => onView(membre)}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        roleConfig.color
                    )}>
                        <RoleIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-[15px] font-medium text-black">
                            {membre.membre?.prenom} {membre.membre?.nom}
                        </h3>
                        <Badge variant="outline" className="text-[10px] mt-1">
                            {roleConfig.label}
                        </Badge>
                    </div>
                </div>
                {membre.actif && (
                    <Badge variant="default" className="text-[10px] h-5">
                        Actif
                    </Badge>
                )}
            </div>

            {/* Copropriété */}
            {membre.copropriete && (
                <div className="flex items-center gap-2 text-[12px] text-black/40 mb-4">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{membre.copropriete.nom}</span>
                </div>
            )}

            {/* Contact */}
            <div className="space-y-2 mb-4">
                {membre.membre?.email && (
                    <a
                        href={`mailto:${membre.membre.email}`}
                        className="flex items-center gap-2 text-[12px] text-black/40 hover:text-black"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Mail className="w-3.5 h-3.5" />
                        <span>{membre.membre.email}</span>
                    </a>
                )}
                {membre.membre?.telephone && (
                    <a
                        href={`tel:${membre.membre.telephone}`}
                        className="flex items-center gap-2 text-[12px] text-black/40 hover:text-black"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{membre.membre.telephone}</span>
                    </a>
                )}
            </div>

            {/* Ancienneté */}
            <div className="flex items-center gap-2 text-[11px] text-black/40 mb-4">
                <Calendar className="w-3 h-3" />
                <span>
                    Membre depuis le {dateDebut.toLocaleDateString("fr-FR")}
                    {anciennete > 0 && ` (${anciennete} an${anciennete > 1 ? "s" : ""})`}
                </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                {membre.membre?.email && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-[11px] h-7 flex-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            onContact(membre, "email");
                        }}
                    >
                        <Mail className="w-3 h-3 mr-1" />
                        Email
                    </Button>
                )}
                {membre.membre?.telephone && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-[11px] h-7"
                        onClick={(e) => {
                            e.stopPropagation();
                            onContact(membre, "phone");
                        }}
                    >
                        <Phone className="w-3 h-3 mr-1" />
                        Appeler
                    </Button>
                )}
            </div>
        </Card>
    );
}

function ConseilSyndicalPageContent() {
    const router = useRouter();
    const [filters, setFilters] = useState<PageFilters>({
        copropriete: "ALL",
        role: "ALL",
        search: "",
    });

    const apiFilters: ConseilFilters = {
        coproprieteId: filters.copropriete !== "ALL" ? filters.copropriete : undefined,
        role: filters.role !== "ALL" ? filters.role : undefined,
        actif: true,
    };

    const { data: membres = [], isLoading } = useConseilSyndical(apiFilters);

    const handleFilterChange = useCallback(
        (key: keyof PageFilters, value: string) => {
            setFilters((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    const handleView = useCallback((membre: MembreConseilWithRelations) => {
        router.push(`/dashboard/conseil-syndical/${membre.id}`);
    }, [router]);

    const handleContact = useCallback((membre: MembreConseilWithRelations, type: string) => {
        if (type === "email" && membre.membre?.email) {
            window.location.href = `mailto:${membre.membre.email}`;
        } else if (type === "phone" && membre.membre?.telephone) {
            window.location.href = `tel:${membre.membre.telephone}`;
        }
    }, []);

    const handleAdd = useCallback(() => {
        router.push("/dashboard/conseil-syndical/nouveau");
    }, [router]);

    // Generate copropriete options from data
    const coproOptions = [
        { value: "ALL", label: "Toutes les copropriétés" },
        ...Array.from(new Map(membres.filter(m => m.copropriete).map((m) => [m.copropriete!.id, m.copropriete!]))).map(([id, copro]) => ({
            value: id,
            label: copro.nom,
        })),
    ];

    // Filter by search (client-side)
    const filteredMembres = filters.search
        ? membres.filter((m) => {
            const search = filters.search.toLowerCase();
            return (
                m.membre?.nom?.toLowerCase().includes(search) ||
                m.membre?.prenom?.toLowerCase().includes(search)
            );
        })
        : membres;

    // Group by copropriete
    const groupedMembres = filteredMembres.reduce((acc, membre) => {
        const coproId = membre.coproprieteId;
        if (!acc[coproId]) {
            acc[coproId] = {
                copropriete: membre.copropriete,
                membres: [],
            };
        }
        acc[coproId].membres.push(membre);
        return acc;
    }, {} as Record<string, { copropriete: MembreConseilWithRelations["copropriete"]; membres: MembreConseilWithRelations[] }>);

    // Stats
    const totalMembres = membres.filter((m) => m.actif).length;
    const presidentsCount = membres.filter((m) => m.role === "PRESIDENT" && m.actif).length;
    const membresCount = membres.filter((m) => m.role === "MEMBRE" && m.actif).length;
    const suppleantsCount = membres.filter((m) => m.role === "SUPPLEANT" && m.actif).length;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Conseil syndical"
                description="Gérez les membres des conseils syndicaux"
                actions={
                    <Button
                        onClick={handleAdd}
                        className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                    >
                        <Plus className="mr-2 h-4 w-4" strokeWidth={2} />
                        Ajouter un membre
                    </Button>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Total membres</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {totalMembres}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Présidents</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {presidentsCount}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Membres</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {membresCount}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Suppléants</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {suppleantsCount}
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
                        placeholder: "Rechercher par nom...",
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
                        value: filters.role || "ALL",
                        onChange: (value) => handleFilterChange("role", value),
                        options: ROLE_OPTIONS,
                        label: "Rôle",
                    },
                ]}
            />

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="h-[280px] bg-black/5 rounded-lg animate-pulse"
                        />
                    ))}
                </div>
            ) : filteredMembres.length === 0 ? (
                <EmptyState
                    icon={Users}
                    title="Aucun membre"
                    description={
                        filters.search ||
                        filters.copropriete !== "ALL" ||
                        filters.role !== "ALL"
                            ? "Aucun membre ne correspond à vos critères"
                            : "Ajoutez les membres des conseils syndicaux"
                    }
                    action={
                        filters.search ||
                        filters.copropriete !== "ALL" ||
                        filters.role !== "ALL"
                            ? undefined
                            : {
                                label: "Ajouter un membre",
                                onClick: handleAdd,
                            }
                    }
                />
            ) : filters.copropriete === "ALL" ? (
                // Grouped view
                <div className="space-y-8">
                    {Object.values(groupedMembres).map(({ copropriete, membres }) => (
                        <div key={copropriete?.id || "unknown"}>
                            <div className="flex items-center gap-2 mb-4">
                                <Building2 className="w-5 h-5 text-black/40" />
                                <h2 className="text-[15px] font-medium text-black">
                                    {copropriete?.nom || "Copropriété inconnue"}
                                </h2>
                                <Badge variant="outline" className="text-[10px]">
                                    {membres.length} membre{membres.length > 1 ? "s" : ""}
                                </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {membres
                                    .sort((a, b) => {
                                        const order: Record<string, number> = { PRESIDENT: 0, MEMBRE: 1, SUPPLEANT: 2 };
                                        return (order[a.role] || 99) - (order[b.role] || 99);
                                    })
                                    .map((membre) => (
                                        <MembreCSCard
                                            key={membre.id}
                                            membre={membre}
                                            onView={handleView}
                                            onContact={handleContact}
                                        />
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // Flat view
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMembres
                        .sort((a, b) => {
                            const order: Record<string, number> = { PRESIDENT: 0, MEMBRE: 1, SUPPLEANT: 2 };
                            return (order[a.role] || 99) - (order[b.role] || 99);
                        })
                        .map((membre) => (
                            <MembreCSCard
                                key={membre.id}
                                membre={membre}
                                onView={handleView}
                                onContact={handleContact}
                            />
                        ))}
                </div>
            )}
        </div>
    );
}

export default function ConseilSyndicalPage() {
    return (
        <SuspensePage
            skeletonProps={{
                layout: "grid",
                headerActionsCount: 1,
                statsCount: 4,
            }}
        >
            <ConseilSyndicalPageContent />
        </SuspensePage>
    );
}
