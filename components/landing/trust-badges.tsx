import { Shield, Lock, Server, CheckCircle } from "lucide-react";

export function TrustBadges() {
    const badges = [
        {
            icon: Shield,
            title: "Sécurité maximale",
            description: "Vos données sont chiffrées et sécurisées",
        },
        {
            icon: Lock,
            title: "RGPD conforme",
            description: "100% conforme aux réglementations européennes",
        },
        {
            icon: Server,
            title: "Hébergement France",
            description: "Serveurs basés en France pour vos données",
        },
        {
            icon: CheckCircle,
            title: "Sauvegarde auto",
            description: "Backup quotidien de toutes vos données",
        },
    ];

    return (
        <section className="py-20 px-6 sm:px-8 bg-white">
            <div className="max-w-[1120px] mx-auto">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-[40px] sm:text-[48px] font-semibold tracking-[-0.02em] text-black leading-[1.1]">
                        Vos données en sécurité
                    </h2>
                    <p className="text-[17px] text-black/60 max-w-[600px] mx-auto">
                        Nous prenons la sécurité et la confidentialité de vos données
                        très au sérieux.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {badges.map((badge, index) => {
                        const Icon = badge.icon;
                        return (
                            <div
                                key={index}
                                className="text-center space-y-4 p-6 rounded-2xl border border-black/[0.08] hover:border-black/[0.12] hover:shadow-lg hover:shadow-black/5 transition-all duration-300"
                            >
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-black/5">
                                    <Icon
                                        className="w-6 h-6 text-black"
                                        strokeWidth={2}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-[16px] font-semibold text-black">
                                        {badge.title}
                                    </h3>
                                    <p className="text-[13px] text-black/60 leading-relaxed">
                                        {badge.description}
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
