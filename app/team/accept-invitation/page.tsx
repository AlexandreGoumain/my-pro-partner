"use client";

import {
    AuthError,
    AuthErrorState,
    AuthFooter,
    AuthHeader,
    AuthSuccessState,
    InvitationInfoCard,
} from "@/components/auth";
import { Button } from "@/components/ui/button";
import { ConditionalSkeleton } from "@/components/ui/conditional-skeleton";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { FormInput } from "@/components/ui/form-input";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { SuspensePage } from "@/components/ui/suspense-page";
import { useAcceptInvitation } from "@/hooks/use-accept-invitation";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

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

    return (
        <ConditionalSkeleton
            isLoading={isVerifying}
            skeletonProps={{
                layout: "form",
                formSections: 2,
            }}
        >
            {/* Invalid invitation */}
            {error && !invitation ? (
                <AuthErrorState
                    title="Invitation invalide"
                    description="L'invitation que vous essayez d'utiliser n'est pas valide"
                    error={error}
                    submessage="Cette invitation a peut-être expiré ou a déjà été utilisée."
                    onBack={() => router.push("/auth/login")}
                />
            ) : success ? (
                /* Success state */
                <AuthSuccessState
                    title="Compte créé avec succès !"
                    description="Vous allez être redirigé vers la page de connexion"
                    message="Votre compte a été créé avec succès !"
                    submessage="Vous pouvez maintenant vous connecter avec votre email et mot de passe."
                />
            ) : (
                /* Form */
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
                        <FormInput
                            control={form.control}
                            name="prenom"
                            label="Prénom"
                            placeholder="Jean"
                            disabled={isLoading}
                            showErrorBorder
                            className="transition-all duration-200"
                        />

                        <FormInput
                            control={form.control}
                            name="name"
                            label="Nom"
                            placeholder="Dupont"
                            disabled={isLoading}
                            showErrorBorder
                            className="transition-all duration-200"
                        />
                    </div>

                    <FormInput
                        control={form.control}
                        name="telephone"
                        label="Téléphone (optionnel)"
                        type="tel"
                        placeholder="06 12 34 56 78"
                        disabled={isLoading}
                        showErrorBorder
                        className="transition-all duration-200"
                    />

                    <FormInput
                        control={form.control}
                        name="password"
                        label="Mot de passe"
                        type="password"
                        placeholder="••••••••"
                        disabled={isLoading}
                        showErrorBorder
                        className="transition-all duration-200"
                    />

                    <FormInput
                        control={form.control}
                        name="confirmPassword"
                        label="Confirmer le mot de passe"
                        type="password"
                        placeholder="••••••••"
                        disabled={isLoading}
                        showErrorBorder
                        className="transition-all duration-200"
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
            )}
        </ConditionalSkeleton>
    );
}

export default function AcceptInvitationPage() {
    return (
        <SuspensePage
            skeletonProps={{
                layout: "form",
                formSections: 2,
            }}
        >
            <AcceptInvitationContent />
        </SuspensePage>
    );
}
