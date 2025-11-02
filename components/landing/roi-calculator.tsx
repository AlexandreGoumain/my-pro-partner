"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp, Clock, DollarSign, Zap } from "lucide-react";
import { useState } from "react";

export function ROICalculator() {
    const [hoursPerWeek, setHoursPerWeek] = useState(20);
    const [hourlyRate, setHourlyRate] = useState(50);
    const [employees, setEmployees] = useState(1);

    // Calculs
    const timeSavedPerWeek = 15; // heures économisées avec MyProPartner
    const timeSavedPerMonth = timeSavedPerWeek * 4;
    const timeSavedPerYear = timeSavedPerMonth * 12;

    const moneySavedPerMonth = timeSavedPerMonth * hourlyRate * employees;
    const moneySavedPerYear = moneySavedPerMonth * 12;

    const planCostPerMonth = 49; // Plan Pro
    const planCostPerYear = planCostPerMonth * 12;

    const netSavingsPerMonth = moneySavedPerMonth - planCostPerMonth;
    const netSavingsPerYear = moneySavedPerYear - planCostPerYear;

    const roi = ((netSavingsPerYear / planCostPerYear) * 100).toFixed(0);

    return (
        <section className="py-32 px-6 sm:px-8 bg-neutral-50">
            <div className="max-w-[1000px] mx-auto">
                <div className="text-center space-y-5 mb-16">
                    <h2 className="text-[48px] sm:text-[56px] font-semibold tracking-[-0.02em] text-black leading-[1.05]">
                        Calculez votre retour sur investissement
                    </h2>
                    <p className="text-[19px] text-black/60 max-w-[680px] mx-auto leading-[1.5] tracking-[-0.01em]">
                        Découvrez combien MyProPartner peut vous faire économiser chaque année
                    </p>
                </div>

                <Card className="p-8 sm:p-12 bg-white border border-black/[0.08]">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Inputs */}
                        <div className="space-y-8">
                            <h3 className="text-[24px] font-semibold text-black tracking-[-0.01em]">
                                Vos informations
                            </h3>

                            {/* Hours per week */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-[14px] font-medium text-black/70">
                                        Heures/semaine sur la gestion admin
                                    </label>
                                    <span className="text-[20px] font-semibold text-black">
                                        {hoursPerWeek}h
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="5"
                                    max="40"
                                    step="1"
                                    value={hoursPerWeek}
                                    onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                                    className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer slider"
                                />
                            </div>

                            {/* Hourly rate */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-[14px] font-medium text-black/70">
                                        Taux horaire de votre temps
                                    </label>
                                    <span className="text-[20px] font-semibold text-black">
                                        {hourlyRate}€/h
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="20"
                                    max="200"
                                    step="5"
                                    value={hourlyRate}
                                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                                    className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer slider"
                                />
                            </div>

                            {/* Employees */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-[14px] font-medium text-black/70">
                                        Nombre de personnes dans l'équipe
                                    </label>
                                    <span className="text-[20px] font-semibold text-black">
                                        {employees}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    step="1"
                                    value={employees}
                                    onChange={(e) => setEmployees(Number(e.target.value))}
                                    className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer slider"
                                />
                            </div>

                            <div className="pt-4 border-t border-black/[0.08]">
                                <p className="text-[12px] text-black/40 leading-relaxed">
                                    Ces calculs sont basés sur des données moyennes de nos utilisateurs.
                                    Les résultats peuvent varier selon votre activité.
                                </p>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="space-y-6">
                            <h3 className="text-[24px] font-semibold text-black tracking-[-0.01em]">
                                Vos économies avec MyProPartner
                            </h3>

                            <div className="space-y-4">
                                {/* Time saved */}
                                <Card className="p-5 bg-blue-500/5 border border-blue-500/20">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                            <Clock className="w-5 h-5 text-blue-700" strokeWidth={2} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[13px] text-blue-700/60 font-medium mb-1">
                                                Temps économisé
                                            </p>
                                            <p className="text-[28px] font-semibold text-blue-700 tracking-[-0.02em]">
                                                {timeSavedPerYear}h<span className="text-[16px] text-blue-700/60">/an</span>
                                            </p>
                                            <p className="text-[12px] text-blue-700/50 mt-1">
                                                Soit {timeSavedPerMonth}h par mois
                                            </p>
                                        </div>
                                    </div>
                                </Card>

                                {/* Money saved */}
                                <Card className="p-5 bg-green-500/5 border border-green-500/20">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                                            <DollarSign className="w-5 h-5 text-green-700" strokeWidth={2} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[13px] text-green-700/60 font-medium mb-1">
                                                Valeur du temps économisé
                                            </p>
                                            <p className="text-[28px] font-semibold text-green-700 tracking-[-0.02em]">
                                                {moneySavedPerYear.toLocaleString()}€<span className="text-[16px] text-green-700/60">/an</span>
                                            </p>
                                            <p className="text-[12px] text-green-700/50 mt-1">
                                                Soit {moneySavedPerMonth.toLocaleString()}€ par mois
                                            </p>
                                        </div>
                                    </div>
                                </Card>

                                {/* Net savings */}
                                <Card className="p-5 bg-purple-500/5 border border-purple-500/20">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                                            <Zap className="w-5 h-5 text-purple-700" strokeWidth={2} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[13px] text-purple-700/60 font-medium mb-1">
                                                Économie nette (après abonnement)
                                            </p>
                                            <p className="text-[28px] font-semibold text-purple-700 tracking-[-0.02em]">
                                                {netSavingsPerYear.toLocaleString()}€<span className="text-[16px] text-purple-700/60">/an</span>
                                            </p>
                                            <p className="text-[12px] text-purple-700/50 mt-1">
                                                Soit {netSavingsPerMonth.toLocaleString()}€ par mois
                                            </p>
                                        </div>
                                    </div>
                                </Card>

                                {/* ROI */}
                                <Card className="p-6 bg-black border-black">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                                            <TrendingUp className="w-6 h-6 text-white" strokeWidth={2} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[13px] text-white/60 font-medium mb-2">
                                                Retour sur investissement
                                            </p>
                                            <p className="text-[48px] font-semibold text-white tracking-[-0.03em] leading-none">
                                                {roi}%
                                            </p>
                                            <p className="text-[13px] text-white/50 mt-3">
                                                Pour chaque euro investi, vous économisez {(Number(roi) / 100).toFixed(1)}€
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            <div className="pt-4">
                                <a
                                    href="/auth/register"
                                    className="flex items-center justify-center w-full h-12 px-6 rounded-lg bg-black text-white text-[14px] font-medium hover:bg-black/90 transition-colors"
                                >
                                    Commencer mon essai gratuit
                                </a>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </section>
    );
}
