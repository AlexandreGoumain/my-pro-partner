"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles, Play, Check, TrendingUp, FileText, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

export function HeroRedesigned() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [activeCard, setActiveCard] = useState(0);
    const [waitlistCount, setWaitlistCount] = useState(0);
    const heroRef = useRef<HTMLElement>(null);

    useEffect(() => {
        setIsVisible(true);

        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20,
            });
        };

        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveCard((prev) => (prev + 1) % 3);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    // Fetch waitlist count
    useEffect(() => {
        const fetchWaitlistCount = async () => {
            try {
                const response = await fetch('/api/waitlist/count');
                if (response.ok) {
                    const data = await response.json();
                    setWaitlistCount(data.count);
                }
            } catch (error) {
                console.error('Failed to fetch waitlist count:', error);
            }
        };

        fetchWaitlistCount();
    }, []);

    const features = [
        "Assistant IA intégré",
        "Devis en 2 minutes",
        "Stocks en temps réel",
        "Support 24/7"
    ];

    return (
        <section ref={heroRef} className="relative min-h-[100vh] flex items-center justify-center px-6 sm:px-8 overflow-hidden bg-white">
            {/* Animated background with gradient orbs */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Main gradient orbs with parallax */}
                <div
                    className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-black/[0.03] to-black/[0.08] rounded-full blur-[120px] animate-pulse"
                    style={{
                        transform: `translate(${mousePosition.x}px, ${mousePosition.y - scrollY * 0.3}px)`,
                        transition: "transform 0.3s ease-out",
                    }}
                />
                <div
                    className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-black/[0.04] to-black/[0.06] rounded-full blur-[100px] animate-pulse"
                    style={{
                        transform: `translate(${-mousePosition.x}px, ${-mousePosition.y - scrollY * 0.2}px)`,
                        transition: "transform 0.3s ease-out",
                        animationDelay: "0.5s",
                    }}
                />

                {/* Additional depth layers */}
                <div
                    className="absolute top-1/3 right-1/3 w-[400px] h-[400px] bg-gradient-to-br from-black/[0.02] to-black/[0.04] rounded-full blur-[80px]"
                    style={{
                        transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5 - scrollY * 0.15}px)`,
                        transition: "transform 0.4s ease-out",
                    }}
                />

                {/* Grid pattern overlay with parallax */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, black 1px, transparent 1px),
                            linear-gradient(to bottom, black 1px, transparent 1px)
                        `,
                        backgroundSize: "80px 80px",
                        transform: `translateY(${scrollY * 0.1}px)`,
                    }}
                />

                {/* Floating particles */}
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-black/10 rounded-full"
                        style={{
                            top: `${15 + (i * 12)}%`,
                            left: `${10 + (i * 10)}%`,
                            animation: `float ${4 + (i % 3)}s ease-in-out infinite`,
                            animationDelay: `${i * 0.3}s`,
                        }}
                    />
                ))}
            </div>

            <div className="max-w-[1400px] mx-auto relative z-10 py-20">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Content */}
                    <div
                        className={`space-y-10 transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
                        style={{
                            transform: `translateY(${scrollY * -0.1}px)`,
                        }}
                    >
                        {/* Badge with enhanced animation */}
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-black/[0.04] border border-black/[0.08] backdrop-blur-sm hover:bg-black/[0.06] hover:border-black/[0.12] transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                            <div className="relative flex items-center justify-center">
                                <div className="absolute w-2 h-2 bg-black rounded-full animate-ping" />
                                <div className="relative w-2 h-2 bg-black rounded-full" />
                            </div>
                            <span className="text-[13px] text-black font-semibold tracking-tight">
                                Lancement imminent
                            </span>
                            <div className="h-4 w-px bg-black/10" />
                            <span className="text-[13px] text-black/50 font-medium">
                                Soyez parmi les premiers
                            </span>
                        </div>

                        {/* Main heading */}
                        <div className="space-y-6">
                            <h1 className="text-[64px] sm:text-[80px] lg:text-[96px] font-bold tracking-[-0.04em] text-black leading-[1.1] pt-2 pb-3">
                                Votre entreprise,
                                <span className="block mt-3 pb-2 bg-gradient-to-r from-black via-black/90 to-black/60 bg-clip-text text-transparent">
                                    simplifiée.
                                </span>
                            </h1>

                            <p className="text-[20px] sm:text-[22px] text-black/60 leading-[1.5] max-w-[580px] font-normal">
                                L'ERP intelligent qui transforme votre gestion quotidienne en expérience fluide.
                                <span className="text-black font-semibold"> Créez, gérez, analysez.</span>
                            </p>
                        </div>

                        {/* Features list */}
                        <div className="grid grid-cols-2 gap-3 max-w-[500px]">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 p-3 rounded-xl bg-black/[0.02] border border-black/[0.06] hover:bg-black/[0.04] hover:border-black/[0.1] transition-all duration-300"
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                    }}
                                >
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-black flex items-center justify-center">
                                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                    </div>
                                    <span className="text-[14px] text-black/70 font-medium">
                                        {feature}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href="/waitlist" className="group">
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto bg-black hover:bg-black/90 text-white h-14 px-8 text-[15px] font-semibold rounded-2xl shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20 transition-all duration-300 hover:scale-[1.02]"
                                >
                                    Rejoindre la liste d'attente
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="#demo">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="w-full sm:w-auto h-14 px-8 text-[15px] font-semibold rounded-2xl border-black/10 hover:bg-black/[0.02] hover:border-black/20 transition-all duration-300 group"
                                >
                                    <Play className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                                    Voir la démo
                                </Button>
                            </Link>
                        </div>

                        {/* Social proof */}
                        <div className="flex items-center gap-6 pt-2">
                            <div className="flex -space-x-3">
                                {[
                                    'from-neutral-200 to-neutral-300',
                                    'from-neutral-300 to-neutral-400',
                                    'from-neutral-200 to-neutral-300',
                                    'from-neutral-300 to-neutral-400'
                                ].map((gradient, i) => (
                                    <div
                                        key={i}
                                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} border-[3px] border-white shadow-md transition-all hover:scale-110 hover:z-10`}
                                        style={{
                                            animationDelay: `${i * 100}ms`,
                                        }}
                                    />
                                ))}
                            </div>
                            <div className="text-[13px] text-black/50">
                                <span className="font-semibold text-black">
                                    {waitlistCount > 0 ? `${waitlistCount}+` : '0'}
                                </span> déjà inscrit{waitlistCount > 1 ? 's' : ''}
                            </div>
                        </div>
                    </div>

                    {/* Right: Visual showcase */}
                    <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
                        <div className="relative">
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-black/10 to-black/5 rounded-[40px] blur-[80px]" />

                            {/* Main card */}
                            <Card className="relative border-black/10 shadow-2xl shadow-black/10 overflow-hidden bg-white backdrop-blur-xl">
                                {/* Browser chrome */}
                                <div className="bg-gradient-to-b from-neutral-50 to-white border-b border-black/[0.08] px-5 py-4 flex items-center gap-3">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-black/10" />
                                        <div className="w-3 h-3 rounded-full bg-black/10" />
                                        <div className="w-3 h-3 rounded-full bg-black/10" />
                                    </div>
                                    <div className="flex-1 mx-6">
                                        <div className="bg-white/80 border border-black/[0.08] rounded-lg px-4 py-2 text-[12px] text-black/40 font-mono backdrop-blur-sm">
                                            app.mypropartner.com
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-md bg-black/[0.04] flex items-center justify-center">
                                            <Sparkles className="w-3.5 h-3.5 text-black/40" />
                                        </div>
                                    </div>
                                </div>

                                {/* Dashboard preview with glassmorphism */}
                                <div className="p-8 bg-gradient-to-br from-white via-neutral-50/30 to-white">
                                    <div className="space-y-4">
                                        {/* Stats cards with enhanced animations */}
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { label: "CA", value: "48.2K", trend: "+12%", icon: TrendingUp },
                                                { label: "Clients", value: "142", trend: "+8%", icon: Users },
                                                { label: "Factures", value: "38", trend: "+15%", icon: FileText },
                                            ].map((stat, i) => {
                                                const Icon = stat.icon;
                                                const isActive = activeCard === i;
                                                return (
                                                    <div
                                                        key={i}
                                                        className={`p-4 rounded-2xl bg-white/80 backdrop-blur-sm border transition-all duration-500 cursor-pointer ${
                                                            isActive
                                                                ? "border-black/20 shadow-lg scale-[1.05] bg-white"
                                                                : "border-black/[0.06] hover:border-black/10 hover:scale-[1.02]"
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="text-[11px] text-black/40 font-medium">
                                                                {stat.label}
                                                            </div>
                                                            <Icon
                                                                className={`w-3.5 h-3.5 transition-all duration-500 ${
                                                                    isActive ? "text-black scale-110" : "text-black/30"
                                                                }`}
                                                                strokeWidth={2}
                                                            />
                                                        </div>
                                                        <div className="text-[20px] font-bold text-black tracking-tight">
                                                            {stat.value}
                                                        </div>
                                                        <div className={`text-[10px] font-semibold mt-1 transition-colors duration-500 ${
                                                            isActive ? "text-black/80" : "text-black/60"
                                                        }`}>
                                                            {stat.trend}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Chart placeholder with enhanced interactivity */}
                                        <div className="relative h-40 rounded-2xl bg-gradient-to-br from-black/[0.02] to-black/[0.06] border border-black/[0.06] p-4 overflow-hidden group/chart">
                                            {/* Chart label */}
                                            <div className="absolute top-3 left-4 text-[10px] text-black/40 font-semibold tracking-wide">
                                                REVENUS (7 DERNIERS JOURS)
                                            </div>
                                            <div className="flex items-end justify-between h-full gap-2 pt-6">
                                                {[40, 65, 45, 80, 55, 90, 70, 85].map((height, i) => (
                                                    <div
                                                        key={i}
                                                        className="relative flex-1 group/bar"
                                                    >
                                                        <div
                                                            className="w-full bg-black/80 rounded-t-lg transition-all duration-500 hover:bg-black cursor-pointer"
                                                            style={{
                                                                height: `${height}%`,
                                                                animationDelay: `${i * 50}ms`,
                                                            }}
                                                        />
                                                        {/* Tooltip on hover */}
                                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200">
                                                            <div className="px-2 py-1 rounded-md bg-black text-white text-[9px] font-semibold whitespace-nowrap">
                                                                {Math.round(height * 100)}€
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {/* Glow effect on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover/chart:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                        </div>

                                        {/* Quick actions with enhanced styling */}
                                        <div className="grid grid-cols-2 gap-3">
                                            {["Nouveau devis", "Ajouter client"].map((action, i) => (
                                                <button
                                                    key={i}
                                                    className="group/btn relative p-3 rounded-xl bg-black text-white text-[13px] font-semibold hover:bg-black/90 transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                                                >
                                                    <span className="relative z-10">{action}</span>
                                                    {/* Shine effect on hover */}
                                                    <div className="absolute inset-0 translate-x-[-100%] group-hover/btn:translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Floating elements with enhanced animations */}
                            <div
                                className="absolute -right-4 top-20 animate-float"
                                style={{
                                    transform: `translate(${mousePosition.x * -0.05}px, ${mousePosition.y * -0.05}px)`,
                                    transition: "transform 0.5s ease-out",
                                }}
                            >
                                <div className="p-3 rounded-2xl bg-white border border-black/10 shadow-xl backdrop-blur-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping" />
                                        </div>
                                        <span className="text-[11px] font-semibold text-black">Temps réel</span>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="absolute -left-4 bottom-20 animate-float"
                                style={{
                                    animationDelay: "1s",
                                    transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)`,
                                    transition: "transform 0.5s ease-out",
                                }}
                            >
                                <div className="group/badge p-3 rounded-2xl bg-white border border-black/10 shadow-xl backdrop-blur-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-black group-hover/badge:rotate-12 transition-transform duration-300" strokeWidth={2} />
                                        <span className="text-[11px] font-semibold text-black">IA Activée</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
}
