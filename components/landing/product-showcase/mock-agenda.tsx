"use client";

import { Calendar, CheckCircle2, Clock, Plus } from "lucide-react";
import { mockAgenda } from "./mock-data";

export function MockAgenda() {
    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-[20px] font-semibold text-black">Agenda</h3>
                    <p className="text-[12px] text-black/40">Décembre 2024</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-black text-white">
                        Semaine
                    </button>
                    <button className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-black/50 hover:bg-black/[0.04] transition-colors">
                        Mois
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/[0.04] text-[12px] text-black/70 hover:bg-black/[0.08] transition-colors ml-2">
                        <Plus className="w-3.5 h-3.5" strokeWidth={2} />
                        Nouveau RDV
                    </button>
                </div>
            </div>

            {/* Week view */}
            <div className="grid grid-cols-5 gap-3">
                {mockAgenda.map((day, i) => (
                    <div key={i} className="space-y-2">
                        <div
                            className={`text-center p-2 rounded-lg ${
                                day.date === 4 ? "bg-black text-white" : "bg-neutral-50"
                            }`}
                        >
                            <p
                                className={`text-[10px] uppercase tracking-wide ${
                                    day.date === 4 ? "text-white/60" : "text-black/40"
                                }`}
                            >
                                {day.jour}
                            </p>
                            <p className="text-[16px] font-semibold">{day.date}</p>
                        </div>
                        <div className="space-y-1.5 min-h-[120px]">
                            {day.events.map((event, j) => (
                                <div
                                    key={j}
                                    className={`p-2 rounded-lg text-[11px] cursor-pointer transition-colors ${
                                        event.type === "rdv"
                                            ? "bg-black text-white hover:bg-black/90"
                                            : event.type === "chantier"
                                            ? "bg-black/[0.08] text-black hover:bg-black/[0.12]"
                                            : "bg-black/[0.04] text-black/60 hover:bg-black/[0.08]"
                                    }`}
                                >
                                    <p
                                        className={`font-medium ${
                                            event.type === "rdv" ? "text-white/60" : "text-black/40"
                                        }`}
                                    >
                                        {event.heure}
                                    </p>
                                    <p className="font-medium truncate">{event.titre}</p>
                                </div>
                            ))}
                            {day.events.length === 0 && (
                                <div className="h-full flex items-center justify-center">
                                    <p className="text-[10px] text-black/20">Libre</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Today's summary */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-black/[0.04]">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-[13px] font-medium text-black">Aujourd&apos;hui</p>
                    <span className="text-[11px] text-black/40">Mer 4 déc</span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-black/[0.06] flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-black/50" strokeWidth={2} />
                        </div>
                        <div>
                            <p className="text-[18px] font-bold text-black">0</p>
                            <p className="text-[10px] text-black/40">RDV</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-black/[0.06] flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-black/50" strokeWidth={2} />
                        </div>
                        <div>
                            <p className="text-[18px] font-bold text-black">3</p>
                            <p className="text-[10px] text-black/40">Tâches</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-black/[0.06] flex items-center justify-center">
                            <Clock className="w-4 h-4 text-black/50" strokeWidth={2} />
                        </div>
                        <div>
                            <p className="text-[18px] font-bold text-black">6h</p>
                            <p className="text-[10px] text-black/40">Dispo</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
