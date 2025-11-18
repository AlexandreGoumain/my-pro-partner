"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, TrendingUp, Users, FileText } from "lucide-react";
import { useState } from "react";

export function Hero() {
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        window.location.href = `/auth/register?email=${encodeURIComponent(email)}`;
    };

    return (
        <section className="relative px-6 overflow-hidden bg-white" style={{ paddingTop: 'var(--spacing-3xl)', paddingBottom: 'var(--spacing-3xl)' }}>
            <div className="max-w-6xl mx-auto">
                <div className="text-center" style={{ marginBottom: 'var(--spacing-3xl)' }}>
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.04] border border-black/[0.06] scroll-fade-in">
                        <span className="text-[13px] text-black/60 font-medium tracking-wide-premium">
                            Rejoignez les entreprises qui automatisent leur gestion
                        </span>
                    </div>

                    {/* Heading - Fluid Typography */}
                    <h1 className="fluid-title font-semibold text-black scroll-fade-in" style={{ marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-md)' }}>
                        Gérez votre
                        <br />
                        <span className="text-black/50">entreprise simplement</span>
                    </h1>

                    {/* Subheading - Fluid Typography */}
                    <p className="fluid-subtitle font-normal text-black/50 max-w-[600px] mx-auto scroll-fade-in">
                        Devis, factures, clients, stocks. Tout ce dont vous avez besoin pour développer votre activité.
                    </p>

                    {/* Email Capture Form - Stripe Style */}
                    <div className="scroll-fade-in" style={{ marginTop: 'var(--spacing-xl)' }}>
                        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                            <div className="relative">
                                <Input
                                    type="email"
                                    placeholder="Votre email professionnel"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-14 pr-40 text-[15px] border-black/[0.12] focus:border-black focus:ring-2 focus:ring-black/10 shadow-sm transition-all ease-premium"
                                />
                                <Button
                                    type="submit"
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium shadow-sm hover:shadow-md transition-all ease-premium group"
                                    style={{ transitionDuration: '0.3s' }}
                                >
                                    Démarrer
                                    <ArrowRight className="h-4 w-4 ml-2 transition-transform ease-premium group-hover:translate-x-1" />
                                </Button>
                            </div>
                            <p className="text-[12px] text-black/40 mt-3 tracking-wide-premium">
                                14 jours gratuits • Sans carte bancaire
                            </p>
                        </form>
                    </div>
                </div>

                {/* Dashboard UI Mockup */}
                <div className="relative scroll-fade-in">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/[0.03] to-transparent rounded-3xl blur-3xl" />
                    <div className="relative bg-white border border-black/[0.08] rounded-2xl shadow-stripe overflow-hidden shadow-stripe-hover">
                        {/* Browser chrome */}
                        <div className="gradient-subtle border-b border-black/[0.06] px-4 py-3 flex items-center gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-black/[0.12]" />
                                <div className="w-2.5 h-2.5 rounded-full bg-black/[0.12]" />
                                <div className="w-2.5 h-2.5 rounded-full bg-black/[0.12]" />
                            </div>
                            <div className="flex-1 mx-8">
                                <div className="bg-white border border-black/[0.06] rounded-md px-3 py-1 text-[11px] text-black/40 font-mono">
                                    app.mypropartner.com/dashboard
                                </div>
                            </div>
                        </div>

                        {/* Dashboard Content */}
                        <div className="gradient-depth" style={{ padding: 'var(--spacing-2xl)' }}>
                            {/* Header */}
                            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                                <h2 className="text-[24px] font-semibold text-black mb-1 tracking-tight-premium">
                                    Tableau de bord
                                </h2>
                                <p className="text-[14px] text-black/50 tracking-wide-premium">
                                    Vue d'ensemble de votre activité
                                </p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-4" style={{ marginBottom: 'var(--spacing-xl)' }}>
                                <div className="p-4 rounded-xl bg-white border border-black/[0.06] shadow-stripe-hover">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-black/[0.04] flex items-center justify-center">
                                            <TrendingUp className="w-4 h-4 text-black/60" strokeWidth={2} />
                                        </div>
                                        <span className="text-[12px] text-black/50 font-medium tracking-wide-premium">CA du mois</span>
                                    </div>
                                    <div className="text-[28px] font-semibold text-black tracking-tight-premium">
                                        42 850€
                                    </div>
                                    <div className="text-[11px] text-black/40 mt-1 tracking-wide-premium">
                                        +18% vs mois dernier
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-white border border-black/[0.06] shadow-stripe-hover">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-black/[0.04] flex items-center justify-center">
                                            <FileText className="w-4 h-4 text-black/60" strokeWidth={2} />
                                        </div>
                                        <span className="text-[12px] text-black/50 font-medium tracking-wide-premium">Factures</span>
                                    </div>
                                    <div className="text-[28px] font-semibold text-black tracking-tight-premium">
                                        127
                                    </div>
                                    <div className="text-[11px] text-black/40 mt-1 tracking-wide-premium">
                                        23 en attente
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-white border border-black/[0.06] shadow-stripe-hover">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-black/[0.04] flex items-center justify-center">
                                            <Users className="w-4 h-4 text-black/60" strokeWidth={2} />
                                        </div>
                                        <span className="text-[12px] text-black/50 font-medium tracking-wide-premium">Clients</span>
                                    </div>
                                    <div className="text-[28px] font-semibold text-black tracking-tight-premium">
                                        284
                                    </div>
                                    <div className="text-[11px] text-black/40 mt-1 tracking-wide-premium">
                                        12 nouveaux ce mois
                                    </div>
                                </div>
                            </div>

                            {/* Chart */}
                            <div className="p-6 rounded-xl bg-white border border-black/[0.06] shadow-stripe-hover">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[14px] font-semibold text-black tracking-wide-premium">
                                        Évolution du chiffre d'affaires
                                    </span>
                                    <span className="text-[12px] text-black/40 tracking-wide-premium">
                                        12 derniers mois
                                    </span>
                                </div>
                                <div className="h-32 flex items-end gap-2">
                                    {[40, 65, 45, 80, 55, 90, 70, 85, 75, 95, 88, 100].map((height, i) => (
                                        <div
                                            key={i}
                                            className="flex-1 bg-gradient-to-t from-black/[0.08] to-black/[0.04] rounded-t ease-premium hover:from-black/[0.12] hover:to-black/[0.08] transition-all"
                                            style={{
                                                height: `${height}%`,
                                                transitionDuration: '0.3s',
                                                transitionTimingFunction: 'var(--ease-out-sine)'
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
