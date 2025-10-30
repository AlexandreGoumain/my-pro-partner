"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        question: "Puis-je essayer MyProPartner gratuitement ?",
        answer: "Oui ! Nous offrons un essai gratuit de 14 jours, sans carte bancaire requise. Vous pouvez tester toutes les fonctionnalités et décider ensuite si vous souhaitez continuer.",
    },
    {
        question: "Comment fonctionne la facturation ?",
        answer: "La facturation est mensuelle ou annuelle selon votre choix. Vous pouvez changer de plan ou annuler à tout moment. Avec l'option annuelle, vous économisez 17% par rapport au paiement mensuel.",
    },
    {
        question: "Mes données sont-elles sécurisées ?",
        answer: "Absolument. Nous utilisons un cryptage de niveau bancaire (SSL/TLS) pour toutes les communications. Vos données sont hébergées sur des serveurs sécurisés en Europe avec des sauvegardes quotidiennes automatiques.",
    },
    {
        question: "Puis-je importer mes données existantes ?",
        answer: "Oui, nous proposons des outils d'import pour vos clients, produits et historique. Notre équipe support peut également vous accompagner dans la migration depuis votre ancien logiciel.",
    },
    {
        question: "MyProPartner est-il conforme à la réglementation française ?",
        answer: "Oui, MyProPartner est 100% conforme à la législation française. Les factures générées respectent toutes les mentions légales obligatoires et sont conformes aux normes comptables en vigueur.",
    },
    {
        question: "Combien d'utilisateurs peuvent accéder au compte ?",
        answer: "Cela dépend de votre plan. Le plan Starter permet 1 utilisateur, le plan Pro jusqu'à 5 utilisateurs, et le plan Entreprise offre des utilisateurs illimités.",
    },
    {
        question: "Puis-je personnaliser mes documents (logo, couleurs) ?",
        answer: "Oui ! Vous pouvez personnaliser vos devis et factures avec votre logo, vos couleurs, et vos mentions légales personnalisées. Des templates professionnels sont également disponibles.",
    },
    {
        question: "Que se passe-t-il si j'annule mon abonnement ?",
        answer: "Vous pouvez annuler à tout moment. Vous conserverez l'accès jusqu'à la fin de votre période de facturation. Vous pourrez exporter toutes vos données avant la fin de votre abonnement.",
    },
    {
        question: "Y a-t-il un support client ?",
        answer: "Oui, nous offrons un support par email pour tous les plans. Les plans Pro et Entreprise bénéficient d'un support prioritaire. Le plan Entreprise inclut également un support dédié 24/7.",
    },
    {
        question: "MyProPartner fonctionne-t-il sur mobile ?",
        answer: "Oui, MyProPartner est entièrement responsive et fonctionne parfaitement sur smartphone et tablette. Vous pouvez créer vos devis et factures depuis n'importe où.",
    },
];

export function FAQ() {
    return (
        <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
            <div className="max-w-4xl mx-auto">
                {/* Section header */}
                <div className="text-center space-y-4 mb-12">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                        Questions fréquentes
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        Tout ce que vous devez savoir sur MyProPartner
                    </p>
                </div>

                {/* FAQ Accordion */}
                <Accordion type="single" collapsible className="space-y-2">
                    {faqs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            value={`item-${index}`}
                            className="border border-border rounded-lg px-6 bg-card hover:border-primary/50 transition-colors"
                        >
                            <AccordionTrigger className="text-left hover:no-underline">
                                <span className="font-semibold">{faq.question}</span>
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>

                {/* Additional help */}
                <div className="text-center mt-12 p-6 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-border">
                    <h3 className="font-semibold text-lg mb-2">Vous avez d&apos;autres questions ?</h3>
                    <p className="text-muted-foreground mb-4">
                        Notre équipe est là pour vous aider
                    </p>
                    <a
                        href="mailto:support@mypropartner.fr"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        support@mypropartner.fr
                    </a>
                </div>
            </div>
        </section>
    );
}
