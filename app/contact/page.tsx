"use client";

import { Navigation } from "@/components/landing/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Mail, Send } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        phone: "",
        message: "",
        website: "", // Honeypot - doit rester vide
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setIsSuccess(true);
                setFormData({
                    name: "",
                    email: "",
                    company: "",
                    phone: "",
                    message: "",
                    website: "",
                });
            } else {
                setError(data.error || "Une erreur s'est produite");
            }
        } catch (err) {
            setError("Impossible d'envoyer le message. Réessayez plus tard.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
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
                                        onClick={() => setIsSuccess(false)}
                                        variant="outline"
                                        className="border-black/[0.08] hover:bg-black/[0.02] h-11 px-6 text-[14px] font-medium"
                                    >
                                        Envoyer un autre message
                                    </Button>
                                </div>
                            ) : (
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    {/* Name & Email */}
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="name"
                                                className="text-[13px] font-medium text-black/70"
                                            >
                                                Nom complet *
                                            </Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="h-11 border-black/[0.08] focus:border-black/[0.2] text-[14px]"
                                                placeholder="Jean Dupont"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="email"
                                                className="text-[13px] font-medium text-black/70"
                                            >
                                                Email *
                                            </Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="h-11 border-black/[0.08] focus:border-black/[0.2] text-[14px]"
                                                placeholder="jean@exemple.fr"
                                            />
                                        </div>
                                    </div>

                                    {/* Company & Phone */}
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="company"
                                                className="text-[13px] font-medium text-black/70"
                                            >
                                                Entreprise
                                            </Label>
                                            <Input
                                                id="company"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleChange}
                                                className="h-11 border-black/[0.08] focus:border-black/[0.2] text-[14px]"
                                                placeholder="Mon entreprise"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="phone"
                                                className="text-[13px] font-medium text-black/70"
                                            >
                                                Téléphone
                                            </Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="h-11 border-black/[0.08] focus:border-black/[0.2] text-[14px]"
                                                placeholder="06 12 34 56 78"
                                            />
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="message"
                                            className="text-[13px] font-medium text-black/70"
                                        >
                                            Message *
                                        </Label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={6}
                                            className="border-black/[0.08] focus:border-black/[0.2] text-[14px] resize-none"
                                            placeholder="Décrivez votre projet ou votre question..."
                                        />
                                    </div>

                                    {/* Honeypot - Invisible field for bot detection */}
                                    <div className="absolute left-[-9999px]" aria-hidden="true">
                                        <Input
                                            type="text"
                                            name="website"
                                            value={formData.website}
                                            onChange={handleChange}
                                            tabIndex={-1}
                                            autoComplete="off"
                                        />
                                    </div>

                                    {/* Error Message */}
                                    {error && (
                                        <div className="p-4 rounded-lg bg-red-50 border border-red-100">
                                            <p className="text-[13px] text-red-600">
                                                {error}
                                            </p>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-black hover:bg-black/90 text-white h-12 px-6 text-[14px] font-medium rounded-md shadow-sm group"
                                    >
                                        {isSubmitting ? (
                                            "Envoi en cours..."
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
                            )}
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
}
