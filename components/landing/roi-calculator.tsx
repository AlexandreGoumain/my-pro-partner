"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ROICalculator() {
    const [hoursPerWeek, setHoursPerWeek] = useState(15);
    const [hourlyRate, setHourlyRate] = useState(45);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.1 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    // Calculs basés sur 60% de temps économisé
    const percentSaved = 0.6;
    const timeSavedPerWeek = Math.round(hoursPerWeek * percentSaved);
    const timeSavedPerYear = timeSavedPerWeek * 52;
    const moneySavedPerYear = timeSavedPerYear * hourlyRate;
    const moneySavedPerMonth = Math.round(moneySavedPerYear / 12);

    return (
        <section ref={ref} className="py-24 px-6 sm:px-8 bg-neutral-50 relative overflow-hidden">
            {/* Subtle background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-radial from-black/[0.02] to-transparent rounded-full" />
            </div>

            <div className="max-w-[800px] mx-auto relative">
                {/* Header */}
                <div
                    className={`text-center space-y-4 mb-12 transition-all duration-700 ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                >
                    <p className="text-[13px] font-semibold text-black/40 uppercase tracking-widest">
                        Calculateur
                    </p>
                    <h2 className="text-[36px] sm:text-[44px] font-bold tracking-[-0.02em] text-black leading-[1.1]">
                        Calculez vos économies
                    </h2>
                    <p className="text-[17px] text-black/50 max-w-[450px] mx-auto">
                        Découvrez combien de temps et d&apos;argent vous pouvez récupérer.
                    </p>
                </div>

                {/* Calculator Card */}
                <div
                    className={`rounded-2xl bg-white border border-black/[0.06] shadow-sm overflow-hidden transition-all duration-700 delay-200 ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                >
                    {/* Sliders Section */}
                    <div className="p-8 space-y-8">
                        {/* Hours per week */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-[14px] text-black/60">
                                    Heures d&apos;admin par semaine
                                </label>
                                <span className="text-[28px] font-bold text-black tracking-[-0.02em]">{hoursPerWeek}h</span>
                            </div>
                            <div className="relative">
                                <input
                                    type="range"
                                    value={hoursPerWeek}
                                    onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                                    min={5}
                                    max={40}
                                    step={1}
                                    className="w-full h-1.5 bg-black/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:cursor-pointer"
                                />
                            </div>
                            <div className="flex justify-between text-[12px] text-black/30">
                                <span>5h</span>
                                <span>40h</span>
                            </div>
                        </div>

                        {/* Hourly rate */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-[14px] text-black/60">
                                    Valeur de votre heure
                                </label>
                                <span className="text-[28px] font-bold text-black tracking-[-0.02em]">{hourlyRate}€</span>
                            </div>
                            <div className="relative">
                                <input
                                    type="range"
                                    value={hourlyRate}
                                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                                    min={20}
                                    max={150}
                                    step={5}
                                    className="w-full h-1.5 bg-black/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:cursor-pointer"
                                />
                            </div>
                            <div className="flex justify-between text-[12px] text-black/30">
                                <span>20€</span>
                                <span>150€</span>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-black/[0.06]" />

                    {/* Results Section - Dark */}
                    <div className="bg-black text-white p-8">
                        {/* Results Grid */}
                        <div className="grid grid-cols-3 gap-6 mb-8">
                            <div className="text-center">
                                <p className="text-[36px] sm:text-[42px] font-bold tracking-[-0.02em]">
                                    {timeSavedPerWeek}h
                                </p>
                                <p className="text-[13px] text-white/50 mt-1">par semaine</p>
                            </div>
                            <div className="text-center border-x border-white/10">
                                <p className="text-[36px] sm:text-[42px] font-bold tracking-[-0.02em]">
                                    {moneySavedPerMonth.toLocaleString("fr-FR")}€
                                </p>
                                <p className="text-[13px] text-white/50 mt-1">par mois</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[36px] sm:text-[42px] font-bold tracking-[-0.02em]">
                                    {moneySavedPerYear.toLocaleString("fr-FR")}€
                                </p>
                                <p className="text-[13px] text-white/50 mt-1">par an</p>
                            </div>
                        </div>

                        {/* Summary */}
                        <p className="text-[14px] text-white/40 text-center mb-6">
                            {timeSavedPerYear} heures par an, soit{" "}
                            <span className="text-white/70 font-medium">
                                {Math.round(timeSavedPerYear / 8)} jours de travail
                            </span>{" "}
                            récupérés.
                        </p>

                        {/* CTA */}
                        <Link href="/waitlist">
                            <Button className="w-full h-12 bg-white hover:bg-white/90 text-black text-[14px] font-medium rounded-lg group">
                                Commencer à économiser
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Bottom note */}
                <div
                    className={`mt-6 text-center transition-all duration-700 delay-500 ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                >
                    <p className="text-[12px] text-black/40">
                        Basé sur une économie de 60% du temps administratif grâce à l&apos;automatisation.
                    </p>
                </div>
            </div>
        </section>
    );
}
