"use client";

import {
    AuthDivider,
    AuthError,
    AuthFooter,
    AuthHeader,
    GoogleSignInButton,
} from "@/components/auth";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/ui/form-input";
import { Spinner } from "@/components/ui/spinner";
import { useRegisterPage } from "@/hooks/use-register-page";
import Link from "next/link";

export default function RegisterPage() {
    const { form, isLoading, error, onSubmit, handleGoogleSignIn } =
        useRegisterPage();

    return (
        <>
            <AuthHeader
                title="Créer un compte"
                description="Entrez vos informations pour créer votre compte"
            />

            <AuthError error={error} />

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <FormInput
                        control={form.control as any}
                        name="name"
                        label="Nom complet"
                        type="text"
                        placeholder="Jean Dupont"
                        disabled={isLoading}
                        showErrorBorder
                        className="transition-all"
                    />

                    <FormInput
                        control={form.control as any}
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="nom@exemple.fr"
                        disabled={isLoading}
                        showErrorBorder
                        className="transition-all"
                    />

                    <FormInput
                        control={form.control as any}
                        name="password"
                        label="Mot de passe"
                        type="password"
                        placeholder="••••••••"
                        disabled={isLoading}
                        showErrorBorder
                        className="transition-all"
                    />

                    <FormInput
                        control={form.control as any}
                        name="confirmPassword"
                        label="Confirmer le mot de passe"
                        type="password"
                        placeholder="••••••••"
                        disabled={isLoading}
                        showErrorBorder
                        className="transition-all"
                    />

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Spinner className="mr-2" />
                                Création du compte...
                            </>
                        ) : (
                            "Créer un compte"
                        )}
                    </Button>
                </form>
            </Form>

            <AuthDivider />

            <GoogleSignInButton
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                mode="register"
            />

            <div className="text-center text-sm text-muted-foreground">
                Vous avez déjà un compte ?{" "}
                <Link
                    href="/auth/login"
                    className="underline underline-offset-4 hover:text-primary"
                >
                    Se connecter
                </Link>
            </div>

            <AuthFooter />
        </>
    );
}
