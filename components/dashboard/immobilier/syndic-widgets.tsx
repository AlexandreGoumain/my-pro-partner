"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Building2, Users, Euro, AlertTriangle, Calendar,
    ArrowRight, Wrench, FileText, Vote, Clock,
    CheckCircle, XCircle, Calculator, Landmark
} from "lucide-react";
import Link from "next/link";

interface SyndicWidgetsProps {
    period?: number;
}

// Mock data
const mockStats = {
    coproprietes: 12,
    lotsGeres: 458,
    tresorerieTotale: 425000,
    chargesAppelees: 185000,
    chargesEncaissees: 162800,
    tauxEncaissement: 88,
    impayesTotaux: 22200,
    impayesCount: 15,
    agAPlanifier: 3,
    travauxEnCours: 5,
};

const mockAG = [
    {
        id: "1",
        copropriete: "Résidence Les Jardins",
        date: new Date(Date.now() + 15 * 86400000),
        type: "ORDINAIRE" as const,
        resolutions: 12,
        convocationsEnvoyees: true,
    },
    {
        id: "2",
        copropriete: "Le Clos des Tilleuls",
        date: new Date(Date.now() + 30 * 86400000),
        type: "ORDINAIRE" as const,
        resolutions: 8,
        convocationsEnvoyees: false,
    },
    {
        id: "3",
        copropriete: "Domaine du Parc",
        date: new Date(Date.now() + 45 * 86400000),
        type: "EXTRAORDINAIRE" as const,
        resolutions: 3,
        convocationsEnvoyees: false,
    },
];

const mockCharges = [
    {
        id: "1",
        copropriete: "Résidence Les Jardins",
        trimestre: "T4 2024",
        montant: 42500,
        encaisse: 38200,
        tauxEncaissement: 90,
    },
    {
        id: "2",
        copropriete: "Le Clos des Tilleuls",
        trimestre: "T4 2024",
        montant: 28000,
        encaisse: 24800,
        tauxEncaissement: 89,
    },
    {
        id: "3",
        copropriete: "Domaine du Parc",
        trimestre: "T4 2024",
        montant: 85000,
        encaisse: 72500,
        tauxEncaissement: 85,
    },
];

const mockTravaux = [
    {
        id: "1",
        copropriete: "Résidence Les Jardins",
        description: "Réfection toiture bâtiment A",
        budget: 45000,
        avancement: 65,
        dateDebut: new Date(Date.now() - 30 * 86400000),
        dateFin: new Date(Date.now() + 30 * 86400000),
    },
    {
        id: "2",
        copropriete: "Domaine du Parc",
        description: "Ravalement façade",
        budget: 120000,
        avancement: 30,
        dateDebut: new Date(Date.now() - 15 * 86400000),
        dateFin: new Date(Date.now() + 90 * 86400000),
    },
    {
        id: "3",
        copropriete: "Le Clos des Tilleuls",
        description: "Mise aux normes ascenseur",
        budget: 25000,
        avancement: 0,
        dateDebut: new Date(Date.now() + 15 * 86400000),
        dateFin: new Date(Date.now() + 45 * 86400000),
    },
];

