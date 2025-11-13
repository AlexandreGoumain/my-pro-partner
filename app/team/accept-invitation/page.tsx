"use client";

import {
    AuthError,
    AuthErrorState,
    AuthFooter,
    AuthHeader,
    AuthLoadingState,
    AuthSuccessState,
    InvitationInfoCard,
} from "@/components/auth";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useAcceptInvitation } from "@/hooks/use-accept-invitation";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AcceptInvitationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const {
        form,
        isLoading,
        isVerifying,
        error,
        success,
        invitation,
        onSubmit,
    } = useAcceptInvitation(token);

    // Loading state
    if (isVerifying) {
        return <AuthLoadingState message="Vérification de l'invitation..." />;
    }

    // Invalid invitation
    if (error && !invitation) {
        return (
            <AuthErrorState
                title="Invitation invalide"
                description="L'invitation que vous essayez d'utiliser n'est pas valide"
                error={error}
                submessage="Cette invitation a peut-être expiré ou a déjà été utilisée."
                onBack={() => router.push("/auth/login")}
            />
        );
    }

    // Success state
    if (success) {
        return (
            <AuthSuccessState
                title="Compte créé avec succès !"
                description="Vous allez être redirigé vers la page de connexion"
                message="Votre compte a été créé avec succès !"
                submessage="Vous pouvez maintenant vous connecter avec votre email et mot de passe."
            />
        );
    }

    // Form
    return (
        <>
            <AuthHeader
                title="Accepter l'invitation"
                description={`Rejoignez ${invitation?.entrepriseName || "l'équipe"}`}
            />

            {invitation && (
                <InvitationInfoCard invitation={invitation} className="mb-6" />
            )}

            <AuthError error={error} />

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="prenom"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Prénom</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="Jean"
                                            disabled={isLoading}
                                            className={cn(
                                                "transition-all duration-200",
                                                form.formState.errors.prenom &&
                                                    "border-destructive"
                                            )}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nom</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="text"
                                            placeholder="Dupont"
                                            disabled={isLoading}
                                            className={cn(
                                                "transition-all duration-200",
                                                form.formState.errors.name &&
                                                    "border-destructive"
                                            )}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="telephone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Téléphone (optionnel)</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="tel"
                                        placeholder="06 12 34 56 78"
                                        disabled={isLoading}
                                        className={cn(
                                            "transition-all duration-200",
                                            form.formState.errors.telephone &&
                                                "border-destructive"
                                        )}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mot de passe</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="password"
                                        placeholder="••••••••"
                                        disabled={isLoading}
                                        className={cn(
                                            "transition-all duration-200",
                                            form.formState.errors.password &&
                                                "border-destructive"
                                        )}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirmer le mot de passe</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="password"
                                        placeholder="••••••••"
                                        disabled={isLoading}
                                        className={cn(
                                            "transition-all duration-200",
                                            form.formState.errors
                                                .confirmPassword &&
                                                "border-destructive"
                                        )}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Spinner className="mr-2" />
                                Création du compte...
                            </>
                        ) : (
                            "Créer mon compte"
                        )}
                    </Button>
                </form>
            </Form>

            <AuthFooter />
        </>
    );
}

export default function AcceptInvitationPage() {
    return (
        <Suspense fallback={<AuthLoadingState />}>
            <AcceptInvitationContent />
        </Suspense>
    );
}
