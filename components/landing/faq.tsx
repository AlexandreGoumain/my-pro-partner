"use client";

const faqs = [
    {
        question: "Puis-je essayer gratuitement ?",
        answer: "Oui. Nous offrons un essai gratuit de 14 jours sans carte bancaire requise.",
    },
    {
        question: "Mes données sont-elles sécurisées ?",
        answer: "Absolument. Nous utilisons un cryptage de niveau bancaire et des sauvegardes quotidiennes.",
    },
    {
        question: "Puis-je importer mes données existantes ?",
        answer: "Oui. Nous fournissons des outils d'import et un support pour la migration.",
    },
    {
        question: "Combien d'utilisateurs peuvent accéder au compte ?",
        answer: "Cela dépend de votre plan. Démarrage permet 1 utilisateur, Pro permet 5 utilisateurs.",
    },
    {
        question: "Que se passe-t-il si j'annule ?",
        answer: "Vous pouvez annuler à tout moment et exporter toutes vos données.",
    },
];

export function FAQ() {
    return (
        <section className="py-32 px-6 sm:px-8 bg-neutral-50">
            <div className="max-w-[840px] mx-auto">
                <div className="text-center space-y-5 mb-24">
                    <h2 className="text-[48px] sm:text-[56px] font-semibold tracking-[-0.02em] text-black leading-[1.05]">
                        FAQ
                    </h2>
                </div>

                <div className="space-y-12">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="space-y-4 border-b border-black/[0.08] pb-12 last:border-0 last:pb-0"
                        >
                            <h3 className="text-[24px] font-semibold text-black tracking-[-0.01em]">
                                {faq.question}
                            </h3>
                            <p className="text-[17px] text-black/60 leading-[1.5] tracking-[-0.01em]">
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
