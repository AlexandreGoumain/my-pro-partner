import { CardSection } from "@/components/ui/card-section";
import { Separator } from "@/components/ui/separator";

export interface ArticlePricingSectionProps {
    prixHT: number;
    tva: number;
    className?: string;
}

export function ArticlePricingSection({
    prixHT,
    tva,
    className = "",
}: ArticlePricingSectionProps) {
    const montantTVA = prixHT * (tva / 100);
    const prixTTC = prixHT + montantTVA;

    return (
        <CardSection
            title="Tarification"
            description="Prix de vente et calculs automatiques"
            className={`border-black/8 shadow-sm ${className}`}
            titleClassName="text-[16px]"
            contentClassName="space-y-4"
        >
            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                    <p className="text-[14px] text-black/60">Prix HT</p>
                    <p className="text-[24px] font-bold tracking-[-0.02em] text-black">
                        {prixHT.toFixed(2)} €
                    </p>
                </div>
                <div className="space-y-1">
                    <p className="text-[14px] text-black/60">TVA</p>
                    <p className="text-[24px] font-bold tracking-[-0.02em] text-black">
                        {tva}%
                    </p>
                    <p className="text-[13px] text-black/40">
                        +{montantTVA.toFixed(2)} €
                    </p>
                </div>
                <div className="space-y-1">
                    <p className="text-[14px] text-black/60">Prix TTC</p>
                    <p className="text-[24px] font-bold tracking-[-0.02em] text-black">
                        {prixTTC.toFixed(2)} €
                    </p>
                </div>
            </div>

            <Separator className="bg-black/10" />

            <div className="space-y-2">
                <div className="flex justify-between text-[14px]">
                    <span className="text-black/60">Prix unitaire HT</span>
                    <span className="font-semibold text-black">
                        {prixHT.toFixed(2)} €
                    </span>
                </div>
                <div className="flex justify-between text-[14px]">
                    <span className="text-black/60">Montant TVA</span>
                    <span className="font-semibold text-black">
                        {montantTVA.toFixed(2)} €
                    </span>
                </div>
                <div className="flex justify-between text-[14px] font-semibold pt-2 border-t border-black/10">
                    <span className="text-black">Prix de vente TTC</span>
                    <span className="text-black">{prixTTC.toFixed(2)} €</span>
                </div>
            </div>
        </CardSection>
    );
}
