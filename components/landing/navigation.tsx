"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

// Smooth scroll utility
const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
            window.history.pushState(null, "", href);
        }
    }
};

// Scroll hook
const useScrolled = () => {
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return scrolled;
};

const features = [
    {
        title: "Assistant IA",
        href: "#ai-assistant",
        description: "Automatisation intelligente avec GPT-4",
    },
    {
        title: "Devis & Factures",
        href: "#features",
        description: "Documents professionnels en 2 minutes",
    },
    {
        title: "CRM Intelligent",
        href: "#features",
        description: "Gestion complète de vos clients",
    },
    {
        title: "Gestion de Stock",
        href: "#features",
        description: "Inventaire temps réel multi-magasin",
    },
    {
        title: "Analytics",
        href: "#features",
        description: "Tableaux de bord en temps réel",
    },
    {
        title: "ROI Calculator",
        href: "#roi",
        description: "Calculez vos économies",
    },
];

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href = "#", ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    href={href}
                    onClick={(e) => smoothScroll(e, href)}
                    className={cn(
                        "block select-none rounded-lg p-3 leading-none no-underline outline-none transition-all ease-premium hover:bg-black/[0.04]",
                        className
                    )}
                    style={{ transitionDuration: '0.2s' }}
                    {...props}
                >
                    <div className="text-[14px] font-medium leading-tight text-black mb-1.5 tracking-wide-premium">
                        {title}
                    </div>
                    <p className="text-[13px] leading-snug text-black/50 line-clamp-2 tracking-wide-premium">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = "ListItem";

export function Navigation() {
    const scrolled = useScrolled();

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                scrolled
                    ? "bg-white/95 backdrop-blur-xl border-b border-black/[0.08]"
                    : "bg-white/80 backdrop-blur-md"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center"
                        onClick={(e) => {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                    >
                        <span className="text-[17px] font-semibold tracking-tight-premium text-black">
                            MyProPartner
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <NavigationMenu className="hidden lg:flex">
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="text-[14px] font-medium tracking-wide-premium">
                                    Fonctionnalités
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[500px] gap-2 p-4 md:grid-cols-2">
                                        {features.map((feature) => (
                                            <ListItem
                                                key={feature.title}
                                                title={feature.title}
                                                href={feature.href}
                                            >
                                                {feature.description}
                                            </ListItem>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    href="#use-cases"
                                    onClick={(e) => smoothScroll(e, "#use-cases")}
                                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-[14px] font-medium tracking-wide-premium transition-all ease-premium hover:bg-black/[0.04] focus:bg-black/[0.04] focus:outline-none"
                                >
                                    Solutions
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    href="#pricing"
                                    onClick={(e) => smoothScroll(e, "#pricing")}
                                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-[14px] font-medium tracking-wide-premium transition-all ease-premium hover:bg-black/[0.04] focus:bg-black/[0.04] focus:outline-none"
                                >
                                    Tarifs
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    href="#faq"
                                    onClick={(e) => smoothScroll(e, "#faq")}
                                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-[14px] font-medium tracking-wide-premium transition-all ease-premium hover:bg-black/[0.04] focus:bg-black/[0.04] focus:outline-none"
                                >
                                    FAQ
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>

                    {/* CTA Buttons */}
                    <div className="flex items-center gap-3">
                        <Link href="/auth/login" className="hidden sm:block">
                            <Button
                                variant="ghost"
                                className="text-[14px] font-medium h-9 px-4 hover:bg-black/[0.04] text-black/70 hover:text-black tracking-wide-premium transition-all ease-premium"
                            >
                                Connexion
                            </Button>
                        </Link>
                        <Link href="/auth/register">
                            <Button
                                className="bg-black hover:bg-black/90 text-white h-10 px-5 text-[14px] font-medium tracking-wide-premium shadow-sm hover:shadow transition-all ease-premium"
                                style={{ transitionDuration: '0.2s' }}
                            >
                                Essai gratuit
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