const mockImpayes = [
    {
        id: "1",
        copropriete: "Résidence Les Jardins",
        montant: 4200,
        lots: 3,
    },
    {
        id: "2",
        copropriete: "Domaine du Parc",
        montant: 15800,
        lots: 8,
    },
    {
        id: "3",
        copropriete: "Le Clos des Tilleuls",
        montant: 2200,
        lots: 4,
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

function AGCard() {
    return (
        <Card className="p-5 border-black/[0.08]">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-medium text-black">
                        Assemblées générales
                    </h3>
                    <Badge variant="outline" className="text-[10px]">
                        {mockAG.length} à venir
                    </Badge>
                </div>
                <Link href="/dashboard/ag">
                    <Button variant="ghost" size="sm" className="text-[12px] h-7">
                        Voir tout
                        <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                </Link>
            </div>

            <div className="space-y-3">
                {mockAG.map((ag) => (
                    <div
                        key={ag.id}
                        className="flex items-center gap-3 p-3 bg-black/[0.02] rounded-lg"
                    >
                        <div className="w-10 h-10 bg-black/5 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Vote className="w-5 h-5 text-black/40" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <p className="text-[13px] font-medium text-black line-clamp-1">
                                    {ag.copropriete}
                                </p>
                                <Badge
                                    variant={ag.type === "ORDINAIRE" ? "default" : "secondary"}
                                    className="text-[9px] h-4"
                                >
                                    {ag.type === "ORDINAIRE" ? "AGO" : "AGE"}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-black/40">
                                <span>{ag.resolutions} résolutions</span>
                                <span>·</span>
                                {ag.convocationsEnvoyees ? (
                                    <span className="text-emerald-600">Convocations envoyées</span>
                                ) : (
                                    <span className="text-amber-600">Convocations à envoyer</span>
                                )}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[12px] font-medium text-black">
                                {ag.date.toLocaleDateString("fr-FR", {
                                    day: "numeric",
                                    month: "short",
                                })}
                            </p>
                            <p className="text-[10px] text-black/40">
                                dans {Math.ceil((ag.date.getTime() - Date.now()) / 86400000)} jours
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

function ChargesCard() {
    return (
        <Card className="p-5 border-black/[0.08]">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-[15px] font-medium text-black">
                        Appels de charges
                    </h3>
                    <p className="text-[12px] text-black/40">
                        Taux encaissement global: {mockStats.tauxEncaissement}%
                    </p>
                </div>
                <Link href="/dashboard/charges">
                    <Button variant="ghost" size="sm" className="text-[12px] h-7">
                        Voir tout
                        <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                </Link>
            </div>

            <div className="space-y-3">
                {mockCharges.map((charge) => (
                    <div key={charge.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <p className="text-[13px] font-medium text-black">
                                {charge.copropriete}
                            </p>
                            <p className="text-[12px] text-black/60">
                                {charge.encaisse.toLocaleString("fr-FR")} / {charge.montant.toLocaleString("fr-FR")} €
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-black/5 rounded-full overflow-hidden">
                                <div
                                    className={cn(
                                        "h-full rounded-full transition-all",
                                        charge.tauxEncaissement >= 90 ? "bg-emerald-500" :
                                            charge.tauxEncaissement >= 80 ? "bg-amber-500" : "bg-red-500"
                                    )}
                                    style={{ width: `${charge.tauxEncaissement}%` }}
                                />
                            </div>
                            <span className="text-[11px] text-black/40 w-10">
                                {charge.tauxEncaissement}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

function TravauxCard() {
    return (
        <Card className="p-5 border-black/[0.08]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-medium text-black">
                    Travaux en cours
                </h3>
                <Link href="/dashboard/travaux-copro">
                    <Button variant="ghost" size="sm" className="text-[12px] h-7">
                        Voir tout
                        <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                </Link>
            </div>

            <div className="space-y-3">
                {mockTravaux.map((travail) => (
                    <div
                        key={travail.id}
                        className="p-3 bg-black/[0.02] rounded-lg"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <p className="text-[13px] font-medium text-black line-clamp-1">
                                    {travail.description}
                                </p>
                                <p className="text-[11px] text-black/40">
                                    {travail.copropriete}
                                </p>
                            </div>
                            <Badge variant="outline" className="text-[10px]">
                                {(travail.budget / 1000).toFixed(0)}k €
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-black/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-black/40 rounded-full transition-all"
                                    style={{ width: `${travail.avancement}%` }}
                                />
                            </div>
                            <span className="text-[11px] text-black/40">
                                {travail.avancement}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

function ImpayesCoproCard() {
    const totalImpayes = mockImpayes.reduce((acc, i) => acc + i.montant, 0);

    return (
        <Card className="p-5 border-black/[0.08]">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-medium text-black">
                        Impayés par copropriété
                    </h3>
                    <Badge variant="destructive" className="text-[10px] h-5">
                        {(totalImpayes / 1000).toFixed(1)}k €
                    </Badge>
                </div>
                <Link href="/dashboard/charges">
                    <Button variant="ghost" size="sm" className="text-[12px] h-7">
                        Gérer
                        <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                </Link>
            </div>

            <div className="space-y-3">
                {mockImpayes.map((impaye) => (
                    <div
                        key={impaye.id}
                        className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                    >
                        <div>
                            <p className="text-[13px] font-medium text-red-900">
                                {impaye.copropriete}
                            </p>
                            <p className="text-[11px] text-red-700/60">
                                {impaye.lots} lots concernés
                            </p>
                        </div>
                        <p className="text-[14px] font-bold text-red-700">
                            {impaye.montant.toLocaleString("fr-FR")} €
                        </p>
                    </div>
                ))}
            </div>
        </Card>
    );
}

export function SyndicWidgets({ period = 30 }: SyndicWidgetsProps) {
    return (
        <div className="space-y-6">
            {/* Stats principales */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Copropriétés"
                    value={mockStats.coproprietes}
                    subValue={`${mockStats.lotsGeres} lots gérés`}
                    icon={Building2}
                    href="/dashboard/coproprietes"
                />
                <StatsCard
                    title="Trésorerie totale"
                    value={`${(mockStats.tresorerieTotale / 1000).toFixed(0)}k €`}
                    subValue="Toutes copropriétés"
                    icon={Landmark}
                    variant="success"
                    href="/dashboard/compta-copro"
                />
                <StatsCard
                    title="Charges appelées"
                    value={`${(mockStats.chargesAppelees / 1000).toFixed(0)}k €`}
                    subValue={`${mockStats.tauxEncaissement}% encaissé`}
                    icon={Euro}
                    href="/dashboard/charges"
                />
                <StatsCard
                    title="Impayés"
                    value={`${(mockStats.impayesTotaux / 1000).toFixed(1)}k €`}
                    subValue={`${mockStats.impayesCount} lots concernés`}
                    icon={AlertTriangle}
                    variant="danger"
                />
            </div>

            {/* AG et Charges */}
            <div className="grid gap-5 lg:grid-cols-2">
                <AGCard />
                <ChargesCard />
            </div>

            {/* Travaux et Impayés */}
            <div className="grid gap-5 lg:grid-cols-2">
                <TravauxCard />
                <ImpayesCoproCard />
            </div>
        </div>
    );
}
