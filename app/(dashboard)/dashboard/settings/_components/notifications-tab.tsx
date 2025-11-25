"use client";

import { Label } from "@/components/ui/label";
import { SettingsSection } from "@/components/ui/settings-section";
import { Switch } from "@/components/ui/switch";
import { NotificationPreferences } from "@/lib/types/settings";
import { Bell, Webhook } from "lucide-react";

interface NotificationsTabProps {
    notifications: Partial<NotificationPreferences>;
    onChange: (field: string, value: boolean) => void;
}

interface NotificationSwitchProps {
    id: string;
    label: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

function NotificationSwitch({
    id,
    label,
    description,
    checked,
    onChange,
}: NotificationSwitchProps) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-black/5 last:border-0">
            <div className="flex-1 pr-4">
                <Label htmlFor={id} className="text-[14px] font-medium cursor-pointer">
                    {label}
                </Label>
                <p className="text-[13px] text-black/50 mt-0.5">{description}</p>
            </div>
            <Switch id={id} checked={checked} onCheckedChange={onChange} />
        </div>
    );
}

export function NotificationsTab({ notifications, onChange }: NotificationsTabProps) {
    const notificationOptions = [
        {
            id: "email_nouveau_client",
            label: "Nouveau client",
            description: "Notification lors de la création d'un nouveau client",
        },
        {
            id: "email_document_cree",
            label: "Document créé",
            description: "Notification lors de la création d'un devis ou facture",
        },
        {
            id: "email_document_paye",
            label: "Document payé",
            description: "Notification lors du paiement d'une facture",
        },
        {
            id: "email_stock_bas",
            label: "Alerte stock bas",
            description: "Alerte lorsqu'un article atteint son seuil minimum",
        },
        {
            id: "email_rapport_hebdomadaire",
            label: "Rapport hebdomadaire",
            description: "Résumé hebdomadaire de votre activité",
        },
    ];

    return (
        <div className="space-y-6">
            <SettingsSection
                icon={Bell}
                title="Notifications email"
                description="Choisissez les notifications à recevoir par email"
            >
                <div className="max-w-2xl bg-white rounded-lg border border-black/8 divide-y divide-black/5">
                    {notificationOptions.map((option) => (
                        <div key={option.id} className="px-4">
                            <NotificationSwitch
                                id={option.id}
                                label={option.label}
                                description={option.description}
                                checked={
                                    notifications[option.id as keyof NotificationPreferences] as boolean || false
                                }
                                onChange={(checked) => onChange(option.id, checked)}
                            />
                        </div>
                    ))}
                </div>
            </SettingsSection>

            <SettingsSection
                icon={Webhook}
                title="Webhooks"
                description="Intégration avec des services tiers"
            >
                <div className="max-w-2xl rounded-lg border border-black/8 bg-black/[0.02] p-4">
                    <p className="text-[14px] text-black/60 text-center">
                        Configuration des webhooks disponible prochainement
                    </p>
                </div>
            </SettingsSection>
        </div>
    );
}
