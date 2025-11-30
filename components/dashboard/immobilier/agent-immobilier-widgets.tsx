"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Building2, FileSignature, Users, TrendingUp, Eye, MousePointer,
    Phone, Calendar, MapPin, Euro, ArrowRight, Home,
    Clock, Target, Megaphone
} from "lucide-react";
import Link from "next/link";

interface AgentImmobilierWidgetsProps {
    period?: number;
}

// Mock data - En production, ces données viendraient des hooks React Query
const mockStats = {
    mandatsActifs: 24,
    mandatsEnCours: 8,
    transactionsEnCours: 12,
    transactionsConclues: 6,
    visitesAVenir: 15,
    estimationsEnAttente: 4,
    tauxConversion: 42,
    caMensuel: 45600,
};

const mockPipeline = [
    { stage: "Prospection", count: 18, color: "bg-black/10" },
    { stage: "Estimation", count: 8, color: "bg-black/20" },
    { stage: "Mandat signé", count: 12, color: "bg-black/30" },
    { stage: "En diffusion", count: 10, color: "bg-black/40" },
    { stage: "Offre reçue", count: 5, color: "bg-black/50" },
    { stage: "Compromis", count: 3, color: "bg-black/60" },
    { stage: "Acte final", count: 2, color: "bg-black/70" },
];

const mockVisites = [
    {
        id: "1",
        bien: "Appartement T3 - 75m²",
        adresse: "15 rue des Fleurs, Paris 15",
        client: "M. Dupont",
        date: new Date(Date.now() + 2 * 3600000),
        type: "VENTE" as const,
    },
    {
        id: "2",
        bien: "Maison 5 pièces - 120m²",
        adresse: "8 allée des Chênes, Lyon",
        client: "Mme Martin",
        date: new Date(Date.now() + 5 * 3600000),
        type: "VENTE" as const,
    },
    {
        id: "3",
        bien: "Studio 25m²",
        adresse: "22 av République, Marseille",
        client: "M. Bernard",
        date: new Date(Date.now() + 24 * 3600000),
        type: "LOCATION" as const,
    },
];

const mockDiffusion = {
    totalAnnonces: 18,
    vues: 4520,
    clics: 342,
    contacts: 28,
    portaux: [
        { nom: "SeLoger", vues: 1800, contacts: 12 },
        { nom: "LeBonCoin", vues: 1500, contacts: 10 },
        { nom: "Bien'ici", vues: 720, contacts: 4 },
        { nom: "Logic-Immo", vues: 500, contacts: 2 },
    ],
};

function StatsCard({
    title,
    value,
    subValue,
    icon: Icon,
    trend,
    href,
}: {
    title: string;
    value: string | number;
    subValue?: string;
    icon: any;
    trend?: { value: number; label: string };
    href?: string;
}) {
    const content = (
        <Card className="p-5 border-black/[0.08] hover:border-black/20 transition-all">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[13px] text-black/40 mb-1">{title}</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {value}
                    </p>
                    {subValue && (
                        <p className="text-[12px] text-black/40 mt-1">{subValue}</p>
                    )}
                    {trend && (
                        <div className="flex items-center gap-1 mt-2">
                            <TrendingUp className="w-3 h-3 text-emerald-600" />
                            <span className="text-[11px] text-emerald-600 font-medium">
                                +{trend.value}% {trend.label}
                            </span>
                        </div>
                    )}
                </div>
                <div className="w-10 h-10 bg-black/5 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-black/40" />
                </div>
            </div>
        </Card>
    );

    if (href) {
        return <Link href={href}>{content}</Link>;
    }
    return content;
}

function PipelineCard() {
    const total = mockPipeline.reduce((acc, s) => acc + s.count, 0);

    return (
        <Card className="p-5 border-black/[0.08]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-medium text-black">
                    Pipeline transactions
                </h3>
                <Link href="/dashboard/pipeline">
                    <Button variant="ghost" size="sm" className="text-[12px] h-7">
                        Voir tout
                        <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                </Link>
            </div>

            {/* Barre de progression */}
            <div className="flex h-3 rounded-full overflow-hidden mb-4">
                {mockPipeline.map((stage, i) => (
                    <div
                        key={stage.stage}
                        className={cn(stage.color, "transition-all")}
                        style={{ width: `${(stage.count / total) * 100}%` }}
                    />
                ))}
            </div>

            {/* Étapes */}
            <div className="grid grid-cols-7 gap-2">
                {mockPipeline.map((stage) => (
                    <div key={stage.stage} className="text-center">
                        <p className="text-[18px] font-bold text-black">{stage.count}</p>
                        <p className="text-[10px] text-black/40 line-clamp-2">{stage.stage}</p>
                    </div>
                ))}
            </div>
        </Card>
    );
}

