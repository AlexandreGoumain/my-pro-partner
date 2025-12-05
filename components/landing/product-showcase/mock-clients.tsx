"use client";

import {
    Search,
    Filter,
    Plus,
    Mail,
    Phone,
    MapPin,
    ChevronRight,
} from "lucide-react";
import { mockClients } from "./mock-data";

export function MockClients() {
    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <h3 className="text-[20px] font-semibold text-black">Clients</h3>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white text-[13px] font-medium hover:bg-black/90 transition-colors">
                    <Plus className="w-4 h-4" strokeWidth={2} />
                    Ajouter
                </button>
            </div>

            {/* Search + Filters */}
            <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border border-black/[0.08] bg-white">
                    <Search className="w-4 h-4 text-black/30" strokeWidth={2} />
                    <input
                        type="text"
                        placeholder="Rechercher un client..."
                        className="text-[13px] bg-transparent outline-none flex-1"
                    />
                </div>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-black/[0.08] hover:bg-black/[0.04] transition-colors text-[12px] text-black/60">
                    <Filter className="w-4 h-4" strokeWidth={2} />
                    Filtrer
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: "Total clients", value: "127" },
                    { label: "Actifs ce mois", value: "34" },
                    { label: "CA moyen", value: "2 450€" },
                ].map((stat, i) => (
                    <div
                        key={i}
                        className="p-3 rounded-xl bg-neutral-50 border border-black/[0.04] text-center"
                    >
                        <p className="text-[10px] text-black/40 uppercase tracking-wide">
                            {stat.label}
                        </p>
                        <p className="text-[18px] font-bold text-black mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Clients list */}
            <div className="space-y-2">
                {mockClients.map((client, i) => (
                    <div
                        key={i}
                        className="p-4 rounded-xl bg-neutral-50 border border-black/[0.04] hover:border-black/[0.08] transition-colors cursor-pointer group"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white text-[13px] font-semibold">
                                    {client.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </div>
                                <div>
                                    <p className="text-[14px] font-medium text-black">{client.name}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="flex items-center gap-1 text-[11px] text-black/40">
                                            <Mail className="w-3 h-3" strokeWidth={2} />
                                            {client.email}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[14px] font-semibold text-black">{client.ca}</p>
                                <p className="text-[10px] text-black/40">{client.docs} docs</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-black/[0.04]">
                            <span className="flex items-center gap-1 text-[10px] text-black/40">
                                <Phone className="w-3 h-3" strokeWidth={2} />
                                {client.phone}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] text-black/40">
                                <MapPin className="w-3 h-3" strokeWidth={2} />
                                {client.ville}
                            </span>
                            <button className="ml-auto flex items-center gap-1 text-[11px] text-black/50 hover:text-black transition-colors">
                                Voir fiche
                                <ChevronRight className="w-3 h-3" strokeWidth={2} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
