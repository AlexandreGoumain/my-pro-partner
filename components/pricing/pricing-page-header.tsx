"use client";

import { cn } from "@/lib/utils";
import { IntervalType } from "@/lib/types/pricing";
import { Sparkles } from "lucide-react";

interface PricingPageHeaderProps {
    interval: IntervalType;
    onIntervalChange: (interval: IntervalType) => void;
}

export function PricingPageHeader({ interval, onIntervalChange }: PricingPageHeaderProps) {
    return (
        <div className="text-center mb-12 pt-8">
            <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-black/5 border border-black/8 mb-6">
                <Sparkles className="w-4 h-4 text-black/60 mr-2" strokeWidth={2} />
                <span className="text-[13px] font-medium text-black/70">
                    Choisissez le plan parfait pour vous
                </span>
            </div>

            <h1 className="text-[42px] font-bold tracking-[-0.03em] text-black mb-4">
                Plans & Tarifs
            </h1>

            <p className="text-[16px] text-black/60 max-w-xl mx-auto leading-relaxed mb-8">
                Des tarifs simples et transparents pour accompagner votre croissance
            </p>

            <div className="inline-flex items-center gap-1 bg-black/5 p-1 rounded-lg border border-black/8">
                <button
                    onClick={() => onIntervalChange("month")}
                    className={cn(
                        "px-5 py-2.5 text-[14px] font-medium rounded-md transition-all duration-200",
                        interval === "month"
                            ? "bg-white text-black shadow-sm"
                            : "text-black/50 hover:text-black"
                    )}
                >
                    Mensuel
                </button>
                <button
                    onClick={() => onIntervalChange("year")}
                    className={cn(
                        "px-5 py-2.5 text-[14px] font-medium rounded-md transition-all duration-200 flex items-center gap-2",
                        interval === "year"
                            ? "bg-white text-black shadow-sm"
                            : "text-black/50 hover:text-black"
                    )}
                >
                    Annuel
                    <span className="text-[11px] bg-black text-white px-2 py-0.5 rounded-full font-semibold">
                        -17%
                    </span>
                </button>
            </div>
        </div>
    );
}
