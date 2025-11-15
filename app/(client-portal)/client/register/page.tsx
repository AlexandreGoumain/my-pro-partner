"use client";

import { ErrorAlert } from "@/components/client-portal/register/error-alert";
import { InvitationSuccessBanner } from "@/components/client-portal/register/invitation-success-banner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/ui/form-input";
import { LoadingState } from "@/components/ui/loading-state";
import { SuspensePage } from "@/components/ui/suspense-page";
import { useClientRegister } from "@/hooks/use-client-register";
import { useInvitationVerification } from "@/hooks/use-invitation-verification";
import {
    clientRegisterSchema,
    type ClientRegisterInput,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const invitationToken = searchParams.get("token") || "";

    const {
        register: registerClient,
        isLoading,
        success,
    } = useClientRegister();
    const {
        invitationData,
        isVerifying,
        error: invitationError,
    } = useInvitationVerification(invitationToken);

    // Calculate default values from invitation data using useMemo
    const defaultValues = useMemo<ClientRegisterInput>(() => {
        if (invitationData) {
            return {
                nom: invitationData.nom || "",
                prenom: invitationData.prenom || "",
                email: invitationData.email || "",
                telephone: invitationData.telephone || "",
                password: "",
                confirmPassword: "",
                adresse: "",
                codePostal: "",
                ville: "",
            };
        }
        return {
            nom: "",
            prenom: "",
            email: "",
            telephone: "",
            password: "",
            confirmPassword: "",
            adresse: "",
            codePostal: "",
            ville: "",
        };
    }, [invitationData]);

    const form = useForm<ClientRegisterInput>({
        resolver: zodResolver(clientRegisterSchema),
        defaultValues,
    });

    // Reset form when invitation data changes
    useEffect(() => {
        if (invitationData) {
            form.reset({
                nom: invitationData.nom || "",
                prenom: invitationData.prenom || "",
                email: invitationData.email || "",
                telephone: invitationData.telephone || "",
                password: "",
                confirmPassword: "",
                adresse: "",
                codePostal: "",
                ville: "",
            });
        }
    }, [invitationData, form]);

    // Redirect to welcome page on success
    useEffect(() => {
        if (success) {
            router.push("/client/welcome");
        }
    }, [success, router]);

    async function onSubmit(values: ClientRegisterInput) {
        if (!invitationData || !invitationToken) {
            form.setError("root", {
                message: "Invitation invalide",
            });
            return;
        }

        await registerClient({
            nom: values.nom,
            prenom: values.prenom,
            email: values.email,
            telephone: values.telephone,
            password: values.password,
            adresse: values.adresse,
            codePostal: values.codePostal,
            ville: values.ville,
            invitationToken,
        });
    }

    if (isVerifying) {
        return (
            <LoadingState
                variant="fullscreen"
                message="Vérification de l'invitation..."
            />
        );
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-black mb-2">
                        {invitationData
                            ? `Bienvenue chez ${invitationData.entrepriseName}`
                            : "Créer votre compte"}
                    </h1>
                    <p className="text-[15px] text-black/60">
                        {invitationData
                            ? "Complétez votre inscription pour accéder à votre espace client"
                            : "Vous devez être invité pour créer un compte"}
                    </p>
                </div>

                {/* Register Form */}
                <Card className="border-black/8 shadow-sm">
                    <div className="p-8">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-5"
                            >
                                {invitationData && <InvitationSuccessBanner />}

                                {invitationError && (
                                    <ErrorAlert message={invitationError} />
                                )}

                                {form.formState.errors.root && (
                                    <ErrorAlert
                                        message={
                                            form.formState.errors.root
                                                .message || ""
                                        }
                                    />
                                )}

                                {/* Email */}
                                <FormInput
                                    control={form.control as any}
                                    name="email"
                                    label="Email"
                                    type="email"
                                    placeholder="votre@email.com"
                                    disabled={!!invitationData?.email}
                                    required
                                    labelClassName="text-[14px] font-medium"
                                    className="h-11 border-black/10 focus:border-black disabled:bg-black/5 disabled:text-black/60 disabled:cursor-not-allowed"
                                />

                                {/* Nom */}
                                <FormInput
                                    control={form.control as any}
                                    name="nom"
                                    label="Nom"
                                    placeholder="Votre nom"
                                    disabled={!!invitationData?.nom}
                                    required
                                    labelClassName="text-[14px] font-medium"
                                    className="h-11 border-black/10 focus:border-black disabled:bg-black/5 disabled:text-black/60 disabled:cursor-not-allowed"
                                />

                                {/* Téléphone */}
                                <FormInput
                                    control={form.control as any}
                                    name="telephone"
                                    label="Téléphone"
                                    type="tel"
                                    placeholder="06 12 34 56 78"
                                    disabled={!!invitationData?.telephone}
                                    required
                                    labelClassName="text-[14px] font-medium"
                                    className="h-11 border-black/10 focus:border-black disabled:bg-black/5 disabled:text-black/60 disabled:cursor-not-allowed"
                                />

                                {/* Optional fields - Collapsed by default */}
                                <details className="group">
                                    <summary className="cursor-pointer text-[14px] text-black/60 hover:text-black transition-colors py-2 list-none">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[13px]">
                                                ▸
                                            </span>
                                            <span>
                                                Informations complémentaires
                                                (optionnel)
                                            </span>
                                        </div>
                                    </summary>

                                    <div className="mt-4 space-y-5 animate-in fade-in duration-200">
                                        {/* Prénom */}
                                        <FormInput
                                            control={form.control as any}
                                            name="prenom"
                                            label="Prénom"
                                            placeholder="Votre prénom"
                                            disabled={!!invitationData?.prenom}
                                            labelClassName="text-[14px] font-medium"
                                            className="h-11 border-black/10 focus:border-black disabled:bg-black/5 disabled:text-black/60 disabled:cursor-not-allowed"
                                        />

                                        {/* Adresse */}
                                        <FormInput
                                            control={form.control as any}
                                            name="adresse"
                                            label="Adresse"
                                            placeholder="123 rue de la République"
                                            labelClassName="text-[14px] font-medium"
                                            className="h-11 border-black/10 focus:border-black"
                                        />

                                        {/* Code postal & Ville */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormInput
                                                control={form.control as any}
                                                name="codePostal"
                                                label="Code postal"
                                                placeholder="75001"
                                                labelClassName="text-[14px] font-medium"
                                                className="h-11 border-black/10 focus:border-black"
                                            />

                                            <FormInput
                                                control={form.control as any}
                                                name="ville"
                                                label="Ville"
                                                placeholder="Paris"
                                                labelClassName="text-[14px] font-medium"
                                                className="h-11 border-black/10 focus:border-black"
                                            />
                                        </div>
                                    </div>
                                </details>

                                {/* Password */}
                                <FormInput
                                    control={form.control as any}
                                    name="password"
                                    label="Mot de passe"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    description="8 caractères minimum"
                                    labelClassName="text-[14px] font-medium"
                                    className="h-11 border-black/10 focus:border-black"
                                />

                                {/* Confirm Password */}
                                <FormInput
                                    control={form.control as any}
                                    name="confirmPassword"
                                    label="Confirmer le mot de passe"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    labelClassName="text-[14px] font-medium"
                                    className="h-11 border-black/10 focus:border-black"
                                />

                                <Button
                                    type="submit"
                                    disabled={
                                        isLoading ||
                                        isVerifying ||
                                        !invitationData
                                    }
                                    className="w-full h-11 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm"
                                >
                                    {isLoading ? (
                                        "Inscription..."
                                    ) : (
                                        <>
                                            <UserPlus className="w-4 h-4 mr-2" />
                                            Créer mon compte
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>

                        <div className="mt-6 text-center">
                            <p className="text-[13px] text-black/40">
                                Vous avez déjà un compte ?{" "}
                                <Link
                                    href="/client/login"
                                    className="text-black/60 hover:text-black transition-colors font-medium"
                                >
                                    Se connecter
                                </Link>
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default function ClientRegisterPage() {
    return (
        <SuspensePage fallback={<LoadingState variant="fullscreen" />}>
            <RegisterForm />
        </SuspensePage>
    );
}
