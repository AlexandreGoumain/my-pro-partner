import { Check } from "lucide-react";

export interface PricingIdealForSectionProps {
    ideal: string[];
}

export function PricingIdealForSection({ ideal }: PricingIdealForSectionProps) {
    return (
        <section className="py-20 px-6 sm:px-8 bg-neutral-50 border-t border-black/[0.08]">
            <div className="max-w-[1120px] mx-auto">
                <h2 className="text-[32px] font-semibold tracking-[-0.02em] text-black mb-8">
                    Idéal pour
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ideal.map((item, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 p-4 bg-white rounded-lg border border-black/[0.08]"
                        >
                            <Check
                                className="w-5 h-5 text-black flex-shrink-0"
                                strokeWidth={2.5}
                            />
                            <span className="text-[15px] text-black/80">
                                {item}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
