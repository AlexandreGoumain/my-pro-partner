"use client";

import { AccountInfoField } from "@/components/settings/account-info-field";
import { DeleteAllDataDialog } from "@/components/settings/delete-all-data-dialog";
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
    ArrowRightLeft,
    Building2,
    Clock,
    Cog,
    CreditCard,
    FileText,
    Filter,
    FolderTree,
    Key,
    Link,
    LucideIcon,
    MessageSquare,
    Package,
    Repeat,
    Shield,
    ShoppingBag,
    ShoppingCart,
    Store,
    Trash2,
    TruckIcon,
    User,
    Users,
    Wrench,
} from "lucide-react";
import { useState } from "react";

// Vérifie si on est en développement local (localhost)
function getIsDevelopment() {
    if (typeof window === "undefined") return false;
    const hostname = window.location.hostname;
    return hostname === "localhost" || hostname === "127.0.0.1";
}

interface AccountTabProps {
    user?: UserSettings | null;
}

interface DeleteOption {
    type: string;
    title: string;
    description: string;
    buttonLabel: string;
    confirmMessage: string;
    icon: LucideIcon;
    apiEndpoint: string;
    color: "orange" | "yellow" | "red";
}

const dataTypeOptions: DeleteOption[] = [
    {
        type: "clients",
        title: "Supprimer tous les clients ?",
        description:
            "Cette action supprimera tous les clients de votre entreprise de manière irréversible.",
        buttonLabel: "Clients",
        confirmMessage: "Je comprends que tous les clients seront supprimés",
        icon: Users,
        apiEndpoint: "/api/admin/delete-clients",
        color: "orange",
    },
    {
        type: "articles",
        title: "Supprimer tous les articles ?",
        description:
            "Cette action supprimera tous les articles et produits de votre entreprise de manière irréversible.",
        buttonLabel: "Articles",
        confirmMessage: "Je comprends que tous les articles seront supprimés",
        icon: Package,
        apiEndpoint: "/api/admin/delete-articles",
        color: "orange",
    },
    {
        type: "fournisseurs",
        title: "Supprimer tous les fournisseurs ?",
        description:
            "Cette action supprimera tous les fournisseurs de votre entreprise de manière irréversible.",
        buttonLabel: "Fournisseurs",
        confirmMessage:
            "Je comprends que tous les fournisseurs seront supprimés",
        icon: TruckIcon,
        apiEndpoint: "/api/admin/delete-fournisseurs",
        color: "orange",
    },
    {
        type: "segments",
        title: "Supprimer tous les segments ?",
        description:
            "Cette action supprimera tous les segments (prédéfinis et personnalisés) de votre entreprise.",
        buttonLabel: "Segments",
        confirmMessage: "Je comprends que tous les segments seront supprimés",
        icon: Filter,
        apiEndpoint: "/api/admin/delete-all-segments",
        color: "orange",
    },
    {
        type: "factures",
        title: "Supprimer toutes les factures et devis ?",
        description:
            "Cette action supprimera toutes les factures et devis de votre entreprise de manière irréversible.",
        buttonLabel: "Factures/Devis",
        confirmMessage:
            "Je comprends que toutes les factures et devis seront supprimés",
        icon: FileText,
        apiEndpoint: "/api/admin/delete-factures",
        color: "yellow",
    },
    {
        type: "stocks",
        title: "Supprimer tous les mouvements de stock ?",
        description:
            "Cette action supprimera tous les mouvements de stock de votre entreprise de manière irréversible.",
        buttonLabel: "Stocks",
        confirmMessage:
            "Je comprends que tous les mouvements de stock seront supprimés",
        icon: ShoppingCart,
        apiEndpoint: "/api/admin/delete-stocks",
        color: "yellow",
    },
    {
        type: "horaires",
        title: "Supprimer tous les horaires et pointages ?",
        description:
            "Cette action supprimera tous les horaires et pointages de votre entreprise de manière irréversible.",
        buttonLabel: "Horaires",
        confirmMessage:
            "Je comprends que tous les horaires et pointages seront supprimés",
        icon: Clock,
        apiEndpoint: "/api/admin/delete-horaires",
        color: "yellow",
    },
    {
        type: "conversations",
        title: "Supprimer toutes les conversations IA ?",
        description:
            "Cette action supprimera toutes les conversations IA de votre entreprise de manière irréversible.",
        buttonLabel: "Conversations IA",
        confirmMessage:
            "Je comprends que toutes les conversations IA seront supprimées",
        icon: MessageSquare,
        apiEndpoint: "/api/admin/delete-conversations",
        color: "yellow",
    },
    {
        type: "categories",
        title: "Supprimer toutes les catégories ?",
        description:
            "Cette action supprimera toutes les catégories de votre entreprise de manière irréversible.",
        buttonLabel: "Catégories",
        confirmMessage:
            "Je comprends que toutes les catégories seront supprimées",
        icon: FolderTree,
        apiEndpoint: "/api/admin/delete-categories",
        color: "yellow",
    },
    {
        type: "commandes",
        title: "Supprimer toutes les commandes ?",
        description:
            "Cette action supprimera toutes les commandes fournisseurs de votre entreprise de manière irréversible.",
        buttonLabel: "Commandes",
        confirmMessage:
            "Je comprends que toutes les commandes seront supprimées",
        icon: ShoppingBag,
        apiEndpoint: "/api/admin/delete-commandes",
        color: "yellow",
    },
    {
        type: "paiements",
        title: "Supprimer tous les paiements ?",
        description:
            "Cette action supprimera tous les paiements de votre entreprise de manière irréversible.",
        buttonLabel: "Paiements",
        confirmMessage: "Je comprends que tous les paiements seront supprimés",
        icon: CreditCard,
        apiEndpoint: "/api/admin/delete-paiements",
        color: "yellow",
    },
    {
        type: "payment-links",
        title: "Supprimer tous les liens de paiement ?",
        description:
            "Cette action supprimera tous les liens de paiement de votre entreprise de manière irréversible.",
        buttonLabel: "Liens paiement",
        confirmMessage:
            "Je comprends que tous les liens de paiement seront supprimés",
        icon: Link,
        apiEndpoint: "/api/admin/delete-payment-links",
        color: "yellow",
    },
    {
        type: "transferts",
        title: "Supprimer tous les transferts de stock ?",
        description:
            "Cette action supprimera tous les transferts de stock entre magasins de manière irréversible.",
        buttonLabel: "Transferts",
        confirmMessage: "Je comprends que tous les transferts seront supprimés",
        icon: ArrowRightLeft,
        apiEndpoint: "/api/admin/delete-transferts",
        color: "yellow",
    },
    {
        type: "magasins",
        title: "Supprimer tous les magasins ?",
        description:
            "Cette action supprimera tous les magasins et leurs stocks de manière irréversible.",
        buttonLabel: "Magasins",
        confirmMessage: "Je comprends que tous les magasins seront supprimés",
        icon: Store,
        apiEndpoint: "/api/admin/delete-magasins",
        color: "yellow",
    },
    {
        type: "reparations",
        title: "Supprimer toutes les réparations ?",
        description:
            "Cette action supprimera toutes les réparations (SAV informatique) de votre entreprise de manière irréversible.",
        buttonLabel: "Réparations",
        confirmMessage:
            "Je comprends que toutes les réparations seront supprimées",
        icon: Wrench,
        apiEndpoint: "/api/admin/delete-reparations",
        color: "yellow",
    },
    {
        type: "rachats",
        title: "Supprimer tous les rachats ?",
        description:
            "Cette action supprimera tous les rachats d'articles d'occasion de votre entreprise de manière irréversible.",
        buttonLabel: "Rachats",
        confirmMessage: "Je comprends que tous les rachats seront supprimés",
        icon: Repeat,
        apiEndpoint: "/api/admin/delete-rachats",
        color: "yellow",
    },
    {
        type: "demontages",
        title: "Supprimer tous les démontages ?",
        description:
            "Cette action supprimera tous les démontages d'articles d'occasion de votre entreprise de manière irréversible.",
        buttonLabel: "Démontages",
        confirmMessage: "Je comprends que tous les démontages seront supprimés",
        icon: Cog,
        apiEndpoint: "/api/admin/delete-demontages",
        color: "yellow",
    },
    {
        type: "utilisateurs",
        title: "Supprimer tous les utilisateurs ?",
        description:
            "Cette action supprimera tous les utilisateurs de votre entreprise de manière irréversible. Vous serez déconnecté.",
        buttonLabel: "Utilisateurs",
        confirmMessage:
            "Je comprends que tous les utilisateurs seront supprimés",
        icon: User,
        apiEndpoint: "/api/admin/delete-utilisateurs",
        color: "red",
    },
];

