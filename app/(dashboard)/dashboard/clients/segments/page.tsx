"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Users,
    MapPin,
    Award,
    TrendingUp,
    Clock,
    Mail,
    Phone,
    Plus,
    MoreHorizontal,
    Filter,
} from "lucide-react";
import { useClients } from "@/hooks/use-clients";
import { useMemo } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

interface Segment {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    count: number;
    filter: (clients: any[]) => any[];
}

export default function ClientSegmentsPage() {
    const router = useRouter();
    const { data: clients = [], isLoading } = useClients();

    // Segments prédéfinis
    const segments: Segment[] = useMemo(() => {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

        return [
            {
                id: "all",
                title: "Tous les clients",
                description: "L'ensemble de votre base clients",
                icon: Users,
                count: clients.length,
                filter: (c) => c,
            },
            {
                id: "with-email",
                title: "Clients avec email",
                description: "Clients joignables par email",
                icon: Mail,
                count: clients.filter((c) => c.email).length,
                filter: (c) => c.filter((client) => client.email),
            },
            {
                id: "with-phone",
                title: "Clients avec téléphone",
                description: "Clients joignables par téléphone",
                icon: Phone,
                count: clients.filter((c) => c.telephone).length,
                filter: (c) => c.filter((client) => client.telephone),
            },
            {
                id: "by-city",
                title: "Par localisation",
                description: `${new Set(clients.filter((c) => c.ville).map((c) => c.ville)).size} villes différentes`,
                icon: MapPin,
                count: clients.filter((c) => c.ville).length,
                filter: (c) => c.filter((client) => client.ville),
            },
            {
                id: "recent",
                title: "Clients récents",
                description: "Ajoutés dans les 30 derniers jours",
                icon: Clock,
                count: clients.filter(
                    (c) => new Date(c.createdAt) >= thirtyDaysAgo
                ).length,
                filter: (c) =>
                    c.filter((client) => new Date(client.createdAt) >= thirtyDaysAgo),
            },
            {
                id: "inactive",
                title: "Clients inactifs",
                description: "Aucune activité depuis 90 jours",
                icon: TrendingUp,
                count: clients.filter(
                    (c) => new Date(c.createdAt) <= ninetyDaysAgo
                ).length,
                filter: (c) =>
                    c.filter((client) => new Date(client.createdAt) <= ninetyDaysAgo),
            },
            {
                id: "loyalty",
                title: "Programme fidélité",
                description: "Clients avec points de fidélité",
                icon: Award,
                count: clients.filter((c) => (c.points_solde ?? 0) > 0).length,
                filter: (c) =>
                    c.filter((client) => (client.points_solde ?? 0) > 0),
            },
        ];
    }, [clients]);

    const handleViewSegment = (segment: Segment) => {
        router.push(`/dashboard/clients?segment=${segment.id}`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                        Segments clients
                    </h1>
                    <p className="text-[14px] text-black/40 mt-1">
                        Organisez et analysez vos clients par segments
                    </p>
                </div>
                <Button className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm cursor-pointer">
                    <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                    Créer un segment
                </Button>
            </div>

            {/* Segments prédéfinis */}
            <div>
                <div className="mb-5">
                    <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-black">
                        Segments prédéfinis
                    </h3>
                    <p className="text-[14px] text-black/40 mt-1">
                        Segments créés automatiquement selon vos données clients
                    </p>
                </div>

                {isLoading ? (
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Card key={i} className="p-6 animate-pulse border-black/8 shadow-sm">
                                <div className="h-24 bg-black/5 rounded" />
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {segments.map((segment) => (
                            <Card
                                key={segment.id}
                                className="group cursor-pointer border-black/8 shadow-sm hover:border-black/20 transition-all duration-200"
                                onClick={() => handleViewSegment(segment)}
                            >
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-black/5 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                                <segment.icon
                                                    className="h-5 w-5 text-black/60"
                                                    strokeWidth={2}
                                                />
                                            </div>
                                            <div>
                                                <h4 className="text-[15px] font-medium tracking-[-0.01em] text-black mb-1.5">
                                                    {segment.title}
                                                </h4>
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-black/5 text-black/60 border-0 text-[11px] h-5 px-2"
                                                >
                                                    {segment.count} clients
                                                </Badge>
                                            </div>
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/5"
                                                >
                                                    <MoreHorizontal className="h-4 w-4 text-black/60" strokeWidth={2} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 border-black/10">
                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleViewSegment(segment);
                                                    }}
                                                    className="text-[13px]"
                                                >
                                                    <Filter className="mr-2 h-4 w-4 text-black/60" strokeWidth={2} />
                                                    <span className="text-black/80">Voir les clients</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-black/8" />
                                                <DropdownMenuItem
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="text-[13px]"
                                                >
                                                    <Mail className="mr-2 h-4 w-4 text-black/60" strokeWidth={2} />
                                                    <span className="text-black/80">Envoyer un email</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <p className="text-[13px] text-black/60 mb-4">
                                        {segment.description}
                                    </p>

                                    {/* Progress bar */}
                                    <div>
                                        <div className="h-2 bg-black/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-black transition-all duration-500"
                                                style={{
                                                    width: `${clients.length > 0 ? (segment.count / clients.length) * 100 : 0}%`,
                                                }}
                                            />
                                        </div>
                                        <p className="text-[12px] text-black/40 mt-2">
                                            {clients.length > 0
                                                ? `${((segment.count / clients.length) * 100).toFixed(1)}% de votre base`
                                                : "0% de votre base"}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Segments personnalisés */}
            <div>
                <div className="mb-5">
                    <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-black">
                        Segments personnalisés
                    </h3>
                    <p className="text-[14px] text-black/40 mt-1">
                        Créez vos propres segments avec des critères personnalisés
                    </p>
                </div>

                <Card className="p-12 border-dashed border-black/10 shadow-sm">
                    <div className="flex flex-col items-center text-center space-y-5">
                        <div className="rounded-full h-20 w-20 bg-black/5 flex items-center justify-center">
                            <Filter className="w-10 h-10 text-black/40" strokeWidth={2} />
                        </div>
                        <div>
                            <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-black mb-2">
                                Aucun segment personnalisé
                            </h3>
                            <p className="text-[14px] text-black/60 max-w-md">
                                Créez des segments personnalisés en combinant plusieurs critères
                                pour mieux cibler vos actions marketing.
                            </p>
                        </div>
                        <Button className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm mt-2">
                            <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                            Créer un segment
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
