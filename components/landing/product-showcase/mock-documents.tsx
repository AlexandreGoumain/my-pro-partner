"use client";

import {
    FileText,
    Search,
    Filter,
    Plus,
    ChevronRight,
} from "lucide-react";
import { mockDocuments } from "./mock-data";

export function MockDocuments() {
    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <h3 className="text-[20px] font-semibold text-black">Documents</h3>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white text-[13px] font-medium hover:bg-black/90 transition-colors">
                    <Plus className="w-4 h-4" strokeWidth={2} />
                    Nouveau
                </button>
            </div>

            {/* Tabs + Search */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex gap-1">
                    {["Tous", "Devis", "Factures", "Avoirs"].map((tab, i) => (
                        <button
                            key={i}
                            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
                                i === 0 ? "bg-black text-white" : "text-black/50 hover:bg-black/[0.04]"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-black/[0.08] bg-white">
                        <Search className="w-3.5 h-3.5 text-black/30" strokeWidth={2} />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="text-[12px] bg-transparent outline-none w-24"
                        />
                    </div>
                    <button className="p-1.5 rounded-lg border border-black/[0.08] hover:bg-black/[0.04] transition-colors">
                        <Filter className="w-3.5 h-3.5 text-black/40" strokeWidth={2} />
                    </button>
                </div>
            </div>

            {/* Stats bar */}
            <div className="flex gap-6 p-3 rounded-xl bg-neutral-50 border border-black/[0.04]">
                {[
                    { label: "En attente", value: "3 890€", count: 4 },
                    { label: "Ce mois", value: "12 840€", count: 12 },
                    { label: "En retard", value: "890€", count: 1 },
                ].map((stat, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div>
                            <p className="text-[10px] text-black/40 uppercase tracking-wide">
                                {stat.label}
                            </p>
                            <p className="text-[14px] font-semibold text-black">{stat.value}</p>
                        </div>
                        <span className="text-[10px] text-black/30 px-1.5 py-0.5 rounded bg-black/[0.04]">
                            {stat.count}
                        </span>
                    </div>
                ))}
            </div>

            {/* Documents list */}
            <div className="space-y-2">
                {mockDocuments.map((doc, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-black/[0.04] hover:border-black/[0.08] transition-colors cursor-pointer group"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                                    doc.type === "Facture"
                                        ? "bg-black/[0.06]"
                                        : doc.type === "Devis"
                                        ? "bg-black/[0.04]"
                                        : "bg-black/[0.03]"
                                }`}
                            >
                                <FileText className="w-4 h-4 text-black/60" strokeWidth={2} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="text-[13px] font-medium text-black">{doc.numero}</p>
                                    <span
                                        className={`text-[9px] px-1.5 py-0.5 rounded ${
                                            doc.statut === "Payée" || doc.statut === "Accepté"
                                                ? "bg-black/[0.08] text-black/60"
                                                : doc.statut === "En retard"
                                                ? "bg-black text-white"
                                                : "bg-black/[0.04] text-black/50"
                                        }`}
                                    >
                                        {doc.statut}
                                    </span>
                                </div>
                                <p className="text-[11px] text-black/50">{doc.client}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-[13px] font-semibold text-black">{doc.montant}</p>
                                <p className="text-[10px] text-black/40">{doc.date}</p>
                            </div>
                            <ChevronRight
                                className="w-4 h-4 text-black/20 group-hover:text-black/40 transition-colors"
                                strokeWidth={2}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
