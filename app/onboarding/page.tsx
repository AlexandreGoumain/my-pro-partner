"use client";

import { AuthError } from "@/components/auth";
import { Button } from "@/components/ui/button";
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
import { Spinner } from "@/components/ui/spinner";
import { useOnboardingPage } from "@/hooks/use-onboarding-page";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
    const { form, isLoading, error, onSubmit } = useOnboardingPage();

    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Bienvenue ! 👋
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Complétez les informations de votre entreprise pour
                        commencer
                    </p>
                </div>

                <AuthError error={error} />

                <div className="rounded-lg border bg-card p-6">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="nomEntreprise"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Nom de l&apos;entreprise *
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Mon Entreprise SARL"
                                                disabled={isLoading}
                                                className={cn(
                                                    "transition-all",
                                                    form.formState.errors
                                                        .nomEntreprise &&
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
                                name="siret"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SIRET</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="123 456 789 00012"
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Numéro SIRET à 14 chiffres
                                            (optionnel)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="adresse"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Adresse</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="123 Rue de la Paix, 75001 Paris"
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="telephone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Téléphone</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="tel"
                                                placeholder="01 23 45 67 89"
                                                disabled={isLoading}
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
                                        Enregistrement...
                                    </>
                                ) : (
                                    "Commencer à utiliser l'application"
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>

                <p className="px-8 text-center text-xs text-muted-foreground">
                    Vous pourrez modifier ces informations plus tard dans les
                    paramètres
                </p>
            </div>
        </div>
    );
}
