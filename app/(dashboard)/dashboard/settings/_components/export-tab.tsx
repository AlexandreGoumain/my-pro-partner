"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SettingsSection } from "@/components/ui/settings-section";
import { Spinner } from "@/components/ui/spinner";
import { useFECExport } from "@/hooks/use-fec-export";
import { format } from "date-fns";
import {
    BarChart3,
    Calendar,
    DollarSign,
    Download,
    FileText,
    Info,
    Receipt,
    TrendingUp,
} from "lucide-react";
import { useEffect } from "react";

interface StatCardProps {
    icon: React.ElementType;
    label: string;
    value: string | number;
    sublabel?: string;
}

function StatCard({ icon: Icon, label, value, sublabel }: StatCardProps) {
    return (
        <div className="rounded-lg border border-black/8 bg-white p-4 space-y-2">
            <div className="flex items-center gap-2 text-black/60">
                <Icon className="h-4 w-4" strokeWidth={2} />
                <span className="text-[13px] font-medium">{label}</span>
            </div>
            <div className="space-y-1">
                <div className="text-2xl font-bold text-black">{value}</div>
                {sublabel && <div className="text-[12px] text-black/50">{sublabel}</div>}
            </div>
        </div>
    );
}

export function ExportTab() {
    const {
        dateDebut,
        dateFin,
        setDateDebut,
        setDateFin,
        setPeriodPreset,
        stats,
        isLoadingStats,
        loadStats,
        isExporting,
        exportFEC,
    } = useFECExport();

    useEffect(() => {
        loadStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateDebut, dateFin]);

    return (
        <div className="space-y-8">
            <SettingsSection
                icon={Info}
                title="À propos du FEC"
                description="Fichier des Écritures Comptables obligatoire pour les entreprises françaises"
            >
                <div className="max-w-3xl rounded-lg border border-black/8 bg-white p-5 shadow-sm">
                    <div className="flex gap-4">
                        <FileText className="h-5 w-5 text-black/60 flex-shrink-0 mt-0.5" strokeWidth={2} />
                        <div className="space-y-3 text-[14px]">
                            <p className="font-medium text-black">Obligation légale</p>
                            <p className="text-black/70 leading-relaxed">
                                Le FEC doit être produit sur demande de l&apos;administration fiscale
                                lors d&apos;un contrôle (Article A47 A-1 du Livre des procédures fiscales).
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-[13px] text-black/60">
                                <div>
                                    <span className="font-medium text-black">Format :</span> TXT (pipe |)
                                </div>
                                <div>
                                    <span className="font-medium text-black">Nom :</span> SiretFECAAAAMMJJ.txt
                                </div>
                                <div>
                                    <span className="font-medium text-black">Contenu :</span> Écritures comptables
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection
                icon={FileText}
                title="Export FEC"
                description="Générez le fichier des écritures comptables"
            >
                <div className="space-y-6 max-w-3xl">
                    <div className="space-y-2">
                        <Label className="text-[14px] font-medium">Période prédéfinie</Label>
                        <Select onValueChange={setPeriodPreset}>
                            <SelectTrigger className="h-11 border-black/10">
                                <SelectValue placeholder="Sélectionner une période" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="current-year">Année en cours</SelectItem>
                                <SelectItem value="last-year">Année dernière</SelectItem>
                                <SelectItem value="last-3-months">3 derniers mois</SelectItem>
                                <SelectItem value="last-6-months">6 derniers mois</SelectItem>
                                <SelectItem value="last-12-months">12 derniers mois</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="dateDebut" className="text-[14px] font-medium">
                                Date de début
                            </Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
                                <Input
                                    id="dateDebut"
                                    type="date"
                                    value={format(dateDebut, "yyyy-MM-dd")}
                                    onChange={(e) => setDateDebut(new Date(e.target.value))}
                                    className="h-11 border-black/10 pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dateFin" className="text-[14px] font-medium">
                                Date de fin
                            </Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
                                <Input
                                    id="dateFin"
                                    type="date"
                                    value={format(dateFin, "yyyy-MM-dd")}
                                    onChange={(e) => setDateFin(new Date(e.target.value))}
                                    className="h-11 border-black/10 pl-10"
                                />
                            </div>
                        </div>
                    </div>

                    {stats && !isLoadingStats && (
                        <div className="space-y-4 pt-2">
                            <h4 className="text-[14px] font-semibold flex items-center gap-2">
                                <BarChart3 className="h-4 w-4" strokeWidth={2} />
                                Aperçu de la période
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <StatCard
                                    icon={Receipt}
                                    label="Documents"
                                    value={stats.documents.total}
                                    sublabel={`${stats.documents.factures} factures, ${stats.documents.avoirs} avoirs`}
                                />
                                <StatCard
                                    icon={DollarSign}
                                    label="Paiements"
                                    value={stats.paiements}
                                    sublabel="transactions enregistrées"
                                />
                                <StatCard
                                    icon={FileText}
                                    label="Écritures"
                                    value={stats.ecritures}
                                    sublabel="lignes comptables"
                                />
                            </div>

                            <div className="rounded-lg border border-black/8 bg-white p-4 shadow-sm">
                                <div className="flex items-center gap-2 text-black mb-3">
                                    <TrendingUp className="h-4 w-4" strokeWidth={2} />
                                    <span className="text-[13px] font-semibold">Chiffre d&apos;affaires</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-[13px]">
                                    <div>
                                        <div className="text-black/60 mb-1">HT</div>
                                        <div className="font-bold text-black">
                                            {parseFloat(stats.montants.ventesHT).toLocaleString("fr-FR", {
                                                minimumFractionDigits: 2,
                                            })}{" "}
                                            €
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-black/60 mb-1">TVA</div>
                                        <div className="font-bold text-black">
                                            {parseFloat(stats.montants.tva).toLocaleString("fr-FR", {
                                                minimumFractionDigits: 2,
                                            })}{" "}
                                            €
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-black/60 mb-1">TTC</div>
                                        <div className="font-bold text-black">
                                            {parseFloat(stats.montants.ventesTTC).toLocaleString("fr-FR", {
                                                minimumFractionDigits: 2,
                                            })}{" "}
                                            €
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="pt-4">
                        <Button
                            onClick={exportFEC}
                            disabled={isExporting || isLoadingStats}
                            className="h-11 bg-black hover:bg-black/90 text-white px-6"
                        >
                            {isExporting ? (
                                <>
                                    <Spinner className="mr-2" />
                                    Export en cours...
                                </>
                            ) : (
                                <>
                                    <Download className="mr-2 h-4 w-4" strokeWidth={2} />
                                    Télécharger le FEC
                                </>
                            )}
                        </Button>
                        <p className="text-[12px] text-black/50 mt-3">
                            Format TXT avec nomenclature légale (SIRETFECAAAAMMJJ.txt)
                        </p>
                    </div>
                </div>
            </SettingsSection>
        </div>
    );
}
