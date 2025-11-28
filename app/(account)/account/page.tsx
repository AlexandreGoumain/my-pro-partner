"use client";

import { AccountPageSkeleton } from "@/components/account/account-page-skeleton";
import { DeleteAccountSection } from "@/components/account/delete-account-section";
import { LogoutSection } from "@/components/account/logout-section";
import { NotificationsSection } from "@/components/account/notifications-section";
import { ProfileSection } from "@/components/account/profile-section";
import { SecuritySection } from "@/components/account/security-section";
import { useAccountPageState } from "@/hooks/use-account-page-state";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AccountPage() {
    const { data: session, update, status } = useSession();
    const router = useRouter();

    const {
        isLoading,
        setIsLoading,
        profile,
        setProfileName,
        setProfileEmail,
        hasProfileChanged,
        notifications,
        setEmailNotifications,
        setNewsUpdates,
        hasNotificationsChanged,
        saveNotificationInitialValues,
        deleteAccount,
        setDeleteDialogOpen,
        setDeleteReason,
        setDeleteComment,
    } = useAccountPageState(session);

    if (status === "loading") {
        return <AccountPageSkeleton />;
    }

    if (!session) {
        router.push("/auth/login");
        return null;
    }

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/" });
    };

    const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch("/api/user/update-profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: profile.name,
                    email: profile.email,
                }),
            });

            if (response.ok) {
                await update();
                toast.success("Profil mis à jour avec succès");
            } else {
                const error = await response.json();
                toast.error(
                    error.error || "Erreur lors de la mise à jour du profil"
                );
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Une erreur s'est produite");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            currentPassword: formData.get("currentPassword") as string,
            newPassword: formData.get("newPassword") as string,
            confirmPassword: formData.get("confirmPassword") as string,
        };

        if (data.newPassword !== data.confirmPassword) {
            toast.error("Les mots de passe ne correspondent pas");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/user/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                (e.target as HTMLFormElement).reset();
                toast.success("Mot de passe modifié avec succès");
            } else {
                const error = await response.json();
                toast.error(
                    error.message || "Erreur lors du changement de mot de passe"
                );
            }
        } catch (error) {
            console.error("Error changing password:", error);
            toast.error("Une erreur s'est produite");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveNotifications = async () => {
        setIsLoading(true);

        try {
            const response = await fetch("/api/user/update-notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    emailNotifications: notifications.emailNotifications,
                    newsUpdates: notifications.newsUpdates,
                }),
            });

            if (response.ok) {
                saveNotificationInitialValues();
                toast.success("Préférences de notifications mises à jour");
            } else {
                const error = await response.json();
                toast.error(error.message || "Erreur lors de la mise à jour");
            }
        } catch (error) {
            console.error("Error updating notifications:", error);
            toast.error("Une erreur s'est produite");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!deleteAccount.reason) {
            toast.error("Veuillez sélectionner une raison");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/user/delete-account", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    reason: deleteAccount.reason,
                    comment: deleteAccount.comment,
                }),
            });

            if (response.ok) {
                toast.success("Votre compte a été supprimé avec succès");
                await signOut({ callbackUrl: "/" });
            } else {
                const error = await response.json();
                toast.error(
                    error.message || "Erreur lors de la suppression du compte"
                );
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            toast.error("Une erreur s'est produite");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black/2 to-black/5">
            {/* Header */}
            <div className="border-b border-black/10 bg-white/50 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-black">
                        Mon compte
                    </h1>
                    <p className="text-[15px] text-black/60 mt-2">
                        Gérez vos informations personnelles et vos préférences
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
                <ProfileSection
                    profile={profile}
                    setProfileName={setProfileName}
                    setProfileEmail={setProfileEmail}
                    hasProfileChanged={hasProfileChanged}
                    isLoading={isLoading}
                    onSubmit={handleUpdateProfile}
                />

                <SecuritySection
                    isLoading={isLoading}
                    onSubmit={handleChangePassword}
                />

                <NotificationsSection
                    notifications={notifications}
                    setEmailNotifications={setEmailNotifications}
                    setNewsUpdates={setNewsUpdates}
                    hasNotificationsChanged={hasNotificationsChanged}
                    isLoading={isLoading}
                    onSave={handleSaveNotifications}
                />

                <LogoutSection onSignOut={handleSignOut} />

                <DeleteAccountSection
                    deleteAccount={deleteAccount}
                    setDeleteDialogOpen={setDeleteDialogOpen}
                    setDeleteReason={setDeleteReason}
                    setDeleteComment={setDeleteComment}
                    isLoading={isLoading}
                    onDelete={handleDeleteAccount}
                />
            </div>
        </div>
    );
}
