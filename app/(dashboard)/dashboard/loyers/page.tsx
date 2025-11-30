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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Receipt, Plus, Home, User, Euro, Calendar, Download,
    Send
} from "lucide-react";
import { cn } from "@/lib/utils";
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

const STATUT_OPTIONS = [
    { value: "ALL", label: "Tous les statuts" },
    { value: "A_ENVOYER", label: "À envoyer" },
    { value: "ENVOYE", label: "Envoyé" },
    { value: "PAYE", label: "Payé" },
    { value: "PARTIELLEMENT_PAYE", label: "Payé partiellement" },
    { value: "IMPAYE", label: "Impayé" },
    { value: "EN_CONTENTIEUX", label: "En contentieux" },
];

const STATUT_CONFIG: Record<string, { label: string; variant: "default" | "outline" | "secondary" | "destructive" }> = {
    A_ENVOYER: { label: "À envoyer", variant: "outline" },
    ENVOYE: { label: "Envoyé", variant: "secondary" },
    PAYE: { label: "Payé", variant: "default" },
    PARTIELLEMENT_PAYE: { label: "Partiel", variant: "secondary" },
    IMPAYE: { label: "Impayé", variant: "destructive" },
    EN_CONTENTIEUX: { label: "Contentieux", variant: "destructive" },
};

// Generate month options
const generateMonthOptions = () => {
    const options = [{ value: "ALL", label: "Tous les mois" }];
    const now = new Date();
    for (let i = -3; i <= 3; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
        const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        const label = date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
        options.push({ value, label: label.charAt(0).toUpperCase() + label.slice(1) });
    }
    return options;
};

const MOIS_OPTIONS = generateMonthOptions();
const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();

