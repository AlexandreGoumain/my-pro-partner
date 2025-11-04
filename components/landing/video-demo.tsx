"use client";

import { Card } from "@/components/ui/card";
import { Play, Sparkles } from "lucide-react";
import { useState } from "react";

export function VideoDemo() {
    const [isPlaying, setIsPlaying] = useState(false);

    // TODO: Remplacer par votre vraie URL YouTube/Loom
    const videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ"; // Exemple

    return (
        <section className="relative py-32 px-6 sm:px-8 bg-white overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-1/3 w-1/2 h-1/2 bg-black/[0.015] rounded-full blur-3xl" />
            </div>

            <div className="max-w-[1120px] mx-auto relative">
                {/* Header */}
                <div className="text-center space-y-5 mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/[0.03] border border-black/[0.08]">
                        <Play className="w-4 h-4 text-black/60" strokeWidth={2} />
                        <span className="text-[13px] text-black/60 font-medium">
                            Démo en 2 minutes
                        </span>
                    </div>

                    <h2 className="text-[48px] sm:text-[56px] font-semibold tracking-[-0.02em] text-black leading-[1.05]">
                        Voyez par vous-même
                    </h2>
                    <p className="text-[19px] text-black/60 max-w-[680px] mx-auto leading-[1.5] tracking-[-0.01em]">
                        Découvrez comment MyProPartner transforme la gestion de votre entreprise.{" "}
                        <span className="text-black font-medium">En 2 minutes chrono.</span>
                    </p>
                </div>

                {/* Video Container */}
                <div className="relative max-w-[900px] mx-auto">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/10 rounded-[24px] blur-3xl translate-y-8" />

                    {/* Video Card */}
                    <Card className="relative border-black/10 shadow-2xl shadow-black/10 overflow-hidden bg-white">
                        <div className="relative aspect-video bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
                            {!isPlaying ? (
                                // Thumbnail avec bouton play
                                <div className="absolute inset-0 flex items-center justify-center group cursor-pointer"
                                     onClick={() => setIsPlaying(true)}>
                                    {/* Placeholder image - remplacer par votre thumbnail */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-black/10 to-black/5 flex items-center justify-center">
                                        <div className="text-center space-y-6">
                                            <div className="relative inline-block">
                                                {/* Play button */}
                                                <div className="w-20 h-20 rounded-full bg-black group-hover:bg-black/90 flex items-center justify-center shadow-2xl shadow-black/30 transition-all duration-300 group-hover:scale-110">
                                                    <Play className="w-8 h-8 text-white ml-1" strokeWidth={2} fill="white" />
                                                </div>
                                                {/* Pulse animation */}
                                                <div className="absolute inset-0 rounded-full bg-black/20 animate-ping" />
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[20px] font-semibold text-black">
                                                    Regarder la démo
                                                </p>
                                                <p className="text-[14px] text-black/50">
                                                    2 min • Découvrez toutes les fonctionnalités
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Video iframe
                                <iframe
                                    className="absolute inset-0 w-full h-full"
                                    src={`${videoUrl}?autoplay=1`}
                                    title="MyProPartner Demo"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            )}
                        </div>
                    </Card>

                    {/* Floating badges */}
                    <div className="hidden lg:block">
                        <div className="absolute -left-12 top-1/4 animate-in fade-in slide-in-from-left duration-700 delay-300">
                            <Card className="p-3 bg-white border-black/10 shadow-lg">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-black" strokeWidth={2} />
                                    <span className="text-[12px] font-medium text-black">Temps réel</span>
                                </div>
                            </Card>
                        </div>
                        <div className="absolute -right-12 bottom-1/3 animate-in fade-in slide-in-from-right duration-700 delay-500">
                            <Card className="p-3 bg-white border-black/10 shadow-lg">
                                <div className="flex items-center gap-2">
                                    <Play className="w-4 h-4 text-black" strokeWidth={2} />
                                    <span className="text-[12px] font-medium text-black">Interface intuitive</span>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Bottom stats */}
                <div className="mt-16 grid grid-cols-3 gap-8 max-w-[700px] mx-auto">
                    <div className="text-center space-y-1">
                        <div className="text-[32px] font-semibold text-black tracking-[-0.02em]">
                            2 min
                        </div>
                        <p className="text-[13px] text-black/50">
                            pour tout comprendre
                        </p>
                    </div>
                    <div className="text-center space-y-1">
                        <div className="text-[32px] font-semibold text-black tracking-[-0.02em]">
                            40+
                        </div>
                        <p className="text-[13px] text-black/50">
                            actions automatiques
                        </p>
                    </div>
                    <div className="text-center space-y-1">
                        <div className="text-[32px] font-semibold text-black tracking-[-0.02em]">
                            100%
                        </div>
                        <p className="text-[13px] text-black/50">
                            en français
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
