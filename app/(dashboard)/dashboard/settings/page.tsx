"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { Textarea } from "@/components/ui/textarea";
import { Save, Building2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface CompanySettings {
    id?: string;
    nom_entreprise: string;
    siret?: string;
    tva_intra?: string;
    adresse?: string;
    code_postal?: string;
    ville?: string;
    telephone?: string;
    email?: string;
    site_web?: string;
    logo_url?: string;
    prefixe_devis: string;
    prefixe_facture: string;
    conditions_paiement_defaut?: string;
    mentions_legales?: string;
}

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [settings, setSettings] = useState<CompanySettings>({
        nom_entreprise: "",
        prefixe_devis: "DEV",
        prefixe_facture: "FACT",
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/settings/company");
            if (!response.ok) throw new Error("Erreur lors du chargement des paramètres");

            const data = await response.json();
            if (data.settings) {
                setSettings(data.settings);
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
            toast.error("Impossible de charger les paramètres");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const response = await fetch("/api/settings/company", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Erreur lors de la sauvegarde");
            }

            toast.success("Paramètres enregistrés avec succès");
        } catch (error: any) {
            console.error("Error saving settings:", error);
            toast.error(error.message || "Impossible d'enregistrer les paramètres");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Paramètres"
                    description="Configurez votre entreprise"
                />
                <Card className="p-12 border-black/8 shadow-sm">
                    <div className="flex items-center justify-center">
                        <div className="text-[14px] text-black/40">Chargement...</div>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Paramètres de l'entreprise"
                description="Gérez les informations de votre entreprise"
            />

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="p-6 border-black/8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5">
                            <Building2 className="h-5 w-5 text-black/60" strokeWidth={2} />
                        </div>
                        <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-black">
                            Informations générales
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="nom" className="text-[14px] font-medium">
                                Nom de l&apos;entreprise *
                            </Label>
                            <Input
                                id="nom"
                                value={settings.nom_entreprise}
                                onChange={(e) =>
                                    setSettings((prev) => ({ ...prev, nom_entreprise: e.target.value }))
                                }
                                placeholder="Ex: Mon Entreprise SARL"
                                className="h-11 border-black/10"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="siret" className="text-[14px] font-medium">
                                SIRET
                            </Label>
                            <Input
                                id="siret"
                                value={settings.siret || ""}
                                onChange={(e) =>
                                    setSettings((prev) => ({ ...prev, siret: e.target.value }))
                                }
                                placeholder="123 456 789 00012"
                                className="h-11 border-black/10"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tva" className="text-[14px] font-medium">
                                TVA Intracommunautaire
                            </Label>
                            <Input
                                id="tva"
                                value={settings.tva_intra || ""}
                                onChange={(e) =>
                                    setSettings((prev) => ({ ...prev, tva_intra: e.target.value }))
                                }
                                placeholder="FR12345678901"
                                className="h-11 border-black/10"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="adresse" className="text-[14px] font-medium">
                                Adresse
                            </Label>
                            <Input
                                id="adresse"
                                value={settings.adresse || ""}
                                onChange={(e) =>
                                    setSettings((prev) => ({ ...prev, adresse: e.target.value }))
                                }
                                placeholder="123 Rue de la République"
                                className="h-11 border-black/10"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cp" className="text-[14px] font-medium">
                                Code postal
                            </Label>
                            <Input
                                id="cp"
                                value={settings.code_postal || ""}
                                onChange={(e) =>
                                    setSettings((prev) => ({ ...prev, code_postal: e.target.value }))
                                }
                                placeholder="75001"
                                className="h-11 border-black/10"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="ville" className="text-[14px] font-medium">
                                Ville
                            </Label>
                            <Input
                                id="ville"
                                value={settings.ville || ""}
                                onChange={(e) =>
                                    setSettings((prev) => ({ ...prev, ville: e.target.value }))
                                }
                                placeholder="Paris"
                                className="h-11 border-black/10"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="telephone" className="text-[14px] font-medium">
                                Téléphone
                            </Label>
                            <Input
                                id="telephone"
                                value={settings.telephone || ""}
                                onChange={(e) =>
                                    setSettings((prev) => ({ ...prev, telephone: e.target.value }))
                                }
                                placeholder="01 23 45 67 89"
                                className="h-11 border-black/10"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[14px] font-medium">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={settings.email || ""}
                                onChange={(e) =>
                                    setSettings((prev) => ({ ...prev, email: e.target.value }))
                                }
                                placeholder="contact@monentreprise.fr"
                                className="h-11 border-black/10"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="web" className="text-[14px] font-medium">
                                Site web
                            </Label>
                            <Input
                                id="web"
                                value={settings.site_web || ""}
                                onChange={(e) =>
                                    setSettings((prev) => ({ ...prev, site_web: e.target.value }))
                                }
                                placeholder="https://monentreprise.fr"
                                className="h-11 border-black/10"
                            />
                        </div>
                    </div>
                </Card>

                <Card className="p-6 border-black/8 shadow-sm">
                    <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-black mb-4">
                        Paramètres de facturation
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="prefixe_devis" className="text-[14px] font-medium">
                                Préfixe des devis
                            </Label>
                            <Input
                                id="prefixe_devis"
                                value={settings.prefixe_devis}
                                onChange={(e) =>
                                    setSettings((prev) => ({ ...prev, prefixe_devis: e.target.value }))
                                }
                                placeholder="DEV"
                                className="h-11 border-black/10"
                                required
                            />
                            <p className="text-[12px] text-black/40">
                                Exemple: {settings.prefixe_devis}00001
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="prefixe_facture" className="text-[14px] font-medium">
                                Préfixe des factures
                            </Label>
                            <Input
                                id="prefixe_facture"
                                value={settings.prefixe_facture}
                                onChange={(e) =>
                                    setSettings((prev) => ({ ...prev, prefixe_facture: e.target.value }))
                                }
                                placeholder="FACT"
                                className="h-11 border-black/10"
                                required
                            />
                            <p className="text-[12px] text-black/40">
                                Exemple: {settings.prefixe_facture}00001
                            </p>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="conditions" className="text-[14px] font-medium">
                                Conditions de paiement par défaut
                            </Label>
                            <Textarea
                                id="conditions"
                                value={settings.conditions_paiement_defaut || ""}
                                onChange={(e) =>
                                    setSettings((prev) => ({
                                        ...prev,
                                        conditions_paiement_defaut: e.target.value,
                                    }))
                                }
                                placeholder="Ex: Paiement à 30 jours fin de mois"
                                className="min-h-[80px] border-black/10"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="mentions" className="text-[14px] font-medium">
                                Mentions légales
                            </Label>
                            <Textarea
                                id="mentions"
                                value={settings.mentions_legales || ""}
                                onChange={(e) =>
                                    setSettings((prev) => ({
                                        ...prev,
                                        mentions_legales: e.target.value,
                                    }))
                                }
                                placeholder="Mentions légales à afficher sur les documents..."
                                className="min-h-[120px] border-black/10"
                            />
                        </div>
                    </div>
                </Card>

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={isSaving}
                        className="h-11 px-6 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm"
                    >
                        <Save className="w-4 h-4 mr-2" strokeWidth={2} />
                        {isSaving ? "Enregistrement..." : "Enregistrer les paramètres"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