function LoyerCard({ loyer, onView, onAction }: {
    loyer: LoyerWithRelations;
    onView: (l: LoyerWithRelations) => void;
    onAction: (l: LoyerWithRelations, action: string) => void;
}) {
    const statutConfig = STATUT_CONFIG[loyer.statut] || STATUT_CONFIG.A_ENVOYER;
    const totalDu = Number(loyer.totalDu) || 0;
    const montantPaye = Number(loyer.montantPaye) || 0;
    const resteAPayer = totalDu - montantPaye;

    const moisLabel = new Date(loyer.annee, loyer.mois - 1, 1).toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
    });

    const echeanceDate = loyer.dateEcheance ? new Date(loyer.dateEcheance) : null;
    const isOverdue = echeanceDate && echeanceDate < new Date() && loyer.statut !== "PAYE";

    return (
        <Card
            className={cn(
                "p-4 border-black/[0.08] hover:border-black/20 transition-all cursor-pointer",
                isOverdue && "border-l-4 border-l-red-500"
            )}
            onClick={() => onView(loyer)}
        >
            <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[12px] text-black/40">{loyer.numero}</span>
                        <Badge variant={statutConfig.variant} className="text-[10px] h-5">
                            {statutConfig.label}
                        </Badge>
                    </div>
                    <p className="text-[14px] font-medium text-black capitalize">
                        {moisLabel}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-[16px] font-bold text-black">
                        {totalDu.toLocaleString("fr-FR")} €
                    </p>
                    {resteAPayer > 0 && loyer.statut !== "A_ENVOYER" && (
                        <p className="text-[11px] text-red-600">
                            Reste: {resteAPayer.toLocaleString("fr-FR")} €
                        </p>
                    )}
                </div>
            </div>

            {/* Bien et locataire */}
            <div className="space-y-1.5 mb-3">
                {loyer.bail?.bien && (
                    <div className="flex items-center gap-2 text-[13px] text-black/60">
                        <Home className="w-3.5 h-3.5 text-black/40" />
                        <span className="line-clamp-1">{loyer.bail.bien.titre}</span>
                    </div>
                )}
                {loyer.bail?.locatairePrincipal && (
                    <div className="flex items-center gap-2 text-[12px] text-black/40">
                        <User className="w-3.5 h-3.5" />
                        <span>
                            {loyer.bail.locatairePrincipal.prenom} {loyer.bail.locatairePrincipal.nom}
                        </span>
                    </div>
                )}
            </div>

            {/* Détails */}
            <div className="flex items-center gap-3 text-[11px] text-black/40 mb-3">
                <span>HC: {Number(loyer.loyerHC || 0).toLocaleString("fr-FR")} €</span>
                <span>+</span>
                <span>Provisions: {Number(loyer.provisions || 0).toLocaleString("fr-FR")} €</span>
            </div>

            {/* Échéance */}
            {echeanceDate && (
                <div className="flex items-center gap-2 text-[12px] mb-3">
                    <Calendar className="w-3.5 h-3.5 text-black/40" />
                    <span className={cn(
                        isOverdue ? "text-red-600 font-medium" : "text-black/40"
                    )}>
                        Échéance: {echeanceDate.toLocaleDateString("fr-FR")}
                    </span>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
                {loyer.statut === "A_ENVOYER" && (
                    <Button
                        variant="default"
                        size="sm"
                        className="bg-black hover:bg-black/90 text-white text-[11px] h-7 flex-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction(loyer, "send");
                        }}
                    >
                        <Send className="w-3 h-3 mr-1" />
                        Envoyer
                    </Button>
                )}
                {loyer.statut === "PAYE" && !loyer.quittanceGeneree && (
                    <Button
                        variant="default"
                        size="sm"
                        className="bg-black hover:bg-black/90 text-white text-[11px] h-7 flex-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction(loyer, "quittance");
                        }}
                    >
                        <Download className="w-3 h-3 mr-1" />
                        Quittance
                    </Button>
                )}
                {loyer.statut === "PAYE" && loyer.quittanceGeneree && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-[11px] h-7 flex-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction(loyer, "download");
                        }}
                    >
                        <Download className="w-3 h-3 mr-1" />
                        Télécharger
                    </Button>
                )}
                {(loyer.statut === "ENVOYE" || loyer.statut === "PARTIELLEMENT_PAYE") && (
                    <Button
                        variant="default"
                        size="sm"
                        className="bg-black hover:bg-black/90 text-white text-[11px] h-7 flex-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction(loyer, "encaissement");
                        }}
                    >
                        <Euro className="w-3 h-3 mr-1" />
                        Encaisser
                    </Button>
                )}
                {loyer.statut === "IMPAYE" && (
                    <Button
                        variant="destructive"
                        size="sm"
                        className="text-[11px] h-7 flex-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction(loyer, "relance");
                        }}
                    >
                        <Send className="w-3 h-3 mr-1" />
                        Relancer
                    </Button>
                )}
            </div>
        </Card>
    );
}

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
                // TODO: Implement relance
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

    // Build current mois value for filter
    const currentMoisFilter = filters.mois && filters.annee
        ? `${filters.annee}-${String(filters.mois).padStart(2, "0")}`
        : "ALL";

    // Stats
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

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Appels du mois</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {totalAppels}
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Montant attendu</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {totalMontant.toLocaleString("fr-FR")} €
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Taux encaissement</p>
                    <p className="text-[28px] font-bold tracking-[-0.02em] text-black">
                        {tauxEncaissement}%
                    </p>
                </Card>
                <Card className="p-5 border-black/[0.08]">
                    <p className="text-[13px] text-black/40 mb-1">Impayés / Partiels</p>
                    <p className={cn(
                        "text-[28px] font-bold tracking-[-0.02em]",
                        impayesCount > 0 ? "text-red-600" : "text-black"
                    )}>
                        {impayesCount}
                    </p>
                </Card>
            </div>

            <FilterBar
                variant="card"
                filters={[
                    {
                        type: "select",
                        value: currentMoisFilter,
                        onChange: (value) => handleFilterChange("mois", value),
                        options: MOIS_OPTIONS,
                        label: "Mois",
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="h-[220px] bg-black/5 rounded-lg animate-pulse"
                        />
                    ))}
                </div>
            ) : loyers.length === 0 ? (
                <EmptyState
                    icon={Receipt}
                    title="Aucun appel de loyer"
                    description={
                        filters.statut
                            ? "Aucun appel ne correspond à vos critères"
                            : "Générez les appels de loyers pour le mois en cours"
                    }
                    action={
                        filters.statut
                            ? undefined
                            : {
                                label: "Générer les appels",
                                onClick: handleGenerate,
                            }
                    }
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loyers.map((loyer) => (
                        <LoyerCard
                            key={loyer.id}
                            loyer={loyer}
                            onView={handleView}
                            onAction={handleAction}
                        />
                    ))}
                </div>
            )}

            {/* Paiement Dialog */}
            <Dialog open={paiementDialog.open} onOpenChange={(open) => {
                if (!open) {
                    setPaiementDialog({ open: false, loyer: null });
                    setPaiementMontant("");
                }
            }}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Enregistrer un paiement</DialogTitle>
                        <DialogDescription>
                            {paiementDialog.loyer && (
                                <>
                                    Loyer de {new Date(paiementDialog.loyer.annee, paiementDialog.loyer.mois - 1, 1).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                                    <br />
                                    Reste à payer: {(Number(paiementDialog.loyer.totalDu) - Number(paiementDialog.loyer.montantPaye)).toLocaleString("fr-FR")} €
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="montant">Montant du paiement (€)</Label>
                            <Input
                                id="montant"
                                type="number"
                                step="0.01"
                                value={paiementMontant}
                                onChange={(e) => setPaiementMontant(e.target.value)}
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setPaiementDialog({ open: false, loyer: null });
                                setPaiementMontant("");
                            }}
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handlePaiementSubmit}
                            disabled={!paiementMontant || enregistrerPaiement.isPending}
                            className="bg-black hover:bg-black/90"
                        >
                            {enregistrerPaiement.isPending ? "Enregistrement..." : "Enregistrer"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
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
