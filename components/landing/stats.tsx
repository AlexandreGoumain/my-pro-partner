export function Stats() {
    const stats = [
        { value: "10min", label: "Installation complète", detail: "vs 2-4 semaines ERP classiques" },
        { value: "40h", label: "Gagnées par mois", detail: "Automatisation IA" },
        { value: "8x", label: "Retour sur investissement", detail: "Économies réelles" },
        { value: "99.9%", label: "Disponibilité", detail: "Infrastructure redondante" },
    ];

    return (
        <section
            className="px-6 border-y border-black/[0.06] bg-gradient-to-b from-white to-black/[0.01] scroll-fade-in"
            style={{
                paddingTop: 'var(--section-padding-top)',
                paddingBottom: 'var(--section-padding-bottom)'
            }}
        >
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 'var(--spacing-2xl)' }}>
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div
                                className="text-[56px] font-semibold tracking-tight-premium text-black leading-none mb-2"
                            >
                                {stat.value}
                            </div>
                            <div className="text-[15px] text-black font-semibold mb-1 tracking-wide-premium">
                                {stat.label}
                            </div>
                            <div className="text-[13px] text-black/40 tracking-wide-premium">
                                {stat.detail}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
