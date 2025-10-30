import Link from "next/link";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const footerLinks = {
    product: {
        title: "Produit",
        links: [
            { label: "Fonctionnalités", href: "#features" },
            { label: "Tarifs", href: "#pricing" },
            { label: "Témoignages", href: "#testimonials" },
            { label: "FAQ", href: "#faq" },
        ],
    },
    company: {
        title: "Entreprise",
        links: [
            { label: "À propos", href: "/about" },
            { label: "Blog", href: "/blog" },
            { label: "Carrières", href: "/careers" },
            { label: "Contact", href: "/contact" },
        ],
    },
    resources: {
        title: "Ressources",
        links: [
            { label: "Documentation", href: "/docs" },
            { label: "Guide de démarrage", href: "/getting-started" },
            { label: "API", href: "/api" },
            { label: "Support", href: "/support" },
        ],
    },
    legal: {
        title: "Légal",
        links: [
            { label: "Mentions légales", href: "/legal" },
            { label: "Conditions d'utilisation", href: "/terms" },
            { label: "Politique de confidentialité", href: "/privacy" },
            { label: "CGV", href: "/cgv" },
        ],
    },
};

const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
];

export function Footer() {
    return (
        <footer className="border-t border-border bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
                    {/* Brand column */}
                    <div className="col-span-2 space-y-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">M</span>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                MyProPartner
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            L&apos;ERP moderne pour artisans et PME. Gérez votre activité en toute simplicité.
                        </p>
                        {/* Social links */}
                        <div className="flex gap-4">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                        aria-label={social.label}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Links columns */}
                    {Object.entries(footerLinks).map(([key, section]) => (
                        <div key={key} className="space-y-4">
                            <h3 className="font-semibold text-sm">{section.title}</h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom section */}
                <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} MyProPartner. Tous droits réservés.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Fait avec ❤️ en France
                    </p>
                </div>
            </div>
        </footer>
    );
}
