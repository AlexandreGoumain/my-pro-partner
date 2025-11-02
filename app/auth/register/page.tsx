"use client";

import {
    AuthDivider,
    AuthError,
    AuthFooter,
    AuthHeader,
    GoogleSignInButton,
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
import { useRegisterPage } from "@/hooks/use-register-page";
import { cn } from "@/lib/utils";
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
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nom complet</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder="Jean Dupont"
                                        disabled={isLoading}
                                        className={cn(
                                            "transition-all",
                                            form.formState.errors.name &&
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
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="email"
                                        placeholder="nom@exemple.fr"
                                        disabled={isLoading}
                                        className={cn(
                                            "transition-all",
                                            form.formState.errors.email &&
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
                                            "transition-all",
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
                                            "transition-all",
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
