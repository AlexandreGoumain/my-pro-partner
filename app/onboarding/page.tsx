"use client";

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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const onboardingSchema = z.object({
    nomEntreprise: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    siret: z.string().optional(),
    adresse: z.string().optional(),
    telephone: z.string().optional(),
});

type OnboardingInput = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
    const { data: session, update } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<OnboardingInput>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {
            nomEntreprise: session?.user?.name || "",
            siret: "",
            adresse: "",
            telephone: "",
        },
    });

    const onSubmit = async (data: OnboardingInput) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/onboarding/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.message || "Une erreur est survenue");
                setIsLoading(false);
                return;
            }

            // Update session to reflect onboarding completion
            await update();

            // Force full page reload to refresh JWT token in middleware
            window.location.replace("/dashboard");
        } catch {
            setError("Une erreur est survenue");
            setIsLoading(false);
        }
    };

    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Bienvenue ! 👋
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Complétez les informations de votre entreprise pour commencer
                    </p>
                </div>

                {error && (
                    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
                        <p className="text-sm text-destructive">{error}</p>
                    </div>
                )}

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
                                        <FormLabel>Nom de l'entreprise *</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Mon Entreprise SARL"
                                                disabled={isLoading}
                                                className={cn(
                                                    "transition-all",
                                                    form.formState.errors.nomEntreprise &&
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
                                            Numéro SIRET à 14 chiffres (optionnel)
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
                    Vous pourrez modifier ces informations plus tard dans les paramètres
                </p>
            </div>
        </div>
    );
}
