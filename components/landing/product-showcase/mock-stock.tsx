"use client";

import {
    Search,
    Plus,
    AlertCircle,
    ChevronRight,
} from "lucide-react";
import { mockStock } from "./mock-data";

export function MockStock() {
    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <h3 className="text-[20px] font-semibold text-black">Gestion des stocks</h3>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white text-[13px] font-medium hover:bg-black/90 transition-colors">
                    <Plus className="w-4 h-4" strokeWidth={2} />
                    Entrée stock
                </button>
            </div>

            {/* Search + Categories */}
            <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border border-black/[0.08] bg-white">
                    <Search className="w-4 h-4 text-black/30" strokeWidth={2} />
                    <input
                        type="text"
                        placeholder="Rechercher un article..."
                        className="text-[13px] bg-transparent outline-none flex-1"
                    />
                </div>
                <select className="px-3 py-2 rounded-lg border border-black/[0.08] text-[12px] text-black/60 bg-white">
                    <option>Toutes catégories</option>
                    <option>Pièces moteur</option>
                    <option>Filtres</option>
                    <option>Freinage</option>
                </select>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3">
                {[
                    { label: "Articles", value: "248" },
                    { label: "Valeur stock", value: "18 450€" },
                    { label: "Stock faible", value: "3", alert: true },
                    { label: "Rupture", value: "0" },
                ].map((stat, i) => (
                    <div
                        key={i}
                        className={`p-3 rounded-xl border text-center ${
                            stat.alert
                                ? "bg-black text-white border-black"
                                : "bg-neutral-50 border-black/[0.04]"
                        }`}
                    >
                        <p
                            className={`text-[10px] uppercase tracking-wide ${
                                stat.alert ? "text-white/60" : "text-black/40"
                            }`}
                        >
                            {stat.label}
                        </p>
                        <p
                            className={`text-[18px] font-bold mt-1 ${
                                stat.alert ? "text-white" : "text-black"
                            }`}
                        >
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Stock list - table style */}
            <div className="rounded-xl border border-black/[0.06] overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-neutral-100/50 text-[10px] text-black/50 uppercase tracking-wide">
                    <div className="col-span-5">Article</div>
                    <div className="col-span-2 text-center">Stock</div>
                    <div className="col-span-2 text-center">Seuil</div>
                    <div className="col-span-2 text-right">Prix</div>
                    <div className="col-span-1"></div>
                </div>
                {/* Rows */}
                {mockStock.map((item, i) => {
                    const isLow = item.qty <= item.seuil;
                    return (
                        <div
                            key={i}
                            className={`grid grid-cols-12 gap-2 px-4 py-3 border-t border-black/[0.04] hover:bg-black/[0.02] transition-colors cursor-pointer ${
                                isLow ? "bg-black/[0.02]" : ""
                            }`}
                        >
                            <div className="col-span-5">
                                <p className="text-[13px] font-medium text-black">{item.name}</p>
                                <p className="text-[10px] text-black/40">
                                    {item.ref} • {item.categorie}
                                </p>
                            </div>
                            <div className="col-span-2 flex items-center justify-center">
                                <span
                                    className={`text-[13px] font-semibold ${
                                        isLow ? "text-black" : "text-black/70"
                                    }`}
                                >
                                    {item.qty}
                                </span>
                                {isLow && (
                                    <AlertCircle className="w-3 h-3 ml-1 text-black" strokeWidth={2} />
                                )}
                            </div>
                            <div className="col-span-2 text-center text-[12px] text-black/40">
                                {item.seuil}
                            </div>
                            <div className="col-span-2 text-right text-[13px] font-medium text-black">
                                {item.prix}
                            </div>
                            <div className="col-span-1 flex justify-end">
                                <ChevronRight className="w-4 h-4 text-black/20" strokeWidth={2} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
