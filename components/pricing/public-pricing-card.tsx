import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { PlanFeature } from "@/lib/types/pricing";
import { PlanType } from "@/lib/pricing-config";

interface PublicPricingCardProps {
    name: string;
    planId: PlanType;
    description: string;
    price: number;
    priceLabel: string;
    savings?: number;
    popular?: boolean;
    features: PlanFeature[];
    isLoading: boolean;
    onSubscribe: (planId: PlanType) => void;
}

export function PublicPricingCard({
    name,
    planId,
    description,
    price,
    priceLabel,
    savings,
    popular = false,
    features,
    isLoading,
    onSubscribe,
}: PublicPricingCardProps) {
    const isFree = planId === "FREE";

    return (
        <Card
            className={cn(
                "relative p-8 border transition-all duration-200",
                popular
                    ? "border-black shadow-lg scale-105"
                    : "border-black/8 hover:border-black/20 shadow-sm"
            )}
        >
            {/* Badge Popular */}
            {popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-black text-white text-[12px] font-medium px-3 py-1 rounded-full">
                        Le plus populaire
                    </span>
                </div>
            )}

            {/* Nom du plan */}
            <div className="mb-6">
                <h3 className="text-[24px] font-semibold tracking-[-0.01em] text-black mb-2">
                    {name}
                </h3>
                <p className="text-[14px] text-black/60">{description}</p>
            </div>

            {/* Prix */}
            <div className="mb-6">
                <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-[40px] font-semibold tracking-[-0.02em] text-black">
                        {price}€
                    </span>
                    {price > 0 && (
                        <span className="text-[14px] text-black/60">
                            {priceLabel}
                        </span>
                    )}
                </div>
                {savings && savings > 0 && (
                    <p className="text-[13px] text-black/60">
                        Économisez {savings}€ par an
                    </p>
                )}
                {!isFree && (
                    <p className="text-[13px] text-black/60 mt-1">
                        Essai gratuit de 14 jours
                    </p>
                )}
            </div>

            {/* Bouton CTA */}
            <Button
                onClick={() => onSubscribe(planId)}
                disabled={isLoading}
                className={cn(
                    "w-full h-11 text-[14px] font-medium rounded-md mb-8 transition-all duration-200",
                    popular
                        ? "bg-black hover:bg-black/90 text-white shadow-sm"
                        : "border border-black/10 bg-white hover:bg-black/5 text-black"
                )}
            >
                {isLoading ? (
                    <>
                        <Spinner className="mr-2" />
                        Chargement...
                    </>
                ) : isFree ? (
                    "Commencer gratuitement"
                ) : (
                    `Obtenir ${name}`
                )}
            </Button>

            {/* Features */}
            <ul className="space-y-3">
                {features.map((feature, idx) => (
                    <li
                        key={idx}
                        className="flex items-start gap-3 text-[14px]"
                    >
                        <Check
                            className={cn(
                                "h-5 w-5 flex-shrink-0 mt-0.5",
                                feature.included
                                    ? "text-black"
                                    : "text-black/20"
                            )}
                            strokeWidth={2}
                        />
                        <span
                            className={cn(
                                feature.included
                                    ? "text-black"
                                    : "text-black/40 line-through"
                            )}
                        >
                            {feature.text}
                        </span>
                    </li>
                ))}
            </ul>
        </Card>
    );
}
