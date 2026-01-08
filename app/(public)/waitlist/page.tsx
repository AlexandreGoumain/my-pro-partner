"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useJoinWaitlist } from "@/hooks/use-waitlist";
import {
    ACTIVITY_TYPES,
    waitlistSchema,
    type WaitlistFormValues,
} from "@/lib/validators/waitlist";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

export default function WaitlistPage() {
    const { mutate: joinWaitlist, isPending, isSuccess, error } = useJoinWaitlist();

    const form = useForm<WaitlistFormValues>({
        resolver: zodResolver(waitlistSchema),
        defaultValues: {
            email: "",
            company: "",
            phone: "",
            templateType: "",
            website: "", // Honeypot
        },
    });

    const onSubmit = (data: WaitlistFormValues) => {
        joinWaitlist(
            {
                email: data.email.trim(),
                company: data.company?.trim() || undefined,
                phone: data.phone?.trim() || undefined,
                templateType: data.templateType || undefined,
                website: data.website,
            },
            {
                onSuccess: () => {
                    form.reset();
                },
            }
        );
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black/2 to-black/5 px-4">
                <Card className="w-full max-w-md border-black/10 shadow-sm">
                    <CardContent className="pt-12 pb-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black/5 mb-6">
                            <CheckCircle2
                                className="w-8 h-8 text-black"
                                strokeWidth={2}
                            />
                        </div>
                        <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-black mb-3">
                            Merci pour votre intérêt !
                        </h1>
                        <p className="text-[15px] text-black/60 leading-relaxed mb-8">
                            Vous êtes maintenant sur la liste d&apos;attente.
                            <br />
                            Nous vous contacterons dès le lancement.
                        </p>
                        <Button
                            onClick={() => (window.location.href = "/")}
                            className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium shadow-sm"
                        >
                            Retour à l&apos;accueil
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black/2 to-black/5 px-4">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-[48px] font-semibold tracking-[-0.03em] text-black mb-4">
                        My Pro Partner arrive bientôt
                    </h1>
                    <p className="text-[20px] text-black/60 tracking-[-0.01em] leading-relaxed max-w-xl mx-auto">
                        La solution ERP tout-en-un pour gérer votre entreprise
                        simplement. Rejoignez la liste d&apos;attente pour être
                        parmi les premiers utilisateurs.
                    </p>
                </div>

                {/* Formulaire */}
                <Card className="border-black/10 shadow-sm mb-8">
                    <CardContent className="pt-8 pb-8">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[14px] font-medium text-black/80">
                                                Email professionnel *
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    maxLength={255}
                                                    placeholder="votre@email.com"
                                                    className="h-11 border-black/10 focus:border-black/30"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-[13px]" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="company"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[14px] font-medium text-black/80">
                                                Nom de votre entreprise
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    maxLength={100}
                                                    placeholder="Mon Entreprise SARL"
                                                    className="h-11 border-black/10 focus:border-black/30"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-[13px]" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[14px] font-medium text-black/80">
                                                Téléphone (optionnel)
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="tel"
                                                    maxLength={20}
                                                    placeholder="06 12 34 56 78"
                                                    className="h-11 border-black/10 focus:border-black/30"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-[13px]" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="templateType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[14px] font-medium text-black/80">
                                                Type d&apos;activité
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="h-11 border-black/10 focus:border-black/30">
                                                        <SelectValue placeholder="Sélectionnez votre secteur" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {ACTIVITY_TYPES.map((activity) => (
                                                        <SelectItem key={activity.value} value={activity.value}>
                                                            {activity.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-[13px]" />
                                        </FormItem>
                                    )}
                                />

                                {/* Honeypot - Invisible field for bot detection */}
                                <div className="absolute left-[-9999px]" aria-hidden="true">
                                    <Input
                                        type="text"
                                        {...form.register("website")}
                                        tabIndex={-1}
                                        autoComplete="off"
                                    />
                                </div>

                                {error && (
                                    <div className="p-4 rounded-md bg-red-50 border border-red-200">
                                        <p className="text-[14px] text-red-700">
                                            {error.message}
                                        </p>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full bg-black hover:bg-black/90 text-white h-12 text-[15px] font-medium shadow-sm disabled:opacity-50"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Inscription en cours...
                                        </>
                                    ) : (
                                        "Rejoindre la liste d'attente"
                                    )}
                                </Button>

                                <p className="text-[13px] text-black/40 text-center">
                                    Nous respectons votre vie privée. Pas de spam.
                                </p>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {/* Fonctionnalités clés */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        {
                            title: "Gestion clients",
                            description: "CRM intégré et facile",
                        },
                        {
                            title: "Facturation",
                            description: "Devis et factures en 2 clics",
                        },
                        {
                            title: "Chatbot IA",
                            description: "Assistant intelligent",
                        },
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className="p-6 rounded-lg border border-black/8 bg-white/50"
                        >
                            <h3 className="text-[16px] font-semibold text-black mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-[14px] text-black/60">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
