"use client";

import { useEffect, useRef, useState } from "react";
import {
    FileText,
    Users,
    BarChart3,
    Package,
    MessageSquare,
    Calendar,
    TrendingUp,
    Clock,
    CheckCircle2,
    AlertCircle,
    Search,
    Filter,
    Plus,
    Send,
    Sparkles,
    ArrowUpRight,
    Mail,
    Phone,
    MapPin,
    Euro,
    ChevronRight,
    Wrench,
    Car,
} from "lucide-react";

const features = [
    {
        id: "dashboard",
        icon: BarChart3,
        title: "Dashboard",
        description: "Vue d'ensemble de votre activité en temps réel",
    },
    {
        id: "documents",
        icon: FileText,
        title: "Documents",
        description: "Devis, factures et avoirs en quelques clics",
    },
    {
        id: "clients",
        icon: Users,
        title: "Clients",
        description: "Fichier client complet avec historique",
    },
    {
        id: "stock",
        icon: Package,
        title: "Stock",
        description: "Gestion des stocks et alertes automatiques",
    },
    {
        id: "atelier",
        icon: Wrench,
        title: "Atelier",
        description: "Suivi des interventions et réparations",
    },
    {
        id: "ai",
        icon: MessageSquare,
        title: "Assistant IA",
        description: "Parlez, l'IA exécute",
    },
    {
        id: "agenda",
        icon: Calendar,
        title: "Agenda",
        description: "Planning et rendez-vous synchronisés",
    },
];

// Mock data for the dashboard mockup
const mockStats = [
    { label: "CA du mois", value: "12 840€", change: "+23%", icon: Euro, positive: true },
    { label: "Factures en attente", value: "3", change: "2 890€", icon: Clock, positive: false },
    { label: "Devis à relancer", value: "7", change: "15 200€", icon: AlertCircle, positive: false },
    { label: "Taux conversion", value: "68%", change: "+5%", icon: TrendingUp, positive: true },
];

const mockDocuments = [
    { type: "Facture", numero: "FAC-2024-089", client: "Martin Construction", montant: "1 250€", statut: "Payée", date: "28 nov" },
    { type: "Devis", numero: "DEV-2024-112", client: "Dupont Rénovation", montant: "3 400€", statut: "En attente", date: "27 nov" },
    { type: "Facture", numero: "FAC-2024-088", client: "Garage Central", montant: "890€", statut: "En retard", date: "15 nov" },
    { type: "Avoir", numero: "AVO-2024-012", client: "Salon Élégance", montant: "-250€", statut: "Émis", date: "26 nov" },
    { type: "Devis", numero: "DEV-2024-111", client: "Boulangerie Paul", montant: "1 800€", statut: "Accepté", date: "25 nov" },
];

const mockClients = [
    { name: "Martin Construction", email: "contact@martin-construction.fr", phone: "06 12 34 56 78", ca: "12 450€", docs: 8, ville: "Lyon" },
    { name: "Dupont Rénovation", email: "dupont.reno@gmail.com", phone: "06 98 76 54 32", ca: "8 200€", docs: 5, ville: "Villeurbanne" },
    { name: "Garage Central", email: "garage.central@orange.fr", phone: "04 78 12 34 56", ca: "4 890€", docs: 3, ville: "Lyon 3ème" },
    { name: "Salon Élégance", email: "contact@elegance.fr", phone: "06 45 67 89 01", ca: "2 100€", docs: 2, ville: "Caluire" },
];

const mockStock = [
    { name: "Joint de culasse universel", ref: "JDC-001", qty: 45, seuil: 10, prix: "85€", categorie: "Pièces moteur" },
    { name: "Filtre à huile premium", ref: "FAH-023", qty: 3, seuil: 15, prix: "12€", categorie: "Filtres" },
    { name: "Bougie d'allumage NGK", ref: "BA-NGK-05", qty: 120, seuil: 50, prix: "8€", categorie: "Allumage" },
    { name: "Plaquettes de frein AV", ref: "PF-AV-87", qty: 8, seuil: 10, prix: "45€", categorie: "Freinage" },
    { name: "Huile moteur 5W40 5L", ref: "HM-5W40-5", qty: 22, seuil: 8, prix: "38€", categorie: "Lubrifiants" },
    { name: "Courroie distribution", ref: "CD-VAG-12", qty: 5, seuil: 5, prix: "125€", categorie: "Distribution" },
];

