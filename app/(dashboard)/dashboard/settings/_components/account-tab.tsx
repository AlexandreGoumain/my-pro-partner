"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsSection } from "@/components/ui/settings-section";
import { UserSettings } from "@/lib/types/settings";
import { Activity, Key, Shield, User } from "lucide-react";
import { useState } from "react";

interface AccountTabProps {
    user: UserSettings;
}

export function AccountTab({ user }: AccountTabProps) {
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement password change
        console.log("Password change:", passwordData);
    };

    return (
        <div className="space-y-6">
            <SettingsSection
                icon={User}
                title="Informations du compte"
                description="Gérez vos informations personnelles"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
                    <div className="space-y-2">
                        <Label
                            htmlFor="user_name"
                            className="text-[14px] font-medium"
                        >
                            Nom complet
                        </Label>
                        <Input
                            id="user_name"
                            value={user?.name || ""}
                            placeholder="Votre nom"
                            className="h-11 border-black/10"
                            readOnly
                        />
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="user_email"
                            className="text-[14px] font-medium"
                        >
                            Email
                        </Label>
                        <Input
                            id="user_email"
                            type="email"
                            value={user?.email || ""}
                            placeholder="votre@email.com"
                            className="h-11 border-black/10"
                            readOnly
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[14px] font-medium">Rôle</Label>
                        <div className="flex items-center gap-2">
                            <Badge
                                variant="outline"
                                className="h-7 px-3 border-black/10"
                            >
                                {user?.role === "admin"
                                    ? "Administrateur"
                                    : "Utilisateur"}
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
                            className="h-10 px-4 border-black/10 hover:bg-black/5"
                        >
                            Changer le mot de passe
                        </Button>
                    ) : (
                        <form
                            onSubmit={handlePasswordChange}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <Label
                                    htmlFor="current_password"
                                    className="text-[14px] font-medium"
                                >
                                    Mot de passe actuel
                                </Label>
                                <Input
                                    id="current_password"
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) =>
                                        setPasswordData({
                                            ...passwordData,
                                            currentPassword: e.target.value,
                                        })
                                    }
                                    placeholder="Entrez votre mot de passe actuel"
                                    className="h-11 border-black/10 max-w-md"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="new_password"
                                    className="text-[14px] font-medium"
                                >
                                    Nouveau mot de passe
                                </Label>
                                <Input
                                    id="new_password"
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) =>
                                        setPasswordData({
                                            ...passwordData,
                                            newPassword: e.target.value,
                                        })
                                    }
                                    placeholder="Entrez un nouveau mot de passe"
                                    className="h-11 border-black/10 max-w-md"
                                    required
                                />
                                <p className="text-[12px] text-black/40">
                                    Minimum 8 caractères avec lettres et
                                    chiffres
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="confirm_password"
                                    className="text-[14px] font-medium"
                                >
                                    Confirmer le mot de passe
                                </Label>
                                <Input
                                    id="confirm_password"
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) =>
                                        setPasswordData({
                                            ...passwordData,
                                            confirmPassword: e.target.value,
                                        })
                                    }
                                    placeholder="Confirmez le nouveau mot de passe"
                                    className="h-11 border-black/10 max-w-md"
                                    required
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    type="submit"
                                    className="h-10 px-4 bg-black hover:bg-black/90 text-white"
                                >
                                    Mettre à jour le mot de passe
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setIsChangingPassword(false);
                                        setPasswordData({
                                            currentPassword: "",
                                            newPassword: "",
                                            confirmPassword: "",
                                        });
                                    }}
                                    className="h-10 px-4 border-black/10 hover:bg-black/5"
                                >
                                    Annuler
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </SettingsSection>

            <SettingsSection
                icon={Shield}
                title="Authentification à deux facteurs"
                description="Renforcez la sécurité de votre compte"
            >
                <div className="max-w-3xl">
                    <div className="bg-black/5 border border-black/10 rounded-md p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-[14px] font-medium text-black">
                                    Authentification à deux facteurs (2FA)
                                </div>
                                <p className="text-[13px] text-black/60 mt-1">
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
                    <div className="space-y-3">
                        <div className="flex items-center justify-between py-3 border-b border-black/8">
                            <div>
                                <div className="text-[14px] font-medium text-black">
                                    Connexion depuis Paris, France
                                </div>
                                <p className="text-[13px] text-black/40 mt-0.5">
                                    Il y a 2 minutes • Chrome sur Windows
                                </p>
                            </div>
                            <Badge
                                variant="outline"
                                className="border-green-200 bg-green-50 text-green-700"
                            >
                                Actuelle
                            </Badge>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-black/8">
                            <div>
                                <div className="text-[14px] font-medium text-black">
                                    Connexion depuis Lyon, France
                                </div>
                                <p className="text-[13px] text-black/40 mt-0.5">
                                    Hier à 14:23 • Safari sur Mac
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-3">
                            <div>
                                <div className="text-[14px] font-medium text-black">
                                    Connexion depuis Paris, France
                                </div>
                                <p className="text-[13px] text-black/40 mt-0.5">
                                    Il y a 3 jours • Chrome sur Android
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </SettingsSection>
        </div>
    );
}
