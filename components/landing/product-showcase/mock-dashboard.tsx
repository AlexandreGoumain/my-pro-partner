"use client";

import {
    FileText,
    Users,
    CheckCircle2,
    AlertCircle,
    Plus,
    ArrowUpRight,
} from "lucide-react";
import { mockStats } from "./mock-data";

export function MockDashboard() {
    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-[20px] font-semibold text-black">Bonjour, Jean</h3>
                    <p className="text-[13px] text-black/50">Voici le résumé de votre activité</p>
                </div>
                <span className="text-[11px] text-black/40 px-3 py-1.5 rounded-full bg-black/[0.04]">
                    Mis à jour il y a 2 min
                </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {mockStats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={i}
                            className="p-4 rounded-xl bg-neutral-50 border border-black/[0.04] hover:border-black/[0.08] transition-colors"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[11px] text-black/50 uppercase tracking-wide">
                                    {stat.label}
                                </p>
                                <Icon className="w-4 h-4 text-black/30" strokeWidth={2} />
                            </div>
                            <p className="text-[22px] font-bold text-black tracking-[-0.02em]">
                                {stat.value}
                            </p>
                            <p className={`text-[11px] mt-1 ${stat.positive ? "text-black/60" : "text-black/40"}`}>
                                {stat.positive && <ArrowUpRight className="w-3 h-3 inline mr-0.5" />}
                                {stat.change}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Chart + Activities */}
            <div className="grid lg:grid-cols-5 gap-4">
                {/* Chart */}
                <div className="lg:col-span-3 p-4 rounded-xl bg-neutral-50 border border-black/[0.04]">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[13px] font-medium text-black">Évolution CA</p>
                        <div className="flex gap-1">
                            {["7j", "30j", "90j"].map((period, i) => (
                                <button
                                    key={i}
                                    className={`px-2 py-1 rounded text-[10px] ${
                                        i === 1 ? "bg-black text-white" : "text-black/40"
                                    }`}
                                >
                                    {period}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="h-[100px] flex items-end justify-around gap-1">
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 80].map((h, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-black/80 rounded-t transition-all hover:bg-black"
                                style={{ height: `${h}%` }}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-[9px] text-black/30">
                        <span>Jan</span><span>Fév</span><span>Mar</span><span>Avr</span>
                        <span>Mai</span><span>Jun</span><span>Jul</span><span>Aoû</span>
                        <span>Sep</span><span>Oct</span><span>Nov</span><span>Déc</span>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-2 p-4 rounded-xl bg-neutral-50 border border-black/[0.04]">
                    <p className="text-[13px] font-medium text-black mb-3">Activité récente</p>
                    <div className="space-y-3">
                        {[
                            { icon: CheckCircle2, text: "Facture FAC-089 payée", time: "Il y a 2h" },
                            { icon: FileText, text: "Devis DEV-112 envoyé", time: "Il y a 4h" },
                            { icon: AlertCircle, text: "Relance auto envoyée", time: "Hier" },
                        ].map((activity, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-full bg-black/[0.06] flex items-center justify-center flex-shrink-0">
                                    <activity.icon className="w-3.5 h-3.5 text-black/50" strokeWidth={2} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[12px] text-black truncate">{activity.text}</p>
                                    <p className="text-[10px] text-black/40">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick actions */}
            <div className="flex gap-2">
                {[
                    { icon: Plus, label: "Nouveau devis" },
                    { icon: FileText, label: "Créer facture" },
                    { icon: Users, label: "Ajouter client" },
                ].map((action, i) => (
                    <button
                        key={i}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/[0.04] hover:bg-black/[0.08] transition-colors text-[12px] text-black/70"
                    >
                        <action.icon className="w-3.5 h-3.5" strokeWidth={2} />
                        {action.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
