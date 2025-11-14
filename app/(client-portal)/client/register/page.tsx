"use client";

import { ErrorAlert } from "@/components/client-portal/register/error-alert";
import { InvitationSuccessBanner } from "@/components/client-portal/register/invitation-success-banner";
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
import { Input } from "@/components/ui/input";
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
import { Suspense, useEffect, useMemo } from "react";
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
        return <LoadingState variant="fullscreen" message="Vérification de l'invitation..." />;
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
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[14px] font-medium">
                                                Email *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    placeholder="votre@email.com"
                                                    disabled={
                                                        !!invitationData?.email
                                                    }
                                                    className="h-11 border-black/10 focus:border-black disabled:bg-black/5 disabled:text-black/60 disabled:cursor-not-allowed"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Nom */}
                                <FormField
                                    control={form.control}
                                    name="nom"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[14px] font-medium">
                                                Nom *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Votre nom"
                                                    disabled={
                                                        !!invitationData?.nom
                                                    }
                                                    className="h-11 border-black/10 focus:border-black disabled:bg-black/5 disabled:text-black/60 disabled:cursor-not-allowed"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Téléphone */}
                                <FormField
                                    control={form.control}
                                    name="telephone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[14px] font-medium">
                                                Téléphone *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="tel"
                                                    placeholder="06 12 34 56 78"
                                                    disabled={
                                                        !!invitationData?.telephone
                                                    }
                                                    className="h-11 border-black/10 focus:border-black disabled:bg-black/5 disabled:text-black/60 disabled:cursor-not-allowed"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
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
                                        <FormField
                                            control={form.control}
                                            name="prenom"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[14px] font-medium">
                                                        Prénom
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="Votre prénom"
                                                            disabled={
                                                                !!invitationData?.prenom
                                                            }
                                                            className="h-11 border-black/10 focus:border-black disabled:bg-black/5 disabled:text-black/60 disabled:cursor-not-allowed"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Adresse */}
                                        <FormField
                                            control={form.control}
                                            name="adresse"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[14px] font-medium">
                                                        Adresse
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="123 rue de la République"
                                                            className="h-11 border-black/10 focus:border-black"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Code postal & Ville */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="codePostal"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[14px] font-medium">
                                                            Code postal
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="75001"
                                                                className="h-11 border-black/10 focus:border-black"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="ville"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[14px] font-medium">
                                                            Ville
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="Paris"
                                                                className="h-11 border-black/10 focus:border-black"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </details>

                                {/* Password */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[14px] font-medium">
                                                Mot de passe *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="h-11 border-black/10 focus:border-black"
                                                />
                                            </FormControl>
                                            <FormDescription className="text-[12px] text-black/40">
                                                8 caractères minimum
                                            </FormDescription>
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
                                            <FormLabel className="text-[14px] font-medium">
                                                Confirmer le mot de passe *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="h-11 border-black/10 focus:border-black"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
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
        <Suspense fallback={<LoadingState variant="fullscreen" />}>
            <RegisterForm />
        </Suspense>
    );
}
