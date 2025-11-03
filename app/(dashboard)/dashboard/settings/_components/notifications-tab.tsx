"use client";

import { Label } from "@/components/ui/label";
import { SettingsSection } from "@/components/ui/settings-section";
import { Switch } from "@/components/ui/switch";
import { Bell, Webhook } from "lucide-react";

interface NotificationsTabProps {
    notifications: any;
    onChange: (field: string, value: boolean) => void;
}

export function NotificationsTab({
    notifications,
    onChange,
}: NotificationsTabProps) {
    return (
        <div className="space-y-6">
            <SettingsSection
                icon={Bell}
                title="Notifications par email"
                description="Configurez les notifications que vous souhaitez recevoir"
            >
                <div className="space-y-4 max-w-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <Label
                                htmlFor="email_nouveau_client"
                                className="text-[14px] font-medium"
                            >
                                Nouveau client
                            </Label>
                            <p className="text-[13px] text-black/40 mt-0.5">
                                Recevoir une notification lors de la création
                                d&apos;un nouveau client
                            </p>
                        </div>
                        <Switch
                            id="email_nouveau_client"
                            checked={
                                notifications.email_nouveau_client || false
                            }
                            onCheckedChange={(checked) =>
                                onChange("email_nouveau_client", checked)
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <Label
                                htmlFor="email_document_cree"
                                className="text-[14px] font-medium"
                            >
                                Document créé
                            </Label>
                            <p className="text-[13px] text-black/40 mt-0.5">
                                Recevoir une notification lors de la création
                                d&apos;un devis ou d&apos;une facture
                            </p>
                        </div>
                        <Switch
                            id="email_document_cree"
                            checked={notifications.email_document_cree || false}
                            onCheckedChange={(checked) =>
                                onChange("email_document_cree", checked)
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <Label
                                htmlFor="email_document_paye"
                                className="text-[14px] font-medium"
                            >
                                Document payé
                            </Label>
                            <p className="text-[13px] text-black/40 mt-0.5">
                                Recevoir une notification lors du paiement
                                d&apos;une facture
                            </p>
                        </div>
                        <Switch
                            id="email_document_paye"
                            checked={notifications.email_document_paye || false}
                            onCheckedChange={(checked) =>
                                onChange("email_document_paye", checked)
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <Label
                                htmlFor="email_stock_bas"
                                className="text-[14px] font-medium"
                            >
                                Alerte stock bas
                            </Label>
                            <p className="text-[13px] text-black/40 mt-0.5">
                                Recevoir une alerte lorsqu&apos;un article
                                atteint son seuil minimum
                            </p>
                        </div>
                        <Switch
                            id="email_stock_bas"
                            checked={notifications.email_stock_bas || false}
                            onCheckedChange={(checked) =>
                                onChange("email_stock_bas", checked)
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <Label
                                htmlFor="email_rapport_hebdomadaire"
                                className="text-[14px] font-medium"
                            >
                                Rapport hebdomadaire
                            </Label>
                            <p className="text-[13px] text-black/40 mt-0.5">
                                Recevoir un résumé hebdomadaire de votre
                                activité
                            </p>
                        </div>
                        <Switch
                            id="email_rapport_hebdomadaire"
                            checked={
                                notifications.email_rapport_hebdomadaire ||
                                false
                            }
                            onCheckedChange={(checked) =>
                                onChange("email_rapport_hebdomadaire", checked)
                            }
                        />
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection
                icon={Webhook}
                title="Webhooks"
                description="Configuration des webhooks (fonctionnalité à venir)"
            >
                <div className="bg-black/5 border border-black/10 rounded-md p-4 text-center max-w-2xl">
                    <p className="text-[14px] text-black/60">
                        La configuration des webhooks sera disponible
                        prochainement
                    </p>
                </div>
            </SettingsSection>
        </div>
    );
}
