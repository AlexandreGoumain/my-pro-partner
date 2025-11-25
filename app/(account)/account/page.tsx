"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
    AlertTriangle,
    Bell,
    Lock,
    LogOut,
    Mail,
    Trash2,
    User,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AccountPage() {
    const { data: session, update, status } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteReason, setDeleteReason] = useState("");
    const [deleteComment, setDeleteComment] = useState("");
    const [profileName, setProfileName] = useState("");
    const [profileEmail, setProfileEmail] = useState("");
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [newsUpdates, setNewsUpdates] = useState(false);
    const [initialEmailNotifications, setInitialEmailNotifications] =
        useState(true);
    const [initialNewsUpdates, setInitialNewsUpdates] = useState(false);

    // Update form values when session loads
    useEffect(() => {
        if (session?.user) {
            setProfileName(session.user.name || "");
            setProfileEmail(session.user.email || "");
        }
    }, [session]);

    // Check if profile has changed
    const hasProfileChanged =
        profileName !== (session?.user?.name || "") ||
        profileEmail !== (session?.user?.email || "");

    // Check if notifications have changed
    const hasNotificationsChanged =
        emailNotifications !== initialEmailNotifications ||
        newsUpdates !== initialNewsUpdates;

    // Show loading skeleton
    if (status === "loading") {
        return (
            <div className="min-h-screen bg-gradient-to-b from-black/2 to-black/5">
                {/* Header Skeleton */}
                <div className="border-b border-black/10 bg-white/50 backdrop-blur-sm">
                    <div className="max-w-4xl mx-auto px-6 py-8">
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                </div>

                {/* Content Skeleton */}
                <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
                    {/* Profile Card Skeleton */}
                    <Card className="border-black/10 shadow-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-10 h-10 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-48" />
                                    <Skeleton className="h-3 w-64" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-11 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-11 w-full" />
                            </div>
                            <Skeleton className="h-11 w-48" />
                        </CardContent>
                    </Card>

                    {/* Security Card Skeleton */}
                    <Card className="border-black/10 shadow-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-10 h-10 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-3 w-56" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-11 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-11 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-52" />
                                <Skeleton className="h-11 w-full" />
                            </div>
                            <Skeleton className="h-11 w-48" />
                        </CardContent>
                    </Card>

                    {/* Notifications Card Skeleton */}
                    <Card className="border-black/10 shadow-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-10 h-10 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-3 w-72" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-3 w-64" />
                                </div>
                                <Skeleton className="h-6 w-11 rounded-full" />
                            </div>
                            <Separator className="bg-black/10" />
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-3 w-56" />
                                </div>
                                <Skeleton className="h-6 w-11 rounded-full" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // Redirect if not authenticated
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

        const data = {
            name: profileName,
            email: profileEmail,
        };

        try {
            const response = await fetch("/api/user/update-profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
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
                    emailNotifications,
                    newsUpdates,
                }),
            });

            if (response.ok) {
                // Update initial values to match current state
                setInitialEmailNotifications(emailNotifications);
                setInitialNewsUpdates(newsUpdates);
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
        if (!deleteReason) {
            toast.error("Veuillez sélectionner une raison");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/user/delete-account", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    reason: deleteReason,
                    comment: deleteComment,
                }),
            });

            if (response.ok) {
                toast.success("Votre compte a été supprimé avec succès");
                // Logout and redirect
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
                {/* Profile Section */}
                <Card className="border-black/10 shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
                                <User
                                    className="w-5 h-5 text-black/60"
                                    strokeWidth={2}
                                />
                            </div>
                            <div>
                                <h2 className="text-[18px] font-semibold tracking-[-0.01em] text-black">
                                    Informations personnelles
                                </h2>
                                <p className="text-[13px] text-black/40">
                                    Modifiez vos informations de profil
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleUpdateProfile}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <Label
                                    htmlFor="name"
                                    className="text-[14px] font-medium text-black/80"
                                >
                                    Nom complet
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={profileName}
                                    onChange={(e) =>
                                        setProfileName(e.target.value)
                                    }
                                    className="h-11 border-black/10 focus:border-black/30"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="text-[14px] font-medium text-black/80"
                                >
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-black/40" />
                                        Email
                                    </div>
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={profileEmail}
                                    onChange={(e) =>
                                        setProfileEmail(e.target.value)
                                    }
                                    className="h-11 border-black/10 focus:border-black/30"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading || !hasProfileChanged}
                                className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading
                                    ? "Enregistrement..."
                                    : "Enregistrer les modifications"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Security Section */}
                <Card className="border-black/10 shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
                                <Lock
                                    className="w-5 h-5 text-black/60"
                                    strokeWidth={2}
                                />
                            </div>
                            <div>
                                <h2 className="text-[18px] font-semibold tracking-[-0.01em] text-black">
                                    Sécurité
                                </h2>
                                <p className="text-[13px] text-black/40">
                                    Modifiez votre mot de passe
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleChangePassword}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <Label
                                    htmlFor="currentPassword"
                                    className="text-[14px] font-medium text-black/80"
                                >
                                    Mot de passe actuel
                                </Label>
                                <Input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type="password"
                                    className="h-11 border-black/10 focus:border-black/30"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="newPassword"
                                    className="text-[14px] font-medium text-black/80"
                                >
                                    Nouveau mot de passe
                                </Label>
                                <Input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    className="h-11 border-black/10 focus:border-black/30"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="confirmPassword"
                                    className="text-[14px] font-medium text-black/80"
                                >
                                    Confirmer le nouveau mot de passe
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    className="h-11 border-black/10 focus:border-black/30"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium shadow-sm"
                            >
                                {isLoading
                                    ? "Modification..."
                                    : "Changer le mot de passe"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Preferences Section */}
                <Card className="border-black/10 shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
                                <Bell
                                    className="w-5 h-5 text-black/60"
                                    strokeWidth={2}
                                />
                            </div>
                            <div>
                                <h2 className="text-[18px] font-semibold tracking-[-0.01em] text-black">
                                    Notifications
                                </h2>
                                <p className="text-[13px] text-black/40">
                                    Gérez vos préférences de notifications
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label
                                        htmlFor="email-notifications"
                                        className="text-[14px] font-medium text-black"
                                    >
                                        Notifications par email
                                    </Label>
                                    <p className="text-[13px] text-black/40">
                                        Recevoir des notifications importantes
                                        par email
                                    </p>
                                </div>
                                <Switch
                                    id="email-notifications"
                                    checked={emailNotifications}
                                    onCheckedChange={setEmailNotifications}
                                />
                            </div>

                            <Separator className="bg-black/10" />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label
                                        htmlFor="news-updates"
                                        className="text-[14px] font-medium text-black"
                                    >
                                        Actualités et mises à jour
                                    </Label>
                                    <p className="text-[13px] text-black/40">
                                        Recevoir les nouveautés et
                                        fonctionnalités
                                    </p>
                                </div>
                                <Switch
                                    id="news-updates"
                                    checked={newsUpdates}
                                    onCheckedChange={setNewsUpdates}
                                />
                            </div>

                            <Separator className="bg-black/10" />

                            <Button
                                onClick={handleSaveNotifications}
                                disabled={isLoading || !hasNotificationsChanged}
                                className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading
                                    ? "Enregistrement..."
                                    : "Enregistrer les préférences"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-red-200 shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                                <LogOut
                                    className="w-5 h-5 text-red-600"
                                    strokeWidth={2}
                                />
                            </div>
                            <div>
                                <h2 className="text-[18px] font-semibold tracking-[-0.01em] text-black">
                                    Déconnexion
                                </h2>
                                <p className="text-[13px] text-black/40">
                                    Quitter votre session actuelle
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={handleSignOut}
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50 h-11 px-6 text-[14px] font-medium"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Se déconnecter
                        </Button>
                    </CardContent>
                </Card>

                {/* Delete Account */}
                <Card className="border-red-300 shadow-sm bg-red-50/30">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                <Trash2
                                    className="w-5 h-5 text-red-600"
                                    strokeWidth={2}
                                />
                            </div>
                            <div>
                                <h2 className="text-[18px] font-semibold tracking-[-0.01em] text-black">
                                    Supprimer mon compte
                                </h2>
                                <p className="text-[13px] text-black/40">
                                    Action irréversible - toutes vos données
                                    seront supprimées
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Dialog
                            open={deleteDialogOpen}
                            onOpenChange={setDeleteDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="border-red-300 text-red-700 hover:bg-red-100 h-11 px-6 text-[14px] font-medium"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Supprimer définitivement mon compte
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                            <AlertTriangle
                                                className="w-6 h-6 text-red-600"
                                                strokeWidth={2}
                                            />
                                        </div>
                                        <div>
                                            <DialogTitle className="text-[20px] font-semibold tracking-[-0.01em]">
                                                Supprimer votre compte
                                            </DialogTitle>
                                            <DialogDescription className="text-[14px] text-black/60 mt-1">
                                                Cette action est irréversible
                                            </DialogDescription>
                                        </div>
                                    </div>
                                </DialogHeader>

                                <div className="space-y-5 py-4">
                                    {/* Warning */}
                                    <div className="p-4 rounded-md bg-red-50 border border-red-200">
                                        <p className="text-[13px] text-red-800 leading-relaxed">
                                            <strong>Attention :</strong> Toutes
                                            vos données seront définitivement
                                            supprimées
                                        </p>
                                    </div>

                                    {/* Questionnaire */}
                                    <div className="space-y-4">
                                        <Label className="text-[14px] font-medium text-black">
                                            Pourquoi souhaitez-vous supprimer
                                            votre compte ?
                                        </Label>
                                        <RadioGroup
                                            value={deleteReason}
                                            onValueChange={setDeleteReason}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem
                                                    value="too-expensive"
                                                    id="r1"
                                                />
                                                <Label
                                                    htmlFor="r1"
                                                    className="text-[14px] font-normal cursor-pointer"
                                                >
                                                    Trop cher pour mes besoins
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem
                                                    value="missing-features"
                                                    id="r2"
                                                />
                                                <Label
                                                    htmlFor="r2"
                                                    className="text-[14px] font-normal cursor-pointer"
                                                >
                                                    Fonctionnalités manquantes
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem
                                                    value="found-alternative"
                                                    id="r3"
                                                />
                                                <Label
                                                    htmlFor="r3"
                                                    className="text-[14px] font-normal cursor-pointer"
                                                >
                                                    J'ai trouvé une alternative
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem
                                                    value="difficult-to-use"
                                                    id="r4"
                                                />
                                                <Label
                                                    htmlFor="r4"
                                                    className="text-[14px] font-normal cursor-pointer"
                                                >
                                                    Difficile à utiliser
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem
                                                    value="no-longer-needed"
                                                    id="r5"
                                                />
                                                <Label
                                                    htmlFor="r5"
                                                    className="text-[14px] font-normal cursor-pointer"
                                                >
                                                    Je n'en ai plus besoin
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem
                                                    value="other"
                                                    id="r6"
                                                />
                                                <Label
                                                    htmlFor="r6"
                                                    className="text-[14px] font-normal cursor-pointer"
                                                >
                                                    Autre raison
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    {/* Optional comment */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="delete-comment"
                                            className="text-[14px] font-medium text-black"
                                        >
                                            Commentaire (optionnel)
                                        </Label>
                                        <Textarea
                                            id="delete-comment"
                                            placeholder="Partagez-nous vos retours pour nous améliorer..."
                                            value={deleteComment}
                                            onChange={(e) =>
                                                setDeleteComment(e.target.value)
                                            }
                                            className="min-h-[80px] resize-none border-black/10"
                                        />
                                    </div>
                                </div>

                                <DialogFooter className="gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            setDeleteDialogOpen(false)
                                        }
                                        className="border-black/10 hover:bg-black/5"
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={handleDeleteAccount}
                                        disabled={isLoading || !deleteReason}
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        {isLoading
                                            ? "Suppression..."
                                            : "Supprimer définitivement"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
