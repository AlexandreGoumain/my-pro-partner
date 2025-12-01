"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";

export default function WaitlistPage() {
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState("");
    const [phone, setPhone] = useState("");
    const [templateType, setTemplateType] = useState("");
    const [website, setWebsite] = useState(""); // Honeypot - doit rester vide
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/waitlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    company,
                    phone,
                    templateType,
                    website,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Afficher le message d'erreur spécifique de l'API
                setError(
                    data.error ||
                        "Une erreur s'est produite. Veuillez réessayer."
                );
                return;
            }

            setIsSuccess(true);
            setEmail("");
            setCompany("");
            setPhone("");
            setTemplateType("");
            setWebsite("");
        } catch (err) {
            setError("Une erreur s'est produite. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
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
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-[14px] font-medium text-black/80 mb-2"
                                >
                                    Email professionnel *
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    placeholder="votre@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-11 border-black/10 focus:border-black/30"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="company"
                                    className="block text-[14px] font-medium text-black/80 mb-2"
                                >
                                    Nom de votre entreprise
                                </label>
                                <Input
                                    id="company"
                                    type="text"
                                    placeholder="Mon Entreprise SARL"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    className="h-11 border-black/10 focus:border-black/30"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="phone"
                                    className="block text-[14px] font-medium text-black/80 mb-2"
                                >
                                    Téléphone (optionnel)
                                </label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="06 12 34 56 78"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="h-11 border-black/10 focus:border-black/30"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="templateType"
                                    className="block text-[14px] font-medium text-black/80 mb-2"
                                >
                                    Type d&apos;activité
                                </label>
                                <Select
                                    value={templateType}
                                    onValueChange={setTemplateType}
                                >
                                    <SelectTrigger className="h-11 border-black/10 focus:border-black/30">
                                        <SelectValue placeholder="Sélectionnez votre secteur" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PLOMBERIE">
                                            Plombier
                                        </SelectItem>
                                        <SelectItem value="ELECTRICITE">
                                            Électricien
                                        </SelectItem>
                                        <SelectItem value="CHAUFFAGE">
                                            Chauffagiste
                                        </SelectItem>
                                        <SelectItem value="MENUISERIE">
                                            Menuisier
                                        </SelectItem>
                                        <SelectItem value="PEINTURE">
                                            Peintre
                                        </SelectItem>
                                        <SelectItem value="MACONNERIE">
                                            Maçon
                                        </SelectItem>
                                        <SelectItem value="RESTAURATION">
                                            Restaurant / Café / Bar
                                        </SelectItem>
                                        <SelectItem value="BOULANGERIE">
                                            Boulangerie / Pâtisserie
                                        </SelectItem>
                                        <SelectItem value="COIFFURE">
                                            Salon de coiffure
                                        </SelectItem>
                                        <SelectItem value="ESTHETIQUE">
                                            Institut de beauté / Spa
                                        </SelectItem>
                                        <SelectItem value="FITNESS">
                                            Salle de sport / Coaching
                                        </SelectItem>
                                        <SelectItem value="GARAGE">
                                            Garage automobile
                                        </SelectItem>
                                        <SelectItem value="INFORMATIQUE">
                                            Services informatiques
                                        </SelectItem>
                                        <SelectItem value="CONSULTING">
                                            Conseil / Formation
                                        </SelectItem>
                                        <SelectItem value="COMMERCE_DETAIL">
                                            Commerce de détail
                                        </SelectItem>
                                        <SelectItem value="IMMOBILIER">
                                            Agence immobilière
                                        </SelectItem>
                                        <SelectItem value="SANTE">
                                            Professions médicales/paramédicales
                                        </SelectItem>
                                        <SelectItem value="JURIDIQUE">
                                            Avocat / Notaire
                                        </SelectItem>
                                        <SelectItem value="COMPTABILITE">
                                            Expert-comptable
                                        </SelectItem>
                                        <SelectItem value="GENERAL">
                                            Autre
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Honeypot - Invisible field for bot detection */}
                            <div
                                className="absolute left-[-9999px]"
                                aria-hidden="true"
                            >
                                <Input
                                    type="text"
                                    name="website"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                    tabIndex={-1}
                                    autoComplete="off"
                                />
                            </div>

                            {error && (
                                <div className="p-4 rounded-md bg-red-50 border border-red-200">
                                    <p className="text-[14px] text-red-700">
                                        {error}
                                    </p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-black hover:bg-black/90 text-white h-12 text-[15px] font-medium shadow-sm"
                            >
                                {isLoading ? (
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
