"use client";

import { Car, Plus } from "lucide-react";
import { mockAtelier } from "./mock-data";

export function MockAtelier() {
    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <h3 className="text-[20px] font-semibold text-black">Gestion Atelier</h3>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white text-[13px] font-medium hover:bg-black/90 transition-colors">
                    <Plus className="w-4 h-4" strokeWidth={2} />
                    Nouvelle intervention
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3">
                {[
                    { label: "En cours", value: "2", highlight: true },
                    { label: "En attente", value: "1" },
                    { label: "À facturer", value: "1" },
                    { label: "Ce mois", value: "12" },
                ].map((stat, i) => (
                    <div
                        key={i}
                        className={`p-3 rounded-xl border text-center ${
                            stat.highlight
                                ? "bg-black text-white border-black"
                                : "bg-neutral-50 border-black/[0.04]"
                        }`}
                    >
                        <p
                            className={`text-[10px] uppercase tracking-wide ${
                                stat.highlight ? "text-white/60" : "text-black/40"
                            }`}
                        >
                            {stat.label}
                        </p>
                        <p
                            className={`text-[18px] font-bold mt-1 ${
                                stat.highlight ? "text-white" : "text-black"
                            }`}
                        >
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Interventions list */}
            <div className="space-y-3">
                {mockAtelier.map((intervention, i) => (
                    <div
                        key={i}
                        className="p-4 rounded-xl bg-neutral-50 border border-black/[0.04] hover:border-black/[0.08] transition-colors cursor-pointer"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-black/[0.06] flex items-center justify-center">
                                    <Car className="w-5 h-5 text-black/60" strokeWidth={2} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-[13px] font-medium text-black">
                                            {intervention.id}
                                        </p>
                                        <span
                                            className={`text-[9px] px-1.5 py-0.5 rounded ${
                                                intervention.statut === "En cours"
                                                    ? "bg-black text-white"
                                                    : intervention.statut === "Terminé" ||
                                                      intervention.statut === "À facturer"
                                                    ? "bg-black/[0.08] text-black/60"
                                                    : "bg-black/[0.04] text-black/50"
                                            }`}
                                        >
                                            {intervention.statut}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-black/50">{intervention.vehicule}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[12px] font-medium text-black">
                                    {intervention.client}
                                </p>
                                <p className="text-[10px] text-black/40">
                                    Tech: {intervention.technicien}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-[12px] text-black/60">{intervention.travaux}</p>
                            <div className="flex items-center gap-2">
                                <div className="w-24 h-1.5 rounded-full bg-black/[0.08] overflow-hidden">
                                    <div
                                        className="h-full bg-black rounded-full transition-all"
                                        style={{ width: `${intervention.avancement}%` }}
                                    />
                                </div>
                                <span className="text-[10px] text-black/40">
                                    {intervention.avancement}%
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick filters */}
            <div className="flex gap-2 pt-2">
                {["Toutes", "En cours", "En attente", "À facturer"].map((filter, i) => (
                    <button
                        key={i}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                            i === 0
                                ? "bg-black text-white"
                                : "bg-black/[0.04] text-black/50 hover:bg-black/[0.08]"
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>
        </div>
    );
}
