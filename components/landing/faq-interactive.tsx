"use client";

import { Card } from "@/components/ui/card";
import { ChevronDown, HelpCircle, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface FAQItem {
    question: string;
    answer: string;
    category: "general" | "pricing" | "technical" | "security";
}

const faqs: FAQItem[] = [
    {
        question: "Combien de temps faut-il pour installer MyProPartner ?",
        answer: "L'installation complète prend environ 7 minutes. Vous créez votre compte (2 min), configurez votre espace avec votre type d'entreprise (5 min), et c'est tout ! Vous pouvez commencer à créer vos premiers devis immédiatement après.",
        category: "general",
    },
    {
        question: "Est-ce que mes données sont sécurisées ?",
        answer: "Absolument. Nous utilisons un chiffrement AES-256 (niveau bancaire), authentification JWT, hébergement en France, conformité RGPD complète, backups quotidiens automatiques, et un monitoring 24/7. Vos données sont aussi sécurisées que dans une banque.",
        category: "security",
    },
    {
        question: "Puis-je changer de plan à tout moment ?",
        answer: "Oui, vous pouvez upgrader ou downgrader à tout moment depuis votre tableau de bord. Les changements sont instantanés et la facturation est proratisée. Si vous downgradez, les limites s'appliquent au prochain cycle de facturation.",
        category: "pricing",
    },
    {
        question: "L'application fonctionne-t-elle sur mobile ?",
        answer: "Oui ! MyProPartner est une PWA (Progressive Web App). Vous pouvez l'installer sur votre téléphone et tablette (iOS et Android) et elle fonctionne même hors-ligne. Idéal pour créer des devis sur chantier.",
        category: "technical",
    },
    {
        question: "Que se passe-t-il si j'atteins mes limites ?",
        answer: "Vous recevez une notification avant d'atteindre 80% de vos limites. Une fois atteintes, vous pouvez upgrader instantanément ou attendre le prochain cycle mensuel. Aucune donnée n'est perdue.",
        category: "pricing",
    },
    {
        question: "Comment fonctionne l'assistant IA ?",
        answer: "Notre assistant utilise GPT-4 d'OpenAI. Il accède à vos vraies données (clients, factures, stocks) de manière sécurisée et répond à vos questions en français. Vous posez une question ('Quels clients n'ont pas payé ?'), il analyse et répond en 2 secondes.",
        category: "technical",
    },
    {
        question: "Puis-je importer mes données existantes ?",
        answer: "Oui ! Vous pouvez importer vos clients depuis Excel/CSV en 1 clic. Pour les factures et stocks, contactez notre équipe qui vous aidera gratuitement à migrer vos données depuis votre ancien système.",
        category: "general",
    },
    {
        question: "Y a-t-il des frais cachés ?",
        answer: "Aucun frais caché. Le prix affiché est le prix final. Les seuls coûts additionnels potentiels sont les frais Stripe (2.9% + 0.25€) si vous utilisez les paiements en ligne, standards dans l'industrie.",
        category: "pricing",
    },
    {
        question: "Qu'est-ce que la garantie 30 jours ?",
        answer: "Si vous n'êtes pas satisfait dans les 30 premiers jours, on vous rembourse intégralement, sans poser de questions. Envoyez juste un email et on traite le remboursement sous 48h.",
        category: "pricing",
    },
    {
        question: "Le support client est-il inclus ?",
        answer: "Oui ! Tous les plans incluent le support par email et accès à notre documentation complète. Les plans PRO et ENTERPRISE bénéficient du support prioritaire avec réponse sous 2h et support 7j/7.",
        category: "general",
    },
    {
        question: "Puis-je gérer plusieurs magasins/emplacements ?",
        answer: "Oui, à partir du plan STARTER. Vous pouvez créer plusieurs magasins, gérer les stocks par emplacement, faire des transferts inter-magasins, et avoir un POS par magasin. Tout est centralisé dans un seul tableau de bord.",
        category: "technical",
    },
    {
        question: "Mes employés peuvent-ils avoir des accès différents ?",
        answer: "Absolument. Nous avons 6 rôles (Owner, Admin, Manager, Employee, Cashier, Accountant) et 30+ permissions granulaires. Vous contrôlez exactement qui peut voir/modifier quoi.",
        category: "security",
    },
    {
        question: "Comment annuler mon abonnement ?",
        answer: "Vous pouvez annuler à tout moment depuis votre tableau de bord en 2 clics. Aucun préavis requis. Vous gardez l'accès jusqu'à la fin de la période payée, puis votre compte passe en plan gratuit.",
        category: "pricing",
    },
    {
        question: "Les mises à jour sont-elles gratuites ?",
        answer: "Oui, toutes les mises à jour et nouvelles fonctionnalités sont incluses dans votre abonnement. Pas de frais supplémentaires pour les upgrades. Vous bénéficiez automatiquement de toutes les améliorations.",
        category: "pricing",
    },
    {
        question: "Est-ce conforme à la comptabilité française ?",
        answer: "Oui, 100% conforme. Nous générons le fichier FEC (Fichier des Écritures Comptables) requis par la loi française, les numéros de facture sont conformes, et toutes les mentions légales obligatoires sont automatiquement incluses.",
        category: "technical",
    },
];

const categories = [
    { id: "all" as const, label: "Toutes", count: faqs.length },
    { id: "general" as const, label: "Général", count: faqs.filter((f) => f.category === "general").length },
    { id: "pricing" as const, label: "Tarification", count: faqs.filter((f) => f.category === "pricing").length },
    { id: "technical" as const, label: "Technique", count: faqs.filter((f) => f.category === "technical").length },
    { id: "security" as const, label: "Sécurité", count: faqs.filter((f) => f.category === "security").length },
];

export function FAQInteractive() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [selectedCategory, setSelectedCategory] = useState<"all" | "general" | "pricing" | "technical" | "security">("all");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredFaqs = faqs.filter((faq) => {
        const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
        const matchesSearch = searchQuery === "" ||
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <section className="relative py-32 px-6 sm:px-8 bg-gradient-to-b from-white via-neutral-50/30 to-white overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/3 w-1/2 h-1/2 bg-black/[0.015] rounded-full blur-3xl" />
            </div>

            <div className="max-w-[1000px] mx-auto relative">
                {/* Header */}
                <div className="text-center space-y-5 mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/[0.03] border border-black/[0.08]">
                        <HelpCircle className="w-4 h-4 text-black/60" strokeWidth={2} />
                        <span className="text-[13px] text-black/60 font-medium">
                            Questions fréquentes
                        </span>
                    </div>

                    <h2 className="text-[48px] sm:text-[64px] font-semibold tracking-[-0.03em] text-black leading-[1.05]">
                        Vous avez des questions ?
                        <br />
                        <span className="text-black/60">On a les réponses.</span>
                    </h2>

                    <p className="text-[19px] text-black/60 max-w-[680px] mx-auto leading-[1.5]">
                        Tout ce que vous devez savoir sur MyProPartner. Vous ne trouvez pas de réponse ? Contactez-nous.
                    </p>
                </div>

                {/* Search */}
                <div className="mb-8">
                    <div className="relative max-w-[600px] mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" strokeWidth={2} />
                        <Input
                            type="text"
                            placeholder="Rechercher une question..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 h-12 text-[15px] bg-white border-black/[0.08] focus:border-black/[0.15] rounded-xl"
                        />
                    </div>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-5 py-2.5 rounded-full text-[14px] font-medium transition-all duration-300 ${
                                selectedCategory === category.id
                                    ? "bg-black text-white shadow-md"
                                    : "bg-black/[0.04] text-black/70 hover:bg-black/[0.08] border border-black/[0.08]"
                            }`}
                        >
                            {category.label}
                            <span className={`ml-2 text-[12px] ${
                                selectedCategory === category.id ? "text-white/70" : "text-black/40"
                            }`}>
                                ({category.count})
                            </span>
                        </button>
                    ))}
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-3">
                    {filteredFaqs.length === 0 ? (
                        <Card className="p-12 text-center border-black/[0.08] bg-white">
                            <HelpCircle className="w-12 h-12 text-black/20 mx-auto mb-4" strokeWidth={2} />
                            <p className="text-[16px] text-black/60">
                                Aucune question trouvée pour "{searchQuery}"
                            </p>
                        </Card>
                    ) : (
                        filteredFaqs.map((faq, index) => (
                            <Card
                                key={index}
                                className={`border-black/[0.08] bg-white transition-all duration-300 overflow-hidden ${
                                    openIndex === index ? "shadow-lg border-black/[0.15]" : "hover:shadow-md hover:border-black/[0.12]"
                                }`}
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full p-6 text-left flex items-start justify-between gap-4 group"
                                >
                                    <div className="flex-1">
                                        <h3 className="text-[17px] font-semibold text-black pr-4 leading-[1.4]">
                                            {faq.question}
                                        </h3>
                                    </div>
                                    <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-black/[0.05] group-hover:bg-black/[0.10] flex items-center justify-center transition-all duration-300 ${
                                        openIndex === index ? "bg-black rotate-180" : ""
                                    }`}>
                                        <ChevronDown
                                            className={`w-4 h-4 transition-colors duration-300 ${
                                                openIndex === index ? "text-white" : "text-black/60"
                                            }`}
                                            strokeWidth={2}
                                        />
                                    </div>
                                </button>

                                <div
                                    className={`transition-all duration-300 ease-in-out ${
                                        openIndex === index
                                            ? "max-h-96 opacity-100"
                                            : "max-h-0 opacity-0"
                                    }`}
                                >
                                    <div className="px-6 pb-6 pt-0">
                                        <div className="pt-4 border-t border-black/[0.06]">
                                            <p className="text-[15px] text-black/70 leading-[1.7]">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>

                {/* Still have questions CTA */}
                <div className="mt-12 text-center">
                    <Card className="inline-block p-6 bg-black text-white border-black">
                        <div className="space-y-3">
                            <p className="text-[17px] font-semibold">
                                Vous ne trouvez pas de réponse ?
                            </p>
                            <p className="text-[14px] text-white/70">
                                Notre équipe est là pour vous aider. Réponse sous 2h en moyenne.
                            </p>
                            <a
                                href="/contact"
                                className="inline-block px-6 py-2.5 rounded-full bg-white text-black text-[14px] font-medium hover:bg-white/90 transition-colors duration-300"
                            >
                                Contactez-nous
                            </a>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
}
