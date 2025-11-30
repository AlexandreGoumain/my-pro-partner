"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Building2, FileText, Users, Euro, AlertTriangle, Calendar,
    ArrowRight, Home, Clock, CheckCircle, XCircle,
    ClipboardList, Wrench, TrendingUp, TrendingDown
} from "lucide-react";
import Link from "next/link";

interface GestionLocativeWidgetsProps {
    period?: number;
}

// Mock data
const mockStats = {
    biensGeres: 86,
    bauxActifs: 78,
    loyersAttendu: 52400,
    loyersEncaisses: 48200,
    tauxEncaissement: 92,
    impayes: 4200,
    impayesCount: 5,
    etatLieuxPrevus: 3,
    bauxARenouveler: 4,
};

const mockLoyers = [
    {
        id: "1",
        locataire: "Martin Sophie",
        bien: "Apt T3 - 15 rue des Fleurs",
        montant: 850,
        statut: "ENCAISSE" as const,
        dateEcheance: new Date(Date.now() - 5 * 86400000),
    },
    {
        id: "2",
        locataire: "Dupont Pierre",
        bien: "Apt T2 - 8 allée des Chênes",
        montant: 650,
        statut: "EN_ATTENTE" as const,
        dateEcheance: new Date(Date.now() + 2 * 86400000),
    },
    {
        id: "3",
        locataire: "Bernard Jean",
        bien: "Studio - 22 av République",
        montant: 520,
        statut: "IMPAYE" as const,
        dateEcheance: new Date(Date.now() - 15 * 86400000),
    },
    {
        id: "4",
        locataire: "Leroy Marie",
        bien: "Maison 4p - 5 rue du Parc",
        montant: 1200,
        statut: "ENCAISSE" as const,
        dateEcheance: new Date(Date.now() - 3 * 86400000),
    },
];

const mockImpayes = [
    {
        id: "1",
        locataire: "Bernard Jean",
        bien: "Studio - 22 av République",
        montant: 1560,
        moisImpayes: 3,
        dernierContact: new Date(Date.now() - 7 * 86400000),
        niveau: "URGENT" as const,
    },
    {
        id: "2",
        locataire: "Garcia Antonio",
        bien: "T2 - 12 rue Nationale",
        montant: 1300,
        moisImpayes: 2,
        dernierContact: new Date(Date.now() - 3 * 86400000),
        niveau: "ALERTE" as const,
    },
    {
        id: "3",
        locataire: "Petit Claire",
        bien: "T3 - 45 bd Victor Hugo",
        montant: 780,
        moisImpayes: 1,
        dernierContact: new Date(Date.now() - 1 * 86400000),
        niveau: "SURVEILLER" as const,
    },
];

const mockTravaux = [
    {
        id: "1",
        bien: "Apt T3 - 15 rue des Fleurs",
        type: "Plomberie",
        description: "Fuite robinet cuisine",
        urgence: "URGENT" as const,
        statut: "EN_COURS" as const,
    },
    {
        id: "2",
        bien: "Studio - 22 av République",
        type: "Électricité",
        description: "Prise défectueuse salon",
        urgence: "NORMAL" as const,
        statut: "PLANIFIE" as const,
    },
];

const mockEtatsLieux = [
    {
        id: "1",
        bien: "T2 - 8 allée des Chênes",
        type: "ENTREE" as const,
        date: new Date(Date.now() + 2 * 86400000),
        locataire: "Nouveau locataire",
    },
    {
        id: "2",
        bien: "Maison 4p - 5 rue du Parc",
        type: "SORTIE" as const,
        date: new Date(Date.now() + 5 * 86400000),
        locataire: "Leroy Marie",
    },
];

function StatsCard({
    title,
    value,
    subValue,
    icon: Icon,
    variant = "default",
    href,
}: {
    title: string;
    value: string | number;
    subValue?: string;
    icon: any;
    variant?: "default" | "success" | "warning" | "danger";
    href?: string;
}) {
    const variantStyles = {
        default: "",
        success: "text-emerald-600",
        warning: "text-amber-600",
        danger: "text-red-600",
    };

    const content = (
        <Card className="p-5 border-black/[0.08] hover:border-black/20 transition-all">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[13px] text-black/40 mb-1">{title}</p>
                    <p className={cn(
                        "text-[28px] font-bold tracking-[-0.02em]",
                        variant === "default" ? "text-black" : variantStyles[variant]
                    )}>
                        {value}
                    </p>
                    {subValue && (
                        <p className="text-[12px] text-black/40 mt-1">{subValue}</p>
                    )}
                </div>
                <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    variant === "danger" ? "bg-red-50" : "bg-black/5"
                )}>
                    <Icon className={cn(
                        "w-5 h-5",
                        variant === "danger" ? "text-red-600" : "text-black/40"
                    )} />
                </div>
            </div>
        </Card>
    );

    if (href) {
        return <Link href={href}>{content}</Link>;
    }
    return content;
}

