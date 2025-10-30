"use client";

import { Card } from "@/components/ui/card";
import {
    FileText,
    Users,
    Package,
    TrendingUp,
    Shield,
    Zap,
    CheckCircle2,
    Clock,
    Bell,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function BentoGrid() {
    return (
        <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
            <div className="max-w-7xl mx-auto">
                {/* Section header */}
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                        Tout ce dont vous avez besoin
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Une plateforme complète qui simplifie la gestion de votre entreprise
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {/* Large card - Main dashboard preview */}
                    <Card className="md:col-span-2 lg:col-span-2 lg:row-span-2 p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20 border-2 hover:border-primary/50 transition-all hover:shadow-xl group overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                                    <TrendingUp className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Dashboard Temps Réel</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Vue d&apos;ensemble de votre activité
                                    </p>
                                </div>
                            </div>
                            <div className="flex-1 flex items-center justify-center">
                                <div className="w-full aspect-[16/10] rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950 border border-border shadow-lg flex items-center justify-center">
                                    <div className="text-center space-y-2">
                                        <div className="text-5xl">📊</div>
                                        <p className="text-sm text-muted-foreground">
                                            Preview du dashboard
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Quick stats card */}
                    <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-2 hover:border-green-500/50 transition-all hover:shadow-xl group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600">
                                <CheckCircle2 className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-bold">Gain de temps</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                    75%
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                    de temps économisé sur la facturation
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-green-600" />
                                <span className="text-muted-foreground">
                                    2 min pour créer un devis
                                </span>
                            </div>
                        </div>
                    </Card>

                    {/* Documents card */}
                    <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-2 hover:border-orange-500/50 transition-all hover:shadow-xl group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-600 to-amber-600">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-bold">Documents</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-2 rounded-lg bg-white/50 dark:bg-black/20">
                                <span className="text-sm">Devis</span>
                                <Badge variant="secondary">Illimités</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-lg bg-white/50 dark:bg-black/20">
                                <span className="text-sm">Factures</span>
                                <Badge variant="secondary">Illimités</Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-lg bg-white/50 dark:bg-black/20">
                                <span className="text-sm">Avoirs</span>
                                <Badge variant="secondary">Illimités</Badge>
                            </div>
                        </div>
                    </Card>

                    {/* Clients card */}
                    <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-2 hover:border-blue-500/50 transition-all hover:shadow-xl group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-bold">Gestion Clients</h3>
                        </div>
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-600" />
                                <span>Base de données centralisée</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-600" />
                                <span>Historique complet</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-600" />
                                <span>Recherche avancée</span>
                            </div>
                        </div>
                    </Card>

                    {/* Stock alerts card */}
                    <Card className="p-6 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 border-2 hover:border-red-500/50 transition-all hover:shadow-xl group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-red-600 to-rose-600">
                                <Bell className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-bold">Alertes stocks</h3>
                        </div>
                        <div className="space-y-2">
                            <div className="p-3 rounded-lg bg-white/50 dark:bg-black/20 border border-red-200 dark:border-red-900">
                                <div className="flex items-center gap-2 mb-1">
                                    <Bell className="w-3 h-3 text-red-600" />
                                    <span className="text-xs font-semibold text-red-600">
                                        Stock critique
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Notifications automatiques
                                </p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Ne manquez plus jamais de stock
                            </p>
                        </div>
                    </Card>

                    {/* Large feature card - Stock management */}
                    <Card className="md:col-span-2 p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-2 hover:border-purple-500/50 transition-all hover:shadow-xl group">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600">
                                        <Package className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Gestion des stocks</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Suivi en temps réel de vos produits
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <p className="text-2xl font-bold">100+</p>
                                        <p className="text-xs text-muted-foreground">Produits suivis</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-2xl font-bold">24/7</p>
                                        <p className="text-xs text-muted-foreground">Suivi en temps réel</p>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-32 h-32 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950 dark:to-pink-950 flex items-center justify-center">
                                <div className="text-5xl">📦</div>
                            </div>
                        </div>
                    </Card>

                    {/* Security card */}
                    <Card className="p-6 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20 border-2 hover:border-slate-500/50 transition-all hover:shadow-xl group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-slate-600 to-gray-600">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-bold">Sécurisé</h3>
                        </div>
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <span>Hébergement sécurisé</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <span>Sauvegardes quotidiennes</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <span>SSL/TLS</span>
                            </div>
                        </div>
                    </Card>

                    {/* Performance card */}
                    <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-2 hover:border-yellow-500/50 transition-all hover:shadow-xl group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-600 to-orange-600">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-bold">Ultra-rapide</h3>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <div className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                                    &lt;100ms
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Temps de réponse
                                </p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Interface fluide et réactive
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
}
