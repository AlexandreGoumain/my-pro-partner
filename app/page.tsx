import { Navigation } from "@/components/landing/navigation";
import { Hero } from "@/components/landing/hero";
import { StatsSection } from "@/components/landing/stats-section";
import { BentoGrid } from "@/components/landing/bento-grid";
import { ProductDemo } from "@/components/landing/product-demo";
import { PricingCards } from "@/components/landing/pricing-cards";
import { FAQ } from "@/components/landing/faq";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "MyProPartner - L'ERP moderne pour artisans et PME",
    description:
        "Gérez votre entreprise en toute simplicité avec MyProPartner. Clients, devis, factures, stocks : tout en un seul endroit. Essai gratuit 14 jours.",
    keywords: [
        "ERP",
        "artisan",
        "PME",
        "gestion entreprise",
        "devis",
        "factures",
        "stock",
        "comptabilité",
    ],
    openGraph: {
        title: "MyProPartner - L'ERP moderne pour artisans et PME",
        description:
            "Gérez votre entreprise en toute simplicité. Clients, devis, factures, stocks : tout en un seul endroit.",
        type: "website",
        locale: "fr_FR",
    },
    twitter: {
        card: "summary_large_image",
        title: "MyProPartner - L'ERP moderne pour artisans",
        description: "L'ERP tout-en-un pour artisans et PME. Essai gratuit 14 jours.",
    },
};

export default function LandingPage() {
    return (
        <>
            <Navigation />
            <main>
                <Hero />
                <StatsSection />
                <BentoGrid />
                <ProductDemo />
                <PricingCards />
                <FAQ />
                <CTASection />
            </main>
            <Footer />
        </>
    );
}
