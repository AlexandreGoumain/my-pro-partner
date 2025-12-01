"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useRef, useState } from "react";

const faqCategories = [
    {
        title: "Démarrage",
        faqs: [
            {
                question: "Puis-je essayer gratuitement ?",
                answer: "Oui, 14 jours gratuits sans carte bancaire. Testez toutes les fonctionnalités sans engagement.",
            },
            {
                question: "Combien de temps prend l'installation ?",
                answer: "2 minutes. Créez votre compte, personnalisez votre profil, c'est prêt. Migration gratuite depuis votre ancien système.",
            },
            {
                question: "Y a-t-il une formation incluse ?",
                answer: "Oui, tutoriels vidéo intégrés, guide de démarrage et support par chat disponible 7j/7 pour vous accompagner.",
            },
        ],
    },
    {
        title: "Fonctionnalités",
        faqs: [
            {
                question: "Comment fonctionne l'assistant IA ?",
                answer: "Parlez naturellement : \"Crée un devis pour M. Dupont\" ou \"Qui me doit de l'argent ?\". L'IA comprend et exécute instantanément.",
            },
            {
                question: "Puis-je personnaliser mes documents ?",
                answer: "Oui, logo, couleurs, mentions légales, CGV... Vos devis et factures sont 100% personnalisables à votre image.",
            },
            {
                question: "Y a-t-il une application mobile ?",
                answer: "L'application web est optimisée mobile et fonctionne parfaitement sur smartphone. Application native prévue pour 2025.",
            },
            {
                question: "Le mode hors-ligne est-il disponible ?",
                answer: "Les données récentes sont disponibles hors-ligne. Synchronisation automatique dès que la connexion revient.",
            },
        ],
    },
    {
        title: "Intégrations & Export",
        faqs: [
            {
                question: "Quelles intégrations sont disponibles ?",
                answer: "Export comptable (format FEC), connexion bancaire automatique, import/export Excel et CSV. API disponible sur le plan Pro.",
            },
            {
                question: "Y a-t-il une API ?",
                answer: "Oui, API REST complète disponible sur les plans Pro et Enterprise. Documentation et support technique inclus.",
            },
            {
                question: "Puis-je exporter mes données ?",
                answer: "Oui, export complet en un clic : clients, factures, devis au format Excel, CSV ou PDF. Vos données vous appartiennent.",
            },
        ],
    },
    {
        title: "Sécurité & Facturation",
        faqs: [
            {
                question: "Mes données sont-elles sécurisées ?",
                answer: "Chiffrement bancaire (AES-256), serveurs en France, conformité RGPD, sauvegardes quotidiennes. Vos données vous appartiennent.",
            },
            {
                question: "Comment fonctionne la facturation ?",
                answer: "Facturation mensuelle ou annuelle (-18%). Changez de plan à tout moment. Pas de frais cachés, prix transparent.",
            },
            {
                question: "Puis-je annuler à tout moment ?",
                answer: "Oui, sans frais. Changez de plan ou annulez quand vous voulez depuis votre tableau de bord.",
            },
            {
                question: "Le support multi-utilisateurs est-il inclus ?",
                answer: "Oui, invitez votre équipe selon votre plan : 1 utilisateur (Free), 3 (Starter), 10 (Pro), illimité (Enterprise).",
            },
        ],
    },
];

export function FAQSimple() {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.1 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={ref} className="py-24 px-6 sm:px-8 bg-white">
            <div className="max-w-[900px] mx-auto">
                {/* Header */}
                <div
                    className={`text-center space-y-4 mb-16 transition-all duration-700 ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                >
                    <p className="text-[13px] font-semibold text-black/40 uppercase tracking-widest">
                        FAQ
                    </p>
                    <h2 className="text-[36px] sm:text-[44px] font-bold tracking-[-0.02em] text-black leading-[1.1]">
                        Questions fréquentes
                    </h2>
                    <p className="text-[17px] text-black/50 max-w-[500px] mx-auto">
                        Tout ce que vous devez savoir pour démarrer avec MyProPartner.
                    </p>
                </div>

                {/* FAQ by Category */}
                <div className="space-y-10">
                    {faqCategories.map((category, catIndex) => (
                        <div
                            key={catIndex}
                            className={`transition-all duration-700 ${
                                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            }`}
                            style={{ transitionDelay: `${catIndex * 100}ms` }}
                        >
                            <h3 className="text-[14px] font-semibold text-black/40 uppercase tracking-wide mb-4">
                                {category.title}
                            </h3>
                            <Accordion type="single" collapsible className="space-y-2">
                                {category.faqs.map((faq, faqIndex) => (
                                    <AccordionItem
                                        key={faqIndex}
                                        value={`cat-${catIndex}-item-${faqIndex}`}
                                        className="border border-black/[0.06] rounded-xl px-5 data-[state=open]:border-black/[0.12] data-[state=open]:bg-neutral-50/50 transition-all"
                                    >
                                        <AccordionTrigger className="text-[15px] font-medium text-black hover:no-underline py-4 text-left">
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-[14px] text-black/60 leading-relaxed pb-4">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div
                    className={`mt-12 text-center transition-all duration-700 delay-500 ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                >
                    <p className="text-[15px] text-black/50">
                        Vous avez d&apos;autres questions ?{" "}
                        <a
                            href="/contact"
                            className="text-black font-medium hover:underline"
                        >
                            Contactez-nous
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
}