const mockConversation = [
    { role: "user", message: "Crée un devis pour M. Dupont, 2 jours de travail à 350€/jour" },
    { role: "ai", message: "Devis DEV-2024-113 créé : 2 jours × 350€ = 700€ HT (840€ TTC). Envoyé par email à M. Dupont." },
    { role: "user", message: "Quels clients n'ont pas payé ce mois ?" },
    { role: "ai", message: "3 factures en attente : Garage Central (890€, 13 jours), Dupont Rénovation (1 200€, 5 jours), Martin Construction (450€, 2 jours). Voulez-vous envoyer des relances ?" },
];

const mockAgenda = [
    { jour: "Lun", date: 2, events: [{ heure: "09:00", titre: "M. Martin", type: "rdv" }] },
    { jour: "Mar", date: 3, events: [{ heure: "14:00", titre: "Devis Dupont", type: "rdv" }, { heure: "16:30", titre: "Rappel client", type: "task" }] },
    { jour: "Mer", date: 4, events: [] },
    { jour: "Jeu", date: 5, events: [{ heure: "08:00", titre: "Chantier Lyon", type: "chantier" }, { heure: "17:00", titre: "Livraison", type: "task" }] },
    { jour: "Ven", date: 6, events: [{ heure: "10:00", titre: "Mme Durand", type: "rdv" }] },
];

const mockAtelier = [
    { id: "INT-2024-045", vehicule: "Peugeot 308 - AB-123-CD", client: "M. Dupont", travaux: "Révision complète + freins", statut: "En cours", avancement: 75, technicien: "Jean" },
    { id: "INT-2024-044", vehicule: "Renault Clio - EF-456-GH", client: "Mme Martin", travaux: "Diagnostic moteur", statut: "En attente pièces", avancement: 40, technicien: "Pierre" },
    { id: "INT-2024-043", vehicule: "VW Golf - IJ-789-KL", client: "Garage Central", travaux: "Distribution + pompe à eau", statut: "Terminé", avancement: 100, technicien: "Jean" },
    { id: "INT-2024-042", vehicule: "BMW Série 3 - MN-012-OP", client: "M. Bernard", travaux: "Climatisation", statut: "À facturer", avancement: 100, technicien: "Marc" },
];

