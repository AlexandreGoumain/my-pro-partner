export function PricingFooter() {
    return (
        <div className="text-center mt-16 mb-8">
            <p className="text-[14px] text-black/50">
                Tous les plans incluent un essai gratuit de 14 jours. Aucune
                carte bancaire requise.
            </p>
            <p className="text-[13px] text-black/40 mt-2">
                Questions ? Contactez-nous !{" "}
                <a
                    href="mailto:support@mypropartner.com"
                    className="text-black/60 hover:text-black underline"
                >
                    support@mypropartner.com
                </a>
            </p>
        </div>
    );
}
