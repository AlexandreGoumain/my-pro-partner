"use client";

import { Card } from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PLANS_CONFIG } from "@/lib/config/plans.config";

interface FAQCategory {
    title: string;
    questions: {
        question: string;
        answer: string;
    }[];
}

const faqCategories: FAQCategory[] = [
    {
        title: "Essai gratuit & Tarification",
        questions: [
            {
                question: "Puis-je essayer gratuitement sans carte bancaire ?",
                answer: "Oui, absolument ! Nous offrons 14 jours d'essai gratuit complet sans demander de carte bancaire. Vous pouvez tester toutes les fonctionnalités premium sans aucun engagement. Si vous décidez de ne pas continuer, votre compte sera simplement désactivé, sans aucun frais."
            },
            {
                question: "Comment fonctionne la tarification ?",
                answer: `Nous proposons 4 plans : Gratuit (pour toujours), Starter à ${PLANS_CONFIG.STARTER.price.monthly}€/mois, Pro à ${PLANS_CONFIG.PRO.price.monthly}€/mois et Enterprise à ${PLANS_CONFIG.ENTERPRISE.price.monthly}€/mois. Vous pouvez payer mensuellement ou annuellement avec 17% de réduction. Tous les prix sont transparents, sans frais cachés, et vous pouvez changer de plan à tout moment.`
            },
            {
                question: "Puis-je changer de plan à tout moment ?",
                answer: "Oui ! Vous pouvez upgrader, downgrader ou annuler votre abonnement à tout moment depuis votre tableau de bord. Les changements sont effectifs immédiatement et nous calculons au prorata pour être parfaitement équitable."
            },
            {
                question: "Y a-t-il des frais cachés ou des coûts supplémentaires ?",
                answer: "Absolument aucun frais caché. Le prix affiché est le prix que vous payez. Pas de frais d'installation, pas de frais par utilisateur supplémentaire (selon votre plan), pas de frais de migration. Tout est inclus dans votre abonnement."
            }
        ]
    },
    {
        title: "Fonctionnalités & Utilisation",
        questions: [
            {
                question: "Comment fonctionne l'assistant IA ?",
                answer: "Notre assistant IA est basé sur GPT-4 et comprend le contexte de votre entreprise. Vous pouvez lui parler naturellement : 'Crée une facture pour M. Dupont' ou 'Quel client me doit le plus d'argent ?'. Il répond instantanément et peut effectuer des actions directement dans votre ERP."
            },
            {
                question: "Puis-je créer des devis et factures personnalisés ?",
                answer: "Oui, totalement ! Vous pouvez créer vos propres templates avec votre logo, vos couleurs, vos mentions légales. Les calculs (TVA, remises, totaux) sont automatiques. Vous pouvez aussi ajouter des photos, des conditions personnalisées, et envoyer directement par email."
            },
            {
                question: "Comment fonctionne la gestion des stocks ?",
                answer: "Le système suit automatiquement vos stocks en temps réel. Chaque vente ou achat met à jour les quantités. Vous recevez des alertes avant les ruptures de stock, vous pouvez gérer plusieurs emplacements, scanner des codes-barres, et exporter l'historique complet."
            },
            {
                question: "Puis-je gérer plusieurs magasins ou emplacements ?",
                answer: "Oui, le plan Pro et Enterprise permettent de gérer plusieurs emplacements. Vous pouvez suivre les stocks séparément pour chaque magasin, transférer des articles entre emplacements, et avoir une vue consolidée de tous vos sites."
            },
            {
                question: "Y a-t-il un système de caisse (POS) intégré ?",
                answer: "Oui ! Notre système de caisse tactile est inclus dans le plan Pro et Enterprise. Interface rapide et intuitive, acceptation des paiements multiples (carte, espèces, chèque), tickets de caisse automatiques, et synchronisation instantanée avec vos stocks."
            }
        ]
    },
    {
        title: "Sécurité & Données",
        questions: [
            {
                question: "Mes données sont-elles sécurisées ?",
                answer: "Absolument. Nous utilisons un chiffrement de niveau bancaire (AES-256) pour toutes vos données. Nos serveurs sont hébergés en Europe (conformité RGPD), nous effectuons des sauvegardes quotidiennes automatiques, et nous ne vendrons jamais vos données à des tiers."
            },
            {
                question: "Où sont hébergées mes données ?",
                answer: "Toutes vos données sont hébergées sur des serveurs sécurisés en France et en Europe, conformes au RGPD. Nous n'utilisons que des datacenters certifiés ISO 27001 avec redondance géographique pour garantir la disponibilité de vos données."
            },
            {
                question: "Qui peut accéder à mes données ?",
                answer: "Seuls vous et les membres de votre équipe que vous avez explicitement autorisés peuvent accéder à vos données. Nos équipes techniques n'y accèdent jamais, sauf en cas de support technique avec votre autorisation explicite."
            },
            {
                question: "Puis-je exporter mes données à tout moment ?",
                answer: "Oui, vos données vous appartiennent. Vous pouvez les exporter à tout moment en CSV, Excel, ou PDF. Si vous décidez de quitter MyProPartner, nous vous fournissons un export complet de toutes vos données."
            }
        ]
    },
    {
        title: "Migration & Installation",
        questions: [
            {
                question: "Combien de temps prend l'installation ?",
                answer: "L'installation est ultra-rapide : environ 2 minutes ! Créez votre compte, personnalisez votre profil, importez vos données (optionnel), et c'est prêt. Nous fournissons aussi des guides vidéo étape par étape pour vous accompagner."
            },
            {
                question: "Pouvez-vous m'aider à migrer depuis mon ancien système ?",
                answer: "Oui, absolument ! Nous offrons une migration gratuite assistée. Notre équipe vous aide à importer vos clients, produits, factures et historique depuis Excel, n'importe quel autre ERP, ou fichiers CSV. C'est inclus dans tous les plans payants."
            },
            {
                question: "Puis-je importer mes données Excel existantes ?",
                answer: "Oui, c'est très simple. Nous fournissons des templates Excel que vous remplissez avec vos données, puis vous les importez en un clic. Compatible avec clients, produits, services, fournisseurs, et historique de transactions."
            },
            {
                question: "Ai-je besoin d'une formation pour utiliser MyProPartner ?",
                answer: "Non, l'interface est conçue pour être intuitive. La plupart de nos utilisateurs sont opérationnels en moins d'une heure. Nous fournissons quand même des tutoriels vidéo, une documentation complète, et un support réactif si besoin."
            }
        ]
    },
    {
        title: "Support & Assistance",
        questions: [
            {
                question: "Quel type de support proposez-vous ?",
                answer: "Nous offrons un support par email pour tous les plans (réponse sous 24h), un chat en direct pour les plans Pro et Enterprise, et un support téléphonique prioritaire pour Enterprise. Notre équipe française est disponible de 9h à 19h en semaine."
            },
            {
                question: "Le support est-il en français ?",
                answer: "Oui, 100% ! Notre équipe de support est entièrement francophone et basée en France. Nous comprenons les spécificités des artisans et PME françaises (TVA, mentions légales, etc.)."
            },
            {
                question: "Proposez-vous des formations personnalisées ?",
                answer: "Oui, pour le plan Enterprise, nous proposons des formations personnalisées en visioconférence ou sur site. Nous adaptons la formation à vos besoins spécifiques et à votre secteur d'activité."
            },
            {
                question: "Que se passe-t-il si j'ai un problème technique ?",
                answer: "Contactez notre support immédiatement. Nous nous engageons à résoudre les problèmes critiques en moins de 4 heures. Notre équipe technique est très réactive et fera tout pour vous débloquer rapidement."
            }
        ]
    },
    {
        title: "Conformité & Légal",
        questions: [
            {
                question: "MyProPartner est-il conforme à la réglementation française ?",
                answer: "Oui, totalement. Nos factures incluent toutes les mentions légales obligatoires, la TVA est calculée automatiquement selon les taux français, et nous respectons toutes les normes comptables françaises."
            },
            {
                question: "Puis-je utiliser MyProPartner pour ma comptabilité ?",
                answer: "MyProPartner simplifie votre pré-comptabilité et génère tous les documents nécessaires pour votre comptable. Vous pouvez exporter vos données au format FEC (Fichier des Écritures Comptables) compatible avec tous les logiciels comptables."
            },
            {
                question: "Les factures sont-elles valables légalement ?",
                answer: "Oui, absolument. Nos factures respectent toutes les exigences légales françaises : numérotation séquentielle, mentions obligatoires, TVA, etc. Elles sont parfaitement valables pour vos clients et votre comptable."
            }
        ]
    }
];

