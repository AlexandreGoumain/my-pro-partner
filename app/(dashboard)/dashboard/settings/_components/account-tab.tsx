"use client";

import { AccountInfoField } from "@/components/settings/account-info-field";
import { DeleteAllDataDialog } from "@/components/settings/delete-all-data-dialog";
import { DeleteAllSegmentsDialog } from "@/components/settings/delete-all-segments-dialog";
import { DeleteDataTypeDialog } from "@/components/settings/delete-data-type-dialog";
import { DeleteEntireDbDialog } from "@/components/settings/delete-entire-db-dialog";
import { LoginActivityItem } from "@/components/settings/login-activity-item";
import { PasswordChangeForm } from "@/components/settings/password-change-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SettingsSection } from "@/components/ui/settings-section";
import { ROLE_LABELS, UserRole } from "@/lib/personnel/roles-config";
import { UserSettings } from "@/lib/types/settings";
import {
    Activity,
    Building2,
    Clock,
    FileText,
    Filter,
    Key,
    MessageSquare,
    Package,
    Shield,
    ShieldAlert,
    ShoppingCart,
    Trash2,
    TruckIcon,
    User,
    Users,
} from "lucide-react";
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
                <div className="max-w-4xl">
                    <div className="rounded-lg border border-red-200 bg-red-50/50 p-6">
                        <div className="space-y-6">
                            {/* Mes données personnelles */}
                            <div>
                                <div className="text-[14px] font-semibold text-red-900">
                                    Supprimer toutes mes données
                                </div>
                                <p className="mt-2 text-[13px] text-red-800/80">
                                    Supprime toutes vos données personnelles de manière
                                    irréversible.
                                </p>
                                <div className="mt-3">
                                    <DeleteAllDataDialog />
                                </div>
                            </div>

                            {/* Suppression par type de données */}
                            <div className="pt-4 border-t border-orange-200">
                                <div className="text-[15px] font-semibold text-orange-900 mb-3">
                                    Supprimer des types de données
                                </div>
                                <p className="text-[13px] text-orange-800/80 mb-4">
                                    Supprimez sélectivement des types de données de
                                    votre entreprise.
                                </p>
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    <DeleteDataTypeDialog
                                        type="clients"
                                        title="Supprimer tous les clients ?"
                                        description="Cette action supprimera tous les clients de votre entreprise de manière irréversible."
                                        buttonLabel="Clients"
                                        confirmMessage="Je comprends que tous les clients seront supprimés"
                                        icon={Users}
                                        apiEndpoint="/api/admin/delete-clients"
                                        color="orange"
                                    />
                                    <DeleteDataTypeDialog
                                        type="articles"
                                        title="Supprimer tous les articles ?"
                                        description="Cette action supprimera tous les articles et produits de votre entreprise de manière irréversible."
                                        buttonLabel="Articles"
                                        confirmMessage="Je comprends que tous les articles seront supprimés"
                                        icon={Package}
                                        apiEndpoint="/api/admin/delete-articles"
                                        color="orange"
                                    />
                                    <DeleteDataTypeDialog
                                        type="fournisseurs"
                                        title="Supprimer tous les fournisseurs ?"
                                        description="Cette action supprimera tous les fournisseurs de votre entreprise de manière irréversible."
                                        buttonLabel="Fournisseurs"
                                        confirmMessage="Je comprends que tous les fournisseurs seront supprimés"
                                        icon={TruckIcon}
                                        apiEndpoint="/api/admin/delete-fournisseurs"
                                        color="orange"
                                    />
                                    <DeleteDataTypeDialog
                                        type="segments"
                                        title="Supprimer tous les segments ?"
                                        description="Cette action supprimera tous les segments (prédéfinis et personnalisés) de votre entreprise. Les clients ne seront pas affectés."
                                        buttonLabel="Segments"
                                        confirmMessage="Je comprends que tous les segments seront supprimés"
                                        icon={Filter}
                                        apiEndpoint="/api/admin/delete-all-segments"
                                        color="orange"
                                    />
                                    <DeleteDataTypeDialog
                                        type="factures"
                                        title="Supprimer toutes les factures et devis ?"
                                        description="Cette action supprimera toutes les factures et devis de votre entreprise de manière irréversible."
                                        buttonLabel="Factures/Devis"
                                        confirmMessage="Je comprends que toutes les factures et devis seront supprimés"
                                        icon={FileText}
                                        apiEndpoint="/api/admin/delete-factures"
                                        color="yellow"
                                    />
                                    <DeleteDataTypeDialog
                                        type="stocks"
                                        title="Supprimer tous les mouvements de stock ?"
                                        description="Cette action supprimera tous les mouvements de stock de votre entreprise de manière irréversible."
                                        buttonLabel="Stocks"
                                        confirmMessage="Je comprends que tous les mouvements de stock seront supprimés"
                                        icon={ShoppingCart}
                                        apiEndpoint="/api/admin/delete-stocks"
                                        color="yellow"
                                    />
                                    <DeleteDataTypeDialog
                                        type="horaires"
                                        title="Supprimer tous les horaires et pointages ?"
                                        description="Cette action supprimera tous les horaires et pointages de votre entreprise de manière irréversible."
                                        buttonLabel="Horaires"
                                        confirmMessage="Je comprends que tous les horaires et pointages seront supprimés"
                                        icon={Clock}
                                        apiEndpoint="/api/admin/delete-horaires"
                                        color="yellow"
                                    />
                                    <DeleteDataTypeDialog
                                        type="conversations"
                                        title="Supprimer toutes les conversations IA ?"
                                        description="Cette action supprimera toutes les conversations IA de votre entreprise de manière irréversible."
                                        buttonLabel="Conversations IA"
                                        confirmMessage="Je comprends que toutes les conversations IA seront supprimées"
                                        icon={MessageSquare}
                                        apiEndpoint="/api/admin/delete-conversations"
                                        color="yellow"
                                    />
                                    <DeleteDataTypeDialog
                                        type="utilisateurs"
                                        title="Supprimer tous les utilisateurs ?"
                                        description="Cette action supprimera tous les utilisateurs de votre entreprise de manière irréversible. ⚠️ Vous serez déconnecté."
                                        buttonLabel="Utilisateurs"
                                        confirmMessage="Je comprends que tous les utilisateurs seront supprimés"
                                        icon={User}
                                        apiEndpoint="/api/admin/delete-utilisateurs"
                                        color="red"
                                    />
                                </div>
                            </div>

                            {/* Actions globales dangereuses */}
                            <div className="pt-4 border-t border-red-300">
                                <div className="text-[15px] font-bold text-red-950 mb-3">
                                    💣 Actions globales extrêmement dangereuses
                                </div>
                                <p className="text-[13px] text-red-900/90 mb-4">
                                    ⚠️ Ces actions affectent TOUTES les entreprises,
                                    pas seulement la vôtre.
                                </p>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <DeleteDataTypeDialog
                                        type="entreprises"
                                        title="⚠️ Supprimer TOUTES les entreprises ?"
                                        description="DANGER EXTRÊME - Cette action supprimera TOUTES les entreprises de la base de données, pas seulement la vôtre. Tous les utilisateurs seront affectés."
                                        buttonLabel="Toutes les entreprises"
                                        confirmMessage="Je comprends que TOUTES les entreprises seront supprimées"
                                        icon={Building2}
                                        apiEndpoint="/api/admin/delete-entreprises"
                                        color="red"
                                    />
                                    <div>
                                        <div className="text-[13px] text-red-900/80 mb-2">
                                            Réinitialisation complète de
                                            l'application
                                        </div>
                                        <DeleteEntireDbDialog />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SettingsSection>
        </div>
    );
}
