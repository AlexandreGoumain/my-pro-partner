export function StatsSection() {
    const stats = [
        {
            value: "15h",
            label: "économisées par semaine",
            description: "en moyenne pour nos utilisateurs",
        },
        {
            value: "3x",
            label: "plus rapide",
            description: "création de devis vs Excel",
        },
        {
            value: "99.9%",
            label: "de disponibilité",
            description: "infrastructure sécurisée",
        },
        {
            value: "500+",
            label: "entreprises",
            description: "nous font confiance",
        },
    ];

    return (
        <section className="py-24 px-6 sm:px-8 bg-neutral-50 border-y border-black/[0.08]">
            <div className="max-w-[1120px] mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-[32px] sm:text-[40px] font-semibold tracking-[-0.02em] text-black mb-3">
                        Des résultats mesurables
                    </h2>
                    <p className="text-[17px] text-black/60 max-w-[600px] mx-auto">
                        Rejoignez des centaines d&apos;entreprises qui ont
                        transformé leur gestion
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center space-y-3">
                            <div className="text-[56px] sm:text-[64px] font-semibold tracking-[-0.03em] text-black leading-none">
                                {stat.value}
                            </div>
                            <div className="text-[16px] text-black font-medium tracking-[-0.01em]">
                                {stat.label}
                            </div>
                            <div className="text-[13px] text-black/40">
                                {stat.description}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
