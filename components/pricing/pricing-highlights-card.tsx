import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

export interface PricingHighlightsCardProps {
    highlights: string[];
}

export function PricingHighlightsCard({
    highlights,
}: PricingHighlightsCardProps) {
    return (
        <Card className="p-10 bg-white border-black/[0.08]">
            <h3 className="text-[20px] font-semibold text-black mb-6">
                Points clés
            </h3>
            <ul className="space-y-4">
                {highlights.map((highlight, i) => (
                    <li key={i} className="flex items-center gap-3">
                        <Check
                            className="w-5 h-5 text-black flex-shrink-0"
                            strokeWidth={2.5}
                        />
                        <span className="text-[15px] text-black/80">
                            {highlight}
                        </span>
                    </li>
                ))}
            </ul>
        </Card>
    );
}
