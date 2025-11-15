"use client";

import { Button } from "@/components/ui/button";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function Navigation() {
    const scrolled = useScroll(20);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
                scrolled
                    ? "bg-white/60 backdrop-blur-3xl border-b border-black/[0.08]"
                    : "bg-transparent"
            )}
        >
            <div className="max-w-[1120px] mx-auto px-6 sm:px-8">
                <div className="flex items-center justify-between h-12">
                    <Link href="/" className="flex items-center -ml-2">
                        <span className="text-[15px] font-medium tracking-[-0.01em] text-black">
                            MyProPartner
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            href="#features"
                            className="text-[12px] font-medium text-black/60 hover:text-black transition-colors duration-200"
                        >
                            Fonctionnalités
                        </Link>
                        <Link
                            href="#pricing"
                            className="text-[12px] font-medium text-black/60 hover:text-black transition-colors duration-200"
                        >
                            Tarifs
                        </Link>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Link href="/auth/login">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-[12px] font-medium h-7 px-3 hover:bg-black/5"
                            >
                                Connexion
                            </Button>
                        </Link>
                        <Link href="/auth/register">
                            <Button
                                size="sm"
                                className="bg-black hover:bg-black/90 text-white rounded-full h-7 px-4 text-[12px] font-medium shadow-sm hover:shadow transition-all duration-200"
                            >
                                Essai gratuit
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
