"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: "Combien de temps faut-il pour installer MyProPartner ?",
            answer: "L'installation complète prend environ 5 à 7 minutes. Créez votre compte, importez vos données existantes (ou partez de zéro), et vous êtes prêt à créer votre première facture.",
        },
        {
            question: "Puis-je importer mes données existantes ?",
            answer: "Oui, vous pouvez importer vos clients, produits et factures depuis Excel, CSV, ou depuis votre ancien logiciel. Notre équipe peut vous assister gratuitement lors de la migration.",
        },
        {
            question: "L'assistant IA est-il vraiment utile ?",
            answer: "L'assistant IA vous fait gagner en moyenne 40h par mois en automatisant les tâches répétitives : recherche de documents, génération de rapports, relances clients, prédictions de ventes, etc.",
        },
        {
            question: "Mes données sont-elles sécurisées ?",
            answer: "Oui. Toutes vos données sont chiffrées et hébergées en France (OVH). Nous sommes conformes au RGPD. Sauvegardes automatiques quotidiennes. Vous pouvez exporter vos données à tout moment.",
        },
        {
            question: "Puis-je annuler à tout moment ?",
            answer: "Absolument. Aucun engagement. Vous pouvez annuler votre abonnement en un clic depuis votre tableau de bord. Vous conservez l'accès jusqu'à la fin de la période payée.",
        },
        {
            question: "Proposez-vous une formation ?",
            answer: "Oui, nous proposons des tutoriels vidéo, une documentation complète, et un support par chat 7j/7. Une session de formation personnalisée gratuite est incluse avec votre abonnement.",
        },
    ];

    return (
        <section
            id="faq"
            className="px-6 bg-black/[0.01] border-y border-black/[0.06] scroll-fade-in"
            style={{
                paddingTop: 'var(--section-padding-top-large)',
                paddingBottom: 'var(--section-padding-bottom-large)'
            }}
        >
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center" style={{ marginBottom: 'var(--spacing-2xl)' }}>
                    <h2 className="text-[48px] font-semibold tracking-tight-premium text-black mb-4">
                        Questions fréquentes
                    </h2>
                    <p className="text-[18px] text-black/50 tracking-wide-premium">
                        Tout ce que vous devez savoir
                    </p>
                </div>

                {/* Accordion */}
                <div className="space-y-2">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white border border-black/[0.06] rounded-lg overflow-hidden shadow-sm"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-5 text-left hover:bg-black/[0.02] transition-all ease-premium"
                                style={{ transitionDuration: '0.3s' }}
                            >
                                <span className="text-[16px] font-medium text-black pr-4 tracking-wide-premium">
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    className={cn(
                                        "w-5 h-5 text-black/40 flex-shrink-0 transition-transform ease-premium",
                                        openIndex === index && "rotate-180"
                                    )}
                                    style={{ transitionDuration: '0.3s' }}
                                    strokeWidth={2}
                                />
                            </button>
                            <div
                                className={cn(
                                    "overflow-hidden transition-all ease-premium",
                                    openIndex === index ? "max-h-96" : "max-h-0"
                                )}
                                style={{ transitionDuration: '0.4s' }}
                            >
                                <div className="p-5 pt-0">
                                    <p className="text-[15px] text-black/60 leading-relaxed tracking-wide-premium">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
