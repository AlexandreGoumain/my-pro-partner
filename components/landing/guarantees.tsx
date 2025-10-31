import { CreditCard, RotateCcw, Clock, HeadphonesIcon } from "lucide-react";

export function Guarantees() {
    const guarantees = [
        {
            icon: CreditCard,
            title: "Sans engagement",
            description: "Aucune carte bancaire requise pendant l'essai",
        },
        {
            icon: RotateCcw,
            title: "Annulation facile",
            description: "Résiliez à tout moment en un clic",
        },
        {
            icon: Clock,
            title: "14 jours gratuits",
            description: "Testez toutes les fonctionnalités sans limitation",
        },
        {
            icon: HeadphonesIcon,
            title: "Support réactif",
            description: "Assistance en français par chat et email",
        },
    ];

    return (
        <section className="py-20 px-6 sm:px-8 bg-neutral-50 border-y border-black/[0.08]">
            <div className="max-w-[1120px] mx-auto">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-[40px] sm:text-[48px] font-semibold tracking-[-0.02em] text-black leading-[1.1]">
                        Essayez sans risque
                    </h2>
                    <p className="text-[17px] text-black/60 max-w-[600px] mx-auto">
                        Nous voulons que vous soyez 100% satisfait. C'est pourquoi nous
                        offrons ces garanties.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {guarantees.map((guarantee, index) => {
                        const Icon = guarantee.icon;
                        return (
                            <div
                                key={index}
                                className="flex flex-col items-center text-center space-y-4 p-6"
                            >
                                <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center">
                                    <Icon
                                        className="w-7 h-7 text-white"
                                        strokeWidth={2}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-[16px] font-semibold text-black">
                                        {guarantee.title}
                                    </h3>
                                    <p className="text-[13px] text-black/60 leading-relaxed">
                                        {guarantee.description}
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
