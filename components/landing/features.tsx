import { FileText, Users, Package, TrendingUp, CreditCard, Calendar } from "lucide-react";

export function Features() {
    const features = [
        {
            icon: FileText,
            title: "Devis & Factures",
            description: "Documents professionnels en 2 minutes",
            detail: "Conversion devis → facture en un clic",
        },
        {
            icon: Users,
            title: "CRM Intelligent",
            description: "Jusqu'à 5000 clients",
            detail: "Segmentation avancée & historique complet",
        },
        {
            icon: Package,
            title: "Gestion de Stock",
            description: "Inventaire temps réel multi-magasin",
            detail: "Alertes automatiques de rupture",
        },
        {
            icon: TrendingUp,
            title: "Analytics IA",
            description: "Tableaux de bord temps réel",
            detail: "Prédictions pour anticiper vos ventes",
        },
        {
            icon: CreditCard,
            title: "Paiements",
            description: "Carte, virement, espèces",
            detail: "Suivi automatique des encaissements",
        },
        {
            icon: Calendar,
            title: "Planning",
            description: "Rendez-vous & missions",
            detail: "Sync Google Calendar",
        },
    ];

    return (
        <section
            id="features"
            className="px-6 bg-white scroll-fade-in"
            style={{
                paddingTop: 'var(--section-padding-top-large)',
                paddingBottom: 'var(--section-padding-bottom-large)'
            }}
        >
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center" style={{ marginBottom: 'var(--spacing-2xl)' }}>
                    <h2 className="text-[48px] font-semibold tracking-tight-premium text-black mb-4">
                        Tout ce dont vous avez besoin
                    </h2>
                    <p className="text-[18px] text-black/50 max-w-[600px] mx-auto tracking-wide-premium">
                        Une suite complète pour gérer votre entreprise.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3" style={{ gap: 'var(--row-gap-small)' }}>
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="p-6 rounded-xl border border-black/[0.06] bg-white card-shadow shadow-stripe-hover transition-all ease-premium"
                                style={{ transitionDuration: '0.4s' }}
                            >
                                <div className="w-12 h-12 rounded-lg bg-black/[0.04] flex items-center justify-center mb-4">
                                    <Icon className="w-6 h-6 text-black/60" strokeWidth={2} />
                                </div>
                                <h3 className="text-[17px] font-semibold text-black mb-2 tracking-wide-premium">
                                    {feature.title}
                                </h3>
                                <p className="text-[15px] text-black/70 leading-relaxed mb-2">
                                    {feature.description}
                                </p>
                                <p className="text-[13px] text-black/40 tracking-wide-premium">
                                    {feature.detail}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
