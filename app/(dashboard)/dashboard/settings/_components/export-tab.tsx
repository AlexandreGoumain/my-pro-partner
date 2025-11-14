"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsSection } from "@/components/ui/settings-section";
import { useFECExport } from "@/hooks/use-fec-export";
import {
  Download,
  FileText,
  Calendar,
  TrendingUp,
  Receipt,
  DollarSign,
  BarChart3,
  Info,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  // Charger les stats au montage et quand les dates changent
  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateDebut, dateFin]);

  return (
    <div className="space-y-8">
      {/* Section Info FEC */}
      <SettingsSection
        icon={Info}
        title="À propos du FEC"
        description="Le Fichier des Écritures Comptables est obligatoire pour toutes les entreprises françaises tenant leur comptabilité au moyen de systèmes informatisés"
      >
        <div className="space-y-4">
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="space-y-2 text-[14px]">
                <p className="font-medium text-blue-900">
                  Obligation légale
                </p>
                <p className="text-blue-800">
                  Le FEC doit être produit sur demande de l&apos;administration
                  fiscale lors d&apos;un contrôle (Article A47 A-1 du Livre des
                  procédures fiscales). Le format est standardisé et doit
                  contenir toutes les écritures comptables de l&apos;exercice.
                </p>
                <p className="text-blue-800 text-[13px] mt-2">
                  <strong>Format du fichier :</strong> TXT avec séparateur pipe (|)
                  <br />
                  <strong>Nomenclature :</strong> SiretFECAAAAMMJJ.txt
                  <br />
                  <strong>Contenu :</strong> Écritures de ventes, achats, banque et opérations diverses
                </p>
              </div>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Section Export */}
      <SettingsSection
        icon={FileText}
        title="Export FEC"
        description="Générez le fichier des écritures comptables pour une période donnée"
      >
        <div className="space-y-6">
          {/* Période prédéfinie */}
          <div className="space-y-2">
            <Label className="text-[14px] font-medium">
              Période prédéfinie
            </Label>
            <Select onValueChange={setPeriodPreset}>
              <SelectTrigger className="h-11 border-black/10">
                <SelectValue placeholder="Sélectionner une période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current-year">
                  Année en cours
                </SelectItem>
                <SelectItem value="last-year">
                  Année dernière
                </SelectItem>
                <SelectItem value="last-3-months">
                  3 derniers mois
                </SelectItem>
                <SelectItem value="last-6-months">
                  6 derniers mois
                </SelectItem>
                <SelectItem value="last-12-months">
                  12 derniers mois
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dates personnalisées */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateDebut" className="text-[14px] font-medium">
                Date de début
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/40" />
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
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/40" />
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

          {/* Statistiques */}
          {stats && !isLoadingStats && (
            <div className="mt-6 space-y-4">
              <h4 className="text-[14px] font-semibold flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Aperçu de la période
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Documents */}
                <div className="rounded-lg border border-black/10 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-black/60">
                    <Receipt className="h-4 w-4" />
                    <span className="text-[13px] font-medium">Documents</span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">
                      {stats.documents.total}
                    </div>
                    <div className="text-[12px] text-black/60">
                      {stats.documents.factures} factures, {stats.documents.avoirs} avoirs
                    </div>
                  </div>
                </div>

                {/* Paiements */}
                <div className="rounded-lg border border-black/10 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-black/60">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-[13px] font-medium">Paiements</span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">
                      {stats.paiements}
                    </div>
                    <div className="text-[12px] text-black/60">
                      transactions enregistrées
                    </div>
                  </div>
                </div>

                {/* Écritures */}
                <div className="rounded-lg border border-black/10 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-black/60">
                    <FileText className="h-4 w-4" />
                    <span className="text-[13px] font-medium">Écritures</span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">
                      {stats.ecritures}
                    </div>
                    <div className="text-[12px] text-black/60">
                      lignes comptables
                    </div>
                  </div>
                </div>
              </div>

              {/* Montants */}
              <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                <div className="flex items-center gap-2 text-green-900 mb-3">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-[13px] font-semibold">
                    Chiffre d&apos;affaires
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-[13px]">
                  <div>
                    <div className="text-green-700 mb-1">HT</div>
                    <div className="font-bold text-green-900">
                      {parseFloat(stats.montants.ventesHT).toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      €
                    </div>
                  </div>
                  <div>
                    <div className="text-green-700 mb-1">TVA</div>
                    <div className="font-bold text-green-900">
                      {parseFloat(stats.montants.tva).toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      €
                    </div>
                  </div>
                  <div>
                    <div className="text-green-700 mb-1">TTC</div>
                    <div className="font-bold text-green-900">
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

          {/* Bouton d'export */}
          <div className="pt-4">
            <Button
              onClick={exportFEC}
              disabled={isExporting || isLoadingStats}
              className="w-full md:w-auto h-11 bg-black hover:bg-black/90 text-white"
            >
              {isExporting ? (
                <>
                  <Spinner className="mr-2" />
                  Export en cours...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger le FEC
                </>
              )}
            </Button>

            <p className="text-[12px] text-black/60 mt-3">
              Le fichier sera téléchargé au format TXT avec la nomenclature
              légale (SIRETFECAAAAMMJJ.txt)
            </p>
          </div>
        </div>
      </SettingsSection>
    </div>
  );
}
