"use client";

import { ErrorAlert } from "@/components/client-portal/register/error-alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useClientLogin } from "@/hooks/use-client-login";
import { clientLoginSchema, type ClientLoginInput } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

export default function ClientLoginPage() {
    const { isLoading, error, login } = useClientLogin();

    const form = useForm<ClientLoginInput>({
        resolver: zodResolver(clientLoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleSubmit = async (data: ClientLoginInput) => {
        await login(data);
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-black mb-2">
                        Portail Client
                    </h1>
                    <p className="text-[15px] text-black/60">
                        Connectez-vous pour accéder à votre espace
                    </p>
                </div>

                {/* Login Form */}
                <Card className="border-black/8 shadow-sm">
                    <div className="p-8">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(handleSubmit)}
                                className="space-y-5"
                            >
                                {error && <ErrorAlert message={error} />}

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[14px] font-medium text-black">
                                                Email
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    placeholder="votre.email@exemple.fr"
                                                    className="h-11 border-black/10 focus:border-black"
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
                                                <FormLabel className="text-[14px] font-medium text-black">
                                                    Mot de passe
                                                </FormLabel>
                                                <Link
                                                    href="/client/forgot-password"
                                                    className="text-[13px] text-black/60 hover:text-black transition-colors"
                                                >
                                                    Mot de passe oublié ?
                                                </Link>
                                            </div>
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
                                    disabled={isLoading}
                                    className="w-full h-11 text-[14px] font-medium bg-black hover:bg-black/90 text-white rounded-md shadow-sm"
                                >
                                    {isLoading ? (
                                        "Connexion..."
                                    ) : (
                                        <>
                                            <LogIn
                                                className="h-4 w-4 mr-2"
                                                strokeWidth={2}
                                            />
                                            Se connecter
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>

                        <div className="mt-6 text-center">
                            <p className="text-[13px] text-black/40">
                                Vous n&apos;avez pas de compte ?{" "}
                                <span className="text-black/60 font-medium">
                                    Demandez votre lien d&apos;inscription à
                                    l&apos;entreprise
                                </span>
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Footer */}
                <p className="text-center text-[13px] text-black/40">
                    Accès sécurisé réservé aux clients
                </p>
            </div>
        </div>
    );
}
