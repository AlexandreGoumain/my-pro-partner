import { Check, X } from "lucide-react";

export function Comparison() {
    const comparisons = [
        {
            feature: "Prix mensuel",
            traditional: "75-300€",
            myProPartner: "Dès 29€",
        },
        {
            feature: "Installation",
            traditional: "2-4 semaines",
            myProPartner: "5 minutes",
        },
        {
            feature: "Formation",
            traditional: "Payante (500-2000€)",
            myProPartner: "Gratuite incluse",
        },
        {
            feature: "Support",
            traditional: "Lun-Ven 9h-17h",
            myProPartner: "7j/7 chat en direct",
        },
        {
            feature: "Assistant IA",
            traditional: false,
            myProPartner: true,
        },
        {
            feature: "Mises à jour",
            traditional: "Payantes",
            myProPartner: "Gratuites",
        },
        {
            feature: "Engagement",
            traditional: "12-24 mois",
            myProPartner: "Sans engagement",
        },
        {
            feature: "Migration données",
            traditional: "Payante (1000€+)",
            myProPartner: "Gratuite",
        },
    ];

    return (
        <section
            className="px-6 bg-white scroll-fade-in"
            style={{
                paddingTop: 'var(--section-padding-top-large)',
                paddingBottom: 'var(--section-padding-bottom-large)'
            }}
        >
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center" style={{ marginBottom: 'var(--spacing-2xl)' }}>
                    <h2 className="text-[48px] font-semibold tracking-tight-premium text-black mb-4">
                        Pourquoi nous choisir ?
                    </h2>
                    <p className="text-[18px] text-black/50 tracking-wide-premium">
                        MyProPartner vs les ERP traditionnels
                    </p>
                </div>

                {/* Comparison Table */}
                <div className="border border-black/[0.08] rounded-2xl overflow-hidden shadow-stripe">
                    {/* Table Header */}
                    <div className="grid grid-cols-3 bg-black/[0.02] border-b border-black/[0.06]">
                        <div className="p-4"></div>
                        <div className="p-4 text-center border-l border-black/[0.06]">
                            <span className="text-[13px] font-medium text-black/50 tracking-wide-premium">
                                ERP traditionnels
                            </span>
                        </div>
                        <div className="p-4 text-center border-l border-black/[0.06] bg-black">
                            <span className="text-[13px] font-semibold text-white tracking-wide-premium">
                                MyProPartner
                            </span>
                        </div>
                    </div>

                    {/* Table Rows */}
                    {comparisons.map((item, index) => (
                        <div
                            key={index}
                            className={`grid grid-cols-3 ${
                                index !== comparisons.length - 1 ? "border-b border-black/[0.06]" : ""
                            }`}
                        >
                            <div className="p-4">
                                <span className="text-[14px] font-medium text-black tracking-wide-premium">
                                    {item.feature}
                                </span>
                            </div>
                            <div className="p-4 text-center border-l border-black/[0.06]">
                                {typeof item.traditional === "boolean" ? (
                                    item.traditional ? (
                                        <Check className="w-5 h-5 text-black/40 mx-auto" strokeWidth={2} />
                                    ) : (
                                        <X className="w-5 h-5 text-black/20 mx-auto" strokeWidth={2} />
                                    )
                                ) : (
                                    <span className="text-[14px] text-black/60 tracking-wide-premium">{item.traditional}</span>
                                )}
                            </div>
                            <div className="p-4 text-center border-l border-black/[0.06] bg-black/[0.01]">
                                {typeof item.myProPartner === "boolean" ? (
                                    item.myProPartner ? (
                                        <Check className="w-5 h-5 text-black mx-auto" strokeWidth={2.5} />
                                    ) : (
                                        <X className="w-5 h-5 text-black/20 mx-auto" strokeWidth={2} />
                                    )
                                ) : (
                                    <span className="text-[14px] font-semibold text-black tracking-wide-premium">
                                        {item.myProPartner}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom note */}
                <div className="text-center" style={{ marginTop: 'var(--spacing-lg)' }}>
                    <p className="text-[13px] text-black/40 tracking-wide-premium">
                        Prix moyens constatés sur le marché français en 2025
                    </p>
                </div>
            </div>
        </section>
    );
}