function VisitesCard() {
    return (
        <Card className="p-5 border-black/[0.08]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-medium text-black">
                    Prochaines visites
                </h3>
                <Link href="/dashboard/visites">
                    <Button variant="ghost" size="sm" className="text-[12px] h-7">
                        Voir tout
                        <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                </Link>
            </div>

            <div className="space-y-3">
                {mockVisites.map((visite) => (
                    <div
                        key={visite.id}
                        className="flex items-center gap-3 p-3 bg-black/[0.02] rounded-lg"
                    >
                        <div className="w-10 h-10 bg-black/5 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Home className="w-5 h-5 text-black/40" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <p className="text-[13px] font-medium text-black line-clamp-1">
                                    {visite.bien}
                                </p>
                                <Badge
                                    variant={visite.type === "VENTE" ? "default" : "outline"}
                                    className="text-[9px] h-4"
                                >
                                    {visite.type}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-black/40">
                                <Users className="w-3 h-3" />
                                <span>{visite.client}</span>
                                <span>·</span>
                                <Clock className="w-3 h-3" />
                                <span>
                                    {visite.date.toLocaleDateString("fr-FR", {
                                        weekday: "short",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

function DiffusionCard() {
    return (
        <Card className="p-5 border-black/[0.08]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-medium text-black">
                    Performance diffusion
                </h3>
                <Link href="/dashboard/diffusion">
                    <Button variant="ghost" size="sm" className="text-[12px] h-7">
                        Voir tout
                        <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                </Link>
            </div>

            {/* Stats globaux */}
            <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="text-center p-3 bg-black/[0.02] rounded-lg">
                    <Megaphone className="w-4 h-4 mx-auto text-black/40 mb-1" />
                    <p className="text-[16px] font-bold text-black">{mockDiffusion.totalAnnonces}</p>
                    <p className="text-[10px] text-black/40">Annonces</p>
                </div>
                <div className="text-center p-3 bg-black/[0.02] rounded-lg">
                    <Eye className="w-4 h-4 mx-auto text-black/40 mb-1" />
                    <p className="text-[16px] font-bold text-black">
                        {(mockDiffusion.vues / 1000).toFixed(1)}k
                    </p>
                    <p className="text-[10px] text-black/40">Vues</p>
                </div>
                <div className="text-center p-3 bg-black/[0.02] rounded-lg">
                    <MousePointer className="w-4 h-4 mx-auto text-black/40 mb-1" />
                    <p className="text-[16px] font-bold text-black">{mockDiffusion.clics}</p>
                    <p className="text-[10px] text-black/40">Clics</p>
                </div>
                <div className="text-center p-3 bg-black/[0.02] rounded-lg">
                    <Phone className="w-4 h-4 mx-auto text-black/40 mb-1" />
                    <p className="text-[16px] font-bold text-black">{mockDiffusion.contacts}</p>
                    <p className="text-[10px] text-black/40">Contacts</p>
                </div>
            </div>

            {/* Top portaux */}
            <div className="space-y-2">
                {mockDiffusion.portaux.slice(0, 3).map((portail) => (
                    <div
                        key={portail.nom}
                        className="flex items-center justify-between text-[12px]"
                    >
                        <span className="text-black/60">{portail.nom}</span>
                        <div className="flex items-center gap-4">
                            <span className="text-black/40">
                                {portail.vues.toLocaleString()} vues
                            </span>
                            <span className="text-black font-medium">
                                {portail.contacts} contacts
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

export function AgentImmobilierWidgets({ period = 30 }: AgentImmobilierWidgetsProps) {
    return (
        <div className="space-y-6">
            {/* Stats principales */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Mandats actifs"
                    value={mockStats.mandatsActifs}
                    subValue={`${mockStats.mandatsEnCours} en cours de signature`}
                    icon={FileSignature}
                    href="/dashboard/mandats"
                />
                <StatsCard
                    title="Transactions"
                    value={mockStats.transactionsEnCours}
                    subValue={`${mockStats.transactionsConclues} conclues ce mois`}
                    icon={Building2}
                    trend={{ value: 15, label: "ce mois" }}
                    href="/dashboard/pipeline"
                />
                <StatsCard
                    title="Visites prévues"
                    value={mockStats.visitesAVenir}
                    subValue="Cette semaine"
                    icon={Calendar}
                    href="/dashboard/visites"
                />
                <StatsCard
                    title="CA du mois"
                    value={`${(mockStats.caMensuel / 1000).toFixed(0)}k €`}
                    subValue={`Taux conversion: ${mockStats.tauxConversion}%`}
                    icon={Euro}
                    trend={{ value: 8, label: "vs mois dernier" }}
                />
            </div>

            {/* Pipeline */}
            <PipelineCard />

            {/* Visites et Diffusion */}
            <div className="grid gap-5 lg:grid-cols-2">
                <VisitesCard />
                <DiffusionCard />
            </div>
        </div>
    );
}
