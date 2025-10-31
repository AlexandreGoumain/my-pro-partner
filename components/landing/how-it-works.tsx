import { Download, Zap, Rocket } from "lucide-react";

export function HowItWorks() {
    const steps = [
        {
            icon: Download,
            number: "01",
            title: "Créez votre compte",
            description:
                "Inscription en 2 minutes. Aucune carte bancaire requise pour l'essai gratuit.",
        },
        {
            icon: Zap,
            number: "02",
            title: "Configurez votre espace",
            description:
                "Importez vos données existantes et personnalisez votre interface en quelques clics.",
        },
        {
            icon: Rocket,
            number: "03",
            title: "Lancez-vous",
            description:
                "Créez votre première facture et profitez de toutes les fonctionnalités immédiatement.",
        },
    ];

    return (
        <section className="py-32 px-6 sm:px-8 bg-white">
            <div className="max-w-[1120px] mx-auto">
                <div className="text-center space-y-4 mb-20">
                    <h2 className="text-[40px] sm:text-[48px] font-semibold tracking-[-0.02em] text-black leading-[1.1]">
                        Démarrez en quelques minutes
                    </h2>
                    <p className="text-[17px] text-black/60 max-w-[600px] mx-auto">
                        Pas de configuration compliquée. Commencez à gérer votre
                        entreprise immédiatement.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={index}
                                className="relative text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700"
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                {/* Connecting line */}
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-[2px] bg-black/[0.08]" />
                                )}

                                <div className="relative">
                                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-black text-white mb-4">
                                        <Icon className="w-9 h-9" strokeWidth={2} />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
                                        <span className="text-[13px] font-bold text-black/30">
                                            {step.number}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-[20px] font-semibold text-black tracking-[-0.01em]">
                                        {step.title}
                                    </h3>
                                    <p className="text-[14px] text-black/60 leading-relaxed max-w-[300px] mx-auto">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
