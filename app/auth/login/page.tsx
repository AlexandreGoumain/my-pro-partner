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
import { useLoginPage } from "@/hooks/use-login-page";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function LoginPage() {
    const { form, isLoading, error, onSubmit, handleGoogleSignIn } =
        useLoginPage();

    return (
        <>
            <AuthHeader
                title="Se connecter"
                description="Entrez votre email pour accéder à votre compte"
            />

            <AuthError error={error} />

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
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
                                <div className="flex items-center justify-between">
                                    <FormLabel>Mot de passe</FormLabel>
                                    <Link
                                        href="#"
                                        className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
                                    >
                                        Mot de passe oublié ?
                                    </Link>
                                </div>
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

                    <Button
                        type="submit"
                        className="w-full cursor-pointer"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Spinner className="mr-2" />
                                Connexion...
                            </>
                        ) : (
                            "Se connecter"
                        )}
                    </Button>
                </form>
            </Form>

            <AuthDivider />

            <GoogleSignInButton
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                mode="login"
            />

            <div className="text-center text-sm text-muted-foreground">
                Pas encore de compte ?{" "}
                <Link
                    href="/auth/register"
                    className="underline underline-offset-4 hover:text-primary"
                >
                    S&apos;inscrire
                </Link>
            </div>

            <AuthFooter />
        </>
    );
}
