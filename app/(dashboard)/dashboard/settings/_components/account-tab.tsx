"use client";

import { AccountInfoField } from "@/components/settings/account-info-field";
import { DeleteAllDataDialog } from "@/components/settings/delete-all-data-dialog";
import { LoginActivityItem } from "@/components/settings/login-activity-item";
import { PasswordChangeForm } from "@/components/settings/password-change-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SettingsSection } from "@/components/ui/settings-section";
import { ROLE_LABELS, UserRole } from "@/lib/personnel/roles-config";
import { UserSettings } from "@/lib/types/settings";
import { Activity, Key, Shield, Trash2, User } from "lucide-react";
import { useState } from "react";

interface AccountTabProps {
    user?: UserSettings | null;
}

export function AccountTab({ user = null }: AccountTabProps) {
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    return (
        <div className="space-y-6">
            <SettingsSection
                icon={User}
                title="Informations du compte"
                description="Gérez vos informations personnelles"
            >
                <div className="max-w-3xl grid grid-cols-1 gap-4 md:grid-cols-2">
                    <AccountInfoField
                        label="Nom complet"
                        value={user?.name || ""}
                        id="user_name"
                    />

                    <AccountInfoField
                        label="Email"
                        value={user?.email || ""}
                        type="email"
                        id="user_email"
                    />

                    <div className="space-y-2">
                        <Label className="text-[14px] font-medium">Rôle</Label>
                        <div className="flex items-center gap-2">
                            <Badge
                                variant="outline"
                                className="h-7 border-black/10 px-3"
                            >
                                {
                                    ROLE_LABELS[
                                        (user?.role as UserRole) || "EMPLOYEE"
                                    ]
                                }
                            </Badge>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[14px] font-medium">
                            Membre depuis
                        </Label>
                        <div className="text-[14px] text-black/60">
                            {user?.createdAt
                                ? new Date(user.createdAt).toLocaleDateString(
                                      "fr-FR",
                                      {
                                          day: "numeric",
                                          month: "long",
                                          year: "numeric",
                                      }
                                  )
                                : "—"}
                        </div>
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection
                icon={Key}
                title="Sécurité du compte"
                description="Modifiez votre mot de passe"
            >
                <div className="max-w-3xl">
                    {!isChangingPassword ? (
                        <Button
                            variant="outline"
                            onClick={() => setIsChangingPassword(true)}
                            className="h-10 border-black/10 px-4 hover:bg-black/5"
                        >
                            Changer le mot de passe
                        </Button>
                    ) : (
                        <PasswordChangeForm
                            onCancel={() => setIsChangingPassword(false)}
                        />
                    )}
                </div>
            </SettingsSection>

            <SettingsSection
                icon={Shield}
                title="Authentification à deux facteurs"
                description="Renforcez la sécurité de votre compte"
            >
                <div className="max-w-3xl">
                    <div className="rounded-md border border-black/10 bg-black/5 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-[14px] font-medium text-black">
                                    Authentification à deux facteurs (2FA)
                                </div>
                                <p className="mt-1 text-[13px] text-black/60">
                                    Disponible prochainement sur le plan Premium
                                </p>
                            </div>
                            <Badge
                                variant="outline"
                                className="border-black/10"
                            >
                                Bientôt disponible
                            </Badge>
                        </div>
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection
                icon={Activity}
                title="Activité récente"
                description="Consultez l'activité de votre compte"
            >
                <div className="max-w-3xl">
                    <div className="space-y-0">
                        <LoginActivityItem
                            location="Paris, France"
                            timestamp="Il y a 2 minutes"
                            device="Chrome sur Windows"
                            isCurrent
                        />
                        <LoginActivityItem
                            location="Lyon, France"
                            timestamp="Hier à 14:23"
                            device="Safari sur Mac"
                        />
                        <LoginActivityItem
                            location="Paris, France"
                            timestamp="Il y a 3 jours"
                            device="Chrome sur Android"
                        />
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection
                icon={Trash2}
                title="Zone danger"
                description="Actions irréversibles (développement uniquement)"
            >
                <div className="max-w-3xl">
                    <div className="rounded-lg border border-red-200 bg-red-50/50 p-4">
                        <div className="space-y-4">
                            <div>
                                <div className="text-[14px] font-semibold text-red-900">
                                    Supprimer toutes mes données
                                </div>
                                <p className="mt-2 text-[13px] text-red-800/80">
                                    Cette action supprimera définitivement et
                                    irrémédiablement:
                                </p>
                                <ul className="ml-4 mt-2 list-disc space-y-1 text-[13px] text-red-800/70">
                                    <li>Tous vos horaires de travail</li>
                                    <li>Tous vos pointages (TimeEntry)</li>
                                    <li>Toutes vos activités enregistrées</li>
                                    <li>Toutes vos conversations IA</li>
                                    <li>
                                        Tous les mouvements de stock que vous
                                        avez créés
                                    </li>
                                    <li>Vos permissions et paramètres</li>
                                    <li>Votre compte utilisateur</li>
                                </ul>
                            </div>

                            <DeleteAllDataDialog />
                        </div>
                    </div>
                </div>
            </SettingsSection>
        </div>
    );
}