export function FAQEnhanced() {
    return (
        <section id="faq" className="relative py-32 px-6 sm:px-8 bg-gradient-to-b from-neutral-50/50 via-white to-neutral-50/30 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-black/[0.015] rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 bg-black/[0.015] rounded-full blur-3xl" />
            </div>

            <div className="max-w-[1000px] mx-auto relative">
                {/* Header */}
                <div className="text-center space-y-5 mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/[0.03] border border-black/[0.08]">
                        <HelpCircle className="w-4 h-4 text-black/60" strokeWidth={2} />
                        <span className="text-[13px] text-black/60 font-medium">
                            Toutes vos questions
                        </span>
                    </div>
                    <h2 className="text-[48px] sm:text-[64px] font-semibold tracking-[-0.03em] text-black leading-[1.05]">
                        Questions fréquentes
                    </h2>
                    <p className="text-[19px] text-black/60 max-w-[680px] mx-auto leading-[1.5]">
                        Tout ce que vous devez savoir sur MyProPartner. Vous ne trouvez pas votre réponse ? Contactez-nous.
                    </p>
                </div>

                {/* FAQ Categories */}
                <div className="space-y-8">
                    {faqCategories.map((category, categoryIndex) => (
                        <Card key={categoryIndex} className="p-8 bg-white border-black/[0.08] shadow-sm">
                            {/* Category Title */}
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-black/[0.08]">
                                <div className="w-2 h-2 rounded-full bg-black/40" />
                                <h3 className="text-[20px] font-semibold text-black tracking-[-0.01em]">
                                    {category.title}
                                </h3>
                            </div>

                            {/* Questions Accordion */}
                            <Accordion type="single" collapsible className="space-y-3">
                                {category.questions.map((faq, faqIndex) => (
                                    <AccordionItem
                                        key={faqIndex}
                                        value={`item-${categoryIndex}-${faqIndex}`}
                                        className="border border-black/[0.06] rounded-lg px-5 data-[state=open]:border-black/[0.12] transition-all"
                                    >
                                        <AccordionTrigger className="text-[15px] font-medium text-black hover:no-underline py-5">
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-[14px] text-black/60 leading-[1.6] pb-5">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </Card>
                    ))}
                </div>

                {/* Still have questions CTA */}
                <div className="mt-16">
                    <Card className="p-8 bg-gradient-to-br from-black via-black to-black/90 border-black text-white text-center">
                        <Sparkles className="w-12 h-12 mx-auto mb-4" strokeWidth={1.5} />
                        <h3 className="text-[24px] font-semibold mb-3 tracking-[-0.01em]">
                            Vous avez encore des questions ?
                        </h3>
                        <p className="text-[15px] text-white/70 mb-6 max-w-[500px] mx-auto">
                            Notre équipe est là pour vous aider. Contactez-nous et obtenez une réponse rapide et personnalisée.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link href="/contact">
                                <Button className="bg-white hover:bg-white/95 text-black h-11 px-6 text-[14px] font-medium rounded-md group">
                                    Contactez-nous
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/waitlist">
                                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-11 px-6 text-[14px] font-medium rounded-md">
                                    Essayer gratuitement
                                </Button>
                            </Link>
                        </div>
                        <div className="mt-6 pt-6 border-t border-white/[0.1]">
                            <p className="text-[13px] text-white/60">
                                Support disponible 7j/7 • Réponse sous 24h maximum
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
}
