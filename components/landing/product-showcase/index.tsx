"use client";

import { useEffect, useRef, useState } from "react";
import { features, type FeatureId } from "./mock-data";
import { MockDashboard } from "./mock-dashboard";
import { MockDocuments } from "./mock-documents";
import { MockClients } from "./mock-clients";
import { MockStock } from "./mock-stock";
import { MockAtelier } from "./mock-atelier";
import { MockAI } from "./mock-ai";
import { MockAgenda } from "./mock-agenda";

function FeatureContent({ activeFeature }: { activeFeature: FeatureId }) {
    switch (activeFeature) {
        case "dashboard":
            return <MockDashboard />;
        case "documents":
            return <MockDocuments />;
        case "clients":
            return <MockClients />;
        case "stock":
            return <MockStock />;
        case "atelier":
            return <MockAtelier />;
        case "ai":
            return <MockAI />;
        case "agenda":
            return <MockAgenda />;
        default:
            return <MockDashboard />;
    }
}

export function ProductShowcase() {
    const [activeFeature, setActiveFeature] = useState<FeatureId>("dashboard");
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
        <section
            ref={ref}
            id="features"
            className="py-24 px-6 sm:px-8 bg-neutral-50 relative overflow-hidden"
        >
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
                                onClick={() => setActiveFeature(feature.id as FeatureId)}
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
                                                onClick={() => setActiveFeature(feature.id as FeatureId)}
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
                                <FeatureContent activeFeature={activeFeature} />
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
                                <span className="font-medium text-black">{feature.title}</span> —{" "}
                                {feature.description}
                            </p>
                        ) : null
                    )}
                </div>
            </div>
        </section>
    );
}