export function ProductShowcase() {
    const [activeFeature, setActiveFeature] = useState("dashboard");
    const [isVisible, setIsVisible] = useState(false);
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

    return (
        <section ref={ref} id="features" className="py-24 px-6 sm:px-8 bg-neutral-50 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-black/[0.02] to-transparent rounded-full" />
            </div>

            <div className="max-w-[1200px] mx-auto relative">
                {/* Header */}
                <div
                    className={`text-center space-y-4 mb-16 transition-all duration-700 ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                >
                    <p className="text-[13px] font-semibold text-black/40 uppercase tracking-widest">
                        Fonctionnalités
                    </p>
                    <h2 className="text-[36px] sm:text-[44px] font-bold tracking-[-0.02em] text-black leading-[1.1]">
                        Découvrez l&apos;interface
                    </h2>
                    <p className="text-[17px] text-black/50 max-w-[450px] mx-auto">
                        Une interface épurée et intuitive pour gérer votre entreprise sans effort.
                    </p>
                </div>

                {/* Feature Tabs */}
                <div
                    className={`flex flex-wrap justify-center gap-2 mb-12 transition-all duration-700 delay-100 ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                >
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        const isActive = activeFeature === feature.id;
                        return (
                            <button
                                key={feature.id}
                                onClick={() => setActiveFeature(feature.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                                    isActive
                                        ? "bg-black text-white"
                                        : "bg-white text-black/60 hover:text-black border border-black/[0.08] hover:border-black/[0.15]"
                                }`}
                            >
                                <Icon className="w-4 h-4" strokeWidth={2} />
                                {feature.title}
                            </button>
                        );
                    })}
                </div>

                {/* Mockup Preview */}
                <div
                    className={`transition-all duration-700 delay-200 ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                >
                    {/* Shadow */}
                    <div className="absolute left-1/2 -translate-x-1/2 w-[90%] h-full max-w-[1100px] bg-gradient-to-b from-black/5 to-black/10 rounded-[32px] blur-2xl -z-10" />

                    {/* Browser Window */}
                    <div className="bg-white rounded-2xl border border-black/[0.08] shadow-2xl shadow-black/10 overflow-hidden">
                        {/* Browser Header */}
                        <div className="flex items-center gap-4 px-5 py-3 border-b border-black/[0.06] bg-gradient-to-b from-neutral-50 to-white">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-black/10" />
                                <div className="w-3 h-3 rounded-full bg-black/10" />
                                <div className="w-3 h-3 rounded-full bg-black/10" />
                            </div>
                            <div className="flex-1 flex items-center justify-center">
                                <div className="px-4 py-1.5 rounded-lg bg-black/[0.04] text-[12px] text-black/40">
                                    app.mypropartner.fr
                                </div>
                            </div>
                            <div className="w-16" />
                        </div>

                        {/* App Content */}
                        <div className="flex min-h-[580px]">
                            {/* Sidebar */}
                            <div className="w-[200px] border-r border-black/[0.06] bg-neutral-50/50 p-4 hidden lg:block">
                                <div className="space-y-1">
                                    {features.map((feature) => {
                                        const Icon = feature.icon;
                                        const isActive = activeFeature === feature.id;
                                        return (
                                            <button
                                                key={feature.id}
                                                onClick={() => setActiveFeature(feature.id)}
                                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                                                    isActive
                                                        ? "bg-black text-white"
                                                        : "text-black/60 hover:bg-black/[0.04]"
                                                }`}
                                            >
                                                <Icon className="w-4 h-4" strokeWidth={2} />
                                                {feature.title}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 p-6 lg:p-8">
                                {activeFeature === "dashboard" && (
                                    <div className="space-y-5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-[20px] font-semibold text-black">Bonjour, Jean</h3>
                                                <p className="text-[13px] text-black/50">Voici le résumé de votre activité</p>
                                            </div>
                                            <span className="text-[11px] text-black/40 px-3 py-1.5 rounded-full bg-black/[0.04]">Mis à jour il y a 2 min</span>
                                        </div>

                                        {/* Stats */}
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                            {mockStats.map((stat, i) => {
                                                const Icon = stat.icon;
                                                return (
                                                    <div key={i} className="p-4 rounded-xl bg-neutral-50 border border-black/[0.04] hover:border-black/[0.08] transition-colors">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <p className="text-[11px] text-black/50 uppercase tracking-wide">{stat.label}</p>
                                                            <Icon className="w-4 h-4 text-black/30" strokeWidth={2} />
                                                        </div>
                                                        <p className="text-[22px] font-bold text-black tracking-[-0.02em]">{stat.value}</p>
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
                                                            <button key={i} className={`px-2 py-1 rounded text-[10px] ${i === 1 ? "bg-black text-white" : "text-black/40"}`}>
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
                                                    <span>Jan</span><span>Fév</span><span>Mar</span><span>Avr</span><span>Mai</span><span>Jun</span>
                                                    <span>Jul</span><span>Aoû</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Déc</span>
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
                                                <button key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/[0.04] hover:bg-black/[0.08] transition-colors text-[12px] text-black/70">
                                                    <action.icon className="w-3.5 h-3.5" strokeWidth={2} />
                                                    {action.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeFeature === "documents" && (
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
                                                    <button key={i} className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${i === 0 ? "bg-black text-white" : "text-black/50 hover:bg-black/[0.04]"}`}>
                                                        {tab}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-black/[0.08] bg-white">
                                                    <Search className="w-3.5 h-3.5 text-black/30" strokeWidth={2} />
                                                    <input type="text" placeholder="Rechercher..." className="text-[12px] bg-transparent outline-none w-24" />
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
                                                        <p className="text-[10px] text-black/40 uppercase tracking-wide">{stat.label}</p>
                                                        <p className="text-[14px] font-semibold text-black">{stat.value}</p>
                                                    </div>
                                                    <span className="text-[10px] text-black/30 px-1.5 py-0.5 rounded bg-black/[0.04]">{stat.count}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Documents list */}
                                        <div className="space-y-2">
                                            {mockDocuments.map((doc, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-black/[0.04] hover:border-black/[0.08] transition-colors cursor-pointer group">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                                                            doc.type === "Facture" ? "bg-black/[0.06]" : doc.type === "Devis" ? "bg-black/[0.04]" : "bg-black/[0.03]"
                                                        }`}>
                                                            <FileText className="w-4 h-4 text-black/60" strokeWidth={2} />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-[13px] font-medium text-black">{doc.numero}</p>
                                                                <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                                                                    doc.statut === "Payée" || doc.statut === "Accepté" ? "bg-black/[0.08] text-black/60" :
                                                                    doc.statut === "En retard" ? "bg-black text-white" : "bg-black/[0.04] text-black/50"
                                                                }`}>
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
                                                        <ChevronRight className="w-4 h-4 text-black/20 group-hover:text-black/40 transition-colors" strokeWidth={2} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeFeature === "clients" && (
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
                                                <input type="text" placeholder="Rechercher un client..." className="text-[13px] bg-transparent outline-none flex-1" />
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
                                                <div key={i} className="p-3 rounded-xl bg-neutral-50 border border-black/[0.04] text-center">
                                                    <p className="text-[10px] text-black/40 uppercase tracking-wide">{stat.label}</p>
                                                    <p className="text-[18px] font-bold text-black mt-1">{stat.value}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Clients list */}
                                        <div className="space-y-2">
                                            {mockClients.map((client, i) => (
                                                <div key={i} className="p-4 rounded-xl bg-neutral-50 border border-black/[0.04] hover:border-black/[0.08] transition-colors cursor-pointer group">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white text-[13px] font-semibold">
                                                                {client.name.split(" ").map(n => n[0]).join("")}
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
                                )}

                                {activeFeature === "stock" && (
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
                                                <input type="text" placeholder="Rechercher un article..." className="text-[13px] bg-transparent outline-none flex-1" />
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
                                                <div key={i} className={`p-3 rounded-xl border text-center ${stat.alert ? "bg-black text-white border-black" : "bg-neutral-50 border-black/[0.04]"}`}>
                                                    <p className={`text-[10px] uppercase tracking-wide ${stat.alert ? "text-white/60" : "text-black/40"}`}>{stat.label}</p>
                                                    <p className={`text-[18px] font-bold mt-1 ${stat.alert ? "text-white" : "text-black"}`}>{stat.value}</p>
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
                                                    <div key={i} className={`grid grid-cols-12 gap-2 px-4 py-3 border-t border-black/[0.04] hover:bg-black/[0.02] transition-colors cursor-pointer ${isLow ? "bg-black/[0.02]" : ""}`}>
                                                        <div className="col-span-5">
                                                            <p className="text-[13px] font-medium text-black">{item.name}</p>
                                                            <p className="text-[10px] text-black/40">{item.ref} • {item.categorie}</p>
                                                        </div>
                                                        <div className="col-span-2 flex items-center justify-center">
                                                            <span className={`text-[13px] font-semibold ${isLow ? "text-black" : "text-black/70"}`}>
                                                                {item.qty}
                                                            </span>
                                                            {isLow && <AlertCircle className="w-3 h-3 ml-1 text-black" strokeWidth={2} />}
                                                        </div>
                                                        <div className="col-span-2 text-center text-[12px] text-black/40">{item.seuil}</div>
                                                        <div className="col-span-2 text-right text-[13px] font-medium text-black">{item.prix}</div>
                                                        <div className="col-span-1 flex justify-end">
                                                            <ChevronRight className="w-4 h-4 text-black/20" strokeWidth={2} />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {activeFeature === "atelier" && (
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
                                                <div key={i} className={`p-3 rounded-xl border text-center ${stat.highlight ? "bg-black text-white border-black" : "bg-neutral-50 border-black/[0.04]"}`}>
                                                    <p className={`text-[10px] uppercase tracking-wide ${stat.highlight ? "text-white/60" : "text-black/40"}`}>{stat.label}</p>
                                                    <p className={`text-[18px] font-bold mt-1 ${stat.highlight ? "text-white" : "text-black"}`}>{stat.value}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Interventions list */}
                                        <div className="space-y-3">
                                            {mockAtelier.map((intervention, i) => (
                                                <div key={i} className="p-4 rounded-xl bg-neutral-50 border border-black/[0.04] hover:border-black/[0.08] transition-colors cursor-pointer">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg bg-black/[0.06] flex items-center justify-center">
                                                                <Car className="w-5 h-5 text-black/60" strokeWidth={2} />
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <p className="text-[13px] font-medium text-black">{intervention.id}</p>
                                                                    <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                                                                        intervention.statut === "En cours" ? "bg-black text-white" :
                                                                        intervention.statut === "Terminé" || intervention.statut === "À facturer" ? "bg-black/[0.08] text-black/60" :
                                                                        "bg-black/[0.04] text-black/50"
                                                                    }`}>
                                                                        {intervention.statut}
                                                                    </span>
                                                                </div>
                                                                <p className="text-[11px] text-black/50">{intervention.vehicule}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[12px] font-medium text-black">{intervention.client}</p>
                                                            <p className="text-[10px] text-black/40">Tech: {intervention.technicien}</p>
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
                                                            <span className="text-[10px] text-black/40">{intervention.avancement}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Quick filters */}
                                        <div className="flex gap-2 pt-2">
                                            {["Toutes", "En cours", "En attente", "À facturer"].map((filter, i) => (
                                                <button key={i} className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${i === 0 ? "bg-black text-white" : "bg-black/[0.04] text-black/50 hover:bg-black/[0.08]"}`}>
                                                    {filter}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeFeature === "ai" && (
                                    <div className="space-y-5 h-full flex flex-col">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
                                                    <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
                                                </div>
                                                <div>
                                                    <h3 className="text-[16px] font-semibold text-black">Assistant IA</h3>
                                                    <p className="text-[11px] text-black/40">Parlez naturellement, je m&apos;occupe du reste</p>
                                                </div>
                                            </div>
                                            <span className="flex items-center gap-1.5 text-[11px] text-black/40 px-2 py-1 rounded-full bg-black/[0.04]">
                                                <span className="w-1.5 h-1.5 rounded-full bg-black/60 animate-pulse" />
                                                En ligne
                                            </span>
                                        </div>

                                        {/* Chat area */}
                                        <div className="flex-1 p-4 rounded-xl bg-neutral-50 border border-black/[0.04] space-y-4 overflow-y-auto">
                                            {mockConversation.map((msg, i) => (
                                                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "gap-3"}`}>
                                                    {msg.role === "ai" && (
                                                        <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                                                            <Sparkles className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                                                        </div>
                                                    )}
                                                    <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-[13px] ${
                                                        msg.role === "user"
                                                            ? "bg-black text-white rounded-br-md"
                                                            : "bg-white border border-black/[0.08] text-black rounded-bl-md"
                                                    }`}>
                                                        {msg.message}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Suggestions */}
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                "Relancer les impayés",
                                                "Créer une facture",
                                                "CA de la semaine",
                                                "Stocks à commander"
                                            ].map((suggestion, i) => (
                                                <button key={i} className="px-3 py-1.5 rounded-full border border-black/[0.08] text-[11px] text-black/60 hover:bg-black/[0.04] transition-colors">
                                                    {suggestion}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Input */}
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-black/[0.08]">
                                            <input
                                                type="text"
                                                placeholder="Demandez quelque chose..."
                                                className="flex-1 text-[13px] bg-transparent outline-none"
                                            />
                                            <button className="w-8 h-8 rounded-lg bg-black flex items-center justify-center hover:bg-black/90 transition-colors">
                                                <Send className="w-4 h-4 text-white" strokeWidth={2} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeFeature === "agenda" && (
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
                                                    <div className={`text-center p-2 rounded-lg ${day.date === 4 ? "bg-black text-white" : "bg-neutral-50"}`}>
                                                        <p className={`text-[10px] uppercase tracking-wide ${day.date === 4 ? "text-white/60" : "text-black/40"}`}>{day.jour}</p>
                                                        <p className="text-[16px] font-semibold">{day.date}</p>
                                                    </div>
                                                    <div className="space-y-1.5 min-h-[120px]">
                                                        {day.events.map((event, j) => (
                                                            <div
                                                                key={j}
                                                                className={`p-2 rounded-lg text-[11px] cursor-pointer transition-colors ${
                                                                    event.type === "rdv" ? "bg-black text-white hover:bg-black/90" :
                                                                    event.type === "chantier" ? "bg-black/[0.08] text-black hover:bg-black/[0.12]" :
                                                                    "bg-black/[0.04] text-black/60 hover:bg-black/[0.08]"
                                                                }`}
                                                            >
                                                                <p className={`font-medium ${event.type === "rdv" ? "text-white/60" : "text-black/40"}`}>{event.heure}</p>
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

                                        {/* Today&apos;s summary */}
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
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature description */}
                <div
                    className={`mt-8 text-center transition-all duration-700 delay-300 ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                >
                    {features.map((feature) =>
                        activeFeature === feature.id ? (
                            <p key={feature.id} className="text-[15px] text-black/50">
                                <span className="font-medium text-black">{feature.title}</span> — {feature.description}
                            </p>
                        ) : null
                    )}
                </div>
            </div>
        </section>
    );
}
