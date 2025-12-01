"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, CreditCard, Clock, Download, Eye, CheckCircle } from "lucide-react";

const portalFeatures = [
    {
        icon: FileText,
        title: "Documents accessibles 24/7",
        description: "Vos clients retrouvent devis, factures et avoirs à tout moment",
    },
    {
        icon: CreditCard,
        title: "Paiement en ligne",
        description: "Ils règlent leurs factures en un clic par carte ou virement",
    },
    {
        icon: Clock,
        title: "Suivi en temps réel",
        description: "Historique complet et statut de chaque document",
    },
    {
        icon: Download,
        title: "Téléchargement PDF",
        description: "Export instantané pour leur comptabilité",
    },
];

const mockDocuments = [
    { type: "Facture", numero: "FAC-2024-089", montant: "1 250,00 €", statut: "Payée", date: "15 nov." },
    { type: "Facture", numero: "FAC-2024-087", montant: "890,00 €", statut: "En attente", date: "10 nov." },
    { type: "Devis", numero: "DEV-2024-112", montant: "2 400,00 €", statut: "Accepté", date: "8 nov." },
];

export function ClientPortal() {
    const [isVisible, setIsVisible] = useState(false);
    const [activeDoc, setActiveDoc] = useState(0);
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

    // Auto-highlight documents
    useEffect(() => {
        if (!isVisible) return;
        const interval = setInterval(() => {
            setActiveDoc((prev) => (prev + 1) % mockDocuments.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [isVisible]);

    return (
        <section ref={ref} className="py-32 px-6 sm:px-8 bg-white relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-gradient-radial from-black/[0.02] to-transparent rounded-full translate-x-1/2" />
            </div>

            <div className="max-w-[1200px] mx-auto relative">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Content */}
                    <div
                        className={`space-y-8 transition-all duration-700 ${
                            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                        }`}
                    >
                        {/* Header */}
                        <div className="space-y-4">
                            <p className="text-[13px] font-semibold text-black/40 uppercase tracking-widest">
                                Portail client inclus
                            </p>
                            <h2 className="text-[44px] sm:text-[52px] font-bold tracking-[-0.03em] text-black leading-[1.1]">
                                Vos clients aussi
                                <br />
                                <span className="text-black/40">vont adorer.</span>
                            </h2>
                            <p className="text-[17px] text-black/50 max-w-[450px]">
                                Un espace dédié où vos clients accèdent à leurs documents,
                                paient en ligne et suivent leurs commandes. Moins de questions, plus de satisfaction.
                            </p>
                        </div>

                        {/* Features */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            {portalFeatures.map((feature, i) => {
                                const Icon = feature.icon;
                                return (
                                    <div
                                        key={i}
                                        className={`p-4 rounded-xl border border-black/[0.06] bg-neutral-50/50 transition-all duration-500 ${
                                            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                        }`}
                                        style={{ transitionDelay: `${i * 100 + 200}ms` }}
                                    >
                                        <Icon className="w-5 h-5 text-black/70 mb-3" strokeWidth={2} />
                                        <h3 className="text-[14px] font-semibold text-black mb-1">
                                            {feature.title}
                                        </h3>
                                        <p className="text-[13px] text-black/50 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Benefit */}
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-black text-white">
                            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-5 h-5" strokeWidth={2} />
                            </div>
                            <div>
                                <p className="text-[14px] font-semibold">-60% de support client</p>
                                <p className="text-[12px] text-white/60">
                                    Vos clients trouvent leurs réponses seuls
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Portal Preview */}
                    <div
                        className={`relative transition-all duration-700 delay-200 ${
                            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                        }`}
                    >
                        {/* Shadow */}
                        <div className="absolute -inset-4 bg-gradient-to-br from-black/5 to-black/10 rounded-[32px] blur-2xl" />

                        {/* Portal Card */}
                        <div className="relative bg-white rounded-2xl border border-black/[0.08] shadow-2xl shadow-black/10 overflow-hidden">
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-black/[0.06] bg-gradient-to-b from-neutral-50 to-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[11px] text-black/40 font-medium">
                                            Espace client
                                        </p>
                                        <p className="text-[15px] font-semibold text-black">
                                            Martin Construction
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-black/[0.04] flex items-center justify-center">
                                        <span className="text-[14px] font-bold text-black">MC</span>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="text-center p-3 rounded-lg bg-neutral-50">
                                        <p className="text-[20px] font-bold text-black">12</p>
                                        <p className="text-[11px] text-black/50">Documents</p>
                                    </div>
                                    <div className="text-center p-3 rounded-lg bg-neutral-50">
                                        <p className="text-[20px] font-bold text-black">890€</p>
                                        <p className="text-[11px] text-black/50">À payer</p>
                                    </div>
                                    <div className="text-center p-3 rounded-lg bg-neutral-50">
                                        <p className="text-[20px] font-bold text-black">8,4k€</p>
                                        <p className="text-[11px] text-black/50">Total payé</p>
                                    </div>
                                </div>

                                {/* Documents list */}
                                <div className="space-y-2">
                                    <p className="text-[12px] font-semibold text-black/40 uppercase tracking-wide mb-3">
                                        Documents récents
                                    </p>
                                    {mockDocuments.map((doc, i) => (
                                        <div
                                            key={i}
                                            className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 cursor-pointer ${
                                                i === activeDoc
                                                    ? "bg-black text-white border-black"
                                                    : "bg-white border-black/[0.06] hover:border-black/20"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <FileText
                                                    className={`w-4 h-4 ${
                                                        i === activeDoc ? "text-white" : "text-black/40"
                                                    }`}
                                                    strokeWidth={2}
                                                />
                                                <div>
                                                    <p
                                                        className={`text-[13px] font-medium ${
                                                            i === activeDoc ? "text-white" : "text-black"
                                                        }`}
                                                    >
                                                        {doc.type} {doc.numero}
                                                    </p>
                                                    <p
                                                        className={`text-[11px] ${
                                                            i === activeDoc ? "text-white/60" : "text-black/40"
                                                        }`}
                                                    >
                                                        {doc.date}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p
                                                    className={`text-[13px] font-semibold ${
                                                        i === activeDoc ? "text-white" : "text-black"
                                                    }`}
                                                >
                                                    {doc.montant}
                                                </p>
                                                <p
                                                    className={`text-[10px] font-medium ${
                                                        i === activeDoc
                                                            ? "text-white/70"
                                                            : doc.statut === "Payée"
                                                            ? "text-black/60"
                                                            : doc.statut === "En attente"
                                                            ? "text-black/50"
                                                            : "text-black/60"
                                                    }`}
                                                >
                                                    {doc.statut}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="grid grid-cols-2 gap-3 mt-4">
                                    <button className="flex items-center justify-center gap-2 p-3 rounded-lg bg-black text-white text-[13px] font-medium">
                                        <CreditCard className="w-4 h-4" />
                                        Payer 890€
                                    </button>
                                    <button className="flex items-center justify-center gap-2 p-3 rounded-lg border border-black/[0.08] text-black text-[13px] font-medium hover:bg-black/[0.02]">
                                        <Eye className="w-4 h-4" />
                                        Voir tout
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Floating badge */}
                        <div className="absolute -top-2 -right-2 px-3 py-1.5 rounded-lg bg-black text-white text-[11px] font-semibold shadow-lg">
                            Personnalisable
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
