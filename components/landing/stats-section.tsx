export function StatsSection() {
    const stats = [
        { value: "14 jours", label: "Essai gratuit" },
        { value: "99.9%", label: "Uptime garanti" },
        { value: "24/7", label: "Support" },
        { value: "0€", label: "Sans carte bancaire" },
    ];

    return (
        <section className="py-20 px-6 sm:px-8 bg-neutral-50 border-y border-black/[0.08]">
            <div className="max-w-[1120px] mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="text-center space-y-2"
                        >
                            <div className="text-[48px] sm:text-[56px] font-semibold tracking-[-0.03em] text-black leading-none">
                                {stat.value}
                            </div>
                            <div className="text-[14px] text-black/60 font-medium">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
