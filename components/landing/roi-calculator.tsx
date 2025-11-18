"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator, TrendingUp, Clock, DollarSign, Zap } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

// Custom Slider Component
function CustomSlider({ value, onChange, min, max, step }: {
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step: number;
}) {
    return (
        <div className="relative w-full">
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 bg-black/[0.08] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md hover:[&::-webkit-slider-thumb]:bg-black/90 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md hover:[&::-moz-range-thumb]:bg-black/90"
                style={{
                    background: `linear-gradient(to right, black ${((value - min) / (max - min)) * 100}%, rgba(0,0,0,0.08) ${((value - min) / (max - min)) * 100}%)`
                }}
            />
        </div>
    );
}

export function ROICalculator() {
    const [devisPerMonth, setDevisPerMonth] = useState(20);
    const [timePerDevis, setTimePerDevis] = useState(30);
    const [hourlyRate, setHourlyRate] = useState(50);
    const [unpaidRate, setUnpaidRate] = useState(15);

    // Calculations
    const timeBeforeMinutes = devisPerMonth * timePerDevis;
    const timeAfterMinutes = devisPerMonth * 2; // 2 min avec MyProPartner
    const timeSavedMinutes = timeBeforeMinutes - timeAfterMinutes;
    const timeSavedHours = Math.round(timeSavedMinutes / 60);

    const moneySavedAdmin = Math.round((timeSavedHours * hourlyRate));

    const unpaidBefore = Math.round((devisPerMonth * 300 * unpaidRate) / 100); // 300€ devis moyen
    const unpaidAfter = Math.round(unpaidBefore * 0.4); // -60% avec relances auto
    const moneySavedUnpaid = unpaidBefore - unpaidAfter;

    const totalMonthlySavings = moneySavedAdmin + moneySavedUnpaid;
    const planCost = 79; // Plan PRO
    const netMonthlyGain = totalMonthlySavings - planCost;
    const yearlyGain = netMonthlyGain * 12;
    const roi = Math.round((netMonthlyGain / planCost) * 100);

    return (
        <section className="relative py-32 px-6 sm:px-8 bg-gradient-to-b from-neutral-50/50 via-white to-neutral-50/50 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-black/[0.015] rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-black/[0.015] rounded-full blur-3xl" />
            </div>

            <div className="max-w-[1200px] mx-auto relative">
                {/* Header */}
                <div className="text-center space-y-5 mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/[0.03] border border-black/[0.08]">
                        <Calculator className="w-4 h-4 text-black/60" strokeWidth={2} />
                        <span className="text-[13px] text-black/60 font-medium">
                            Calculateur ROI interactif
                        </span>
                    </div>

                    <h2 className="text-[48px] sm:text-[64px] font-semibold tracking-[-0.03em] text-black leading-[1.05]">
                        Calculez votre ROI
                        <br />
                        <span className="text-black/60">en temps réel.</span>
                    </h2>

                    <p className="text-[19px] text-black/60 max-w-[680px] mx-auto leading-[1.5]">
                        Ajustez les curseurs selon votre activité et découvrez combien vous pouvez gagner chaque mois avec MyProPartner.
                    </p>
                </div>

                <div className="grid lg:grid-cols-[1fr,400px] gap-8">
                    {/* Left: Inputs */}
                    <Card className="p-8 lg:p-10 bg-white border-black/[0.08] shadow-lg">
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-[24px] font-semibold text-black mb-6">
                                    Votre activité actuelle
                                </h3>
                                <p className="text-[15px] text-black/60 mb-8">
                                    Personnalisez les paramètres pour obtenir une estimation précise de vos gains potentiels.
                                </p>
                            </div>

                            {/* Slider 1 */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-[15px] font-medium text-black">
                                        Nombre de devis par mois
                                    </label>
                                    <span className="text-[20px] font-semibold text-black">
                                        {devisPerMonth}
                                    </span>
                                </div>
                                <CustomSlider
                                    value={devisPerMonth}
                                    onChange={setDevisPerMonth}
                                    min={5}
                                    max={100}
                                    step={5}
                                />
                                <p className="text-[13px] text-black/50">
                                    Combien de devis créez-vous en moyenne chaque mois ?
                                </p>
                            </div>

                            {/* Slider 2 */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-[15px] font-medium text-black">
                                        Temps par devis (minutes)
                                    </label>
                                    <span className="text-[20px] font-semibold text-black">
                                        {timePerDevis} min
                                    </span>
                                </div>
                                <CustomSlider
                                    value={timePerDevis}
                                    onChange={setTimePerDevis}
                                    min={10}
                                    max={60}
                                    step={5}
                                />
                                <p className="text-[13px] text-black/50">
                                    Temps moyen pour créer un devis actuellement
                                </p>
                            </div>

                            {/* Slider 3 */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-[15px] font-medium text-black">
                                        Taux horaire (€)
                                    </label>
                                    <span className="text-[20px] font-semibold text-black">
                                        {hourlyRate}€
                                    </span>
                                </div>
                                <CustomSlider
                                    value={hourlyRate}
                                    onChange={setHourlyRate}
                                    min={20}
                                    max={150}
                                    step={10}
                                />
                                <p className="text-[13px] text-black/50">
                                    Valeur de votre temps (ou de vos employés) par heure
                                </p>
                            </div>

                            {/* Slider 4 */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-[15px] font-medium text-black">
                                        Taux d'impayés (%)
                                    </label>
                                    <span className="text-[20px] font-semibold text-black">
                                        {unpaidRate}%
                                    </span>
                                </div>
                                <CustomSlider
                                    value={unpaidRate}
                                    onChange={setUnpaidRate}
                                    min={0}
                                    max={40}
                                    step={5}
                                />
                                <p className="text-[13px] text-black/50">
                                    Pourcentage de factures payées en retard ou jamais
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Right: Results */}
                    <div className="space-y-6">
                        {/* Main ROI Card */}
                        <Card className="p-8 bg-gradient-to-br from-black via-black to-black/90 border-black text-white">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <p className="text-[13px] text-white/60 font-medium uppercase tracking-wider">
                                        Votre ROI mensuel
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-[56px] font-bold tracking-[-0.03em] leading-none">
                                            {roi}%
                                        </span>
                                    </div>
                                    <p className="text-[14px] text-white/70">
                                        Retour sur investissement
                                    </p>
                                </div>

                                <div className="pt-6 border-t border-white/[0.1] space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[14px] text-white/70">Coût MyProPartner PRO</span>
                                        <span className="text-[18px] font-semibold">-{planCost}€</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[14px] text-white/70">Économies totales</span>
                                        <span className="text-[18px] font-semibold text-green-400">+{totalMonthlySavings}€</span>
                                    </div>
                                    <div className="pt-4 border-t border-white/[0.1]">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[15px] font-semibold">Gain net mensuel</span>
                                            <span className="text-[24px] font-bold text-green-400">+{netMonthlyGain}€</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/[0.1]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="w-4 h-4 text-green-400" strokeWidth={2} />
                                        <span className="text-[13px] text-white/70">Sur 1 an</span>
                                    </div>
                                    <p className="text-[32px] font-bold text-green-400">
                                        +{yearlyGain.toLocaleString()}€
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Breakdown Cards */}
                        <div className="space-y-3">
                            <Card className="p-5 bg-white border-black/[0.08]">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-black/[0.03] border border-black/[0.08]">
                                        <Clock className="w-5 h-5 text-black/60" strokeWidth={2} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[13px] text-black/60 font-medium mb-1">
                                            Temps gagné
                                        </p>
                                        <p className="text-[20px] font-semibold text-black mb-1">
                                            {timeSavedHours}h/mois
                                        </p>
                                        <p className="text-[13px] text-black/60">
                                            Valeur: {moneySavedAdmin}€
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-5 bg-white border-black/[0.08]">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-black/[0.03] border border-black/[0.08]">
                                        <DollarSign className="w-5 h-5 text-black/60" strokeWidth={2} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[13px] text-black/60 font-medium mb-1">
                                            Impayés récupérés
                                        </p>
                                        <p className="text-[20px] font-semibold text-black mb-1">
                                            -{Math.round((1 - unpaidAfter/unpaidBefore) * 100)}%
                                        </p>
                                        <p className="text-[13px] text-black/60">
                                            Économie: {moneySavedUnpaid}€/mois
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-5 bg-white border-black/[0.08]">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-black/[0.03] border border-black/[0.08]">
                                        <Zap className="w-5 h-5 text-black/60" strokeWidth={2} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[13px] text-black/60 font-medium mb-1">
                                            Rentabilisé en
                                        </p>
                                        <p className="text-[20px] font-semibold text-black mb-1">
                                            {Math.max(1, Math.round(planCost / totalMonthlySavings * 30))} jours
                                        </p>
                                        <p className="text-[13px] text-black/60">
                                            Puis pure profit
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* CTA */}
                        <Link href="/auth/register">
                            <Button className="w-full bg-black hover:bg-black/90 text-white h-12 text-[15px] font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group">
                                Commencer gratuitement
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </Button>
                        </Link>
                        <p className="text-[12px] text-black/50 text-center">
                            14 jours gratuits • Sans carte bancaire
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
