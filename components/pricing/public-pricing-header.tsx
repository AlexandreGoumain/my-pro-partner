interface PublicPricingHeaderProps {
    title?: string;
    description?: string;
}

export function PublicPricingHeader({
    title = "Choisissez votre plan",
    description = "Démarrez gratuitement, upgradez quand vous êtes prêt. Tous les plans incluent 14 jours d'essai gratuit.",
}: PublicPricingHeaderProps) {
    return (
        <div className="text-center mb-8">
            <h1 className="text-[48px] font-semibold tracking-[-0.02em] text-black mb-4">
                {title}
            </h1>
            <p className="text-[18px] text-black/60 max-w-2xl mx-auto">
                {description}
            </p>
        </div>
    );
}
