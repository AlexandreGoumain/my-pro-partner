"use client";

import { Navigation } from "@/components/landing/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { useSendContact } from "@/hooks/use-contact";
import {
    contactSchema,
    type ContactFormValues,
} from "@/lib/validators/contact";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Loader2, Mail, Send } from "lucide-react";
import { useForm } from "react-hook-form";

export default function ContactPage() {
    const { mutate: sendContact, isPending, isSuccess, error } = useSendContact();

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: "",
            email: "",
            company: "",
            phone: "",
            message: "",
            website: "", // Honeypot
        },
    });

    const onSubmit = (data: ContactFormValues) => {
        sendContact(
            {
                name: data.name.trim(),
                email: data.email.trim(),
                company: data.company?.trim() || undefined,
                phone: data.phone?.trim() || undefined,
                message: data.message.trim(),
                website: data.website,
            },
            {
                onSuccess: () => {
                    form.reset();
                },
            }
        );
    };

    return (
        <div className="min-h-screen bg-white">
            <Navigation />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 sm:px-8 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-black/[0.015] rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 bg-black/[0.015] rounded-full blur-3xl" />
                </div>

                <div className="max-w-[1200px] mx-auto relative">
                    {/* Header */}
                    <div className="text-center space-y-5 mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/[0.03] border border-black/[0.08]">
                            <Mail
                                className="w-4 h-4 text-black/60"
                                strokeWidth={2}
                            />
                            <span className="text-[13px] text-black/60 font-medium">
                                Nous sommes là pour vous
                            </span>
                        </div>
                        <h1 className="text-[48px] sm:text-[64px] font-semibold tracking-[-0.03em] text-black leading-[1.05]">
                            Contactez-nous
                        </h1>
                        <p className="text-[19px] text-black/60 max-w-[680px] mx-auto leading-[1.5]">
                            Une question ? Un projet ? Notre équipe vous répond
                            sous 24h pour vous accompagner.
                        </p>
                    </div>

                    <div className="max-w-[800px] mx-auto">
                        {/* Form */}
                        <Card className="p-10 bg-white border-black/[0.08] shadow-xl shadow-black/5">
                            {isSuccess ? (
                                <div className="text-center py-12 space-y-6">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black/[0.06]">
                                        <CheckCircle
                                            className="w-8 h-8 text-black"
                                            strokeWidth={2}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-[24px] font-semibold text-black tracking-[-0.01em]">
                                            Message envoyé !
                                        </h3>
                                        <p className="text-[15px] text-black/60">
                                            Nous avons bien reçu votre message.
                                            Notre équipe vous répondra sous 24h.
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => window.location.reload()}
                                        variant="outline"
                                        className="border-black/[0.08] hover:bg-black/[0.02] h-11 px-6 text-[14px] font-medium"
                                    >
                                        Envoyer un autre message
                                    </Button>
                                </div>
                            ) : (
                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(onSubmit)}
                                        className="space-y-6"
                                    >
                                        {/* Name & Email */}
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[13px] font-medium text-black/70">
                                                            Nom complet *
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                maxLength={100}
                                                                className="h-11 border-black/[0.08] focus:border-black/[0.2] text-[14px]"
                                                                placeholder="Jean Dupont"
                                                            />
                                                        </FormControl>
                                                        <FormMessage className="text-[13px]" />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[13px] font-medium text-black/70">
                                                            Email *
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                type="email"
                                                                maxLength={255}
                                                                className="h-11 border-black/[0.08] focus:border-black/[0.2] text-[14px]"
                                                                placeholder="jean@exemple.fr"
                                                            />
                                                        </FormControl>
                                                        <FormMessage className="text-[13px]" />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {/* Company & Phone */}
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="company"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-[13px] font-medium text-black/70">
                                                            Entreprise
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                maxLength={100}
                                                                className="h-11 border-black/[0.08] focus:border-black/[0.2] text-[14px]"
                                                                placeholder="Mon entreprise"
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
                                                        <FormLabel className="text-[13px] font-medium text-black/70">
                                                            Téléphone
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                type="tel"
                                                                maxLength={20}
                                                                className="h-11 border-black/[0.08] focus:border-black/[0.2] text-[14px]"
                                                                placeholder="06 12 34 56 78"
                                                            />
                                                        </FormControl>
                                                        <FormMessage className="text-[13px]" />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {/* Message */}
                                        <FormField
                                            control={form.control}
                                            name="message"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[13px] font-medium text-black/70">
                                                        Message *
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            rows={6}
                                                            maxLength={5000}
                                                            className="border-black/[0.08] focus:border-black/[0.2] text-[14px] resize-none"
                                                            placeholder="Décrivez votre projet ou votre question..."
                                                        />
                                                    </FormControl>
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

                                        {/* Error Message */}
                                        {error && (
                                            <div className="p-4 rounded-lg bg-red-50 border border-red-100">
                                                <p className="text-[13px] text-red-600">
                                                    {error.message}
                                                </p>
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        <Button
                                            type="submit"
                                            disabled={isPending}
                                            className="w-full bg-black hover:bg-black/90 text-white h-12 px-6 text-[14px] font-medium rounded-md shadow-sm group"
                                        >
                                            {isPending ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Envoi en cours...
                                                </>
                                            ) : (
                                                <>
                                                    Envoyer le message
                                                    <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </Button>

                                        <p className="text-[12px] text-black/40 text-center">
                                            En envoyant ce formulaire, vous acceptez
                                            notre politique de confidentialité.
                                        </p>
                                    </form>
                                </Form>
                            )}
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
}
