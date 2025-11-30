"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { SuspensePage } from "@/components/ui/suspense-page";
import { EmptyState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    GitBranch, Plus, Home, User, Euro, Calendar, ArrowRight,
    CheckCircle, Clock, FileSignature, Banknote, Key
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface Transaction {
    id: string;
    etape: "PROSPECTION" | "ESTIMATION" | "MANDAT" | "VISITE" | "OFFRE" | "COMPROMIS" | "FINANCEMENT" | "ACTE" | "TERMINEE";
    dateCreation: string;
    dateMiseAJour: string;
    montantEstime?: number;
    commission?: number;
    bien?: {
        id: string;
        reference: string;
        titre: string;
        ville: string;
        prix: number;
    };
    acquereur?: {
        id: string;
        nom: string;
        prenom: string;
    };
    vendeur?: {
        id: string;
        nom: string;
        prenom: string;
    };
    agent: {
        id: string;
        prenom: string;
        nom: string;
    };
    notes?: string;
}

const ETAPES_ORDER: Transaction["etape"][] = [
    "PROSPECTION",
    "ESTIMATION",
    "MANDAT",
    "VISITE",
    "OFFRE",
    "COMPROMIS",
    "FINANCEMENT",
    "ACTE",
    "TERMINEE",
];

const ETAPES_CONFIG: Record<Transaction["etape"], {
    label: string;
    shortLabel: string;
    icon: typeof Clock;
    color: string;
}> = {
    PROSPECTION: { label: "Prospection", shortLabel: "Prosp.", icon: Clock, color: "bg-slate-100 text-slate-600" },
    ESTIMATION: { label: "Estimation", shortLabel: "Estim.", icon: Euro, color: "bg-blue-100 text-blue-600" },
    MANDAT: { label: "Mandat signé", shortLabel: "Mandat", icon: FileSignature, color: "bg-indigo-100 text-indigo-600" },
    VISITE: { label: "Visites", shortLabel: "Visites", icon: Home, color: "bg-purple-100 text-purple-600" },
    OFFRE: { label: "Offre acceptée", shortLabel: "Offre", icon: CheckCircle, color: "bg-pink-100 text-pink-600" },
    COMPROMIS: { label: "Compromis", shortLabel: "Comp.", icon: FileSignature, color: "bg-amber-100 text-amber-600" },
    FINANCEMENT: { label: "Financement", shortLabel: "Financ.", icon: Banknote, color: "bg-orange-100 text-orange-600" },
    ACTE: { label: "Acte authentique", shortLabel: "Acte", icon: Key, color: "bg-emerald-100 text-emerald-600" },
    TERMINEE: { label: "Terminée", shortLabel: "Fini", icon: CheckCircle, color: "bg-green-100 text-green-600" },
};

// Mock data
const mockTransactions: Transaction[] = [
    {
        id: "1",
        etape: "VISITE",
        dateCreation: new Date(Date.now() - 86400000 * 30).toISOString(),
        dateMiseAJour: new Date().toISOString(),
        montantEstime: 450000,
        commission: 18000,
        bien: {
            id: "b1",
            reference: "BIEN-0001",
            titre: "Appartement 3 pièces - Centre ville",
            ville: "Paris",
            prix: 450000,
        },
        vendeur: { id: "v1", nom: "Lefevre", prenom: "Marc" },
        acquereur: { id: "a1", nom: "Martin", prenom: "Sophie" },
        agent: { id: "ag1", prenom: "Jean", nom: "Dupont" },
    },
    {
        id: "2",
        etape: "COMPROMIS",
        dateCreation: new Date(Date.now() - 86400000 * 45).toISOString(),
        dateMiseAJour: new Date(Date.now() - 86400000 * 2).toISOString(),
        montantEstime: 680000,
        commission: 27200,
        bien: {
            id: "b2",
            reference: "BIEN-0002",
            titre: "Maison 5 pièces avec jardin",
            ville: "Lyon",
            prix: 680000,
        },
        vendeur: { id: "v2", nom: "Bernard", prenom: "Pierre" },
        acquereur: { id: "a2", nom: "Durand", prenom: "Marie" },
        agent: { id: "ag1", prenom: "Jean", nom: "Dupont" },
        notes: "Financement en cours de validation",
    },
    {
        id: "3",
        etape: "MANDAT",
        dateCreation: new Date(Date.now() - 86400000 * 10).toISOString(),
        dateMiseAJour: new Date(Date.now() - 86400000 * 5).toISOString(),
        montantEstime: 320000,
        commission: 12800,
        bien: {
            id: "b3",
            reference: "BIEN-0003",
            titre: "Appartement 2 pièces rénové",
            ville: "Paris",
            prix: 320000,
        },
        vendeur: { id: "v3", nom: "Lambert", prenom: "Julie" },
        agent: { id: "ag1", prenom: "Jean", nom: "Dupont" },
    },
    {
        id: "4",
        etape: "OFFRE",
        dateCreation: new Date(Date.now() - 86400000 * 20).toISOString(),
        dateMiseAJour: new Date(Date.now() - 86400000).toISOString(),
        montantEstime: 195000,
        commission: 7800,
        bien: {
            id: "b4",
            reference: "BIEN-0004",
            titre: "Studio proche métro",
            ville: "Paris",
            prix: 195000,
        },
        vendeur: { id: "v4", nom: "Petit", prenom: "Thomas" },
        acquereur: { id: "a4", nom: "Garcia", prenom: "Ana" },
        agent: { id: "ag1", prenom: "Jean", nom: "Dupont" },
    },
    {
        id: "5",
        etape: "FINANCEMENT",
        dateCreation: new Date(Date.now() - 86400000 * 60).toISOString(),
        dateMiseAJour: new Date(Date.now() - 86400000 * 3).toISOString(),
        montantEstime: 520000,
        commission: 20800,
        bien: {
            id: "b5",
            reference: "BIEN-0005",
            titre: "Maison 4 pièces",
            ville: "Bordeaux",
            prix: 520000,
        },
        vendeur: { id: "v5", nom: "Moreau", prenom: "Claire" },
        acquereur: { id: "a5", nom: "Roux", prenom: "Lucas" },
        agent: { id: "ag1", prenom: "Jean", nom: "Dupont" },
    },
    {
        id: "6",
        etape: "PROSPECTION",
        dateCreation: new Date().toISOString(),
        dateMiseAJour: new Date().toISOString(),
        agent: { id: "ag1", prenom: "Jean", nom: "Dupont" },
        notes: "Nouveau contact vendeur - à qualifier",
    },
];

function TransactionCard({ transaction, onView, onMove }: {
    transaction: Transaction;
    onView: (t: Transaction) => void;
    onMove: (t: Transaction, etape: Transaction["etape"]) => void;
}) {
    const config = ETAPES_CONFIG[transaction.etape];
    const Icon = config.icon;
    const etapeIndex = ETAPES_ORDER.indexOf(transaction.etape);
    const nextEtape = etapeIndex < ETAPES_ORDER.length - 1 ? ETAPES_ORDER[etapeIndex + 1] : null;

    return (
        <Card
            className="p-3 border-black/[0.08] hover:border-black/20 transition-all cursor-pointer mb-3"
            onClick={() => onView(transaction)}
        >
            {/* Bien */}
            {transaction.bien ? (
                <div className="mb-2">
                    <p className="text-[13px] font-medium text-black line-clamp-1">
                        {transaction.bien.titre}
                    </p>
                    <p className="text-[11px] text-black/40">
                        {transaction.bien.reference} · {transaction.bien.ville}
                    </p>
                </div>
            ) : (
                <div className="mb-2">
                    <p className="text-[13px] font-medium text-black">
                        Nouvelle opportunité
                    </p>
                    <p className="text-[11px] text-black/40">
                        À qualifier
                    </p>
                </div>
            )}

            {/* Montant */}
            {transaction.montantEstime && (
                <p className="text-[14px] font-bold text-black mb-2">
                    {transaction.montantEstime.toLocaleString("fr-FR")} €
                </p>
            )}

            {/* Parties */}
            <div className="space-y-1 mb-2">
                {transaction.vendeur && (
                    <div className="flex items-center gap-1.5 text-[11px] text-black/60">
                        <User className="w-3 h-3 text-black/40" />
                        <span>Vendeur: {transaction.vendeur.prenom} {transaction.vendeur.nom}</span>
                    </div>
                )}
                {transaction.acquereur && (
                    <div className="flex items-center gap-1.5 text-[11px] text-black/60">
                        <User className="w-3 h-3 text-black/40" />
                        <span>Acheteur: {transaction.acquereur.prenom} {transaction.acquereur.nom}</span>
                    </div>
                )}
            </div>

            {/* Commission */}
            {transaction.commission && (
                <div className="bg-black/[0.02] rounded px-2 py-1 mb-2">
                    <p className="text-[10px] text-black/40">Commission estimée</p>
                    <p className="text-[12px] font-medium text-black">
                        {transaction.commission.toLocaleString("fr-FR")} €
                    </p>
                </div>
            )}

            {/* Notes */}
            {transaction.notes && (
                <p className="text-[11px] text-black/40 line-clamp-2 mb-2">
                    {transaction.notes}
                </p>
            )}

            {/* Date */}
            <p className="text-[10px] text-black/30">
                Maj {new Date(transaction.dateMiseAJour).toLocaleDateString("fr-FR")}
            </p>

            {/* Action */}
            {nextEtape && transaction.etape !== "TERMINEE" && (
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 text-[11px] h-7"
                    onClick={(e) => {
                        e.stopPropagation();
                        onMove(transaction, nextEtape);
                    }}
                >
                    <ArrowRight className="w-3 h-3 mr-1" />
                    {ETAPES_CONFIG[nextEtape].shortLabel}
                </Button>
            )}
        </Card>
    );
}

function PipelineColumn({ etape, transactions, onView, onMove }: {
    etape: Transaction["etape"];
    transactions: Transaction[];
    onView: (t: Transaction) => void;
    onMove: (t: Transaction, etape: Transaction["etape"]) => void;
}) {
    const config = ETAPES_CONFIG[etape];
    const Icon = config.icon;
    const totalMontant = transactions.reduce((acc, t) => acc + (t.montantEstime || 0), 0);
    const totalCommission = transactions.reduce((acc, t) => acc + (t.commission || 0), 0);

    return (
        <div className="flex-shrink-0 w-[280px]">
            <div className={cn("rounded-t-lg p-3", config.color)}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span className="text-[13px] font-medium">{config.label}</span>
                    </div>
                    <Badge variant="secondary" className="bg-white/50 text-[11px]">
                        {transactions.length}
                    </Badge>
                </div>
                {totalMontant > 0 && (
                    <p className="text-[11px] mt-1 opacity-80">
                        {(totalMontant / 1000).toFixed(0)}k € · Com. {(totalCommission / 1000).toFixed(0)}k €
                    </p>
                )}
            </div>
            <div className="bg-black/[0.02] rounded-b-lg p-2 min-h-[400px]">
                {transactions.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-[12px] text-black/30">Aucune transaction</p>
                    </div>
                ) : (
                    transactions.map((transaction) => (
                        <TransactionCard
                            key={transaction.id}
                            transaction={transaction}
                            onView={onView}
                            onMove={onMove}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

function PipelinePageContent() {
    const router = useRouter();
    const transactions = mockTransactions;
    const isLoading = false;

    const handleView = useCallback((transaction: Transaction) => {
        router.push(`/dashboard/pipeline/${transaction.id}`);
    }, [router]);

    const handleMove = useCallback((_transaction: Transaction, _etape: Transaction["etape"]) => {
        // Move action handled via mutation
    }, []);

    const handleCreate = useCallback(() => {
        router.push("/dashboard/pipeline/nouveau");
    }, [router]);

    // Group by etape
    const transactionsByEtape = ETAPES_ORDER.reduce((acc, etape) => {
        acc[etape] = transactions.filter((t) => t.etape === etape);
        return acc;
    }, {} as Record<Transaction["etape"], Transaction[]>);

    // Stats
    const totalTransactions = transactions.length;
    const totalMontant = transactions.reduce((acc, t) => acc + (t.montantEstime || 0), 0);
    const totalCommission = transactions.reduce((acc, t) => acc + (t.commission || 0), 0);
    const enCoursCount = transactions.filter((t) =>
        !["TERMINEE", "PROSPECTION"].includes(t.etape)
    ).length;

    // Visible etapes (excluding terminee by default)
    const visibleEtapes = ETAPES_ORDER.filter((e) => e !== "TERMINEE");

    return (
        <div className="space-y-6">
            <PageHeader
                title="Pipeline transactions"
                description="Suivez vos transactions de la prospection à la signature"
                actions={
                    <Button
                        onClick={handleCreate}
                        className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                    >
                        <Plus className="mr-2 h-4 w-4" strokeWidth={2} />
                        Nouvelle transaction
                    </Button>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Transactions actives</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {enCoursCount}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Volume total</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {(totalMontant / 1000000).toFixed(1)}M €
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Commissions potentielles</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {(totalCommission / 1000).toFixed(0)}k €
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">En compromis/financement</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {transactions.filter((t) =>
                            ["COMPROMIS", "FINANCEMENT", "ACTE"].includes(t.etape)
                        ).length}
                    </p>
                </Card>
            </div>

            {isLoading ? (
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 w-[280px] h-[500px] bg-black/5 rounded-lg animate-pulse"
                        />
                    ))}
                </div>
            ) : totalTransactions === 0 ? (
                <EmptyState
                    icon={GitBranch}
                    title="Pipeline vide"
                    description="Commencez par créer votre première transaction"
                    action={{
                        label: "Créer une transaction",
                        onClick: handleCreate,
                    }}
                />
            ) : (
                <div className="overflow-x-auto pb-4 -mx-6 px-6">
                    <div className="flex gap-4" style={{ minWidth: "fit-content" }}>
                        {visibleEtapes.map((etape) => (
                            <PipelineColumn
                                key={etape}
                                etape={etape}
                                transactions={transactionsByEtape[etape]}
                                onView={handleView}
                                onMove={handleMove}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function PipelinePage() {
    return (
        <SuspensePage
            skeletonProps={{
                layout: "dashboard",
                headerActionsCount: 1,
                statsCount: 4,
            }}
        >
            <PipelinePageContent />
        </SuspensePage>
    );
}
