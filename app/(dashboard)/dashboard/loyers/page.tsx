"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { SuspensePage } from "@/components/ui/suspense-page";
import { LoyerCard } from "@/components/loyers/loyer-card";
import { LoyersStatsGrid } from "@/components/loyers/loyers-stats-grid";
import { LoyersFilterBar } from "@/components/loyers/loyers-filter-bar";
import { LoyersGrid } from "@/components/loyers/loyers-grid";
import { LoyerPaymentDialog } from "@/components/loyers/loyer-payment-dialog";
import { Plus } from "lucide-react";
import {
    useLoyers,
    useGenerateLoyers,
    useEnregistrerPaiement,
    useEnvoyerLoyer,
    useGenererQuittance,
    type LoyerWithRelations,
    type LoyersFilters,
} from "@/hooks/gestion-locative/use-loyers";
import { toast } from "sonner";

const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();

function LoyersPageContent() {
    const router = useRouter();
    const [filters, setFilters] = useState<LoyersFilters>({
        mois: currentMonth,
        annee: currentYear,
        statut: "ALL",
    });

    const [paiementDialog, setPaiementDialog] = useState<{
        open: boolean;
        loyer: LoyerWithRelations | null;
    }>({ open: false, loyer: null });
    const [paiementMontant, setPaiementMontant] = useState("");

    const { data: loyers = [], isLoading } = useLoyers(filters);
    const generateLoyers = useGenerateLoyers();
    const enregistrerPaiement = useEnregistrerPaiement();
    const envoyerLoyer = useEnvoyerLoyer();
    const genererQuittance = useGenererQuittance();

    const handleFilterChange = useCallback(
        (key: string, value: string) => {
            if (key === "mois") {
                if (value === "ALL") {
                    setFilters((prev) => ({ ...prev, mois: undefined, annee: undefined }));
                } else {
                    const [year, month] = value.split("-");
                    setFilters((prev) => ({
                        ...prev,
                        mois: parseInt(month),
                        annee: parseInt(year),
                    }));
                }
            } else {
                setFilters((prev) => ({ ...prev, [key]: value === "ALL" ? undefined : value }));
            }
        },
        []
    );

    const handleView = useCallback((loyer: LoyerWithRelations) => {
        router.push(`/dashboard/loyers/${loyer.id}`);
    }, [router]);

    const handleAction = useCallback(async (loyer: LoyerWithRelations, action: string) => {
        switch (action) {
            case "send":
                try {
                    await envoyerLoyer.mutateAsync(loyer.id);
                    toast.success("Appel de loyer envoyé");
                } catch {
                    toast.error("Erreur lors de l'envoi");
                }
                break;
            case "quittance":
                try {
                    await genererQuittance.mutateAsync(loyer.id);
                    toast.success("Quittance générée");
                } catch {
                    toast.error("Erreur lors de la génération");
                }
                break;
            case "download":
                if (loyer.quittanceUrl) {
                    window.open(loyer.quittanceUrl, "_blank");
                }
                break;
            case "encaissement":
                setPaiementMontant(String(Number(loyer.totalDu) - Number(loyer.montantPaye)));
                setPaiementDialog({ open: true, loyer });
                break;
            case "relance":
                toast.info("Fonctionnalité de relance à venir");
                break;
        }
    }, [envoyerLoyer, genererQuittance]);

    const handlePaiementSubmit = async () => {
        if (!paiementDialog.loyer || !paiementMontant) return;

        try {
            await enregistrerPaiement.mutateAsync({
                id: paiementDialog.loyer.id,
                data: { montant: parseFloat(paiementMontant) },
            });
            toast.success("Paiement enregistré");
            setPaiementDialog({ open: false, loyer: null });
            setPaiementMontant("");
        } catch {
            toast.error("Erreur lors de l'enregistrement");
        }
    };

    const handleGenerate = useCallback(async () => {
        try {
            const result = await generateLoyers.mutateAsync({
                mois: filters.mois || currentMonth,
                annee: filters.annee || currentYear,
            });
            toast.success(result.message);
        } catch {
            toast.error("Erreur lors de la génération des appels");
        }
    }, [generateLoyers, filters]);

    // Stats calculations
    const totalAppels = loyers.length;
    const totalMontant = loyers.reduce((acc, l) => acc + Number(l.totalDu || 0), 0);
    const totalEncaisse = loyers.reduce((acc, l) => acc + Number(l.montantPaye || 0), 0);
    const tauxEncaissement = totalMontant > 0
        ? ((totalEncaisse / totalMontant) * 100).toFixed(0)
        : "0";
    const impayesCount = loyers.filter((l) =>
        l.statut === "IMPAYE" || l.statut === "PARTIELLEMENT_PAYE"
    ).length;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Loyers & Quittances"
                description="Gérez les appels de loyers et générez les quittances"
                actions={
                    <Button
                        onClick={handleGenerate}
                        disabled={generateLoyers.isPending}
                        className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                    >
                        <Plus className="mr-2 h-4 w-4" strokeWidth={2} />
                        {generateLoyers.isPending ? "Génération..." : "Générer les appels"}
                    </Button>
                }
            />

            <LoyersStatsGrid
                totalAppels={totalAppels}
                totalMontant={totalMontant}
                tauxEncaissement={tauxEncaissement}
                impayesCount={impayesCount}
            />

            <LoyersFilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
            />

            <LoyersGrid
                loyers={loyers}
                isLoading={isLoading}
                filters={filters}
                onView={handleView}
                onAction={handleAction}
                onGenerate={handleGenerate}
            />

            <LoyerPaymentDialog
                open={paiementDialog.open}
                onOpenChange={(open) => {
                    if (!open) {
                        setPaiementDialog({ open: false, loyer: null });
                        setPaiementMontant("");
                    }
                }}
                loyer={paiementDialog.loyer}
                montant={paiementMontant}
                onMontantChange={setPaiementMontant}
                onSubmit={handlePaiementSubmit}
                isPending={enregistrerPaiement.isPending}
            />
        </div>
    );
}

export default function LoyersPage() {
    return (
        <SuspensePage
            skeletonProps={{
                layout: "grid",
                headerActionsCount: 1,
                statsCount: 4,
            }}
        >
            <LoyersPageContent />
        </SuspensePage>
    );
}