export function AccountTab({ user = null }: AccountTabProps) {
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const showDangerZone = getIsDevelopment();

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
                    <div className="rounded-md border border-black/10 bg-black/[0.02] p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-[14px] font-medium text-black">
                                    Authentification à deux facteurs (2FA)
                                </div>
                                <p className="mt-1 text-[13px] text-black/60">
                                    Disponible prochainement
                                </p>
                            </div>
                            <Badge
                                variant="outline"
                                className="border-black/10"
                            >
                                Bientôt
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

            {showDangerZone && (
                <SettingsSection
                    icon={Trash2}
                    title="Zone danger"
                    description="Actions irréversibles (développement uniquement)"
                >
                    <div className="max-w-4xl">
                        <div className="rounded-lg border border-black/[0.08] bg-white p-6 shadow-sm">
                            <div className="space-y-6">
                                {/* Mes données personnelles */}
                                <div>
                                    <div className="text-[14px] font-semibold text-black">
                                        Supprimer toutes mes données
                                    </div>
                                    <p className="mt-2 text-[13px] text-black/70">
                                        Supprime toutes vos données personnelles de
                                        manière irréversible.
                                    </p>
                                    <div className="mt-3">
                                        <DeleteAllDataDialog />
                                    </div>
                                </div>

                                {/* Suppression par type de données */}
                                <div className="pt-4 border-t border-black/[0.08]">
                                    <div className="text-[15px] font-semibold text-black mb-3">
                                        Supprimer des types de données
                                    </div>
                                    <p className="text-[13px] text-black/70 mb-4">
                                        Supprimez sélectivement des types de données
                                        de votre entreprise.
                                    </p>
                                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                        {dataTypeOptions.map((option) => (
                                            <DeleteDataTypeDialog
                                                key={option.type}
                                                type={option.type}
                                                title={option.title}
                                                description={option.description}
                                                buttonLabel={option.buttonLabel}
                                                confirmMessage={
                                                    option.confirmMessage
                                                }
                                                icon={option.icon}
                                                apiEndpoint={option.apiEndpoint}
                                                color={option.color}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Actions globales dangereuses */}
                                <div className="pt-4 border-t border-black/[0.08]">
                                    <div className="text-[15px] font-bold text-black mb-3">
                                        Actions globales extrêmement dangereuses
                                    </div>
                                    <p className="text-[13px] text-black/70 mb-4">
                                        Ces actions affectent TOUTES les
                                        entreprises, pas seulement la vôtre.
                                    </p>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <DeleteDataTypeDialog
                                            type="entreprises"
                                            title="Supprimer TOUTES les entreprises ?"
                                            description="DANGER EXTRÊME - Cette action supprimera TOUTES les entreprises de la base de données, pas seulement la vôtre."
                                            buttonLabel="Toutes les entreprises"
                                            confirmMessage="Je comprends que TOUTES les entreprises seront supprimées"
                                            icon={Building2}
                                            apiEndpoint="/api/admin/delete-entreprises"
                                            color="red"
                                        />
                                        <div>
                                            <div className="text-[13px] text-black/70 mb-2">
                                                Réinitialisation complète de
                                                l&apos;application
                                            </div>
                                            <DeleteEntireDbDialog />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SettingsSection>
            )}
        </div>
    );
}