function LoyersCard() {
    const statutConfig = {
        ENCAISSE: { label: "Encaissé", icon: CheckCircle, color: "text-emerald-600 bg-emerald-50" },
        EN_ATTENTE: { label: "En attente", icon: Clock, color: "text-amber-600 bg-amber-50" },
        IMPAYE: { label: "Impayé", icon: XCircle, color: "text-red-600 bg-red-50" },
    };

    return (
        <Card className="p-5 border-black/[0.08]">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-[15px] font-medium text-black">
                        Loyers du mois
                    </h3>
                    <p className="text-[12px] text-black/40">
                        {mockStats.tauxEncaissement}% encaissé
                    </p>
                </div>
                <Link href="/dashboard/loyers">
                    <Button variant="ghost" size="sm" className="text-[12px] h-7">
                        Voir tout
                        <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                </Link>
            </div>

            {/* Barre de progression */}
            <div className="h-2 bg-black/5 rounded-full mb-4 overflow-hidden">
                <div
                    className="h-full bg-black/60 rounded-full transition-all"
                    style={{ width: `${mockStats.tauxEncaissement}%` }}
                />
            </div>

            <div className="space-y-2">
                {mockLoyers.map((loyer) => {
                    const config = statutConfig[loyer.statut];
                    const IconComp = config.icon;
                    return (
                        <div
                            key={loyer.id}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-black/[0.02] transition-all"
                        >
                            <div className={cn(
                                "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                                config.color.split(" ")[1]
                            )}>
                                <IconComp className={cn("w-4 h-4", config.color.split(" ")[0])} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-medium text-black line-clamp-1">
                                    {loyer.locataire}
                                </p>
                                <p className="text-[11px] text-black/40 line-clamp-1">
                                    {loyer.bien}
                                </p>
                            </div>
                            <p className="text-[13px] font-medium text-black">
                                {loyer.montant} €
                            </p>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}

function ImpayesCard() {
    const niveauConfig = {
        URGENT: { label: "Urgent", color: "bg-red-100 text-red-700 border-red-200" },
        ALERTE: { label: "Alerte", color: "bg-amber-100 text-amber-700 border-amber-200" },
        SURVEILLER: { label: "À surveiller", color: "bg-black/5 text-black/60 border-black/10" },
    };

    return (
        <Card className="p-5 border-black/[0.08]">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-medium text-black">
                        Impayés
                    </h3>
                    {mockImpayes.length > 0 && (
                        <Badge variant="destructive" className="text-[10px] h-5">
                            {mockImpayes.length}
                        </Badge>
                    )}
                </div>
                <Link href="/dashboard/impayes">
                    <Button variant="ghost" size="sm" className="text-[12px] h-7">
                        Gérer
                        <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                </Link>
            </div>

            <div className="space-y-3">
                {mockImpayes.map((impaye) => {
                    const config = niveauConfig[impaye.niveau];
                    return (
                        <div
                            key={impaye.id}
                            className={cn(
                                "p-3 rounded-lg border",
                                config.color
                            )}
                        >
                            <div className="flex items-start justify-between mb-1">
                                <p className="text-[13px] font-medium">{impaye.locataire}</p>
                                <p className="text-[14px] font-bold">{impaye.montant} €</p>
                            </div>
                            <p className="text-[11px] opacity-70 mb-2">{impaye.bien}</p>
                            <div className="flex items-center justify-between text-[10px]">
                                <span>{impaye.moisImpayes} mois d'impayés</span>
                                <span>
                                    Contact: {impaye.dernierContact.toLocaleDateString("fr-FR")}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}

function EtatsLieuxCard() {
    return (
        <Card className="p-5 border-black/[0.08]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-medium text-black">
                    États des lieux à venir
                </h3>
                <Link href="/dashboard/etats-lieux">
                    <Button variant="ghost" size="sm" className="text-[12px] h-7">
                        Voir tout
                        <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                </Link>
            </div>

            <div className="space-y-3">
                {mockEtatsLieux.map((edl) => (
                    <div
                        key={edl.id}
                        className="flex items-center gap-3 p-3 bg-black/[0.02] rounded-lg"
                    >
                        <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                            edl.type === "ENTREE" ? "bg-emerald-50" : "bg-amber-50"
                        )}>
                            <ClipboardList className={cn(
                                "w-5 h-5",
                                edl.type === "ENTREE" ? "text-emerald-600" : "text-amber-600"
                            )} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <p className="text-[13px] font-medium text-black">
                                    État des lieux {edl.type === "ENTREE" ? "entrée" : "sortie"}
                                </p>
                            </div>
                            <p className="text-[11px] text-black/40">{edl.bien}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[12px] font-medium text-black">
                                {edl.date.toLocaleDateString("fr-FR", {
                                    weekday: "short",
                                    day: "numeric",
                                    month: "short",
                                })}
                            </p>
                            <p className="text-[11px] text-black/40">{edl.locataire}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

function TravauxCard() {
    const urgenceConfig = {
        URGENT: { label: "Urgent", color: "bg-red-50 text-red-700" },
        NORMAL: { label: "Normal", color: "bg-black/5 text-black/60" },
    };

    return (
        <Card className="p-5 border-black/[0.08]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-medium text-black">
                    Travaux en cours
                </h3>
                <Link href="/dashboard/travaux-locatifs">
                    <Button variant="ghost" size="sm" className="text-[12px] h-7">
                        Voir tout
                        <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                </Link>
            </div>

            <div className="space-y-3">
                {mockTravaux.map((travail) => {
                    const config = urgenceConfig[travail.urgence];
                    return (
                        <div
                            key={travail.id}
                            className="flex items-center gap-3 p-3 bg-black/[0.02] rounded-lg"
                        >
                            <div className="w-10 h-10 bg-black/5 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Wrench className="w-5 h-5 text-black/40" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <p className="text-[13px] font-medium text-black line-clamp-1">
                                        {travail.description}
                                    </p>
                                    <Badge className={cn("text-[9px] h-4", config.color)}>
                                        {config.label}
                                    </Badge>
                                </div>
                                <p className="text-[11px] text-black/40">{travail.bien}</p>
                            </div>
                            <Badge variant="outline" className="text-[10px]">
                                {travail.statut === "EN_COURS" ? "En cours" : "Planifié"}
                            </Badge>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}

export function GestionLocativeWidgets({ period = 30 }: GestionLocativeWidgetsProps) {
    return (
        <div className="space-y-6">
            {/* Stats principales */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Biens gérés"
                    value={mockStats.biensGeres}
                    subValue={`${mockStats.bauxActifs} baux actifs`}
                    icon={Building2}
                    href="/dashboard/baux"
                />
                <StatsCard
                    title="Loyers attendus"
                    value={`${(mockStats.loyersAttendu / 1000).toFixed(1)}k €`}
                    subValue={`${mockStats.tauxEncaissement}% encaissé`}
                    icon={Euro}
                    variant="success"
                    href="/dashboard/loyers"
                />
                <StatsCard
                    title="Impayés"
                    value={`${(mockStats.impayes / 1000).toFixed(1)}k €`}
                    subValue={`${mockStats.impayesCount} locataires concernés`}
                    icon={AlertTriangle}
                    variant="danger"
                    href="/dashboard/impayes"
                />
                <StatsCard
                    title="À prévoir"
                    value={mockStats.etatLieuxPrevus + mockStats.bauxARenouveler}
                    subValue={`${mockStats.etatLieuxPrevus} EDL, ${mockStats.bauxARenouveler} renouvellements`}
                    icon={Calendar}
                    href="/dashboard/etats-lieux"
                />
            </div>

            {/* Loyers et Impayés */}
            <div className="grid gap-5 lg:grid-cols-2">
                <LoyersCard />
                <ImpayesCard />
            </div>

            {/* États des lieux et Travaux */}
            <div className="grid gap-5 lg:grid-cols-2">
                <EtatsLieuxCard />
                <TravauxCard />
            </div>
        </div>
    );
}
