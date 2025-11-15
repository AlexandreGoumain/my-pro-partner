"use client";

import { PasswordInput } from "@/components/client-portal/reset-password/password-input";
import { StatusCard } from "@/components/client-portal/shared/status-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingState } from "@/components/ui/loading-state";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useResetPassword } from "@/hooks/use-reset-password";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SuspensePage } from "@/components/ui/suspense-page";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const { isLoading, success, resetPassword } = useResetPassword();

    const form = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        if (!token) {
            toast.error("Token invalide. Veuillez refaire une demande.");
        }
    }, [token]);

    async function onSubmit(values: ResetPasswordInput) {
        if (!token) {
            toast.error("Token manquant");
            return;
        }

        await resetPassword({
            token,
            newPassword: values.newPassword,
        });
    }

    if (!token) {
        return (
            <StatusCard
                type="error"
                icon={Lock}
                title="Lien invalide"
                description="Ce lien de réinitialisation est invalide ou a expiré."
                fullPage
                action={
                    <Link href="/client/forgot-password">
                        <Button className="bg-black hover:bg-black/90 text-white h-11 text-[14px] font-medium rounded-md shadow-sm">
                            Refaire une demande
                        </Button>
                    </Link>
                }
            />
        );
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black mb-2">
                        Réinitialiser le mot de passe
                    </h1>
                    <p className="text-[14px] text-black/60">
                        Choisissez un nouveau mot de passe sécurisé
                    </p>
                </div>

                {!success ? (
                    <Card className="border-black/8 shadow-sm">
                        <div className="p-6">
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-5"
                                >
                                    {/* New Password */}
                                    <FormField
                                        control={form.control}
                                        name="newPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[13px] text-black/60">
                                                    Nouveau mot de passe
                                                </FormLabel>
                                                <FormControl>
                                                    <PasswordInput
                                                        {...field}
                                                        placeholder="Minimum 8 caractères"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Confirm Password */}
                                    <FormField
                                        control={form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[13px] text-black/60">
                                                    Confirmer le mot de passe
                                                </FormLabel>
                                                <FormControl>
                                                    <PasswordInput
                                                        {...field}
                                                        placeholder="Confirmez le mot de passe"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Info Box */}
                                    <div className="rounded-lg bg-black/5 p-4">
                                        <FormDescription className="text-[13px] text-black/60">
                                            ℹ️ Le mot de passe doit contenir au
                                            moins 8 caractères.
                                        </FormDescription>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full h-11 bg-black hover:bg-black/90 text-white text-[14px] font-medium rounded-md shadow-sm"
                                    >
                                        {isLoading
                                            ? "Réinitialisation..."
                                            : "Réinitialiser le mot de passe"}
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </Card>
                ) : (
                    <StatusCard
                        type="success"
                        icon={CheckCircle2}
                        title="Mot de passe réinitialisé !"
                        description="Votre mot de passe a été modifié avec succès. Vous allez être redirigé vers la page de connexion..."
                    />
                )}
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <SuspensePage fallback={<LoadingState variant="fullscreen" />}>
            <ResetPasswordForm />
        </SuspensePage>
    );
}
