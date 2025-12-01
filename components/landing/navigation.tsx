"use client";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";

const navLinks = [
    { href: "/#features", label: "Fonctionnalités" },
    { href: "/#pricing", label: "Tarifs" },
    { href: "/contact", label: "Contact" },
];

export function Navigation() {
    const scrolled = useScroll(20);
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);

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

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-[12px] font-medium text-black/60 hover:text-black transition-colors duration-200"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center space-x-2">
                        {session ? (
                            <Link href="/account">
                                <Button
                                    size="sm"
                                    className="bg-black hover:bg-black/90 text-white rounded-full h-7 px-4 text-[12px] font-medium shadow-sm hover:shadow transition-all duration-200"
                                >
                                    Mon compte
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/waitlist">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-[12px] font-medium h-7 px-3 hover:bg-black/5"
                                    >
                                        Connexion
                                    </Button>
                                </Link>
                                <Link href="/waitlist">
                                    <Button
                                        size="sm"
                                        className="bg-black hover:bg-black/90 text-white rounded-full h-7 px-4 text-[12px] font-medium shadow-sm hover:shadow transition-all duration-200"
                                    >
                                        Essai gratuit
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                            >
                                <Menu className="h-5 w-5 text-black" strokeWidth={2} />
                                <span className="sr-only">Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="w-full sm:w-[320px] bg-white border-l border-black/[0.08] p-0"
                        >
                            {/* Mobile Menu Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.06]">
                                <span className="text-[15px] font-medium tracking-[-0.01em] text-black">
                                    MyProPartner
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <X className="h-5 w-5 text-black/60" strokeWidth={2} />
                                </Button>
                            </div>

                            {/* Mobile Menu Links */}
                            <div className="px-6 py-6 space-y-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center py-3 text-[15px] font-medium text-black/70 hover:text-black transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            {/* Mobile Menu CTA */}
                            <div className="px-6 py-6 border-t border-black/[0.06] space-y-3">
                                {session ? (
                                    <Link href="/account" onClick={() => setIsOpen(false)}>
                                        <Button className="w-full bg-black hover:bg-black/90 text-white h-11 text-[14px] font-medium rounded-lg">
                                            Mon compte
                                        </Button>
                                    </Link>
                                ) : (
                                    <>
                                        <Link href="/waitlist" onClick={() => setIsOpen(false)}>
                                            <Button className="w-full bg-black hover:bg-black/90 text-white h-11 text-[14px] font-medium rounded-lg">
                                                Essai gratuit
                                            </Button>
                                        </Link>
                                        <Link href="/waitlist" onClick={() => setIsOpen(false)}>
                                            <Button
                                                variant="outline"
                                                className="w-full h-11 text-[14px] font-medium rounded-lg border-black/10"
                                            >
                                                Connexion
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>

                            {/* Mobile Menu Footer */}
                            <div className="absolute bottom-6 left-6 right-6">
                                <p className="text-[12px] text-black/40 text-center">
                                    Sans carte bancaire • 14 jours gratuits
                                </p>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}
